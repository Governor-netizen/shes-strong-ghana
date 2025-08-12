-- Secure triggers and tighter RLS
-- 1) Replace public availability policy to require auth
DROP POLICY IF EXISTS "Public can view unbooked slots" ON public.availability_slots;
CREATE POLICY "Authenticated can view unbooked slots"
ON public.availability_slots
FOR SELECT
USING (auth.uid() IS NOT NULL AND is_booked = false);

-- 2) Ownership/validation triggers
-- Alerts: ensure user_id is set to the current user on insert
DROP TRIGGER IF EXISTS set_alerts_owner_before_insert ON public.alerts;
CREATE TRIGGER set_alerts_owner_before_insert
BEFORE INSERT ON public.alerts
FOR EACH ROW
EXECUTE FUNCTION public.set_alert_owner();

-- Risk assessments: ensure user_id is set and enforced
DROP TRIGGER IF EXISTS set_risk_assessments_owner_before_insert ON public.risk_assessments;
CREATE TRIGGER set_risk_assessments_owner_before_insert
BEFORE INSERT ON public.risk_assessments
FOR EACH ROW
EXECUTE FUNCTION public.set_risk_assessment_owner();

-- Availability slots: validate time ranges on insert/update
DROP TRIGGER IF EXISTS validate_availability_time_range ON public.availability_slots;
CREATE TRIGGER validate_availability_time_range
BEFORE INSERT OR UPDATE ON public.availability_slots
FOR EACH ROW
EXECUTE FUNCTION public.validate_time_range();

-- Appointments: mark slot booked when appropriate
DROP TRIGGER IF EXISTS mark_slot_booked_on_appointment_trigger ON public.appointments;
CREATE TRIGGER mark_slot_booked_on_appointment_trigger
AFTER INSERT OR UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.mark_slot_booked_on_appointment();

-- Appointments: release slot when canceled/completed
DROP TRIGGER IF EXISTS release_slot_on_cancel_trigger ON public.appointments;
CREATE TRIGGER release_slot_on_cancel_trigger
AFTER UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.release_slot_on_cancel();

-- Appointments: release slot on delete
DROP TRIGGER IF EXISTS release_slot_on_delete_trigger ON public.appointments;
CREATE TRIGGER release_slot_on_delete_trigger
AFTER DELETE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.release_slot_on_delete();

-- 3) Consistent updated_at maintenance triggers
-- availability_slots
DROP TRIGGER IF EXISTS set_availability_slots_updated_at ON public.availability_slots;
CREATE TRIGGER set_availability_slots_updated_at
BEFORE UPDATE ON public.availability_slots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- appointments
DROP TRIGGER IF EXISTS set_appointments_updated_at ON public.appointments;
CREATE TRIGGER set_appointments_updated_at
BEFORE UPDATE ON public.appointments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- providers
DROP TRIGGER IF EXISTS set_providers_updated_at ON public.providers;
CREATE TRIGGER set_providers_updated_at
BEFORE UPDATE ON public.providers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- profiles
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();