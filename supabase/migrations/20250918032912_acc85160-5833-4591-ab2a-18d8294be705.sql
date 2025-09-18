-- Add virtual meeting support to appointments system

-- Add meeting type enum
CREATE TYPE meeting_type AS ENUM ('in_person', 'virtual');

-- Add virtual meeting fields to appointments table
ALTER TABLE public.appointments 
ADD COLUMN meeting_type meeting_type DEFAULT 'in_person',
ADD COLUMN meeting_details jsonb DEFAULT '{}',
ADD COLUMN meeting_room_id text,
ADD COLUMN meeting_url text;

-- Create virtual meeting rooms table
CREATE TABLE public.virtual_meeting_rooms (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id text NOT NULL UNIQUE,
  appointment_id uuid REFERENCES public.appointments(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on virtual_meeting_rooms
ALTER TABLE public.virtual_meeting_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for virtual meeting rooms
CREATE POLICY "Users can view their meeting rooms" 
ON public.virtual_meeting_rooms 
FOR SELECT 
USING (
  created_by = auth.uid() 
  OR EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = virtual_meeting_rooms.appointment_id 
    AND a.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create meeting rooms for their appointments" 
ON public.virtual_meeting_rooms 
FOR INSERT 
WITH CHECK (
  created_by = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.appointments a 
    WHERE a.id = virtual_meeting_rooms.appointment_id 
    AND a.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their meeting rooms" 
ON public.virtual_meeting_rooms 
FOR UPDATE 
USING (created_by = auth.uid());

-- Add trigger for updated_at
CREATE TRIGGER update_virtual_meeting_rooms_updated_at
BEFORE UPDATE ON public.virtual_meeting_rooms
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();