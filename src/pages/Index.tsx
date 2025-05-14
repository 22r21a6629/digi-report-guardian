
import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
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

          // If user has reports, they need to complete profile first
          if (reports && reports.length > 0) {
            toast.info({
              title: "Complete your profile",
              description: "Please complete your profile information"
            });
            navigate("/settings");
          } else {
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
