-- Secure risk_assessments and add sharing table/policies (retry without IF NOT EXISTS)

-- 1) Remove overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view risk assessments" ON public.risk_assessments;

-- 2) Ensure RLS enabled
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- 3) Owner-only SELECT policy
DROP POLICY IF EXISTS "Users can view their own risk assessments" ON public.risk_assessments;
CREATE POLICY "Users can view their own risk assessments"
ON public.risk_assessments
FOR SELECT
USING (auth.uid() = user_id);

-- 4) Sharing table
CREATE TABLE IF NOT EXISTS public.risk_assessment_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  granted_to uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission text NOT NULL DEFAULT 'read',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, granted_to)
);

ALTER TABLE public.risk_assessment_access ENABLE ROW LEVEL SECURITY;

-- Grant policies
DROP POLICY IF EXISTS "Owners can grant access to their risk assessments" ON public.risk_assessment_access;
CREATE POLICY "Owners can grant access to their risk assessments"
ON public.risk_assessment_access
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = risk_assessment_access.assessment_id
      AND ra.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owners can revoke access to their risk assessments" ON public.risk_assessment_access;
CREATE POLICY "Owners can revoke access to their risk assessments"
ON public.risk_assessment_access
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = risk_assessment_access.assessment_id
      AND ra.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Owners and grantees can view access records" ON public.risk_assessment_access;
CREATE POLICY "Owners and grantees can view access records"
ON public.risk_assessment_access
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = risk_assessment_access.assessment_id
      AND ra.user_id = auth.uid()
  ) OR risk_assessment_access.granted_to = auth.uid()
);

-- 5) Allow viewing shared assessments
DROP POLICY IF EXISTS "Authorized users can view shared risk assessments" ON public.risk_assessments;
CREATE POLICY "Authorized users can view shared risk assessments"
ON public.risk_assessments
FOR SELECT
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.risk_assessment_access gaa
    WHERE gaa.assessment_id = risk_assessments.id
      AND gaa.granted_to = auth.uid()
  )
);

-- 6) Indexes
CREATE INDEX IF NOT EXISTS idx_risk_assessment_access_assessment ON public.risk_assessment_access(assessment_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessment_access_granted_to ON public.risk_assessment_access(granted_to);
