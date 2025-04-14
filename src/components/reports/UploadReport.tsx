
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File, Image, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export function UploadReport() {
  const [reportType, setReportType] = useState("");
  const [hospital, setHospital] = useState("");
  const [reportDate, setReportDate] = useState<Date | undefined>(undefined);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [fileSelected, setFileSelected] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileSelected) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Mock upload for now - will replace with Supabase storage later
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      toast({
        title: "Report uploaded successfully",
        description: "Your report has been saved to your records",
      });
      
      // Reset form
      setReportType("");
      setHospital("");
      setReportDate(undefined);
      setDescription("");
      setTags([]);
      setFileSelected(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = () => {
    if (!fileSelected) return <Upload className="h-16 w-16 text-muted-foreground" />;
    
    const fileType = fileSelected.type;
    if (fileType.includes('image')) return <Image className="h-16 w-16 text-blue-500" />;
    if (fileType.includes('pdf')) return <File className="h-16 w-16 text-red-500" />;
    return <FileText className="h-16 w-16 text-green-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Medical Report</CardTitle>
        <CardDescription>
          Add your medical reports to keep all your health records in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
            {getFileIcon()}
            
            <div className="mt-4 mb-6">
              <h3 className="font-medium text-lg">
                {fileSelected ? fileSelected.name : "Upload your report"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {fileSelected 
                  ? `${(fileSelected.size / 1024 / 1024).toFixed(2)} MB` 
                  : "Drag and drop or click to select a file"}
              </p>
            </div>
            
            <Input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              Select file
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Supports PDF, JPG, PNG, DOC, DOCX up to 10MB
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType} required>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blood-test">Blood Test</SelectItem>
                  <SelectItem value="x-ray">X-Ray</SelectItem>
                  <SelectItem value="mri">MRI</SelectItem>
                  <SelectItem value="ct-scan">CT Scan</SelectItem>
                  <SelectItem value="ultrasound">Ultrasound</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital/Clinic</Label>
              <Select value={hospital} onValueChange={setHospital} required>
                <SelectTrigger id="hospital">
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city-general">City General Hospital</SelectItem>
                  <SelectItem value="medstar">MedStar Clinic</SelectItem>
                  <SelectItem value="health-first">Health First Medical</SelectItem>
                  <SelectItem value="central-diag">Central Diagnostics</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Report Date</Label>
              <DatePicker
                selected={reportDate}
                onSelect={setReportDate}
                disabled={(date) => date > new Date()}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex">
                <Input
                  id="tags"
                  placeholder="Enter tags and press Enter"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="ml-2"
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className="px-3 py-1 flex items-center gap-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <span className="cursor-pointer">×</span>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add any notes or context about this report"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Report"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
