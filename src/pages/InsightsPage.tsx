import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { HealthInsightsDashboard } from "@/components/insights/HealthInsightsDashboard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { Database } from "@/integrations/supabase/types";

type Report = Database['public']['Tables']['reports']['Row'];

export default function InsightsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching reports:', error);
          toast({
            title: "Failed to load reports",
            description: error.message,
            variant: "destructive"
          });
          setReports([]);
        } else {
          console.log('Reports fetched for insights:', data?.length || 0);
          setReports(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error loading data",
          description: "Failed to load your medical reports for analysis",
          variant: "destructive"
        });
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();

    // Set up a subscription to listen for new reports
    const channel = supabase
      .channel('insights-reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('Report changes detected:', payload);
          // Refetch reports when changes are detected
          fetchReports();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AppLayout title="Health Insights - DiagnoWeb">
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Health Insights</h1>
          <p className="text-muted-foreground">
            Get personalized insights and recommendations based on your medical reports and health patterns.
          </p>
        </div>
        
        <HealthInsightsDashboard reports={reports} loading={loading} />
      </div>
    </AppLayout>
  );
}