import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    language: "en",
  });
  
  const [notifications, setNotifications] = useState({
    emailReports: true,
    emailAppointments: true,
    pushNotifications: true,
    smsNotifications: false,
  });
  
  const [privacy, setPrivacy] = useState({
    shareData: false,
    shareAnalytics: true,
    allowHealthProviders: true,
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLanguageChange = (value: string) => {
    setProfileData(prev => ({ ...prev, language: value }));
  };
  
  const handleNotificationChange = (key: keyof typeof notifications, checked: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: checked }));
  };
  
  const handlePrivacyChange = (key: keyof typeof privacy, checked: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: checked }));
  };
  
  const handleSave = () => {
    toast.success({
      title: "Settings saved",
      description: "Your settings have been saved successfully."
    });
  };

  return (
    <AppLayout title="Settings">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    value={profileData.firstName} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    value={profileData.lastName} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={profileData.email} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleProfileChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={profileData.language} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
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
                    onCheckedChange={(checked) => handleNotificationChange('emailReports', checked)}
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
                    onCheckedChange={(checked) => handleNotificationChange('emailAppointments', checked)}
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
                    onCheckedChange={(checked) => handleNotificationChange('pushNotifications', checked)}
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
                      onCheckedChange={(checked) => handleNotificationChange('smsNotifications', checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share Medical Data</h4>
                    <p className="text-sm text-muted-foreground">Allow us to share your medical data with verified research institutions</p>
                  </div>
                  <Switch 
                    checked={privacy.shareData}
                    onCheckedChange={(checked) => handlePrivacyChange('shareData', checked)}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Share Analytics</h4>
                    <p className="text-sm text-muted-foreground">Allow us to collect anonymous usage data to improve our services</p>
                  </div>
                  <Switch 
                    checked={privacy.shareAnalytics}
                    onCheckedChange={(checked) => handlePrivacyChange('shareAnalytics', checked)}
                  />
                </div>
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Health Provider Access</h4>
                    <p className="text-sm text-muted-foreground">Allow your health providers to access your reports</p>
                  </div>
                  <Switch 
                    checked={privacy.allowHealthProviders}
                    onCheckedChange={(checked) => handlePrivacyChange('allowHealthProviders', checked)}
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <Button onClick={handleSave}>Save Changes</Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Your privacy is important to us. We will never sell your data to third parties.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
