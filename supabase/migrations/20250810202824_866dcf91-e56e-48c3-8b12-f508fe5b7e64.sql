-- Harden function security: set search_path and use SECURITY DEFINER

CREATE OR REPLACE FUNCTION public.validate_time_range()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.ends_at <= NEW.starts_at THEN
    RAISE EXCEPTION 'ends_at must be after starts_at';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_slot_booked_on_appointment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.slot_id IS NOT NULL AND NEW.status IN ('booked','confirmed') THEN
    UPDATE public.availability_slots
    SET is_booked = true
    WHERE id = NEW.slot_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_slot_on_cancel()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.slot_id IS NOT NULL AND OLD.status IN ('booked','confirmed') AND NEW.status IN ('canceled','completed') THEN
    UPDATE public.availability_slots
    SET is_booked = false
    WHERE id = OLD.slot_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.release_slot_on_delete()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.slot_id IS NOT NULL AND OLD.status IN ('booked','confirmed') THEN
    UPDATE public.availability_slots
    SET is_booked = false
    WHERE id = OLD.slot_id;
  END IF;
  RETURN OLD;
END;
$$;
