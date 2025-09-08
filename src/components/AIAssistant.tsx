import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  AlertTriangle,
  Heart,
  Phone,
  Paperclip
} from "lucide-react";

import { VoiceRecorder } from "@/components/VoiceRecorder";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  images?: string[];
  timestamp: Date;
}

const triageQuestions = [
  "Tell me about any symptoms you're experiencing",
  "How long have you noticed these symptoms?",
  "Do you have any family history of breast cancer?",
  "Are you experiencing any breast lumps or changes?",
  "Any unusual discharge or skin changes?"
];

const quickResponses = [
  "I found a lump",
  "Breast pain",
  "Skin changes",
  "Family history concerns",
  "Schedule appointment"
];

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hi there! 👋 I'm Grace, your friendly health companion. I'm here to chat about any health concerns you might have and help you understand your symptoms better. What's on your mind today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
const [animateIntro, setAnimateIntro] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  const addMessage = (content: string, type: 'user' | 'bot', images?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      images,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

const handleSendMessage = async (override?: string) => {
  const text = (override ?? inputValue).trim();
  if (!text && mediaPreviews.length === 0) return;

  // Add user message with any attached media
  addMessage(text || "[Media uploaded]", 'user', mediaPreviews.length ? mediaPreviews : undefined);
  setInputValue("");
  setIsLoading(true);

  try {
    const { supabase } = await import("@/integrations/supabase/client");

    if (mediaPreviews.length > 0) {
        const { data, error } = await supabase.functions.invoke('vision-analyze', {
          body: {
            images: mediaPreviews,
            prompt: text,
          }
        });

        if (error) {
          console.error("vision-analyze error", error);
          addMessage("Oops! I'm having trouble looking at that image right now. Could you try again?", 'bot');
        } else {
          const content = (data as any)?.generatedText || "I'm sorry, I couldn't make out what's in the image.";
          addMessage(content, 'bot');
        }

      // Clear attachments after send
      setMediaPreviews([]);
      return;
    }

    // Fallback to text chat
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        messages: [
          { role: 'system', content: "You are Grace, a warm and caring health companion. Keep responses brief and conversational. Be supportive but always remind people to see a doctor for proper medical advice. Use a friendly, approachable tone. Include Ghana/Sub-Saharan context when relevant." },
          ...messages.slice(-10).map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content
          })),
          { role: 'user', content: text }
        ]
      }
    });

    if (error) {
      console.error("openai-chat error", error);
      addMessage("I'm having a little trouble connecting right now. Mind trying that again?", 'bot');
    } else {
      const content = (data as any)?.generatedText || "Hmm, I'm not sure about that one.";
      addMessage(content, 'bot');
    }
  } catch (e: any) {
    console.error("AI error", e);
    addMessage("Oops! Something went wrong on my end. Let's try that again!", 'bot');
  } finally {
    setIsLoading(false);
  }
};

// Handle file uploads (images + first frame of videos)
const readFileAsDataURL = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const extractVideoFirstFrame = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas context not available');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        URL.revokeObjectURL(url);
        resolve(dataUrl);
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };
    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
  });
};

const handleFiles = async (files: FileList | null) => {
  if (!files || files.length === 0) return;
  const previews: string[] = [];
  for (const file of Array.from(files)) {
    if (file.type.startsWith('image/')) {
      const dataUrl = await readFileAsDataURL(file);
      previews.push(dataUrl);
    } else if (file.type.startsWith('video/')) {
      try {
        const frame = await extractVideoFirstFrame(file);
        previews.push(frame);
      } catch (e) {
        console.error('Failed to extract video frame', e);
      }
    }
  }
  setMediaPreviews(prev => [...prev, ...previews]);
};

const handleQuickResponse = (response: string) => {
  handleSendMessage(response);
};

useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
}, [messages, isLoading]);

// Play OncoAI intro animation once per session
useEffect(() => {
  try {
    const done = sessionStorage.getItem('oncoAIIntroDone');
    if (!done) {
      setAnimateIntro(true);
      // Mark as done after animation completes (6s)
      setTimeout(() => {
        setAnimationComplete(true);
        sessionStorage.setItem('oncoAIIntroDone', '1');
      }, 6000);
    } else {
      // If already done, go straight to final position
      setAnimationComplete(true);
    }
  } catch {
    // ignore storage errors
  }
}, []);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary shadow-medical hover:shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background z-50 hover-scale ${
          animationComplete ? 'oncoai-final-position' : (animateIntro ? 'oncoai-float-blink' : '')
        }`}
        size="icon"
      >
        <img
          src="/lovable-uploads/149c2f84-f3e6-435d-b22f-fe5f9e85d931.png"
          alt="OncoAI icon — female nurse silhouette with ribbon"
          className="h-8 w-8 rounded-full object-cover"
          loading="lazy"
        />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[92vw] max-w-md h-[70vh] sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] z-50 flex flex-col shadow-medical animate-scale-in" role="dialog" aria-label="OncoAI">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-primary rounded-t-lg">
        <div className="flex items-center gap-2">
          <img
            src="/lovable-uploads/149c2f84-f3e6-435d-b22f-fe5f9e85d931.png"
            alt="OncoAI icon"
            className="h-5 w-5 rounded-full object-cover ring-1 ring-primary-foreground/30"
            loading="lazy"
          />
          <span className="font-semibold text-primary-foreground">Grace</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
          aria-label="Close assistant"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 animate-fade-in ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <img
                    src="/lovable-uploads/149c2f84-f3e6-435d-b22f-fe5f9e85d931.png"
                    alt="Grace avatar"
                    className="h-8 w-8 rounded-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>
              <div className={`max-w-[85%] p-4 rounded-lg text-sm leading-relaxed ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted border'
              }`}>
                <div>{message.content}</div>
                {message.images && message.images.length > 0 && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {message.images.map((src, i) => (
                      <img key={i} src={src} alt={`uploaded media ${i + 1}`} className="w-20 h-20 object-cover rounded" loading="lazy" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted">
                <img
                  src="/lovable-uploads/149c2f84-f3e6-435d-b22f-fe5f9e85d931.png"
                  alt="OncoAI typing"
                  className="h-8 w-8 rounded-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="max-w-[85%] p-3 rounded-lg bg-muted border">
                <div className="typing-indicator" aria-live="polite" aria-label="Grace is typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      {/* Quick Responses */}
      <div className="p-3 border-t bg-muted/30">
        <div className="flex flex-wrap gap-2">
          {quickResponses.slice(0, 3).map((response) => (
            <Button
              key={response}
              variant="outline"
              size="sm"
              onClick={() => handleQuickResponse(response)}
              className="text-xs h-8 hover-scale"
            >
              {response}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        {mediaPreviews.length > 0 && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex -space-x-2">
              {mediaPreviews.slice(0, 5).map((src, i) => (
                <img key={i} src={src} alt={`preview ${i + 1}`} className="w-10 h-10 rounded object-cover border bg-background" />
              ))}
              {mediaPreviews.length > 5 && (
                <span className="ml-3 text-xs text-muted-foreground">+{mediaPreviews.length - 5} more</span>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setMediaPreviews([])}>Clear</Button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Please wait..." : "Ask a question or describe what’s in the media..."}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <Paperclip className="h-4 w-4" />
          </Button>
          <VoiceRecorder onTranscript={(t) => handleSendMessage(t)} disabled={isLoading} />
          <Button onClick={() => handleSendMessage()} size="icon" className="bg-gradient-primary" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="p-3 bg-destructive/10 border-t">
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span>For emergencies, call your nearest hospital immediately</span>
        </div>
      </div>
    </Card>
  );
}