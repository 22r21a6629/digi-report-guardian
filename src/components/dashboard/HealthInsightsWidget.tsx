import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Info, ArrowRight } from "lucide-react";
import { InsightsAnalyzer, HealthInsight } from "@/lib/insightsAnalyzer";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Report = Database['public']['Tables']['reports']['Row'];

interface HealthInsightsWidgetProps {
  reports: Report[];
  loading?: boolean;
}

export function HealthInsightsWidget({ reports, loading = false }: HealthInsightsWidgetProps) {
  const [topInsights, setTopInsights] = useState<HealthInsight[]>([]);
  const [healthScore, setHealthScore] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (reports.length > 0) {
      const analyzer = new InsightsAnalyzer(reports);
      const insights = analyzer.generateInsights();
      const metrics = analyzer.getKeyMetrics();
      
      // Show top 3 insights
      setTopInsights(insights.slice(0, 3));
      setHealthScore(metrics.healthScore);
    } else {
      setTopInsights([]);
      setHealthScore(0);
    }
  }, [reports]);

  const getInsightIcon = (type: HealthInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
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

  const handleViewAllInsights = () => {
    navigate('/insights');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Analyzing...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5" />
            Health Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-3">
              Upload reports to get insights
            </p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate('/upload')}
            >
              Upload Report
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5" />
          Health Insights
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewAllInsights}
          className="h-8"
        >
          View all
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Health Score */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">Health Score</p>
            <p className="text-xs text-muted-foreground">Based on report patterns</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{healthScore}/100</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </div>

        {/* Top Insights */}
        <div className="space-y-3">
          {topInsights.length > 0 ? (
            topInsights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-2 p-2 border rounded-md">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium truncate">{insight.title}</h4>
                    <Badge 
                      variant={getInsightBadgeVariant(insight.type)} 
                      className="text-xs"
                    >
                      {insight.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {insight.description}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-3">
              <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto mb-1" />
              <p className="text-sm text-muted-foreground">All looking good!</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewAllInsights}
          className="w-full"
        >
          View Detailed Analysis
        </Button>
      </CardContent>
    </Card>
  );
}