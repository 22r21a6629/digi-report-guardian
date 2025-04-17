
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadReport } from "@/components/reports/UploadReport";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export default function UploadPage() {
  const { toast } = useToast();
  const [bucketError, setBucketError] = useState(false);

  useEffect(() => {
    // Check if the storage bucket exists by attempting to list files
    const checkBucket = async () => {
      try {
        const { data, error } = await supabase.storage.from('medical-reports').list();
        
        if (error && error.message.includes('The resource was not found')) {
          // Bucket doesn't exist, let the user know they need to create it in Supabase dashboard
          setBucketError(true);
          toast({
            title: "Storage Setup Required",
            description: "The medical-reports storage bucket needs to be created in the Supabase dashboard.",
            variant: "destructive",
            duration: 10000,
          });
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
      }
    };

    checkBucket();
  }, [toast]);

  return (
    <AppLayout title="Upload Report">
      {bucketError ? (
        <div className="my-8 p-6 bg-destructive/10 rounded-lg border border-destructive">
          <h3 className="text-lg font-medium mb-2">Storage Setup Required</h3>
          <p className="mb-4">
            To enable file uploads, you need to create a storage bucket named 'medical-reports' in your Supabase dashboard.
          </p>
          <ol className="list-decimal ml-5 space-y-2">
            <li>Go to your Supabase dashboard</li>
            <li>Navigate to Storage</li>
            <li>Create a new bucket named 'medical-reports'</li>
            <li>Set the bucket to public or configure appropriate policies</li>
            <li>Refresh this page</li>
          </ol>
        </div>
      ) : (
        <UploadReport />
      )}
    </AppLayout>
  );
}
