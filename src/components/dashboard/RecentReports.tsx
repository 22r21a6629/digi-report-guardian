
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { useNavigate } from "react-router-dom";
import { PinAuthDialog } from "@/components/auth/PinAuthDialog";
import { ReportAnalysisDialog } from "@/components/reports/ReportAnalysisDialog";
import { AIReportAnalyzer, ReportAnalysis } from "@/lib/aiReportAnalyzer";

type Report = {
  id: string;
  file_name: string;
  report_type: string;
  report_date: string;
  hospital: string;
  file_url: string;
  created_at: string;
};

type PendingAction = {
  type: 'view' | 'download' | 'analyze';
  report: Report;
} | null;

export function RecentReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [analysisDialog, setAnalysisDialog] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<ReportAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('id, file_name, report_type, report_date, hospital, file_url, created_at')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Error fetching reports:', error);
          toast({
            title: "Error loading reports",
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        setReports(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error loading reports",
          description: "Failed to load recent reports",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, [toast]);

  const getReportTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const handleView = (report: Report) => {
    setPendingAction({ type: 'view', report });
  };

  const handleDownload = (report: Report) => {
    setPendingAction({ type: 'download', report });
  };

  const handleAnalyze = (report: Report) => {
    setPendingAction({ type: 'analyze', report });
  };

  const executePendingAction = async () => {
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
    } else if (type === 'analyze') {
      setAnalysisLoading(true);
      setAnalysisDialog(true);
      
      try {
        const existingAnalysis = AIReportAnalyzer.getAnalysis(report.id);
        if (existingAnalysis) {
          setCurrentAnalysis(existingAnalysis);
          setAnalysisLoading(false);
          toast({
            title: "Analysis loaded",
            description: "Displaying saved analysis for this report",
          });
        } else {
          const analysis = await AIReportAnalyzer.analyzeReport(
            report.report_date || report.file_name,
            report.report_type,
            report.file_name,
            report.id
          );
          
          AIReportAnalyzer.saveAnalysis(analysis);
          setCurrentAnalysis(analysis);
          
          toast({
            title: "Analysis complete",
            description: "AI analysis has been generated for your report",
          });
        }
      } catch (error) {
        console.error('Analysis error:', error);
        toast({
          title: "Analysis failed",
          description: "There was a problem analyzing your report. Please try again.",
          variant: "destructive",
        });
        setAnalysisDialog(false);
      } finally {
        setAnalysisLoading(false);
      }
    }

    setPendingAction(null);
  };

  const handleViewAll = () => {
    navigate('/reports');
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Recent Reports</CardTitle>
          <Button variant="outline" size="sm" onClick={handleViewAll}>
            View all
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reports uploaded yet.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/upload')}
              >
                Upload Your First Report
              </Button>
            </div>
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
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">{report.file_name}</td>
                      <td className="py-3 px-2 text-sm">
                        <Badge variant="outline">
                          {getReportTypeDisplay(report.report_type)}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm">
                        {report.report_date ? new Date(report.report_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-2 text-sm">{report.hospital}</td>
                      <td className="py-3 px-2 text-sm text-right">
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
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={() => handleAnalyze(report)}
                            title="AI Analysis"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Brain className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* PIN Authentication Dialog */}
      <PinAuthDialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
        onSuccess={executePendingAction}
        title={
          pendingAction?.type === 'view' ? 'Secure Access Required' : 
          pendingAction?.type === 'download' ? 'Download Authorization' : 
          'AI Analysis Authorization'
        }
        description={
          pendingAction?.type === 'view' 
            ? `Enter your PIN to view "${pendingAction.report.file_name}"`
            : pendingAction?.type === 'download'
            ? `Enter your PIN to download "${pendingAction?.report.file_name}"`
            : `Enter your PIN to analyze "${pendingAction?.report.file_name}" with AI`
        }
      />

      {/* Analysis Dialog */}
      <ReportAnalysisDialog
        open={analysisDialog}
        onOpenChange={setAnalysisDialog}
        analysis={currentAnalysis}
        loading={analysisLoading}
      />
    </>
  );
}
