import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VideoCall } from './VideoCall';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { 
  Video, 
  Clock, 
  User, 
  MapPin, 
  FileText,
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

interface Appointment {
  id: string;
  starts_at: string;
  ends_at: string;
  notes?: string;
  meeting_type: 'in_person' | 'virtual';
  meeting_room_id?: string;
  meeting_url?: string;
  provider?: {
    name: string;
    specialty: string;
    photo_url?: string;
  };
}

interface VirtualMeetingRoomProps {
  appointmentId: string;
  onClose: () => void;
}

export const VirtualMeetingRoom: React.FC<VirtualMeetingRoomProps> = ({
  appointmentId,
  onClose
}) => {
  const { toast } = useToast();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [meetingRoom, setMeetingRoom] = useState<any>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [callReady, setCallReady] = useState(false);

  useEffect(() => {
    loadAppointmentData();
  }, [appointmentId]);

  const loadAppointmentData = async () => {
    try {
      // Load appointment details
      const { data: appointmentData, error: appointmentError } = await supabase
        .from('appointments')
        .select(`
          *,
          providers (
            name,
            specialty,
            photo_url
          )
        `)
        .eq('id', appointmentId)
        .single();

      if (appointmentError) throw appointmentError;
      
      setAppointment({
        ...appointmentData,
        provider: appointmentData.providers
      });

      // Load or create meeting room
      if (appointmentData.meeting_room_id) {
        const { data: roomData, error: roomError } = await supabase
          .from('virtual_meeting_rooms')
          .select('*')
          .eq('room_id', appointmentData.meeting_room_id)
          .single();

        if (roomError) {
          console.error('Error loading meeting room:', roomError);
        } else {
          setMeetingRoom(roomData);
        }
      } else {
        // Create a new meeting room
        await createMeetingRoom(appointmentData.id);
      }
    } catch (error) {
      console.error('Error loading appointment data:', error);
      toast({
        title: "Error",
        description: "Failed to load meeting information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createMeetingRoom = async (appointmentId: string) => {
    try {
      const roomId = `room-${appointmentId}-${Date.now()}`;
      
      const { data: roomData, error: roomError } = await supabase
        .from('virtual_meeting_rooms')
        .insert({
          room_id: roomId,
          appointment_id: appointmentId,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Update appointment with room ID
      await supabase
        .from('appointments')
        .update({ 
          meeting_room_id: roomId,
          meeting_url: `${window.location.origin}/meeting/${roomId}`
        })
        .eq('id', appointmentId);

      setMeetingRoom(roomData);
      
      toast({
        title: "Meeting Room Created",
        description: "Virtual meeting room is ready",
      });
    } catch (error) {
      console.error('Error creating meeting room:', error);
      toast({
        title: "Error",
        description: "Failed to create meeting room",
        variant: "destructive",
      });
    }
  };

  const startCall = async () => {
    // Check microphone and camera permissions
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCallReady(true);
      setIsInCall(true);
    } catch (error) {
      toast({
        title: "Camera/Microphone Access Required",
        description: "Please allow camera and microphone access to join the call",
        variant: "destructive",
      });
    }
  };

  const endCall = () => {
    setIsInCall(false);
    setCallReady(false);
    toast({
      title: "Call Ended",
      description: "You have left the meeting",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading meeting room...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isInCall && meetingRoom) {
    return (
      <VideoCall
        roomId={meetingRoom.room_id}
        onCallEnd={endCall}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Virtual Consultation
            </CardTitle>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Appointment Details */}
          {appointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {appointment.provider?.photo_url ? (
                  <img 
                    src={appointment.provider.photo_url} 
                    alt={appointment.provider.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{appointment.provider?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {appointment.provider?.specialty}
                  </p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  Virtual Meeting
                </Badge>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(appointment.starts_at).toLocaleDateString()} at{' '}
                    {new Date(appointment.starts_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Duration: {Math.round(
                      (new Date(appointment.ends_at).getTime() - 
                       new Date(appointment.starts_at).getTime()) / (1000 * 60)
                    )} minutes
                  </span>
                </div>
              </div>

              {appointment.notes && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Appointment Notes</span>
                  </div>
                  <p className="text-sm">{appointment.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Meeting Room Status */}
          {meetingRoom && (
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Meeting Room Ready
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Room ID: {meetingRoom.room_id}
              </p>
            </div>
          )}

          {/* Pre-call Instructions */}
          <div className="space-y-3">
            <h4 className="font-medium">Before joining the call:</h4>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Ensure you have a stable internet connection
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Test your camera and microphone
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Find a quiet, well-lit location
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Have your medical documents ready if needed
              </li>
            </ul>
          </div>

          {/* Join Call Button */}
          <div className="flex gap-3">
            <Button 
              onClick={startCall} 
              size="lg" 
              className="flex-1"
              disabled={!meetingRoom}
            >
              <Video className="h-4 w-4 mr-2" />
              Join Video Call
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              size="lg"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};