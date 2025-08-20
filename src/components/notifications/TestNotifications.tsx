import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, TestTube } from "lucide-react";

const testNotificationTypes = [
  {
    type: 'screening_results',
    stage: 'post_screening',
    title: 'Mammogram Results Ready',
    message: 'Your mammogram results are ready. Please schedule your follow-up appointment with Dr. Smith. Click here to book.'
  },
  {
    type: 'diagnosis_available',
    stage: 'diagnosis',
    title: 'Pathology Report Available',
    message: 'Your pathology report is available. Please meet with your care team to discuss treatment options.'
  },
  {
    type: 'treatment_reminder',
    stage: 'chemotherapy',
    title: 'Chemo Session Tomorrow',
    message: 'Chemo Session #3 is tomorrow at 9:00 AM. Don\'t forget to bring your ID, snacks, and a support person if possible.'
  },
  {
    type: 'post_treatment',
    stage: 'chemotherapy',
    title: 'Post-Chemo Check-in',
    message: 'How are you feeling today? It\'s Day 5 after your infusion. Tap here to record symptoms and get support.'
  },
  {
    type: 'pre_treatment',
    stage: 'surgery',
    title: 'Surgery Preparation',
    message: 'Surgery scheduled for Monday at 7:00 AM. Please avoid food after midnight and arrange transportation.'
  },
  {
    type: 'post_treatment',
    stage: 'surgery',
    title: 'Post-Surgery Care',
    message: 'It\'s Day 3 after surgery. Remember to check your wound site for signs of infection. Learn what\'s normal and when to seek help.'
  },
  {
    type: 'treatment_reminder',
    stage: 'radiation',
    title: 'Radiation Session Today',
    message: 'Radiation therapy session today at 2:00 PM. Try to wear loose clothing.'
  },
  {
    type: 'wellness_tip',
    stage: 'radiation',
    title: 'Skin Care Tip',
    message: 'Skin care tip: Apply moisturizer after treatment, not before. Your skin may be more sensitive during radiation therapy.'
  },
  {
    type: 'support_group',
    stage: 'survivorship',
    title: 'Support Group Tonight',
    message: 'Join tonight\'s survivor support group on WhatsApp at 7 PM. Share your journey and hear from others.'
  },
  {
    type: 'mental_health_check',
    stage: null,
    title: 'Mental Health Check-in',
    message: 'How are you feeling today? If you\'d like, we can connect you with a counselor for additional support.'
  }
];

export function TestNotifications() {
  const [selectedType, setSelectedType] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendTestNotification = async () => {
    if (!selectedType) {
      toast({
        title: "Please select a notification type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      const notificationType = testNotificationTypes.find(t => t.type === selectedType);
      if (!notificationType) {
        throw new Error('Invalid notification type');
      }

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userData.user.id,
          type: notificationType.type as any,
          title: customTitle || notificationType.title,
          message: customMessage || notificationType.message,
          channel: 'in_app' as any,
          status: 'sent' as any,
          scheduled_for: new Date().toISOString(),
          sent_at: new Date().toISOString(),
          care_stage: notificationType.stage as any,
          priority: 1,
          metadata: { source: 'test_notification' }
        });

      if (error) throw error;

      toast({
        title: "Test notification sent!",
        description: "Check your notification center to see the test notification."
      });

      // Reset form
      setSelectedType('');
      setCustomTitle('');
      setCustomMessage('');

    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedNotification = testNotificationTypes.find(t => t.type === selectedType);

  return (
    <Card className="shadow-medical bg-gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="h-5 w-5" />
          Test Healthcare Notifications
        </CardTitle>
        <CardDescription>
          Send test notifications to see how the healthcare notification system works across different care stages
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Notification Type & Care Stage</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a healthcare notification scenario" />
            </SelectTrigger>
            <SelectContent>
              {testNotificationTypes.map((notif) => (
                <SelectItem key={notif.type + (notif.stage || '')} value={notif.type}>
                  <div className="flex flex-col">
                    <span className="font-medium">{notif.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {notif.stage ? `${notif.stage} stage` : 'General'} • {notif.type.replace('_', ' ')}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedNotification && (
          <div className="p-4 bg-muted/50 rounded-lg border-l-4 border-l-primary">
            <h4 className="font-medium text-sm mb-1">Default notification preview:</h4>
            <p className="text-sm font-medium">{selectedNotification.title}</p>
            <p className="text-xs text-muted-foreground">{selectedNotification.message}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="customTitle">Custom Title (optional)</Label>
          <Input
            id="customTitle"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="Override the default title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customMessage">Custom Message (optional)</Label>
          <Textarea
            id="customMessage"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Override the default message"
            rows={3}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            onClick={sendTestNotification} 
            disabled={loading || !selectedType}
            className="bg-gradient-primary"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? "Sending..." : "Send Test Notification"}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/30 rounded">
          <strong>How to test:</strong>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Select a notification type above</li>
            <li>Optionally customize the title and message</li>
            <li>Click "Send Test Notification"</li>
            <li>Check the notification bell icon in the top navigation</li>
            <li>The notification will appear instantly with the healthcare-specific styling</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}