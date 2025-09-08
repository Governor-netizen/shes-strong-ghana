import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, startOfDay, addDays } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Phone,
  Plus,
  CheckCircle,
  AlertCircle,
  Stethoscope
} from "lucide-react";
import ClinicMap from "@/components/ClinicMap";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/hooks/useSEO";
import { secureProviderData } from "@/utils/secureProviderData";
 
const sb: any = supabase;
const appointmentTypes = [
  { value: "screening", label: "Screening Mammogram", duration: "30 minutes" },
  { value: "followup", label: "Follow-up Visit", duration: "30 minutes" },
  { value: "biopsy", label: "Biopsy Procedure", duration: "60 minutes" },
  { value: "genetic", label: "Genetic Counseling", duration: "60 minutes" },
  { value: "support", label: "Support Group", duration: "90 minutes" }
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30"
];

const doctors = [
  { id: "1", name: "Dr. Akosua Mensah", specialty: "Oncologist", location: "Korle-Bu Teaching Hospital" },
  { id: "2", name: "Dr. Kwame Asante", specialty: "Radiologist", location: "University of Ghana Hospital" },
  { id: "3", name: "Dr. Ama Osei", specialty: "Genetic Counselor", location: "Greater Accra Regional Hospital" },
  { id: "4", name: "Dr. Kofi Boateng", specialty: "Surgeon", location: "37 Military Hospital" }
];

interface Provider {
  id: string;
  name: string;
  specialty?: string;
  location?: string;
  external_booking_url?: string | null;
}

interface Slot {
  id: string;
  provider_id: string;
  starts_at: string;
  ends_at: string;
  location?: string | null;
}

interface Appointment {
  id: string;
  type: string;
  doctor: string;
  date: Date;
  time: string;
  location: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [showClinicMap, setShowClinicMap] = useState(false);
  const { toast } = useToast();
const location = useLocation();
  const navigate = useNavigate();

  useSEO({
    title: "Appointments — Book and manage | She's Strong Ghana",
    description: "Book oncologist appointments and manage your medical visits.",
    canonical: window.location.origin + "/appointments",
  });
 
  // Refs for smooth scroll and focusing the first field
  const bookingFormRef = useRef<HTMLDivElement | null>(null);
  const typeTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openAndScrollToForm = () => {
    setShowBookingForm(true);
    // Wait for the form to render, then scroll and focus
    setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      try { typeTriggerRef.current?.focus(); } catch { /* noop */ }
    }, 50);
  };

  useEffect(() => {
    const state = (location.state as any) || {};
    if (state.fromRiskAssessment) {
      setShowBookingForm(true);
      const defaultType = state.riskLevel === "high" ? "consultation" : "screening";
      setSelectedType(defaultType);
      setNotes(`From risk assessment: ${state.riskLevel} risk.`);
    }

    // Support deep-linking to /appointments#book
    if (location.hash === "#book") {
      openAndScrollToForm();
    }
    // We only want to run this once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load active providers on mount with secure data
  useEffect(() => {
    const loadProviders = async () => {
      const { data, error } = await supabase
        .from("providers")
        .select("id,name,specialty,location,external_booking_url,phone,email")
        .eq("is_active", true)
        .order("name", { ascending: true });
      if (!error && data) {
        // Apply security layer to mask sensitive contact information
        const securedData = await secureProviderData(data as any);
        setProviders(securedData as unknown as Provider[]);
      }
    };
    loadProviders();
  }, []);

  // Load available slots when provider or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDoctor || !selectedDate) {
        setSlots([]);
        setSelectedTime("");
        return;
      }
      const start = startOfDay(selectedDate);
      const end = addDays(start, 1);
      const { data, error } = await supabase
        .from("availability_slots")
        .select("id,provider_id,starts_at,ends_at,location,is_booked")
        .eq("provider_id", selectedDoctor)
        .gte("starts_at", start.toISOString())
        .lt("starts_at", end.toISOString())
        .eq("is_booked", false)
        .order("starts_at", { ascending: true });
      if (!error && data) {
        setSlots(data as unknown as Slot[]);
      }
    };
    fetchSlots();
}, [selectedDoctor, selectedDate]);

  // Realtime subscription to slot changes for selected provider/date
  useEffect(() => {
    if (!selectedDoctor) return;
    const channel = supabase
      .channel('availability_slots_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'availability_slots', filter: `provider_id=eq.${selectedDoctor}` }, () => {
        if (!selectedDate) return;
        const start = startOfDay(selectedDate);
        const end = addDays(start, 1);
        supabase
          .from('availability_slots')
          .select('id,provider_id,starts_at,ends_at,location,is_booked')
          .eq('provider_id', selectedDoctor)
          .gte('starts_at', start.toISOString())
          .lt('starts_at', end.toISOString())
          .eq('is_booked', false)
          .order('starts_at', { ascending: true })
          .then(({ data, error }) => {
            if (!error && data) setSlots(data as unknown as Slot[]);
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedDoctor, selectedDate]);
 
  const bookAppointment = async () => {
    if (!selectedType || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Require authentication to book
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "You must be signed in to book appointments. Please sign in first.",
        variant: "destructive",
      });
      navigate("/auth", { replace: false, state: { redirectTo: "/appointments#book" } });
      return;
    }

    const provider: any = (providers.find((p) => p.id === selectedDoctor) || (doctors as any).find((d: any) => d.id === selectedDoctor));

    // Try to map selected time to an available slot (from Supabase)
    const selectedSlot = slots.find(
      (s) => format(new Date(s.starts_at), "HH:mm") === selectedTime
    );

    if (selectedSlot) {
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          user_id: session.user.id,
          provider_id: selectedDoctor,
          slot_id: selectedSlot.id,
          starts_at: selectedSlot.starts_at,
          ends_at: selectedSlot.ends_at,
          status: "booked",
          notes,
        })
        .select()
        .single();

      if (error) {
        toast({ title: "Booking failed", description: error.message, variant: "destructive" });
        return;
      }

      const created = data as any;
      const newAppointment: Appointment = {
        id: created.id,
        type: selectedType,
        doctor: provider?.name || "",
        date: new Date(created.starts_at),
        time: format(new Date(created.starts_at), "HH:mm"),
        location: provider?.location || selectedSlot.location || "",
        notes,
        status: "scheduled",
      };
      setAppointments((prev) => [...prev, newAppointment]);
    } else {
      // Fallback to local booking when no slots are configured yet
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        type: selectedType,
        doctor: provider?.name || "",
        date: selectedDate,
        time: selectedTime,
        location: provider?.location || "",
        notes,
        status: "scheduled",
      };
      setAppointments((prev) => [...prev, newAppointment]);
    }

    // Reset form
    setSelectedType("");
    setSelectedDoctor("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setNotes("");
    setShowBookingForm(false);

    toast({
      title: "Appointment Booked",
      description: "Your appointment has been scheduled successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-primary/20 text-primary";
      case "completed": return "bg-success/20 text-success";
      case "cancelled": return "bg-destructive/20 text-destructive";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const getAppointmentTypeInfo = (type: string) => {
    return appointmentTypes.find(t => t.value === type);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Appointments</h1>
            </div>
            <Button 
              onClick={openAndScrollToForm}
              className="bg-gradient-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
          <p className="text-muted-foreground mt-2">
            Schedule and manage your medical appointments
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card-soft cursor-pointer hover:shadow-medical transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Emergency Contact</p>
                  <p className="text-sm text-muted-foreground">24/7 Health Hotline</p>
                  <p className="text-sm font-mono text-primary">+233 123 456 789</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card shadow-card-soft cursor-pointer hover:shadow-medical transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="font-medium">Telemedicine</p>
                  <p className="text-sm text-muted-foreground">Virtual consultations</p>
                  <p className="text-sm text-primary">Available now</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="bg-gradient-card shadow-card-soft cursor-pointer hover:shadow-medical transition-shadow"
            onClick={() => setShowClinicMap(true)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-medium">Find Clinics</p>
                  <p className="text-sm text-muted-foreground">Nearby healthcare providers</p>
                  <p className="text-sm text-primary">View map</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form */}
        {showBookingForm && (
          <Card ref={bookingFormRef} className="mb-8 shadow-medical bg-gradient-card">
            <CardHeader>
              <CardTitle>Book New Appointment</CardTitle>
              <CardDescription>Schedule your medical appointment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Appointment Type</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger ref={typeTriggerRef}>
                        <SelectValue placeholder="Select appointment type" />
                      </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.duration}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Healthcare Provider</Label>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {(providers.length > 0 ? providers : doctors).map((doctor: any) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-muted-foreground">{(doctor.specialty || "Oncologist")} • {doctor.location}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Time</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {(slots.length > 0
                        ? slots.map((s) => ({ id: s.id, label: format(new Date(s.starts_at), "HH:mm") }))
                        : timeSlots.map((t) => ({ id: t, label: t }))
                      ).map((opt) => (
                        <SelectItem key={opt.id} value={opt.label}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-notes">Notes (Optional)</Label>
                <Textarea
                  id="booking-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or questions for your appointment..."
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={() => setShowBookingForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={bookAppointment} className="flex-1 bg-gradient-primary">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Book Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <Card className="shadow-medical bg-gradient-card">
          <CardHeader>
            <CardTitle>Your Appointments</CardTitle>
            <CardDescription>Upcoming and past appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointments.map((appointment) => {
                const typeInfo = getAppointmentTypeInfo(appointment.type);
                return (
                  <div
                    key={appointment.id}
                    className="border border-border rounded-lg p-6 hover:shadow-card-soft transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-lg">
                          {typeInfo?.label || appointment.type}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(appointment.date, "PPP")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {appointment.time}
                            {typeInfo && <span>({typeInfo.duration})</span>}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.doctor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{appointment.location}</span>
                      </div>
                    </div>

                    {appointment.notes && (
                      <div className="bg-muted/50 p-3 rounded text-sm">
                        <strong>Notes:</strong> {appointment.notes}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Reset form and open with existing appointment data
                          setSelectedType(appointment.type);
                          setSelectedDoctor(appointments.find(a => a.doctor === appointment.doctor)?.id || "");
                          setSelectedDate(appointment.date);
                          setSelectedTime(appointment.time);
                          setNotes(appointment.notes);
                          setShowBookingForm(true);
                          toast({
                            title: "Reschedule Mode",
                            description: "Form opened with current appointment details. Make changes and book again."
                          });
                        }}
                      >
                        Reschedule
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setAppointments(prev => prev.map(a => 
                            a.id === appointment.id 
                              ? { ...a, status: "cancelled" as const }
                              : a
                          ));
                          toast({
                            title: "Appointment Cancelled",
                            description: "Your appointment has been cancelled successfully."
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Extract phone number from location or use emergency number
                          let phoneNumber = "+233123456789"; // Default emergency number
                          
                          // Try to match with clinic data from the map
                          const clinicPhone = appointment.location.includes("Korle-Bu") ? "+233302672501"
                            : appointment.location.includes("University of Ghana") ? "+233302512401"
                            : appointment.location.includes("37 Military") ? "+233302776591"
                            : appointment.location.includes("Komfo Anokye") ? "+233320227701"
                            : appointment.location.includes("Tamale") ? "+23337202970"
                            : "+233123456789";
                          
                          window.open(`tel:${clinicPhone}`, '_self');
                        }}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call Clinic
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clinic Map Modal */}
      {showClinicMap && (
        <ClinicMap onClose={() => setShowClinicMap(false)} />
      )}
    </div>
  );
}