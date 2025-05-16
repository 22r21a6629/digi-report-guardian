
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  notifications: {
    emailReports: boolean;
    emailAppointments: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
  };
  loading: boolean;
  onNotificationChange: (key: keyof typeof notifications, checked: boolean) => void;
  onSave: () => void;
}

export function NotificationSettings({
  notifications,
  loading,
  onNotificationChange,
  onSave
}: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Control how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Reports</h4>
              <p className="text-sm text-muted-foreground">Receive email notifications for new reports</p>
            </div>
            <Switch 
              checked={notifications.emailReports}
              onCheckedChange={(checked) => onNotificationChange('emailReports', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Email Appointments</h4>
              <p className="text-sm text-muted-foreground">Receive email reminders for upcoming appointments</p>
            </div>
            <Switch 
              checked={notifications.emailAppointments}
              onCheckedChange={(checked) => onNotificationChange('emailAppointments', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Push Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
            </div>
            <Switch 
              checked={notifications.pushNotifications}
              onCheckedChange={(checked) => onNotificationChange('pushNotifications', checked)}
            />
          </div>
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">SMS Notifications</h4>
              <p className="text-sm text-muted-foreground">Receive text message notifications</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">Premium</Badge>
              <Switch 
                checked={notifications.smsNotifications}
                onCheckedChange={(checked) => onNotificationChange('smsNotifications', checked)}
              />
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <Button onClick={onSave} disabled={loading}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
