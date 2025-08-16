-- Create post_treatment_surveys table
CREATE TABLE public.post_treatment_surveys (
  survey_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  treatment_stage text,
  chemo_cycles int,
  surgery_recovery_status text,
  side_effect_severity jsonb, -- e.g. { "nausea": "moderate", "fatigue": "severe" }
  comorbidities text[],
  mood_score int,
  pain_level int,
  energy_level int,
  distance_to_clinic numeric,
  transportation_access boolean,
  caregiver_support boolean,
  work_schedule_conflict boolean,
  reminders_read_rate numeric,
  video_engagement numeric,
  text_engagement numeric,
  audio_engagement numeric,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recommendations table
CREATE TABLE public.recommendations (
  recommendation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES public.post_treatment_surveys(survey_id) ON DELETE CASCADE,
  action text,
  model_version text,
  confidence_score numeric,
  rationale text,
  generated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.post_treatment_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_treatment_surveys
CREATE POLICY "Users can view their own surveys" 
ON public.post_treatment_surveys 
FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Users can create their own surveys" 
ON public.post_treatment_surveys 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their own surveys" 
ON public.post_treatment_surveys 
FOR UPDATE 
USING (auth.uid() = patient_id);

-- RLS policies for recommendations
CREATE POLICY "Users can view recommendations for their surveys" 
ON public.recommendations 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.post_treatment_surveys pts 
  WHERE pts.survey_id = recommendations.survey_id 
  AND pts.patient_id = auth.uid()
));

-- Add updated_at trigger
CREATE TRIGGER update_post_treatment_surveys_updated_at
BEFORE UPDATE ON public.post_treatment_surveys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();