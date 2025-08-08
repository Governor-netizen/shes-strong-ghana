import { useState } from "react";
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
  Phone
} from "lucide-react";

import { VoiceRecorder } from "@/components/VoiceRecorder";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
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
      content: "Hello! I'm your AI health assistant. I can help you with symptom assessment, answer questions about breast cancer, and guide you on next steps. What would you like to discuss today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

const handleSendMessage = async (override?: string) => {
  const text = (override ?? inputValue).trim();
  if (!text) return;

  addMessage(text, 'user');
  setInputValue("");
  setIsLoading(true);

  try {
    const { supabase } = await import("@/integrations/supabase/client");

    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        messages: [
          { role: 'system', content: "You are a helpful, concise health assistant. Be accurate, avoid diagnosis, include Ghana/Sub-Saharan context when relevant. If unsure, say you don't know and suggest seeing a clinician." },
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
      addMessage("Sorry, I couldn't fetch an answer right now. Please try again.", 'bot');
    } else {
      const content = (data as any)?.generatedText || "I couldn't find an answer.";
      addMessage(content, 'bot');
    }
  } catch (e: any) {
    console.error("AI error", e);
    addMessage("There was a problem reaching the AI service. Please try again.", 'bot');
  } finally {
    setIsLoading(false);
  }
};

const handleQuickResponse = (response: string) => {
  handleSendMessage(response);
};

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-primary shadow-medical hover:shadow-lg z-50 animate-pulse"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-primary-foreground" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 w-[92vw] max-w-md h-[70vh] sm:bottom-6 sm:right-6 sm:w-96 sm:h-[500px] z-50 flex flex-col shadow-medical animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-primary rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary-foreground" />
          <span className="font-semibold text-primary-foreground">AI Health Assistant</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-primary-foreground hover:bg-primary-foreground/20"
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
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`max-w-[85%] p-4 rounded-lg text-sm leading-relaxed ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted border'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
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
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Please wait..." : "Describe your symptoms or ask a question..."}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
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