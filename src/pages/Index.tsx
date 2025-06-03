
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user type from metadata
          const userType = session.user.user_metadata?.user_type;
          console.log("User type:", userType);
          
          // Redirect based on user type
          if (userType === 'doctor') {
            console.log("Doctor user detected, navigating to doctor dashboard");
            navigate("/doctor-dashboard");
            return;
          } else if (userType === 'hospital') {
            console.log("Hospital admin detected, navigating to dashboard");
            navigate("/dashboard");
            return;
          } else {
            // For patients or users without specified type
            console.log("Patient user detected, navigating to dashboard");
            navigate("/dashboard");
            return;
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, [navigate]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return null;
};

export default Index;
