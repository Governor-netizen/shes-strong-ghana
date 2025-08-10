-- Phase 1: Booking schema, RLS, and safeguards

-- 1) Enum for appointment status (idempotent)
DO $$ BEGIN
  CREATE TYPE public.appointment_status AS ENUM ('booked','confirmed','canceled','completed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2) Providers
CREATE TABLE IF NOT EXISTS public.providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  specialty text NOT NULL DEFAULT 'Oncology',
  location text,
  phone text,
  email text,
  external_booking_url text,
  bio text,
  photo_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- Public can read active providers
DO $$ BEGIN
  CREATE POLICY "Public can view active providers"
  ON public.providers FOR SELECT
  USING (is_active);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3) Availability slots
CREATE TABLE IF NOT EXISTS public.availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  is_booked boolean NOT NULL DEFAULT false,
  location text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.availability_slots ENABLE ROW LEVEL SECURITY;

-- Public can read only unbooked slots
DO $$ BEGIN
  CREATE POLICY "Public can view unbooked slots"
  ON public.availability_slots FOR SELECT
  USING (is_booked = false);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 4) Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider_id uuid NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  slot_id uuid REFERENCES public.availability_slots(id) ON DELETE SET NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  status public.appointment_status NOT NULL DEFAULT 'booked',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS for appointments (owner-only)
DO $$ BEGIN
  CREATE POLICY "Users can view their own appointments"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own appointments"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete their own appointments"
  ON public.appointments FOR DELETE
  USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 5) Auto-update updated_at using existing function
DO $$ BEGIN
  CREATE TRIGGER trg_providers_updated_at
  BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_slots_updated_at
  BEFORE UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 6) Validation: ends_at must be after starts_at
CREATE OR REPLACE FUNCTION public.validate_time_range()
RETURNS trigger AS $$
BEGIN
  IF NEW.ends_at <= NEW.starts_at THEN
    RAISE EXCEPTION 'ends_at must be after starts_at';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_validate_slot_time
  BEFORE INSERT OR UPDATE ON public.availability_slots
  FOR EACH ROW EXECUTE FUNCTION public.validate_time_range();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_validate_appointment_time
  BEFORE INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.validate_time_range();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7) Prevent double booking of active appointments
DO $$ BEGIN
  CREATE UNIQUE INDEX unique_active_appointments
  ON public.appointments(provider_id, starts_at)
  WHERE status IN ('booked','confirmed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 8) Keep slots in sync with appointments
CREATE OR REPLACE FUNCTION public.mark_slot_booked_on_appointment()
RETURNS trigger AS $$
BEGIN
  IF NEW.slot_id IS NOT NULL AND NEW.status IN ('booked','confirmed') THEN
    UPDATE public.availability_slots
    SET is_booked = true
    WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.release_slot_on_cancel()
RETURNS trigger AS $$
BEGIN
  IF OLD.slot_id IS NOT NULL AND OLD.status IN ('booked','confirmed') AND NEW.status IN ('canceled','completed') THEN
    UPDATE public.availability_slots
    SET is_booked = false
    WHERE id = OLD.slot_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.release_slot_on_delete()
RETURNS trigger AS $$
BEGIN
  IF OLD.slot_id IS NOT NULL AND OLD.status IN ('booked','confirmed') THEN
    UPDATE public.availability_slots
    SET is_booked = false
    WHERE id = OLD.slot_id;
  END IF;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER trg_mark_slot_booked
  AFTER INSERT ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.mark_slot_booked_on_appointment();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_release_slot_on_status
  AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.release_slot_on_cancel();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TRIGGER trg_release_slot_on_delete
  AFTER DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.release_slot_on_delete();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 9) Helpful indexes
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_slots_provider_starts ON public.availability_slots(provider_id, starts_at);
END $$;
