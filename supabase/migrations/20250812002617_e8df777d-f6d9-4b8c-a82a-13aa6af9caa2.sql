-- Security hardening migration: helper functions, ownership triggers, RLS fixes

-- 1) Fix function search_path for SECURITY DEFINER function
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = NEW.raw_user_meta_data->>'name',
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
END;
$$;

-- 2) Helper functions to avoid complex policy recursion and centralize logic
CREATE OR REPLACE FUNCTION public.is_assessment_owner(assess_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = assess_id AND ra.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.can_view_assessment(assess_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path TO 'public'
AS $$
  SELECT public.is_assessment_owner(assess_id)
      OR EXISTS (
        SELECT 1 FROM public.risk_assessment_access gaa
        WHERE gaa.assessment_id = assess_id
          AND gaa.granted_to = auth.uid()
      );
$$;

-- 3) Risk assessment ownership trigger to ensure user_id is set
CREATE OR REPLACE FUNCTION public.set_risk_assessment_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'Must be authenticated to create a risk assessment';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_risk_assessment_owner ON public.risk_assessments;
CREATE TRIGGER set_risk_assessment_owner
BEFORE INSERT ON public.risk_assessments
FOR EACH ROW
EXECUTE FUNCTION public.set_risk_assessment_owner();

-- 4) Simplify and harden RLS for risk assessments and access using helper functions
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessment_access ENABLE ROW LEVEL SECURITY;

-- risk_assessments policies
DROP POLICY IF EXISTS "Users can view their own risk assessments" ON public.risk_assessments;
DROP POLICY IF EXISTS "Authorized users can view shared risk assessments" ON public.risk_assessments;
CREATE POLICY "View own or shared assessments"
ON public.risk_assessments
FOR SELECT
USING (public.can_view_assessment(id));

-- Keep existing INSERT owner policy if present; ensure it's in place
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='risk_assessments' AND policyname='Users can insert their own risk assessments'
  ) THEN
    CREATE POLICY "Users can insert their own risk assessments"
    ON public.risk_assessments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- risk_assessment_access policies
DROP POLICY IF EXISTS "Owners can grant access to their risk assessments" ON public.risk_assessment_access;
CREATE POLICY "Owners can grant access to their risk assessments"
ON public.risk_assessment_access
FOR INSERT
WITH CHECK (public.is_assessment_owner(assessment_id));

DROP POLICY IF EXISTS "Owners can revoke access to their risk assessments" ON public.risk_assessment_access;
CREATE POLICY "Owners can revoke access to their risk assessments"
ON public.risk_assessment_access
FOR DELETE
USING (public.is_assessment_owner(assessment_id));

DROP POLICY IF EXISTS "Owners and grantees can view access records" ON public.risk_assessment_access;
CREATE POLICY "Owners and grantees can view access records"
ON public.risk_assessment_access
FOR SELECT
USING (public.is_assessment_owner(assessment_id) OR granted_to = auth.uid());

-- 5) Secure alerts table with RLS and ownership trigger
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.set_alert_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_alert_owner ON public.alerts;
CREATE TRIGGER set_alert_owner
BEFORE INSERT ON public.alerts
FOR EACH ROW
EXECUTE FUNCTION public.set_alert_owner();

-- Alerts owner-only policies
DROP POLICY IF EXISTS "Users can view own alerts" ON public.alerts;
DROP POLICY IF EXISTS "Users can insert own alerts" ON public.alerts;
DROP POLICY IF EXISTS "Users can update own alerts" ON public.alerts;
DROP POLICY IF EXISTS "Users can delete own alerts" ON public.alerts;

CREATE POLICY "Users can view own alerts"
ON public.alerts
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alerts"
ON public.alerts
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts"
ON public.alerts
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts"
ON public.alerts
FOR DELETE
USING (auth.uid() = user_id);

-- 6) Restrict provider contact exposure: require authentication to view providers
DROP POLICY IF EXISTS "Public can view active providers" ON public.providers;
CREATE POLICY "Authenticated users can view active providers"
ON public.providers
FOR SELECT
USING (is_active AND auth.uid() IS NOT NULL);
