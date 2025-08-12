
-- 1) Add a profile snapshot to appointments for provider reference
ALTER TABLE public.appointments
ADD COLUMN IF NOT EXISTS profile_snapshot jsonb;

-- 2) Create a trigger to attach the patient's current profile to new appointments
CREATE OR REPLACE FUNCTION public.attach_profile_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only set the snapshot on INSERT (do not overwrite later)
  IF NEW.profile_snapshot IS NULL AND NEW.user_id IS NOT NULL THEN
    SELECT jsonb_build_object(
      'first_name', p.first_name,
      'last_name', p.last_name,
      'email', p.email,
      'phone', p.phone,
      'date_of_birth', p.date_of_birth,
      'address', p.address,
      'emergency_contact', p.emergency_contact,
      'emergency_phone', p.emergency_phone,
      'blood_type', p.blood_type,
      'allergies', p.allergies,
      'medications', p.medications,
      'preferred_language', p.preferred_language
    )
    INTO NEW.profile_snapshot
    FROM public.profiles p
    WHERE p.id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS attach_profile_snapshot_before_insert ON public.appointments;
CREATE TRIGGER attach_profile_snapshot_before_insert
BEFORE INSERT ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.attach_profile_snapshot();
