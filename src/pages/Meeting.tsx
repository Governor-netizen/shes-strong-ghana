import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VideoCall } from '@/components/VideoCall';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Video, ArrowLeft } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

interface MeetingRoom {
  id: string;
  room_id: string;
  appointment_id: string;
  is_active: boolean;
  expires_at: string;
  appointment?: {
    starts_at: string;
    ends_at: string;
    providers?: {
      name: string;
      specialty: string;
    };
  };
}

export default function Meeting() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [meetingRoom, setMeetingRoom] = useState<MeetingRoom | null>(null);
  const [isInCall, setIsInCall] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: "Virtual Meeting Room | She's Strong Ghana",
    description: "Join your virtual consultation with healthcare providers",
    canonical: window.location.origin + `/meeting/${roomId}`,
  });

  useEffect(() => {
    if (roomId) {
      loadMeetingRoom();
    } else {
      setError("Invalid meeting room ID");
      setLoading(false);
    }
  }, [roomId]);

  const loadMeetingRoom = async () => {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to join the meeting",
          variant: "destructive",
        });
        navigate('/auth', { state: { redirectTo: `/meeting/${roomId}` } });
        return;
      }

      // Load meeting room data
      const { data: roomData, error: roomError } = await supabase
        .from('virtual_meeting_rooms')
        .select(`
          *,
          appointments (
            starts_at,
            ends_at,
            providers (
              name,
              specialty
            )
          )
        `)
        .eq('room_id', roomId)
        .eq('is_active', true)
        .single();

      if (roomError) {
        throw new Error('Meeting room not found or has expired');
      }

      // Check if room has expired
      if (new Date(roomData.expires_at) < new Date()) {
        throw new Error('This meeting room has expired');
      }

      setMeetingRoom(roomData);
    } catch (error: any) {
      console.error('Error loading meeting room:', error);
      setError(error.message || 'Failed to load meeting room');
      toast({
        title: "Error",
        description: error.message || 'Failed to load meeting room',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startCall = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
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
    toast({
      title: "Call Ended",
      description: "You have left the meeting",
    });
  };

  const goBack = () => {
    navigate('/appointments');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading meeting room...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Meeting Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={goBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Appointments
            </Button>
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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Virtual Meeting Room
            </CardTitle>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {meetingRoom && (
            <>
              {/* Meeting Details */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-semibold mb-2">Meeting Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room ID:</span>
                    <span className="font-mono">{meetingRoom.room_id}</span>
                  </div>
                  {meetingRoom.appointment?.providers && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Provider:</span>
                      <span>{meetingRoom.appointment.providers.name}</span>
                    </div>
                  )}
                  {meetingRoom.appointment?.starts_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scheduled:</span>
                      <span>
                        {new Date(meetingRoom.appointment.starts_at).toLocaleDateString()} at{' '}
                        {new Date(meetingRoom.appointment.starts_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pre-call Instructions */}
              <div className="space-y-3">
                <h4 className="font-medium">Before joining the call:</h4>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Test your camera and microphone</li>
                  <li>• Find a quiet, well-lit location</li>
                  <li>• Have your medical documents ready if needed</li>
                </ul>
              </div>

              {/* Join Button */}
              <Button 
                onClick={startCall} 
                size="lg" 
                className="w-full"
              >
                <Video className="h-4 w-4 mr-2" />
                Join Video Call
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}