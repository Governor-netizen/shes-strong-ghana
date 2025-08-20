-- Fix function search path security issue
-- Update the create_appointment_notifications function to set search_path
CREATE OR REPLACE FUNCTION public.create_appointment_notifications()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_prefs RECORD;
  reminder_time INTEGER;
BEGIN
  -- Get user preferences for appointment reminders
  SELECT * INTO user_prefs 
  FROM public.notification_preferences 
  WHERE user_id = NEW.user_id AND notification_type = 'appointment_reminder';
  
  -- If no preferences exist, create default ones
  IF NOT FOUND THEN
    INSERT INTO public.notification_preferences (user_id, notification_type, channels, reminder_timing)
    VALUES (NEW.user_id, 'appointment_reminder', ARRAY['in_app', 'email']::notification_channel[], ARRAY[1440, 120, 30]);
    
    user_prefs.reminder_timing := ARRAY[1440, 120, 30];
    user_prefs.channels := ARRAY['in_app', 'email']::notification_channel[];
  END IF;
  
  -- Create confirmation notification (immediate)
  INSERT INTO public.notifications (
    user_id, type, title, message, channel, 
    scheduled_for, related_appointment_id, care_stage, priority
  ) VALUES (
    NEW.user_id, 
    'appointment_confirmation',
    'Appointment Confirmed',
    'Your appointment has been scheduled for ' || to_char(NEW.starts_at, 'FMDay, FMMonth FMDD, YYYY at FMHH12:MI AM'),
    'in_app',
    now(),
    NEW.id,
    COALESCE((SELECT current_stage FROM public.patient_journey_stages WHERE user_id = NEW.user_id), 'screening'::care_stage),
    2
  );
  
  -- Create reminder notifications
  FOREACH reminder_time IN ARRAY user_prefs.reminder_timing
  LOOP
    INSERT INTO public.notifications (
      user_id, type, title, message, channel,
      scheduled_for, related_appointment_id, care_stage, priority
    ) VALUES (
      NEW.user_id,
      'appointment_reminder',
      'Upcoming Appointment Reminder',
      'You have an appointment scheduled for ' || to_char(NEW.starts_at, 'FMDay, FMMonth FMDD, YYYY at FMHH12:MI AM'),
      'in_app',
      NEW.starts_at - (reminder_time || ' minutes')::INTERVAL,
      NEW.id,
      COALESCE((SELECT current_stage FROM public.patient_journey_stages WHERE user_id = NEW.user_id), 'screening'::care_stage),
      1
    );
  END LOOP;
  
  RETURN NEW;
END;
$$;