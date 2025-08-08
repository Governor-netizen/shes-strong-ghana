import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceRecorder({ onTranscript, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      try {
        mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop());
      } catch {}
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
      ];
      let chosen: string | undefined;
      for (const type of mimeTypes) {
        if ((window as any).MediaRecorder && MediaRecorder.isTypeSupported(type)) {
          chosen = type;
          break;
        }
      }

      const recorder = new MediaRecorder(stream, chosen ? { mimeType: chosen } : undefined);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsTranscribing(true);
        try {
          const blob = new Blob(chunksRef.current, { type: chosen || 'audio/webm' });
          const base64 = await blobToBase64(blob);
          const payload = base64.replace(/^data:.*;base64,/, '');

          const { data, error } = await supabase.functions.invoke('voice-to-text', {
            body: { audio: payload },
          });

          if (error) {
            console.error('Transcription error', error);
          } else {
            const text = (data as any)?.text || '';
            if (text.trim()) onTranscript(text.trim());
          }
        } catch (err) {
          console.error('VoiceRecorder transcription failed', err);
        } finally {
          setIsTranscribing(false);
        }
      };

      recorder.start(250); // gather small chunks
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access denied or unavailable', err);
    }
  };

  const stopRecording = () => {
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      rec.stop();
      rec.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const onClick = () => {
    if (disabled || isTranscribing) return;
    if (!isRecording) startRecording();
    else stopRecording();
  };

  return (
    <Button
      type="button"
      onClick={onClick}
      size="icon"
      variant={isRecording ? 'destructive' : 'secondary'}
      className="shrink-0"
      disabled={disabled}
      aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
      title={isRecording ? 'Stop recording' : 'Start voice input'}
    >
      {isTranscribing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <Square className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
