
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadReport } from "@/components/reports/UploadReport";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export default function UploadPage() {
  const { toast } = useToast();

  useEffect(() => {
    // Check if the storage bucket exists and create it if it doesn't
    const checkAndCreateBucket = async () => {
      try {
        // Check if bucket exists
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some(bucket => bucket.name === 'medical-reports');
        
        if (!bucketExists) {
          // Create the bucket if it doesn't exist
          const { error } = await supabase.storage.createBucket('medical-reports', {
            public: true, // Make the bucket public
            fileSizeLimit: 20971520, // 20MB file size limit
          });
          
          if (error) {
            console.error('Error creating bucket:', error);
            toast({
              title: "Storage Error",
              description: "There was a problem setting up the storage. Please try again later.",
              variant: "destructive"
            });
          }
        }
      } catch (err) {
        console.error('Error checking or creating bucket:', err);
        toast({
          title: "Storage Error",
          description: "There was a problem accessing the storage. Please try again later.",
          variant: "destructive"
        });
      }
    };

    checkAndCreateBucket();
  }, [toast]);

  return (
    <AppLayout title="Upload Report">
      <UploadReport />
    </AppLayout>
  );
}
