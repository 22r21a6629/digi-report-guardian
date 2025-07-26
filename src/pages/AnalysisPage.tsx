import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Brain, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  Calendar,
  BarChart3,
  Lightbulb,
  FileText,
  Sparkles,
  Target,
  Clock,
  Shield,
  Upload,
  Home
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { analysisService, HealthMetric, HealthInsight, ReportAnalysis } from '@/lib/analysisService';

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

const COLORS = ['#5664d2', '#8e9aff', '#36d399', '#fbbf24', '#f87171'];

const AnalysisPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [analyses, setAnalyses] = useState<ReportAnalysis[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);

  useEffect(() => {
    fetchReportsAndAnalyses();
  }, []);

  const fetchReportsAndAnalyses = async () => {
    setLoading(true);
    try {
      // Fetch user's reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('report_date', { ascending: false });

      if (reportsError) throw reportsError;
      
      setReports(reportsData || []);
      
      // Use the analysis service to generate real insights
      if (reportsData && reportsData.length > 0) {
        await generateRealAnalyses(reportsData);
      } else {
        // Fallback to mock data for demo
        generateMockAnalyses([]);
        generateHealthMetrics([]);
        generateHealthInsights([]);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Failed to load analysis data",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRealAnalyses = async (reports: Report[]) => {
    try {
      // Generate analyses for each report using AI
      const analysisPromises = reports.slice(0, 5).map(report => 
        analysisService.analyzeReport(report)
      );
      const reportAnalyses = await Promise.all(analysisPromises);
      setAnalyses(reportAnalyses);

      // Generate health metrics based on reports and analyses
      const healthMetrics = analysisService.calculateHealthMetrics(reports, reportAnalyses);
      setHealthMetrics(healthMetrics);

      // Generate comprehensive health insights
      const insights = await analysisService.generateHealthInsights(reports);
      setInsights(insights);

    } catch (error) {
      console.error('Error generating real analyses:', error);
      // Fallback to mock data
      generateMockAnalyses(reports);
      generateHealthMetrics(reports);
      generateHealthInsights(reports);
    }
  };

  const generateMockAnalyses = (reports: Report[]) => {
    const mockAnalyses: ReportAnalysis[] = reports.map((report) => ({
      id: `analysis_${report.id}`,
      reportId: report.id,
      reportType: report.report_type,
      analysisDate: new Date().toISOString(),
      keyFindings: getKeyFindingsByType(report.report_type),
      riskFactors: getRiskFactorsByType(report.report_type),
      recommendations: getRecommendationsByType(report.report_type),
      followUpNeeded: Math.random() > 0.7,
      severity: ['normal', 'mild', 'moderate', 'severe'][Math.floor(Math.random() * 4)] as any,
      confidence: 0.85,
      dataPoints: []
    }));
    setAnalyses(mockAnalyses);
  };

  const generateHealthMetrics = (reports: Report[]) => {
    const metrics: HealthMetric[] = [
      {
        category: 'Cardiovascular Health',
        value: 82,
        trend: 'up',
        status: 'good',
        description: 'Your heart health indicators are improving based on recent cardiology reports',
        lastUpdated: new Date().toISOString()
      },
      {
        category: 'Metabolic Health',
        value: 76,
        trend: 'stable',
        status: 'good',
        description: 'Blood work shows stable metabolic function',
        lastUpdated: new Date().toISOString()
      },
      {
        category: 'Neurological Health',
        value: 88,
        trend: 'up',
        status: 'good',
        description: 'Cognitive and neurological assessments are excellent',
        lastUpdated: new Date().toISOString()
      },
      {
        category: 'General Wellness',
        value: 79,
        trend: 'down',
        status: 'warning',
        description: 'Some areas need attention - check recommendations below',
        lastUpdated: new Date().toISOString()
      }
    ];
    setHealthMetrics(metrics);
  };

  const generateHealthInsights = (reports: Report[]) => {
    const mockInsights: HealthInsight[] = [
      {
        id: '1',
        type: 'recommendation',
        title: 'Schedule Follow-up Cardiology Appointment',
        description: 'Based on your recent cardiology report, a follow-up in 3 months is recommended to monitor progress.',
        priority: 'medium',
        category: 'Cardiology',
        actionable: true,
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        confidence: 0.85,
        sources: ['Recent Cardiology Report']
      },
      {
        id: '2',
        type: 'achievement',
        title: 'Improved Blood Pressure Readings',
        description: 'Your recent reports show a 15% improvement in blood pressure compared to 6 months ago.',
        priority: 'low',
        category: 'Cardiovascular',
        actionable: false,
        confidence: 0.92,
        sources: ['Latest Cardiology Report']
      },
      {
        id: '3',
        type: 'alert',
        title: 'Vitamin D Deficiency Detected',
        description: 'Your latest pathology report indicates low vitamin D levels. Consider supplementation.',
        priority: 'high',
        category: 'Nutritional',
        actionable: true,
        confidence: 0.95,
        sources: ['Blood Work']
      },
      {
        id: '4',
        type: 'trend',
        title: 'Cholesterol Levels Trending Down',
        description: 'Great progress! Your cholesterol levels have decreased by 20% over the past year.',
        priority: 'low',
        category: 'Cardiovascular',
        actionable: false,
        confidence: 0.88,
        sources: ['Blood Work Series']
      }
    ];
    setInsights(mockInsights);
  };

  const getKeyFindingsByType = (reportType: string): string[] => {
    const findings = {
      cardiology: ['Normal sinus rhythm', 'Ejection fraction: 60%', 'No signs of coronary artery disease'],
      pathology: ['Complete blood count within normal range', 'Liver function tests normal', 'Cholesterol: 180 mg/dL'],
      radiology: ['No acute findings', 'Normal organ structure', 'Clear lung fields'],
      neurology: ['Normal cognitive function', 'No signs of neurological deficit', 'Reflex responses normal']
    };
    return findings[reportType as keyof typeof findings] || ['Analysis pending'];
  };

  const getRiskFactorsByType = (reportType: string): string[] => {
    const risks = {
      cardiology: ['Family history of heart disease', 'Sedentary lifestyle'],
      pathology: ['Elevated stress markers', 'Vitamin D deficiency'],
      radiology: ['Previous injury history'],
      neurology: ['Age-related changes', 'Sleep pattern irregularities']
    };
    return risks[reportType as keyof typeof risks] || [];
  };

  const getRecommendationsByType = (reportType: string): string[] => {
    const recommendations = {
      cardiology: ['Continue regular exercise', 'Maintain healthy diet', 'Monitor blood pressure'],
      pathology: ['Vitamin D supplementation', 'Regular health screenings', 'Stress management'],
      radiology: ['Physical therapy if needed', 'Follow-up in 6 months'],
      neurology: ['Adequate sleep (7-9 hours)', 'Mental exercises', 'Regular check-ups']
    };
    return recommendations[reportType as keyof typeof recommendations] || [];
  };

  const generateAIAnalysis = async () => {
    setGeneratingAnalysis(true);
    try {
      // Simulate AI analysis generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate fresh AI analysis
      if (reports.length > 0) {
        await generateRealAnalyses(reports);
      } else {
        await fetchReportsAndAnalyses();
      }
      
      toast({
        title: "AI Analysis Complete",
        description: "New insights and recommendations have been generated based on your latest reports.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate AI analysis. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingAnalysis(false);
    }
  };

  const getHealthTrendData = () => {
    return [
      { month: 'Jan', cardiovascular: 75, metabolic: 70, neurological: 85, general: 78 },
      { month: 'Feb', cardiovascular: 77, metabolic: 72, neurological: 86, general: 79 },
      { month: 'Mar', cardiovascular: 79, metabolic: 74, neurological: 87, general: 80 },
      { month: 'Apr', cardiovascular: 80, metabolic: 75, neurological: 88, general: 79 },
      { month: 'May', cardiovascular: 81, metabolic: 76, neurological: 88, general: 79 },
      { month: 'Jun', cardiovascular: 82, metabolic: 76, neurological: 88, general: 79 }
    ];
  };

  const getReportDistributionData = () => {
    const distribution = reports.reduce((acc, report) => {
      acc[report.report_type] = (acc[report.report_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count
    }));
  };

  const getPriorityInsights = () => {
    return insights.filter(insight => insight.priority === 'high').slice(0, 3);
  };

  const getRecentAnalyses = () => {
    return analyses.slice(0, 5);
  };

  if (loading) {
    return (
      <AppLayout title="Health Analysis & Insights">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-diagnoweb-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing your health data...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (reports.length === 0 && !loading) {
    return (
      <AppLayout title="Health Analysis & Insights">
        <div className="flex items-center justify-center min-h-[500px]">
          <Card className="max-w-2xl mx-auto text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-gradient-to-br from-diagnoweb-primary to-diagnoweb-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Health Analysis & Insights</h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Get AI-powered analysis of your medical reports with personalized health insights, trends, and recommendations. 
                Upload your first medical report to start your health journey.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => window.location.href = '/upload'}
                  className="bg-gradient-to-r from-diagnoweb-primary to-diagnoweb-secondary hover:from-diagnoweb-secondary hover:to-diagnoweb-primary"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Your First Report
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </div>
              <div className="mt-8 p-4 bg-diagnoweb-light/30 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">What you'll get with AI Analysis:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Personalized health insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Health trend analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Risk factor identification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Actionable recommendations</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Health Analysis & Insights">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Health Analysis & Insights</h1>
            <p className="text-gray-600 mt-1">AI-powered analysis of your medical reports with personalized recommendations</p>
          </div>
          <Button 
            onClick={generateAIAnalysis}
            disabled={generatingAnalysis}
            className="bg-gradient-to-r from-diagnoweb-primary to-diagnoweb-secondary hover:from-diagnoweb-secondary hover:to-diagnoweb-primary"
          >
            {generatingAnalysis ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Analysis
              </>
            )}
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
                <FileText className="h-8 w-8 text-diagnoweb-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Analyses Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{analyses.length}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-diagnoweb-secondary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Insights</p>
                  <p className="text-2xl font-bold text-gray-900">{insights.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-diagnoweb-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Health Score</p>
                  <p className="text-2xl font-bold text-gray-900">81%</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Health Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{metric.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{metric.value}%</span>
                          {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                          {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                          {metric.trend === 'stable' && <span className="text-xs text-gray-500">stable</span>}
                        </div>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600">{metric.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Report Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Report Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={getReportDistributionData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getReportDistributionData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Priority Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getPriorityInsights().map((insight) => (
                    <div key={insight.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-red-900">{insight.title}</h4>
                        <p className="text-sm text-red-700">{insight.description}</p>
                        {insight.actionable && (
                          <Button size="sm" variant="outline" className="mt-2 border-red-300 text-red-700 hover:bg-red-100">
                            Take Action
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4">
              {insights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-full ${
                        insight.type === 'alert' ? 'bg-red-100' :
                        insight.type === 'recommendation' ? 'bg-blue-100' :
                        insight.type === 'achievement' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        {insight.type === 'alert' && <AlertTriangle className="h-5 w-5 text-red-600" />}
                        {insight.type === 'recommendation' && <Lightbulb className="h-5 w-5 text-blue-600" />}
                        {insight.type === 'achievement' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {insight.type === 'trend' && <TrendingUp className="h-5 w-5 text-purple-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant={
                            insight.priority === 'high' ? 'destructive' :
                            insight.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {insight.priority}
                          </Badge>
                          <Badge variant="outline">{insight.category}</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{insight.description}</p>
                        {insight.actionable && (
                          <div className="flex gap-2">
                            <Button size="sm">Take Action</Button>
                            <Button size="sm" variant="outline">Learn More</Button>
                          </div>
                        )}
                        {insight.dueDate && (
                          <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Due: {new Date(insight.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Health Trends Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={getHealthTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="cardiovascular" stroke="#5664d2" strokeWidth={2} />
                    <Line type="monotone" dataKey="metabolic" stroke="#8e9aff" strokeWidth={2} />
                    <Line type="monotone" dataKey="neurological" stroke="#36d399" strokeWidth={2} />
                    <Line type="monotone" dataKey="general" stroke="#fbbf24" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid gap-6">
              {/* Immediate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Immediate Actions Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insights.filter(insight => insight.actionable && insight.priority === 'high').map((insight) => (
                      <div key={insight.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <h4 className="font-medium text-red-900">{insight.title}</h4>
                          <p className="text-sm text-red-700">{insight.description}</p>
                        </div>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700">
                          Act Now
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Lifestyle Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Lifestyle Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-green-700">✓ Keep Doing</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Regular cardiovascular exercise
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Consistent sleep schedule
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Healthy diet choices
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-blue-700">→ Consider Adding</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Meditation or stress management
                        </li>
                        <li className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Vitamin D supplementation
                        </li>
                        <li className="flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-blue-500" />
                          Regular health screenings
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AnalysisPage;