import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Upload, File, Image, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export function UploadReport() {
  const [reportType, setReportType] = useState("");
  const [hospital, setHospital] = useState("");
  const [reportDate, setReportDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (currentTag.trim() !== "") {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileSelected(e.target.files[0]);
    } else {
      setFileSelected(null);
    }
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
    
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      // Create a unique file name
      const fileExt = fileSelected.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${reportType}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('medical-reports')
        .upload(filePath, fileSelected, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(filePath);
        
      // Save report metadata to database (would be implemented when we have Auth)
      // For now, just show success message
      
      toast({
        title: "Report uploaded successfully",
        description: "Your medical report has been uploaded",
      });
      
      // Reset form
      setReportType("");
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Medical Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radiology">Radiology</SelectItem>
                  <SelectItem value="pathology">Pathology</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="hospital">Hospital</Label>
              <Input
                type="text"
                id="hospital"
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                placeholder="Enter hospital name"
              />
            </div>
          </div>
          <div>
            <Label>Report Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={format(reportDate || new Date(), "PPP")}
                >
                  {reportDate ? (
                    format(reportDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={reportDate}
                  onSelect={setReportDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter report description"
            />
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Add tags"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
              />
              <Button type="button" size="sm" onClick={handleAddTag}>
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="mr-2 mb-2"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-1 inline-flex items-center rounded-full bg-secondary px-1 py-0.5 text-xs font-semibold ring-offset-background transition-colors hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3 w-3"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="file-upload" className="cursor-pointer">
              {fileSelected ? (
                <div className="flex items-center">
                  {fileSelected.type.startsWith("image/") ? (
                    <Image className="mr-2 h-4 w-4" />
                  ) : fileSelected.type === "application/pdf" ? (
                    <FileText className="mr-2 h-4 w-4" />
                  ) : (
                    <File className="mr-2 h-4 w-4" />
                  )}
                  {fileSelected.name}
                  <Badge className="ml-2">{fileSelected.size} bytes</Badge>
                </div>
              ) : (
                <div className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  <span>Click to upload file</span>
                </div>
              )}
            </Label>
            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          {isLoading && (
            <progress value={uploadProgress} max="100">
              {uploadProgress}%
            </progress>
          )}
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Report"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
