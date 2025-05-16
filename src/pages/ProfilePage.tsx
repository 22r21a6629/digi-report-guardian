
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
      }
      setLoading(false);
    }
    
    getProfile();
  }, []);

  return (
    <AppLayout title="My Profile">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-dignoweb-primary text-white text-lg">
                  {user?.email ? user.email.substring(0, 2).toUpperCase() : <User />}
                </AvatarFallback>
              </Avatar>
              <CardTitle>My Profile</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="text-center py-4">Loading profile information...</div>
            ) : user ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="font-medium">{user.email}</div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-muted-foreground">User ID</Label>
                  <div className="font-medium text-sm font-mono bg-gray-100 p-2 rounded overflow-x-auto">
                    {user.id}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-muted-foreground">Account Created</Label>
                  <div className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()} at {new Date(user.created_at).toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label className="text-muted-foreground">Last Sign In</Label>
                  <div className="font-medium">
                    {new Date(user.last_sign_in_at).toLocaleDateString()} at {new Date(user.last_sign_in_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">Not signed in.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
