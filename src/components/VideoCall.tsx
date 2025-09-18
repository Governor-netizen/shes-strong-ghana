import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoCallProps {
  roomId: string;
  onCallEnd: () => void;
  isProvider?: boolean;
}

export const VideoCall: React.FC<VideoCallProps> = ({ 
  roomId, 
  onCallEnd, 
  isProvider = false 
}) => {
  const { toast } = useToast();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (connectionStatus === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [connectionStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      toast({
        title: "Camera Access Granted",
        description: "Setting up video call...",
      });
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera and microphone access for video calls",
        variant: "destructive",
      });
      throw error;
    }
  };

  const setupPeerConnection = async (stream: MediaStream) => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    pcRef.current = pc;

    // Add local stream tracks to peer connection
    stream.getTracks().forEach(track => {
      pc.addTrack(track, stream);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setRemoteStream(remoteStream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setConnectionStatus('connected');
        toast({
          title: "Call Connected",
          description: "You are now connected to the video call",
        });
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setConnectionStatus('disconnected');
      }
    };

    // Handle ICE candidates (in a real app, you'd exchange these via signaling server)
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE candidate:', event.candidate);
        // In a real implementation, send this to the other peer via signaling server
      }
    };

    return pc;
  };

  useEffect(() => {
    const startCall = async () => {
      try {
        const stream = await initializeMedia();
        await setupPeerConnection(stream);
        
        // Simulate connection for demo purposes
        setTimeout(() => {
          setConnectionStatus('connected');
        }, 2000);
        
      } catch (error) {
        console.error('Failed to start call:', error);
        setConnectionStatus('disconnected');
      }
    };

    startCall();

    return () => {
      // Cleanup
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (pcRef.current) {
        pcRef.current.close();
      }
    };
  }, []);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (pcRef.current) {
      pcRef.current.close();
    }
    onCallEnd();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="bg-card border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'connected' && `Connected • ${formatDuration(callDuration)}`}
            {connectionStatus === 'disconnected' && 'Disconnected'}
          </Badge>
          {isProvider && (
            <Badge variant="outline">Provider</Badge>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Room: {roomId}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-black">
        {/* Remote Video (Main) */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        
        {/* Local Video (Picture-in-picture) */}
        <div className="absolute top-4 right-4 w-48 h-36 bg-card rounded-lg overflow-hidden border">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <VideoOff className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* No remote video message */}
        {!remoteStream && connectionStatus === 'connected' && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <Card className="bg-black/50 text-white border-white/20">
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Waiting for the other participant to join...</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-card border-t p-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isAudioEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleAudio}
            className="rounded-full w-14 h-14"
          >
            {isAudioEnabled ? (
              <Mic className="h-6 w-6" />
            ) : (
              <MicOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant={isVideoEnabled ? "default" : "destructive"}
            size="lg"
            onClick={toggleVideo}
            className="rounded-full w-14 h-14"
          >
            {isVideoEnabled ? (
              <Video className="h-6 w-6" />
            ) : (
              <VideoOff className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={endCall}
            className="rounded-full w-14 h-14"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};