-- Fix notification templates RLS policy to be admin-only
-- First drop the existing policy
DROP POLICY IF EXISTS "Everyone can view templates" ON public.notification_templates;

-- Create new restrictive policy - only system/admin access through functions
CREATE POLICY "System can view notification templates" 
ON public.notification_templates 
FOR SELECT 
USING (false); -- No direct client access

-- Create a security definer function for safe template access
CREATE OR REPLACE FUNCTION public.get_notification_template(
  template_type notification_type,
  template_care_stage care_stage DEFAULT NULL,
  template_channel notification_channel DEFAULT 'in_app'
) 
RETURNS TABLE(
  title_template text,
  message_template text,
  variables jsonb
) 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path TO 'public'
AS $$
  SELECT 
    nt.title_template,
    nt.message_template,
    nt.variables
  FROM public.notification_templates nt
  WHERE nt.type = template_type
    AND nt.channel = template_channel
    AND (template_care_stage IS NULL OR nt.care_stage = template_care_stage OR nt.care_stage IS NULL)
    AND nt.is_active = true
  ORDER BY 
    CASE WHEN nt.care_stage = template_care_stage THEN 1 ELSE 2 END,
    nt.created_at DESC
  LIMIT 1;
$$;