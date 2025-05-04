
import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "critical";
  date: string;
};

// Mock notifications - in a real app these would come from an API/backend
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Report Available",
    message: "Your Chest X-Ray report from City General Hospital is now available.",
    type: "info",
    date: "2025-05-02"
  },
  {
    id: "2",
    title: "Abnormal Result Detected",
    message: "Your latest blood test shows values outside normal range. Please consult with your doctor.",
    type: "warning",
    date: "2025-05-01"
  },
  {
    id: "3",
    title: "Critical Alert",
    message: "Urgent: Please schedule a follow-up appointment regarding your recent liver function test.",
    type: "critical",
    date: "2025-04-30"
  }
];

export function NotificationBar() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [expanded, setExpanded] = useState(false);
  const isMobile = useIsMobile();

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getAlertStyle = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return "border-l-4 border-l-red-500 bg-red-50";
      case "warning":
        return "border-l-4 border-l-yellow-500 bg-yellow-50";
      default:
        return "border-l-4 border-l-blue-500 bg-blue-50";
    }
  };

  // Display only the most recent notification when collapsed
  const displayedNotifications = expanded ? notifications : notifications.slice(0, 1);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-dignoweb-primary" />
          <h3 className="font-medium">Notifications</h3>
        </div>
        {notifications.length > 1 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : `Show all (${notifications.length})`}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {displayedNotifications.map((notification) => (
          <Alert 
            key={notification.id} 
            className={`${getAlertStyle(notification.type)} relative pr-10 ${isMobile ? 'text-sm p-3' : ''}`}
          >
            <Button
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => dismissNotification(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <AlertTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
              {notification.title}
            </AlertTitle>
            <AlertDescription className={`${isMobile ? 'text-xs' : 'text-sm'} mt-1`}>
              {notification.message}
              <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground mt-1`}>
                {notification.date}
              </div>
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
