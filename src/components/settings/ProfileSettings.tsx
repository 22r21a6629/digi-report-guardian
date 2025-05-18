
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProfileSettingsProps {
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    language: string;
  };
  loading: boolean;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLanguageChange: (value: string) => void;
  onSave: () => void;
}

export function ProfileSettings({
  profileData,
  loading,
  onProfileChange,
  onLanguageChange,
  onSave
}: ProfileSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Manage your personal information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                name="firstName" 
                value={profileData.firstName} 
                onChange={onProfileChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                name="lastName" 
                value={profileData.lastName} 
                onChange={onProfileChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={profileData.email} 
                onChange={onProfileChange}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={profileData.phone} 
                onChange={onProfileChange} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={profileData.language || "en"} 
                onValueChange={onLanguageChange}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="hi">Hindi</SelectItem>
                  <SelectItem value="te">Telugu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="pt-4">
          <Button onClick={onSave} disabled={loading}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}
