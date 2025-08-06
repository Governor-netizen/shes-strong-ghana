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

  const addMessage = (content: string, type: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    addMessage(inputValue, 'user');
    
    // Simple bot response logic
    setTimeout(() => {
      let botResponse = "I understand your concern. ";
      
      if (inputValue.toLowerCase().includes('lump')) {
        botResponse += "Finding a lump can be concerning. I recommend scheduling an appointment with a healthcare provider as soon as possible for proper examination. Would you like help finding a nearby clinic?";
      } else if (inputValue.toLowerCase().includes('pain')) {
        botResponse += "Breast pain can have various causes. Can you describe the type of pain and when you notice it most? I'd also recommend tracking this in your symptom tracker.";
      } else if (inputValue.toLowerCase().includes('family')) {
        botResponse += "Family history is important for risk assessment. Have you completed our family history assessment? It can help determine your risk factors.";
      } else {
        botResponse += "Thank you for sharing that information. Based on your symptoms, I recommend documenting them in the symptom tracker and considering a consultation with a healthcare provider. Is there anything specific you'd like to know about breast health?";
      }
      
      addMessage(botResponse, 'bot');
    }, 1500);
    
    setInputValue("");
  };

  const handleQuickResponse = (response: string) => {
    addMessage(response, 'user');
    
    setTimeout(() => {
      let botResponse = "";
      
      switch (response) {
        case "I found a lump":
          botResponse = "This requires immediate attention. Please schedule an appointment with a healthcare provider within the next few days. In the meantime, try not to worry - many lumps are benign. Would you like me to help you find nearby clinics?";
          break;
        case "Breast pain":
          botResponse = "Breast pain can be related to hormonal changes, but it's good to track it. Can you tell me if the pain is in one or both breasts, and if it's related to your menstrual cycle?";
          break;
        case "Skin changes":
          botResponse = "Skin changes should be evaluated by a healthcare provider. This includes dimpling, puckering, or unusual texture. I recommend scheduling an appointment and taking photos to show your doctor.";
          break;
        case "Family history concerns":
          botResponse = "Understanding your family history is crucial for risk assessment. Have you completed our detailed family history questionnaire? It can help determine if you need enhanced screening.";
          break;
        case "Schedule appointment":
          botResponse = "I can help guide you to our appointment scheduler. You can book consultations, follow-ups, and screening appointments. Would you like to proceed to the appointment section?";
          break;
        default:
          botResponse = "Thank you for that information. How can I help you further with your health concerns?";
      }
      
      addMessage(botResponse, 'bot');
    }, 1000);
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
    <Card className="fixed bottom-6 right-6 w-80 h-96 z-50 flex flex-col shadow-medical">
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
              className={`flex items-start gap-2 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
              <div className={`max-w-[220px] p-3 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-primary text-primary-foreground ml-auto'
                  : 'bg-muted'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick Responses */}
      <div className="p-2 border-t">
        <div className="flex flex-wrap gap-1 mb-2">
          {quickResponses.map((response) => (
            <Button
              key={response}
              variant="outline"
              size="sm"
              onClick={() => handleQuickResponse(response)}
              className="text-xs h-7"
            >
              {response}
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="p-2 bg-destructive/10 border-t">
        <div className="flex items-center gap-2 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span>For emergencies, call 911 or visit your nearest hospital</span>
        </div>
      </div>
    </Card>
  );
}