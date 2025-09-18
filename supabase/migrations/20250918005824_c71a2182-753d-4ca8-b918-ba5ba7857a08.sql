-- Fix notification templates RLS policy to allow system access
-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "System can view notification templates" ON public.notification_templates;

-- Create a new policy that allows:
-- 1. Service role access (for edge functions)  
-- 2. Database functions to access templates
-- 3. Block direct user access for security
CREATE POLICY "Allow system access to notification templates" 
ON public.notification_templates 
FOR SELECT 
USING (
  -- Allow service role (used by edge functions)
  auth.role() = 'service_role'
  OR
  -- Allow access from database functions (security definer functions run with elevated privileges)
  current_setting('role', true) = 'supabase_admin'
);

-- Grant necessary permissions to service role for edge functions
GRANT SELECT ON public.notification_templates TO service_role;