-- Create notification tables for healthcare notification system
CREATE TYPE notification_type AS ENUM (
  'appointment_reminder', 'appointment_confirmation', 'appointment_follow_up',
  'screening_results', 'diagnosis_available', 'treatment_reminder',
  'pre_treatment', 'post_treatment', 'side_effect_check', 'wellness_tip',
  'support_group', 'mental_health_check', 'educational_content'
);

CREATE TYPE notification_channel AS ENUM ('in_app', 'email', 'push', 'sms');
CREATE TYPE delivery_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'read');
CREATE TYPE care_stage AS ENUM (
  'screening', 'post_screening', 'diagnosis', 'treatment_planning',
  'chemotherapy', 'surgery', 'radiation', 'follow_up', 'survivorship'
);

-- Notifications table - stores all notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channel notification_channel NOT NULL DEFAULT 'in_app',
  status delivery_status NOT NULL DEFAULT 'pending',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  template_id UUID,
  related_appointment_id UUID,
  care_stage care_stage,
  priority INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notification preferences table
CREATE TABLE public.notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_type notification_type NOT NULL,
  channels notification_channel[] DEFAULT ARRAY['in_app']::notification_channel[],
  enabled BOOLEAN DEFAULT true,
  reminder_timing INTEGER[] DEFAULT ARRAY[1440, 120, 30], -- minutes before: 24h, 2h, 30min
  quiet_hours_start TIME DEFAULT '22:00',
  quiet_hours_end TIME DEFAULT '08:00',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, notification_type)
);

-- Notification templates table
CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type notification_type NOT NULL,
  care_stage care_stage,
  title_template TEXT NOT NULL,
  message_template TEXT NOT NULL,
  channel notification_channel NOT NULL,
  variables JSONB DEFAULT '{}', -- template variables
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Patient journey stages table
CREATE TABLE public.patient_journey_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_stage care_stage NOT NULL DEFAULT 'screening',
  stage_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_journey_stages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for notification_preferences
CREATE POLICY "Users can manage their own preferences" 
ON public.notification_preferences FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notification_templates
CREATE POLICY "Everyone can view templates" 
ON public.notification_templates FOR SELECT USING (is_active = true);

-- RLS Policies for patient_journey_stages
CREATE POLICY "Users can manage their own journey" 
ON public.patient_journey_stages FOR ALL USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_journey_stages_updated_at
  BEFORE UPDATE ON public.patient_journey_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create appointment notifications
CREATE OR REPLACE FUNCTION public.create_appointment_notifications()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create notifications when appointments are booked
CREATE TRIGGER create_appointment_notifications_trigger
  AFTER INSERT ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.create_appointment_notifications();

-- Insert default notification templates
INSERT INTO public.notification_templates (type, care_stage, title_template, message_template, channel) VALUES
('screening_results', 'post_screening'::care_stage, 'Your Screening Results are Ready', 'Your mammogram results are ready. Please schedule your follow-up appointment with Dr. {{doctor_name}}. Click here to book.', 'in_app'),
('screening_results', 'post_screening'::care_stage, 'Follow-up Required', 'Next step: a diagnostic ultrasound/biopsy has been recommended. Here''s what that means → {{education_link}}.', 'in_app'),
('diagnosis_available', 'diagnosis'::care_stage, 'Pathology Report Available', 'Your pathology report is available. Please meet with your care team to discuss treatment options.', 'in_app'),
('treatment_reminder', 'chemotherapy'::care_stage, 'Chemo Session Reminder', 'Chemo Session #{{session_number}} is tomorrow at {{time}}. Don''t forget to bring your ID, snacks, and a support person if possible.', 'in_app'),
('post_treatment', 'chemotherapy'::care_stage, 'Post-Chemo Check-in', 'How are you feeling today? Tap here to record symptoms and get support.', 'in_app'),
('pre_treatment', 'surgery'::care_stage, 'Surgery Reminder', 'Surgery scheduled for {{date}} at {{time}}. Please avoid food after midnight and arrange transportation.', 'in_app'),
('post_treatment', 'surgery'::care_stage, 'Post-Surgery Care', 'It''s Day {{days_post_surgery}} after surgery. Remember to check your wound site for signs of infection. Learn what''s normal and when to seek help.', 'in_app'),
('treatment_reminder', 'radiation'::care_stage, 'Radiation Session', 'Radiation therapy session today at {{time}}. Try to wear loose clothing.', 'in_app'),
('wellness_tip', 'radiation'::care_stage, 'Skin Care Tip', 'Skin care tip: Apply moisturizer after treatment, not before.', 'in_app'),
('support_group', 'survivorship'::care_stage, 'Support Group Tonight', 'Join tonight''s survivor support group on WhatsApp at 7 PM. Share your journey and hear from others.', 'in_app'),
('mental_health_check', NULL, 'Mental Health Check', 'How are you feeling today? If you''d like, we can connect you with a counselor.', 'in_app');

-- Insert default patient journey stage for existing users
INSERT INTO public.patient_journey_stages (user_id, current_stage)
SELECT DISTINCT user_id, 'screening'::care_stage
FROM public.appointments
WHERE NOT EXISTS (
  SELECT 1 FROM public.patient_journey_stages 
  WHERE patient_journey_stages.user_id = appointments.user_id
);