
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
          
          // Check if user has reports
          const { data: reports, error } = await supabase
            .from('reports')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1);
            
          if (error) {
            console.error("Error checking reports:", error);
            navigate("/dashboard");
            return;
          }

          // Different navigation logic based on user type
          if (userType === 'doctor') {
            // Doctors go straight to dashboard regardless of reports
            navigate("/dashboard");
          } else if (reports && reports.length > 0) {
            // Regular users with reports complete profile first
            toast("Complete your profile", {
              description: "Please complete your profile information"
            });
            navigate("/settings");
          } else {
            // Regular users without reports go to dashboard
            navigate("/dashboard");
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
