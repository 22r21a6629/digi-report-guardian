
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Clock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function DashboardStats() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [totalReports, setTotalReports] = useState<number | null>(null);
  const [recentUploads, setRecentUploads] = useState<number | null>(null);
  const [pendingReviews, setPendingReviews] = useState<number | null>(null);
  const [criticalAlerts, setCriticalAlerts] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;

        // Fetch total reports count
        const { count: totalCount, error: totalError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (totalError) throw totalError;
        setTotalReports(totalCount);
        
        // Fetch recent uploads (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const { count: recentCount, error: recentError } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .gte('created_at', sevenDaysAgo.toISOString());
          
        if (recentError) throw recentError;
        setRecentUploads(recentCount);
        
        // For demo purposes, set some values for pending and critical
        // In a real app, these would be based on actual report statuses
        setPendingReviews(Math.floor(totalCount * 0.3));
        setCriticalAlerts(Math.floor(totalCount * 0.1));
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast("Error loading dashboard statistics", {
          description: "Please try refreshing the page",
          duration: 5000,
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  const handleCardClick = (destination: string, title: string) => {
    navigate(destination);
    toast(`Navigating to ${title}`, {
      description: `Viewing ${title.toLowerCase()} details`,
      duration: 3000,
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="border-l-4 border-l-dignoweb-primary hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/reports", "Total Reports")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-8 rounded-full border-2 border-t-dignoweb-primary animate-spin" />
            ) : totalReports !== null ? (
              totalReports
            ) : (
              "-"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            View all reports
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="border-l-4 border-l-dignoweb-secondary hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/upload", "Recent Uploads")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Uploads</CardTitle>
          <Upload className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-8 rounded-full border-2 border-t-dignoweb-secondary animate-spin" />
            ) : recentUploads !== null ? (
              recentUploads
            ) : (
              "-"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Last 7 days
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="border-l-4 border-l-dignoweb-accent hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/reports?status=pending", "Pending Reviews")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-8 rounded-full border-2 border-t-dignoweb-accent animate-spin" />
            ) : pendingReviews !== null ? (
              pendingReviews
            ) : (
              "-"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Waiting for review
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleCardClick("/reports?status=critical", "Critical Alerts")}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {loading ? (
              <div className="h-8 w-8 rounded-full border-2 border-t-red-500 animate-spin" />
            ) : criticalAlerts !== null ? (
              criticalAlerts
            ) : (
              "-"
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Requires attention
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
