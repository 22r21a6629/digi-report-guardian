
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkSession = async () => {
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

        // If user has reports, check if they need to complete profile
        if (reports && reports.length > 0) {
          navigate("/settings");
        } else {
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    };
    
    checkSession();
  }, [navigate]);

  return null;
};

export default Index;
