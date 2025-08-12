-- Restrict access to sensitive risk assessments and add sharing mechanism for providers

-- 1) Remove overly permissive public SELECT policy
DROP POLICY IF EXISTS "Anyone can view risk assessments" ON public.risk_assessments;

-- 2) Ensure RLS is enabled (safe to run even if already enabled)
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;

-- 3) Owner-only SELECT policy
CREATE POLICY "Users can view their own risk assessments"
ON public.risk_assessments
FOR SELECT
USING (auth.uid() = user_id);

-- Keep existing INSERT policy as-is (assumes it already exists):
-- "Users can insert their own risk assessments" WITH CHECK (auth.uid() = user_id)

-- 4) Create a sharing table to grant explicit access to providers (or other authorized users)
CREATE TABLE IF NOT EXISTS public.risk_assessment_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  granted_to uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission text NOT NULL DEFAULT 'read',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, granted_to)
);

-- Enable RLS on the sharing table
ALTER TABLE public.risk_assessment_access ENABLE ROW LEVEL SECURITY;

-- Only the owner of an assessment can grant access
CREATE POLICY IF NOT EXISTS "Owners can grant access to their risk assessments"
ON public.risk_assessment_access
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = risk_assessment_access.assessment_id
      AND ra.user_id = auth.uid()
  )
);

-- Owners can revoke access they granted
CREATE POLICY IF NOT EXISTS "Owners can revoke access to their risk assessments"
ON public.risk_assessment_access
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = risk_assessment_access.assessment_id
      AND ra.user_id = auth.uid()
  )
);

-- Owners and grantees can view access records (optional, for transparency)
CREATE POLICY IF NOT EXISTS "Owners and grantees can view access records"
ON public.risk_assessment_access
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.risk_assessments ra
    WHERE ra.id = risk_assessment_access.assessment_id
      AND ra.user_id = auth.uid()
  ) OR risk_assessment_access.granted_to = auth.uid()
);

-- 5) Allow authorized users to view risk assessments that were shared with them
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

-- 6) Helpful indexes for performance
CREATE INDEX IF NOT EXISTS idx_risk_assessment_access_assessment ON public.risk_assessment_access(assessment_id);
CREATE INDEX IF NOT EXISTS idx_risk_assessment_access_granted_to ON public.risk_assessment_access(granted_to);
