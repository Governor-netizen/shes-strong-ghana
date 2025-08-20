import React from "react";
import { Bell, Check, CheckCheck, Trash2, Calendar, Heart, Stethoscope, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const getNotificationIcon = (type: string, careStage?: string) => {
  switch (type) {
    case 'appointment_reminder':
    case 'appointment_confirmation':
      return <Calendar className="h-4 w-4 text-primary" />;
    case 'screening_results':
    case 'diagnosis_available':
      return <Stethoscope className="h-4 w-4 text-warning" />;
    case 'treatment_reminder':
    case 'pre_treatment':
    case 'post_treatment':
      return <Pill className="h-4 w-4 text-success" />;
    case 'support_group':
    case 'mental_health_check':
      return <Heart className="h-4 w-4 text-accent" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getNotificationColors = (type: string, isRead: boolean) => {
  const baseClasses = isRead 
    ? "bg-muted/50 border-muted" 
    : "bg-card border-primary/20 shadow-medical";
  
  switch (type) {
    case 'screening_results':
    case 'diagnosis_available':
      return `${baseClasses} border-l-4 border-l-warning`;
    case 'treatment_reminder':
      return `${baseClasses} border-l-4 border-l-success`;
    case 'support_group':
    case 'mental_health_check':
      return `${baseClasses} border-l-4 border-l-accent`;
    default:
      return `${baseClasses} border-l-4 border-l-primary`;
  }
};

const NotificationCard = ({ 
  notification, 
  onMarkAsRead, 
  onDelete 
}: { 
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const isRead = !!notification.read_at;
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), { addSuffix: true });

  return (
    <Card className={getNotificationColors(notification.type, isRead)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getNotificationIcon(notification.type, notification.care_stage)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className={`text-sm font-medium leading-tight ${isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
                {notification.title}
              </h4>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="h-6 w-6 p-0 hover:bg-primary/10"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(notification.id)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <p className={`text-xs leading-relaxed ${isRead ? 'text-muted-foreground' : 'text-foreground/80'}`}>
              {notification.message}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
              {notification.priority > 1 && (
                <Badge variant="secondary" className="text-xs">
                  Important
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function NotificationCenter() {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative hover:bg-muted/50 transition-colors"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </CardHeader>
          <Separator />
          <ScrollArea className="h-96">
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading notifications...
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications yet</p>
                  <p className="text-xs">We'll notify you about important updates</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </Popover>
  );
}