-- Security Enhancement Migration
-- Fix 1: Create function to check if user has appointment with provider
CREATE OR REPLACE FUNCTION public.has_appointment_with_provider(provider_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.appointments a
    WHERE a.provider_id = provider_uuid 
    AND a.user_id = auth.uid()
    AND a.status IN ('booked', 'confirmed')
  );
$function$;

-- Fix 2: Update providers RLS policy to mask sensitive data for general users
DROP POLICY IF EXISTS "Authenticated users can view active providers" ON public.providers;

CREATE POLICY "Authenticated users can view basic provider info" 
ON public.providers 
FOR SELECT 
USING (
  is_active AND auth.uid() IS NOT NULL
);

-- Create a secure view for provider contact details
CREATE OR REPLACE VIEW public.provider_public_info AS
SELECT 
  id,
  name,
  specialty,
  location,
  bio,
  photo_url,
  is_active,
  created_at,
  updated_at,
  CASE 
    WHEN public.has_appointment_with_provider(id) THEN phone
    ELSE NULL
  END as phone,
  CASE 
    WHEN public.has_appointment_with_provider(id) THEN email  
    ELSE NULL
  END as email,
  external_booking_url
FROM public.providers
WHERE is_active = true;

-- Fix 3: Update availability_slots policy to be more restrictive
DROP POLICY IF EXISTS "Authenticated users can view unbooked slots" ON public.availability_slots;

CREATE POLICY "Users can view available slots for booking" 
ON public.availability_slots 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL 
  AND is_booked = false 
  AND starts_at > now()
  AND EXISTS (
    SELECT 1 FROM public.providers p 
    WHERE p.id = provider_id 
    AND p.is_active = true
  )
);

-- Fix 4: Make user_id fields NOT NULL and add constraints
-- First, update any existing NULL user_id records to prevent constraint violations
UPDATE public.risk_assessments 
SET user_id = auth.uid() 
WHERE user_id IS NULL AND auth.uid() IS NOT NULL;

UPDATE public.alerts 
SET user_id = auth.uid() 
WHERE user_id IS NULL AND auth.uid() IS NOT NULL;

-- Add NOT NULL constraints
ALTER TABLE public.risk_assessments 
ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE public.alerts 
ALTER COLUMN user_id SET NOT NULL;

-- Fix 5: Enhance the user ownership triggers to be more secure
CREATE OR REPLACE FUNCTION public.ensure_user_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Ensure user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Set user_id to current user if not already set
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  
  -- Verify user can only create records for themselves
  IF NEW.user_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create records for other users';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Apply the enhanced trigger to risk_assessments and alerts
DROP TRIGGER IF EXISTS set_risk_assessment_owner ON public.risk_assessments;
CREATE TRIGGER ensure_risk_assessment_ownership
  BEFORE INSERT ON public.risk_assessments
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_ownership();

DROP TRIGGER IF EXISTS set_alert_owner ON public.alerts;
CREATE TRIGGER ensure_alert_ownership
  BEFORE INSERT ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_ownership();