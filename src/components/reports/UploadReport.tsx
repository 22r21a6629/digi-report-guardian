import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Imported form components
import { ReportTypeField } from "./form/ReportTypeField";
import { HospitalField } from "./form/HospitalField";
import { ReportDateField } from "./form/ReportDateField";
import { DescriptionField } from "./form/DescriptionField";
import { TagsField } from "./form/TagsField";
import { FileUploadField } from "./form/FileUploadField";
import { UploadProgress } from "./form/UploadProgress";

export function UploadReport() {
  const [reportType, setReportType] = useState("radiology"); // Set default value
  const [hospital, setHospital] = useState(""); // Ensure it's initialized as empty string
  const [reportDate, setReportDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [isComponentReady, setIsComponentReady] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      } else {
        toast({
          title: "Authentication required",
          description: "Please log in to upload reports",
          variant: "destructive",
        });
        navigate('/login');
      }
    };
    
    getUser();
    
    // Set component as ready after a small delay to ensure all components are properly initialized
    const timer = setTimeout(() => {
      setIsComponentReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [navigate, toast]);

  const handleAddTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!reportType || !hospital || !reportDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload reports",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      // Create a unique file name
      const fileExt = fileSelected.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${reportType}/${fileName}`;
      
      // First verify the bucket exists before attempting upload
      const { data: bucketData, error: bucketCheckError } = await supabase.storage
        .from('medical-reports')
        .list();
        
      if (bucketCheckError) {
        throw new Error(`Storage error: ${bucketCheckError.message}. Please verify the storage bucket exists and is properly configured.`);
      }
      
      // Upload file to Supabase Storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(filePath, fileSelected, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        if (uploadError.message.includes('violates row-level security policy')) {
          throw new Error('Permission denied: You do not have access to upload files. Please check your permissions or contact the administrator.');
        }
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(filePath);
        
      // Save report metadata to database
      const { error: metadataError } = await supabase
        .from('reports')
        .insert({
          user_id: user.id,
          report_type: reportType,
          hospital: hospital,
          report_date: reportDate?.toISOString(),
          description: description,
          tags: tags,
          file_path: filePath,
          file_name: fileSelected.name,
          file_size: fileSelected.size,
          file_type: fileSelected.type,
          file_url: urlData.publicUrl
        });
        
      clearInterval(progressInterval);
      setUploadProgress(100);
        
      if (metadataError) {
        console.error("Metadata error:", metadataError);
        toast({
          title: "Error saving report metadata",
          description: metadataError.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Report uploaded successfully",
        description: "Your medical report has been uploaded and saved to My Reports",
      });
      
      // Reset form
      setReportType("radiology");
      setHospital("");
      setReportDate(undefined);
      setDescription("");
      setTags([]);
      setFileSelected(null);
      setUploadProgress(0);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Navigate to reports page after successful upload
      setTimeout(() => {
        navigate('/reports');
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was a problem uploading your report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render form components until everything is ready
  if (!isComponentReady) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse">Loading form...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Medical Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReportTypeField value={reportType} onChange={setReportType} />
            <HospitalField value={hospital || ""} onChange={setHospital} />
          </div>
          
          <ReportDateField value={reportDate} onChange={setReportDate} />
          <DescriptionField value={description} onChange={(e) => setDescription(e.target.value)} />
          <TagsField tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
          <FileUploadField onFileChange={setFileSelected} fileSelected={fileSelected} />
          <UploadProgress isLoading={isLoading} uploadProgress={uploadProgress} />
          
          <CardFooter className="px-0 pb-0">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Uploading..." : "Upload Report"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
