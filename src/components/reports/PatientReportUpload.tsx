import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserSearch } from "lucide-react";

export function PatientReportUpload() {
  const [reportType, setReportType] = useState("radiology");
  const [hospital, setHospital] = useState("");
  const [reportDate, setReportDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [patientSearch, setPatientSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        // Check if user is doctor
        const userType = data.user.user_metadata?.user_type;
        if (userType !== 'doctor') {
          toast({
            title: "Access denied",
            description: "Only doctors can access this page",
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

  const handleSearchPatient = async () => {
    if (!patientSearch) {
      toast({
        title: "Missing search criteria",
        description: "Please enter a patient email or ID to search",
        variant: "destructive",
      });
      return;
    }
    
    setSearching(true);
    setSearchResults([]);
    
    try {
      // Since we don't have a profiles table in the schema yet, we'll simulate the search results
      // In a real app, you would have an actual profiles table to search through
      // For now, we'll create mock data if an email is provided
      
      if (patientSearch.includes('@')) {
        // Create mock results for demonstration
        const mockPatientId = uuidv4();
        setTimeout(() => {
          setSearchResults([{
            id: mockPatientId,
            email: patientSearch,
            first_name: patientSearch.split('@')[0],
            last_name: ""
          }]);
          setSelectedPatientId(mockPatientId);
          setSearching(false);
        }, 500);
      } else if (patientSearch.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        // If it's a UUID format, use it directly
        const mockPatientId = patientSearch;
        setTimeout(() => {
          setSearchResults([{
            id: mockPatientId,
            email: `patient-${mockPatientId.substring(0, 8)}@example.com`,
            first_name: `Patient`,
            last_name: mockPatientId.substring(0, 6)
          }]);
          setSelectedPatientId(mockPatientId);
          setSearching(false);
        }, 500);
      } else {
        // Not a valid search term
        toast({
          title: "Patient not found",
          description: "No patient found with that email or ID",
          variant: "destructive",
        });
        setSearching(false);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search failed",
        description: "Failed to search for patient",
        variant: "destructive",
      });
      setSearching(false);
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
    
    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!selectedPatientId) {
      toast({
        title: "No patient selected",
        description: "Please search and select a patient",
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
      const filePath = `${selectedPatientId}/${reportType}/${fileName}`;
      
      // Upload file to Supabase Storage (in a real app)
      // For now we just simulate the upload
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        toast({
          title: "Report uploaded successfully",
          description: "The medical report has been uploaded and assigned to the patient",
        });
        
        // Reset form
        setReportType("radiology");
        setHospital("");
        setReportDate(undefined);
        setDescription("");
        setTags([]);
        setFileSelected(null);
        setUploadProgress(0);
        setPatientSearch("");
        setSelectedPatientId("");
        setSearchResults([]);
        
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "There was a problem uploading the report",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="mb-6 border p-4 rounded-lg">
          <Label htmlFor="patient-search">Search Patient by Email or ID</Label>
          <div className="flex gap-2 mt-2">
            <Input
              id="patient-search"
              placeholder="Enter patient email or ID"
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            <Button 
              type="button" 
              onClick={handleSearchPatient}
              disabled={searching}
              className="flex gap-2 items-center"
            >
              <UserSearch className="h-4 w-4" />
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {searchResults.length > 0 && (
            <div className="mt-4">
              <Label>Select Patient</Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {searchResults.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name || ""} {patient.last_name || ""} ({patient.email || "No email"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        {selectedPatientId && (
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
            
            <Button type="submit" disabled={isLoading || !selectedPatientId} className="w-full">
              {isLoading ? "Uploading..." : "Upload Report for Patient"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
