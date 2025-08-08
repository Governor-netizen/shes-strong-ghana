-- Update profiles table for app profile details and secure access

-- Ensure timestamps have defaults
ALTER TABLE public.profiles
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET DEFAULT now();

-- Add profile detail columns if they don't exist
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS emergency_phone text,
  ADD COLUMN IF NOT EXISTS blood_type text,
  ADD COLUMN IF NOT EXISTS allergies text,
  ADD COLUMN IF NOT EXISTS medications text,
  ADD COLUMN IF NOT EXISTS preferred_language text DEFAULT 'English';

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Owner-only access policies
DROP POLICY IF EXISTS "Profiles are viewable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be inserted by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can be updated by owner" ON public.profiles;

CREATE POLICY "Profiles are viewable by owner"
  ON public.profiles
  FOR SELECT
  USING (id::text = auth.uid()::text);

CREATE POLICY "Profiles can be inserted by owner"
  ON public.profiles
  FOR INSERT
  WITH CHECK (id::text = auth.uid()::text);

CREATE POLICY "Profiles can be updated by owner"
  ON public.profiles
  FOR UPDATE
  USING (id::text = auth.uid()::text);

-- Updated-at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();