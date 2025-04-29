
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Filter, FileText, Search, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

type Report = {
  id: string;
  report_type: string;
  hospital: string;
  report_date: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
};

export default function ReportsPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      
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
        console.log('Reports fetched:', data?.length || 0);
        setReports(data || []);
      }
      
      setLoading(false);
    };
    
    fetchReports();
    
    // Set up a subscription to listen for new reports
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'reports'
        },
        (payload) => {
          console.log('New report added:', payload);
          // Refetch reports when a new one is added
          fetchReports();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);
  
  // Get report type for display and filtering
  const getReportTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Get file icon based on file type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <Image className="h-4 w-4 mr-2 text-muted-foreground" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />;
    } else {
      return <File className="h-4 w-4 mr-2 text-muted-foreground" />;
    }
  };
  
  const filteredReports = reports.filter(report => {
    // Apply report type filter if selected
    if (filterStatus && report.report_type !== filterStatus) {
      return false;
    }
    
    // Apply search term if entered - expanded to search across multiple fields
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        report.file_name.toLowerCase().includes(search) ||
        report.hospital.toLowerCase().includes(search) ||
        (report.description?.toLowerCase().includes(search) || false) ||
        getReportTypeDisplay(report.report_type).toLowerCase().includes(search)
      );
    }
    
    return true;
  });

  const clearSearch = () => {
    setSearchTerm("");
  };
  
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Downloading ${fileName}`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your report",
        variant: "destructive",
      });
    }
  };
  
  const handleGoToUpload = () => {
    navigate('/upload');
  };
  
  return (
    <AppLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search reports..."
                className="pl-9 pr-10 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filterStatus === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterStatus(null)}
            >
              All
            </Button>
            <Button 
              variant={filterStatus === "radiology" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterStatus("radiology")}
            >
              Radiology
            </Button>
            <Button 
              variant={filterStatus === "pathology" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterStatus("pathology")}
            >
              Pathology
            </Button>
            <Button 
              variant={filterStatus === "cardiology" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterStatus("cardiology")}
            >
              Cardiology
            </Button>
            <Button 
              variant={filterStatus === "neurology" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilterStatus("neurology")}
            >
              Neurology
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>All Reports</CardTitle>
            <Button onClick={handleGoToUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload New Report
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading reports...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Hospital</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {getFileIcon(report.file_type)}
                              {report.file_name}
                            </div>
                          </TableCell>
                          <TableCell>{getReportTypeDisplay(report.report_type)}</TableCell>
                          <TableCell>
                            {report.report_date ? new Date(report.report_date).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>{report.hospital}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => window.open(report.file_url, '_blank')}
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleDownload(report.file_url, report.file_name)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          {searchTerm || filterStatus 
                            ? "No reports found matching your criteria." 
                            : (
                              <div className="flex flex-col items-center">
                                <p className="mb-4">You haven't uploaded any reports yet.</p>
                                <Button onClick={handleGoToUpload}>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Your First Report
                                </Button>
                              </div>
                            )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
