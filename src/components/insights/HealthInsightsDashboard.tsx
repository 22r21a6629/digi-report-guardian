import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  TrendingUp, 
  Activity,
  Brain,
  Lightbulb,
  Target,
  Clock,
  BarChart3,
  Heart
} from "lucide-react";
import { 
  InsightsAnalyzer, 
  HealthInsight, 
  ImprovementTip, 
  HealthSummary 
} from "@/lib/insightsAnalyzer";
import { Database } from "@/integrations/supabase/types";

type Report = Database['public']['Tables']['reports']['Row'];

interface HealthInsightsDashboardProps {
  reports: Report[];
  loading?: boolean;
}

export function HealthInsightsDashboard({ reports, loading = false }: HealthInsightsDashboardProps) {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [improvementTips, setImprovementTips] = useState<ImprovementTip[]>([]);
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null);
  const [keyMetrics, setKeyMetrics] = useState<any>(null);

  useEffect(() => {
    if (reports.length > 0) {
      const analyzer = new InsightsAnalyzer(reports);
      setInsights(analyzer.generateInsights());
      setImprovementTips(analyzer.generateImprovementTips());
      setHealthSummary(analyzer.getHealthSummary());
      setKeyMetrics(analyzer.getKeyMetrics());
    } else {
      setInsights([]);
      setImprovementTips([]);
      setHealthSummary(null);
      setKeyMetrics(null);
    }
  }, [reports]);

  const getInsightIcon = (type: HealthInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightBadgeVariant = (type: HealthInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'default';
      case 'warning':
        return 'secondary';
      case 'critical':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getTipIcon = (category: ImprovementTip['category']) => {
    switch (category) {
      case 'preventive':
        return <Heart className="h-4 w-4" />;
      case 'lifestyle':
        return <Activity className="h-4 w-4" />;
      case 'monitoring':
        return <BarChart3 className="h-4 w-4" />;
      case 'followup':
        return <Clock className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: ImprovementTip['difficulty']) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600';
      case 'moderate':
        return 'text-orange-600';
      case 'challenging':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Analyzing your health data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports to Analyze</h3>
            <p className="text-muted-foreground mb-4">
              Upload some medical reports to get personalized health insights and improvement recommendations.
            </p>
            <Button onClick={() => window.location.href = '/upload'}>
              Upload Your First Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      {keyMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Health Score</p>
                  <p className="text-2xl font-bold">{keyMetrics.healthScore}/100</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={`${keyMetrics.healthScore}, 100`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Insights</p>
                  <p className="text-2xl font-bold">{keyMetrics.totalInsights}</p>
                  <div className="flex gap-2 mt-1">
                    {keyMetrics.criticalInsights > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {keyMetrics.criticalInsights} Critical
                      </Badge>
                    )}
                    {keyMetrics.warningInsights > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {keyMetrics.warningInsights} Warnings
                      </Badge>
                    )}
                  </div>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recent Activity</p>
                  <p className="text-2xl font-bold">{keyMetrics.recentActivity}</p>
                  <p className="text-xs text-muted-foreground">reports in last 30 days</p>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Insights Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Health Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">Key Insights</TabsTrigger>
              <TabsTrigger value="tips">Improvement Tips</TabsTrigger>
              <TabsTrigger value="summary">Health Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4">
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <Card key={insight.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          {getInsightIcon(insight.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{insight.title}</h4>
                              <Badge variant={getInsightBadgeVariant(insight.type)}>
                                {insight.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{insight.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Looking Good!</h3>
                  <p className="text-muted-foreground">
                    No specific insights identified. Keep up with regular health monitoring.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <div className="space-y-4">
                {improvementTips.map((tip) => (
                  <Card key={tip.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getTipIcon(tip.category)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{tip.title}</h4>
                            <Badge variant="outline">{tip.category}</Badge>
                            <span className={`text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                              {tip.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{tip.description}</p>
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm">
                              <strong>Action:</strong> {tip.actionable}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              {healthSummary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Report Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Reports:</span>
                        <span className="font-semibold">{healthSummary.totalReports}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recent Activity (30 days):</span>
                        <span className="font-semibold">{healthSummary.recentActivity}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average per Month:</span>
                        <span className="font-semibold">{healthSummary.averageReportsPerMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Primary Hospital:</span>
                        <span className="font-semibold text-sm">{healthSummary.mostCommonHospital}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Report Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(healthSummary.reportTypes).map(([type, count]) => (
                        <div key={type} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{type}</span>
                            <span>{count} reports</span>
                          </div>
                          <Progress 
                            value={(count / healthSummary.totalReports) * 100} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}