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
import { format } from "date-fns";
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
import { useLocation } from "react-router-dom";

const appointmentTypes = [
  { value: "screening", label: "Screening Mammogram", duration: "30 minutes" },
  { value: "consultation", label: "Specialist Consultation", duration: "45 minutes" },
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
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      type: "consultation",
      doctor: "Dr. Akosua Mensah",
      date: new Date(2024, 2, 15),
      time: "10:00",
      location: "Korle-Bu Teaching Hospital",
      notes: "Initial consultation for family history assessment",
      status: "scheduled"
    }
  ]);
  
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();
  const location = useLocation();

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

  const bookAppointment = () => {
    if (!selectedType || !selectedDoctor || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const doctor = doctors.find(d => d.id === selectedDoctor);
    if (!doctor) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      type: selectedType,
      doctor: doctor.name,
      date: selectedDate,
      time: selectedTime,
      location: doctor.location,
      notes,
      status: "scheduled"
    };

    setAppointments(prev => [...prev, newAppointment]);
    
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

          <Card className="bg-gradient-card shadow-card-soft cursor-pointer hover:shadow-medical transition-shadow">
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
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          <div>
                            <div className="font-medium">{doctor.name}</div>
                            <div className="text-sm text-muted-foreground">{doctor.specialty} • {doctor.location}</div>
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
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
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
                      <Button variant="outline" size="sm">
                        Reschedule
                      </Button>
                      <Button variant="outline" size="sm">
                        Cancel
                      </Button>
                      <Button variant="outline" size="sm">
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
    </div>
  );
}