import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";
import { Resend } from "npm:resend@4.0.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScheduledNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  channel: string;
  scheduled_for: string;
  metadata: any;
  related_appointment_id?: string;
  care_stage?: string;
  priority: number;
}

async function processScheduledNotifications() {
  console.log('Processing scheduled notifications...');
  
  try {
    // Get notifications that are due for sending
    const { data: dueNotifications, error: fetchError } = await supabase
      .from('notifications')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: false })
      .limit(100);

    if (fetchError) {
      console.error('Error fetching due notifications:', fetchError);
      return;
    }

    if (!dueNotifications || dueNotifications.length === 0) {
      console.log('No notifications due for processing');
      return;
    }

    console.log(`Found ${dueNotifications.length} notifications to process`);

    for (const notification of dueNotifications) {
      await processNotification(notification);
    }

  } catch (error) {
    console.error('Error in processScheduledNotifications:', error);
  }
}

async function processNotification(notification: ScheduledNotification) {
  try {
    console.log(`Processing notification ${notification.id} for user ${notification.user_id}`);

    // Check user preferences for this notification type
    const { data: userPrefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', notification.user_id)
      .eq('notification_type', notification.type)
      .single();

    if (prefsError && prefsError.code !== 'PGRST116') {
      console.error('Error fetching user preferences:', prefsError);
      return;
    }

    // If user has preferences and notifications are disabled, skip
    if (userPrefs && !userPrefs.enabled) {
      console.log(`Notifications disabled for user ${notification.user_id}, type ${notification.type}`);
      await markNotificationAsSkipped(notification.id);
      return;
    }

    // Check quiet hours
    if (userPrefs && isInQuietHours(userPrefs.quiet_hours_start, userPrefs.quiet_hours_end)) {
      console.log(`Notification ${notification.id} postponed due to quiet hours`);
      await postponeNotification(notification.id, userPrefs.quiet_hours_end);
      return;
    }

    // Send the notification
    await sendNotification(notification, userPrefs);

    // Mark as sent
    await markNotificationAsSent(notification.id);

  } catch (error) {
    console.error(`Error processing notification ${notification.id}:`, error);
    await markNotificationAsFailed(notification.id, error.message);
  }
}

async function sendNotification(notification: ScheduledNotification, userPrefs: any) {
  const channels = userPrefs?.channels || ['in_app'];
  
  console.log(`Sending notification ${notification.id} via channels: ${channels.join(', ')}`);

  // Always send in-app (mark as sent for real-time updates)
  if (channels.includes('in_app')) {
    // The notification is already in the database and will appear in the UI
    console.log(`In-app notification ${notification.id} ready for display`);
  }

  // Send email if enabled
  if (channels.includes('email')) {
    await sendEmailNotification(notification);
  }

  // Send push notification if enabled
  if (channels.includes('push')) {
    await sendPushNotification(notification);
  }
}

async function sendEmailNotification(notification: ScheduledNotification) {
  try {
    // Get user email from auth
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(notification.user_id);
    
    if (userError || !userData.user?.email) {
      console.error('Could not get user email for notification:', userError);
      return;
    }

    console.log(`Sending email to ${userData.user.email} for notification ${notification.id}`);
    
    // Get user profile for personalization
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', notification.user_id)
      .single();

    const userName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'there';
    const greeting = userName && userName !== '' ? `Hi ${userName}` : 'Hello';

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'HealthCarePath <notifications@healthcarepath.app>',
      to: [userData.user.email],
      subject: notification.title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">HealthCarePath</h1>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              ${greeting},
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
              <h2 style="color: #333; margin: 0 0 10px 0; font-size: 18px;">${notification.title}</h2>
              <p style="color: #666; margin: 0; line-height: 1.6;">${notification.message}</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://qbidsyeefbjhekiqvlqm.supabase.co" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        font-weight: bold;
                        display: inline-block;">
                View in App
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            
            <p style="color: #888; font-size: 14px; text-align: center; margin: 0;">
              You're receiving this because you have notifications enabled in your HealthCarePath account.
              <br>
              <a href="https://qbidsyeefbjhekiqvlqm.supabase.co/profile" style="color: #667eea;">Manage notification preferences</a>
            </p>
          </div>
        </div>
      `,
      text: `${greeting},\n\n${notification.title}\n\n${notification.message}\n\nView this notification in your HealthCarePath app: https://qbidsyeefbjhekiqvlqm.supabase.co\n\nManage your notification preferences: https://qbidsyeefbjhekiqvlqm.supabase.co/profile`
    });

    if (error) {
      console.error('Error sending email via Resend:', error);
      throw error;
    }

    console.log(`Email sent successfully to ${userData.user.email}:`, data);
    
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}

async function sendPushNotification(notification: ScheduledNotification) {
  try {
    console.log(`Push notifications not yet implemented for ${notification.id}`);
    // TODO: Implement push notifications using web push API or service worker
    // This would require:
    // 1. User permission for notifications
    // 2. Service worker registration
    // 3. Push subscription management
    // 4. Web Push protocol implementation
    
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
}

function isInQuietHours(startTime: string, endTime: string): boolean {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  // Handle quiet hours that span midnight
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  } else {
    return currentTime >= startTime && currentTime <= endTime;
  }
}

async function markNotificationAsSent(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as sent:', error);
  }
}

async function markNotificationAsFailed(notificationId: string, errorMessage: string) {
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'failed',
      metadata: { error: errorMessage }
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as failed:', error);
  }
}

async function markNotificationAsSkipped(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({
      status: 'failed',
      metadata: { reason: 'user_disabled' }
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as skipped:', error);
  }
}

async function postponeNotification(notificationId: string, quietHoursEnd: string) {
  // Schedule for after quiet hours end
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [hours, minutes] = quietHoursEnd.split(':');
  tomorrow.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  const { error } = await supabase
    .from('notifications')
    .update({
      scheduled_for: tomorrow.toISOString()
    })
    .eq('id', notificationId);

  if (error) {
    console.error('Error postponing notification:', error);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    await processScheduledNotifications();

    return new Response(
      JSON.stringify({ success: true, message: 'Notifications processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in notification scheduler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});