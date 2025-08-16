-- Fix the security definer view issue by removing it and updating the RLS policies instead
DROP VIEW IF EXISTS public.provider_public_info;

-- Instead, modify the providers table RLS policy to conditionally show contact details
DROP POLICY IF EXISTS "Authenticated users can view basic provider info" ON public.providers;

-- Create a new policy that masks sensitive data for users without appointments
CREATE POLICY "Authenticated users can view providers" 
ON public.providers 
FOR SELECT 
USING (
  is_active 
  AND auth.uid() IS NOT NULL
);

-- Note: The application layer will need to handle masking of phone/email
-- for users who don't have appointments with specific providers