
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';
import { HospitalField } from "./form/HospitalField";
import { ReportTypeField } from "./form/ReportTypeField";
import { ReportDateField } from "./form/ReportDateField";
import { DescriptionField } from "./form/DescriptionField";
import { TagsField } from "./form/TagsField";
import { FileUploadField } from "./form/FileUploadField";
import { UploadProgress } from "./form/UploadProgress";
import { UserSearch, Lock } from "lucide-react";

export function DoctorPatientUpload() {
  const [reportType, setReportType] = useState("radiology");
  const [hospital, setHospital] = useState("");
  const [reportDate, setReportDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Patient authentication fields
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPin, setPatientPin] = useState("");
  const [isPatientVerified, setIsPatientVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [user, setUser] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user and verify they are a doctor
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        const userType = data.user.user_metadata?.user_type;
        if (userType !== 'doctor') {
          toast({
            title: "Access denied",
            description: "Only doctors can access this feature",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } else {
        navigate('/login');
      }
    };
    
    getUser();
  }, [navigate, toast]);

  const handlePatientVerification = async () => {
    if (!patientEmail || !patientPin) {
      toast({
        title: "Missing information",
        description: "Please enter both patient email and PIN",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Verify the patient's PIN from localStorage (in real implementation, this would be from the database)
      const storedPin = localStorage.getItem(`user_pin_${patientEmail}`);
      
      if (storedPin === patientPin) {
        setIsPatientVerified(true);
        toast({
          title: "Patient verified",
          description: "You can now upload reports for this patient",
        });
      } else {
        toast({
          title: "Verification failed",
          description: "Invalid email or PIN. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "An error occurred during verification",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAddTag = (newTag: string) => {
    setTags([...tags, newTag]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isPatientVerified) {
      toast({
        title: "Patient not verified",
        description: "Please verify the patient before uploading",
        variant: "destructive",
      });
      return;
    }

    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!reportType || !hospital || !reportDate || !user) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file name
      const fileExt = fileSelected.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `doctor-uploads/${user.id}/${fileName}`;
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      // Create the report record in the existing reports table
      // We'll store the patient info in the description and tags
      const patientTags = [...tags, `patient_email:${patientEmail}`, `uploaded_by_doctor:${user.id}`];
      const reportDescription = `${description}\n\n[Doctor Upload] Uploaded by Dr. ${user.user_metadata?.full_name || user.email} for patient: ${patientEmail}`;
      
      const reportData = {
        user_id: user.id, // Doctor's ID for now, in real implementation this should be patient's ID
        report_type: reportType,
        hospital: hospital,
        report_date: reportDate.toISOString(),
        description: reportDescription,
        tags: patientTags,
        file_name: fileSelected.name,
        file_path: filePath,
        file_url: `https://placeholder-url.com/${filePath}`, // In real implementation, this would be the actual Supabase storage URL
        file_type: fileSelected.type,
        file_size: fileSelected.size,
      };

      const { data: reportRecord, error: reportError } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single();

      if (reportError) {
        throw reportError;
      }

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: "Report uploaded successfully",
        description: `Medical report has been uploaded for patient: ${patientEmail}`,
      });
      
      // Reset form
      setReportType("radiology");
      setHospital("");
      setReportDate(undefined);
      setDescription("");
      setTags([]);
      setFileSelected(null);
      setUploadProgress(0);
      setPatientEmail("");
      setPatientPin("");
      setIsPatientVerified(false);
      
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was a problem uploading the report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Report for Patient</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Patient Verification Section */}
        <div className="border p-4 rounded-lg bg-blue-50">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Patient Verification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patient-email">Patient Email</Label>
              <Input
                id="patient-email"
                type="email"
                placeholder="patient@example.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                disabled={isPatientVerified}
              />
            </div>
            <div>
              <Label htmlFor="patient-pin">Patient PIN</Label>
              <Input
                id="patient-pin"
                type="password"
                placeholder="Enter 4-digit PIN"
                value={patientPin}
                onChange={(e) => setPatientPin(e.target.value)}
                maxLength={4}
                disabled={isPatientVerified}
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            {!isPatientVerified ? (
              <Button 
                type="button" 
                onClick={handlePatientVerification}
                disabled={isVerifying}
                className="flex gap-2 items-center"
              >
                <UserSearch className="h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify Patient"}
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Patient verified: {patientEmail}
              </div>
            )}
          </div>
        </div>

        {/* Upload Form Section - Only shown after patient verification */}
        {isPatientVerified && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ReportTypeField value={reportType} onChange={setReportType} />
              <HospitalField value={hospital} onChange={setHospital} />
            </div>
            
            <ReportDateField value={reportDate} onChange={setReportDate} />
            <DescriptionField value={description} onChange={(e) => setDescription(e.target.value)} />
            <TagsField tags={tags} onAddTag={handleAddTag} onRemoveTag={handleRemoveTag} />
            <FileUploadField onFileChange={setFileSelected} fileSelected={fileSelected} />
            <UploadProgress isLoading={isLoading} uploadProgress={uploadProgress} />
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Uploading..." : "Upload Report for Patient"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
