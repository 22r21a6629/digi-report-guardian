import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, FileText, Search, X, Upload, File as FileIcon, Image as ImageIcon, Trash2 } from "lucide-react";
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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PinAuthDialog } from "@/components/auth/PinAuthDialog";

type Report = {
  id: string;
  report_type: string;
  hospital: string;
  report_date: string;
  description: string | null;
  file_name: string;
  file_url: string;
  file_type: string;
  file_path: string;
  created_at: string;
};

type PendingAction = {
  type: 'view' | 'download';
  report: Report;
} | null;

export default function ReportsPage() {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
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
  
  useEffect(() => {
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
      return <ImageIcon className="h-4 w-4 mr-2 text-muted-foreground" />;
    } else if (fileType === "application/pdf") {
      return <FileText className="h-4 w-4 mr-2 text-muted-foreground" />;
    } else {
      return <FileIcon className="h-4 w-4 mr-2 text-muted-foreground" />;
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
  
  const handleView = (report: Report) => {
    setPendingAction({ type: 'view', report });
  };

  const handleDownload = (report: Report) => {
    setPendingAction({ type: 'download', report });
  };

  const executePendingAction = () => {
    if (!pendingAction) return;

    const { type, report } = pendingAction;

    if (type === 'view') {
      window.open(report.file_url, '_blank');
      toast({
        title: "Opening report",
        description: `Opening ${report.file_name}`,
      });
    } else if (type === 'download') {
      try {
        const link = document.createElement('a');
        link.href = report.file_url;
        link.download = report.file_name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
          title: "Download started",
          description: `Downloading ${report.file_name}`,
        });
      } catch (error) {
        console.error('Download error:', error);
        toast({
          title: "Download failed",
          description: "There was a problem downloading your report",
          variant: "destructive",
        });
      }
    }

    setPendingAction(null);
  };
  
  const handleGoToUpload = () => {
    navigate('/upload');
  };

  const handleDeleteReport = async () => {
    if (!reportToDelete) return;

    try {
      // First delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('medical-reports')
        .remove([reportToDelete.file_path]);
      
      if (storageError) {
        console.error('Error deleting file:', storageError);
        toast({
          title: "Error deleting file",
          description: storageError.message,
          variant: "destructive"
        });
        return;
      }

      // Then delete the report from the database
      const { error: dbError } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportToDelete.id);
      
      if (dbError) {
        console.error('Error deleting report:', dbError);
        toast({
          title: "Error deleting report",
          description: dbError.message,
          variant: "destructive"
        });
        return;
      }

      // Update local state to remove the deleted report
      setReports(reports.filter(report => report.id !== reportToDelete.id));
      
      toast({
        title: "Report deleted",
        description: "The report has been successfully deleted."
      });
      
      setReportToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "There was a problem deleting your report",
        variant: "destructive"
      });
    }
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
                                onClick={() => handleView(report)}
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleDownload(report)}
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    size="icon" 
                                    variant="ghost"
                                    title="Delete"
                                    onClick={() => setReportToDelete(report)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete this report?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the report
                                      "{report.file_name}" and remove the associated file from storage.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setReportToDelete(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={handleDeleteReport}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
      
      {/* Global delete confirmation dialog */}
      <AlertDialog open={!!reportToDelete && reportToDelete.id !== ''} onOpenChange={(open) => !open && setReportToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this report?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the report
              "{reportToDelete?.file_name}" and remove the associated file from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteReport}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PIN Authentication Dialog */}
      <PinAuthDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onSuccess={executePendingAction}
        title={pendingAction?.type === 'view' ? 'Secure Access Required' : 'Download Authorization'}
        description={
          pendingAction?.type === 'view' 
            ? `Enter your PIN to view "${pendingAction.report.file_name}"`
            : `Enter your PIN to download "${pendingAction?.report.file_name}"`
        }
      />
    </AppLayout>
  );
}
