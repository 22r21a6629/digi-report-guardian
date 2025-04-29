
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadReport } from "@/components/reports/UploadReport";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const { toast } = useToast();
  const [bucketError, setBucketError] = useState(false);
  const [isCheckingBucket, setIsCheckingBucket] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the storage bucket exists by attempting to get bucket info
    const checkBucket = async () => {
      setIsCheckingBucket(true);
      try {
        const { error } = await supabase.storage.getBucket('medical-reports');
        
        if (error) {
          console.error('Bucket error:', error);
          setBucketError(true);
          toast({
            title: "Storage Setup Required",
            description: "The medical-reports storage bucket needs to be created in the Supabase dashboard.",
            variant: "destructive",
            duration: 10000,
          });
        } else {
          // Bucket exists, clear any previous errors
          setBucketError(false);
        }
      } catch (err) {
        console.error('Error checking bucket:', err);
        setBucketError(true);
        toast({
          title: "Storage Error",
          description: "There was a problem accessing the storage. Please check Supabase settings.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsCheckingBucket(false);
      }
    };

    checkBucket();
  }, [toast]);

  const openSupabaseDashboard = () => {
    window.open('https://qbjpurniyjebdvwxzegf.supabase.co/dashboard/project/storage/buckets', '_blank');
  };

  const goToReports = () => {
    navigate('/reports');
  };

  return (
    <AppLayout title="Upload Report">
      {isCheckingBucket ? (
        <div className="flex justify-center items-center my-8 p-6">
          <div className="animate-pulse text-center">
            <p>Checking storage setup...</p>
          </div>
        </div>
      ) : bucketError ? (
        <div className="my-8 p-6 bg-destructive/10 rounded-lg border border-destructive">
          <h3 className="text-lg font-medium mb-2">Storage Setup Required</h3>
          <p className="mb-4">
            To enable file uploads, you need to create a storage bucket named 'medical-reports' in your Supabase dashboard.
          </p>
          <ol className="list-decimal ml-5 space-y-2 mb-6">
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to Storage</li>
            <li>Create a new bucket named 'medical-reports'</li>
            <li>Set the bucket to public or configure appropriate RLS policies</li>
            <li>Refresh this page</li>
          </ol>
          <div className="flex gap-4">
            <Button onClick={openSupabaseDashboard} className="flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Go to Supabase Storage
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
            <Button variant="secondary" onClick={goToReports}>
              View My Reports
            </Button>
          </div>
        </div>
      ) : (
        <UploadReport />
      )}
    </AppLayout>
  );
}
