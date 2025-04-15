
import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { UploadReport } from "@/components/reports/UploadReport";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
          }
        }
      } catch (err) {
        console.error('Error checking or creating bucket:', err);
      }
    };

    checkAndCreateBucket();
  }, []);

  return (
    <AppLayout title="Upload Report">
      <UploadReport />
    </AppLayout>
  );
}
