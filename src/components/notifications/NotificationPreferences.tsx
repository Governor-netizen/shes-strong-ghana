import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Smartphone, Clock, Moon } from "lucide-react";

type NotificationType = 
  | 'appointment_reminder' 
  | 'appointment_confirmation' 
  | 'appointment_follow_up'
  | 'screening_results' 
  | 'diagnosis_available' 
  | 'treatment_reminder'
  | 'pre_treatment' 
  | 'post_treatment' 
  | 'side_effect_check' 
  | 'wellness_tip'
  | 'support_group' 
  | 'mental_health_check' 
  | 'educational_content';

type NotificationChannel = 'in_app' | 'email' | 'push' | 'sms';

interface NotificationPreference {
  id: string;
  notification_type: NotificationType;
  channels: NotificationChannel[];
  enabled: boolean;
  reminder_timing: number[];
  quiet_hours_start: string;
  quiet_hours_end: string;
  timezone: string;
}

const notificationTypes: Array<{
  type: NotificationType;
  label: string;
  description: string;
}> = [
  {
    type: 'appointment_reminder',
    label: 'Appointment Reminders',
    description: 'Get notified before your appointments'
  },
  {
    type: 'screening_results',
    label: 'Screening Results',
    description: 'Receive alerts when your test results are ready'
  },
  {
    type: 'treatment_reminder',
    label: 'Treatment Reminders',
    description: 'Reminders for medication and therapy sessions'
  },
  {
    type: 'wellness_tip',
    label: 'Wellness Tips',
    description: 'Daily health and wellness recommendations'
  },
  {
    type: 'support_group',
    label: 'Support Groups',
    description: 'Notifications about support group meetings'
  },
  {
    type: 'mental_health_check',
    label: 'Mental Health Check-ins',
    description: 'Periodic wellness check-ins and resources'
  }
];

const reminderOptions = [
  { value: [1440], label: '1 day before' },
  { value: [1440, 120], label: '1 day and 2 hours before' },
  { value: [1440, 120, 30], label: '1 day, 2 hours, and 30 minutes before' },
  { value: [2880, 1440, 120], label: '2 days, 1 day, and 2 hours before' },
];

export function NotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*');

      if (error) throw error;

      // Create default preferences for missing notification types
      const existingTypes = data?.map(p => p.notification_type) || [];
      const missingTypes = notificationTypes.filter(nt => !existingTypes.includes(nt.type));
      
      const defaultPreferences: NotificationPreference[] = missingTypes.map(nt => ({
        id: `temp-${nt.type}`,
        notification_type: nt.type,
        channels: ['in_app'] as NotificationChannel[],
        enabled: true,
        reminder_timing: [1440, 120, 30],
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        timezone: 'UTC'
      }));

      setPreferences([...(data || []), ...defaultPreferences]);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast({
        title: "Error",
        description: "Failed to load notification preferences",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (type: NotificationType, updates: Partial<NotificationPreference>) => {
    setSaving(true);
    try {
      const existingPref = preferences.find(p => p.notification_type === type);
      
      if (existingPref && !existingPref.id.startsWith('temp-')) {
        // Update existing preference
        const { error } = await supabase
          .from('notification_preferences')
          .update(updates)
          .eq('notification_type', type);

        if (error) throw error;
      } else {
        // Create new preference - let Supabase handle user_id automatically
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not authenticated');

        const { error } = await supabase
          .from('notification_preferences')
          .insert({
            user_id: userData.user.id,
            notification_type: type,
            channels: updates.channels || ['in_app'],
            enabled: updates.enabled ?? true,
            reminder_timing: updates.reminder_timing || [1440, 120, 30],
            quiet_hours_start: updates.quiet_hours_start || '22:00',
            quiet_hours_end: updates.quiet_hours_end || '08:00',
            timezone: updates.timezone || 'UTC'
          });

        if (error) throw error;
      }

      // Update local state
      setPreferences(prev => 
        prev.map(p => 
          p.notification_type === type 
            ? { ...p, ...updates }
            : p
        )
      );

      toast({
        title: "Settings Updated",
        description: "Your notification preferences have been saved",
      });

      // Refresh to get proper IDs for new preferences
      await fetchPreferences();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading preferences...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Customize how and when you receive notifications about your healthcare journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationTypes.map((notificationType) => {
            const pref = preferences.find(p => p.notification_type === notificationType.type);
            if (!pref) return null;

            return (
              <div key={notificationType.type} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-medium">
                      {notificationType.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {notificationType.description}
                    </p>
                  </div>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={(enabled) => 
                      updatePreference(notificationType.type, { enabled })
                    }
                    disabled={saving}
                  />
                </div>

                {pref.enabled && (
                  <div className="ml-4 space-y-4 border-l-2 border-muted pl-4">
                    {/* Delivery Channels */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Delivery Methods</Label>
                      <div className="flex gap-2 flex-wrap">
                        {([
                          { key: 'in_app' as const, label: 'In-App', icon: Bell },
                          { key: 'email' as const, label: 'Email', icon: Mail },
                          { key: 'push' as const, label: 'Push', icon: Smartphone }
                        ] as const).map(({ key, label, icon: Icon }) => (
                          <Badge
                            key={key}
                            variant={pref.channels.includes(key) ? "default" : "outline"}
                            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => {
                              const newChannels = pref.channels.includes(key)
                                ? pref.channels.filter(c => c !== key)
                                : [...pref.channels, key];
                              updatePreference(notificationType.type, { channels: newChannels });
                            }}
                          >
                            <Icon className="h-3 w-3 mr-1" />
                            {label}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Reminder Timing for appointment reminders */}
                    {notificationType.type === 'appointment_reminder' && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Reminder Schedule
                        </Label>
                        <Select
                          value={JSON.stringify(pref.reminder_timing)}
                          onValueChange={(value) => 
                            updatePreference(notificationType.type, { 
                              reminder_timing: JSON.parse(value) 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {reminderOptions.map((option) => (
                              <SelectItem 
                                key={JSON.stringify(option.value)} 
                                value={JSON.stringify(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                )}
                <Separator />
              </div>
            );
          })}

          {/* Quiet Hours */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              <Label className="text-base font-medium">Quiet Hours</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Set times when you don't want to receive non-urgent notifications
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Label className="text-sm">From</Label>
                <Input
                  type="time"
                  value={preferences[0]?.quiet_hours_start || '22:00'}
                  onChange={(e) => {
                    const time = e.target.value;
                    preferences.forEach(pref => {
                      if (!pref.id.startsWith('temp-')) {
                        updatePreference(pref.notification_type, { quiet_hours_start: time });
                      }
                    });
                  }}
                  className="w-32"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">To</Label>
                <Input
                  type="time"
                  value={preferences[0]?.quiet_hours_end || '08:00'}
                  onChange={(e) => {
                    const time = e.target.value;
                    preferences.forEach(pref => {
                      if (!pref.id.startsWith('temp-')) {
                        updatePreference(pref.notification_type, { quiet_hours_end: time });
                      }
                    });
                  }}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}