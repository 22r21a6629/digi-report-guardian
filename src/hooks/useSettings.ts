
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useSettings() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
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

  useEffect(() => {
    async function loadUserProfile() {
      setLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Set the email from the auth user
          setProfileData(prev => ({
            ...prev,
            email: user.email || "",
            // Extract first name and last name from user metadata if available
            firstName: user.user_metadata?.first_name || "",
            lastName: user.user_metadata?.last_name || "",
            phone: user.user_metadata?.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUserProfile();
  }, []);

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
  
  const handleSave = async () => {
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone: profileData.phone,
          language: profileData.language
        }
      });

      if (error) throw error;
      
      toast.success("Settings saved", {
        description: "Your settings have been saved successfully."
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings", {
        description: "Please try again later."
      });
    }
  };

  return {
    loading,
    profileData,
    notifications,
    privacy,
    handleProfileChange,
    handleLanguageChange,
    handleNotificationChange,
    handlePrivacyChange,
    handleSave
  };
}
