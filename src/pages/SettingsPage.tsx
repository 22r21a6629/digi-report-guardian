
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PrivacySettings } from "@/components/settings/PrivacySettings";
import { useSettings } from "@/hooks/useSettings";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const {
    loading,
    profileData,
    notifications,
    privacy,
    handleProfileChange,
    handleLanguageChange,
    handleNotificationChange,
    handlePrivacyChange,
    handleSave
  } = useSettings();

  // Add a safety check for data integrity
  if (!profileData || !notifications || !privacy) {
    return (
      <AppLayout title="Settings">
        <Card>
          <CardContent className="flex items-center justify-center p-8 text-center">
            <div className="space-y-4">
              <AlertTriangle className="h-8 w-8 text-yellow-500 mx-auto" />
              <h3 className="text-lg font-medium">Loading Settings</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we load your settings...
              </p>
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Settings">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSettings 
            profileData={profileData}
            loading={loading}
            onProfileChange={handleProfileChange}
            onLanguageChange={handleLanguageChange}
            onSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationSettings 
            notifications={notifications}
            loading={loading}
            onNotificationChange={handleNotificationChange}
            onSave={handleSave}
          />
        </TabsContent>
        
        <TabsContent value="privacy">
          <PrivacySettings 
            privacy={privacy}
            loading={loading}
            onPrivacyChange={handlePrivacyChange}
            onSave={handleSave}
          />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
