
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Download, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

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
        setReports(data || []);
      }
      
      setLoading(false);
    };
    
    fetchReports();
  }, [toast]);
  
  // Get report type for display and filtering
  const getReportTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const filteredReports = reports.filter(report => {
    // Apply report type filter if selected
    if (filterStatus && report.report_type !== filterStatus) {
      return false;
    }
    
    // Apply search term if entered
    if (searchTerm && !report.file_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !report.hospital.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your report",
        variant: "destructive",
      });
    }
  };
  
  return (
    <AppLayout title="My Reports">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search reports..."
              className="pl-3 pr-10 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-dignoweb-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading reports...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 text-sm font-medium">File Name</th>
                      <th className="text-left py-3 px-2 text-sm font-medium">Type</th>
                      <th className="text-left py-3 px-2 text-sm font-medium">Date</th>
                      <th className="text-left py-3 px-2 text-sm font-medium">Hospital</th>
                      <th className="text-right py-3 px-2 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50">
                          <td className="py-3 px-2 text-sm">{report.file_name}</td>
                          <td className="py-3 px-2 text-sm">{getReportTypeDisplay(report.report_type)}</td>
                          <td className="py-3 px-2 text-sm">
                            {report.report_date ? new Date(report.report_date).toLocaleDateString() : '-'}
                          </td>
                          <td className="py-3 px-2 text-sm">{report.hospital}</td>
                          <td className="py-3 px-2 text-sm text-right">
                            <div className="flex justify-end space-x-2">
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => window.open(report.file_url, '_blank')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleDownload(report.file_url, report.file_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          {searchTerm || filterStatus 
                            ? "No reports found matching your criteria." 
                            : "You haven't uploaded any reports yet."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
