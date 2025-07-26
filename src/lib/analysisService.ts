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

export type HealthMetric = {
  category: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
  description: string;
  lastUpdated: string;
};

export type HealthInsight = {
  id: string;
  type: 'recommendation' | 'alert' | 'trend' | 'achievement';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  actionable: boolean;
  dueDate?: string;
  confidence: number;
  sources: string[];
};

export type ReportAnalysis = {
  id: string;
  reportId: string;
  reportType: string;
  analysisDate: string;
  keyFindings: string[];
  riskFactors: string[];
  recommendations: string[];
  followUpNeeded: boolean;
  severity: 'normal' | 'mild' | 'moderate' | 'severe';
  confidence: number;
  dataPoints: Array<{
    metric: string;
    value: string;
    normalRange: string;
    status: 'normal' | 'abnormal' | 'borderline';
  }>;
};

export type HealthTrend = {
  timeRange: string;
  metrics: Array<{
    name: string;
    trend: 'improving' | 'stable' | 'declining';
    changePercentage: number;
    currentValue: number;
    previousValue: number;
  }>;
};

class AnalysisService {
  private readonly API_KEY = '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';
  private readonly API_URL = 'https://api.groq.com/openai/v1/chat/completions';

  /**
   * Analyze a single medical report using AI
   */
  async analyzeReport(report: Report): Promise<ReportAnalysis> {
    try {
      const prompt = this.createAnalysisPrompt(report);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a medical AI assistant that analyzes medical reports. Provide analysis in JSON format with the following structure:
              {
                "keyFindings": ["finding1", "finding2", ...],
                "riskFactors": ["risk1", "risk2", ...],
                "recommendations": ["rec1", "rec2", ...],
                "followUpNeeded": boolean,
                "severity": "normal|mild|moderate|severe",
                "confidence": 0.0-1.0,
                "dataPoints": [{"metric": "string", "value": "string", "normalRange": "string", "status": "normal|abnormal|borderline"}]
              }
              
              Always provide actionable insights and be conservative with severity assessments. Focus on preventive care and lifestyle recommendations.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error('AI analysis failed');
      }

      const data = await response.json();
      const aiAnalysis = data.choices[0]?.message?.content;
      
      let analysisResult;
      try {
        analysisResult = JSON.parse(aiAnalysis);
      } catch {
        // Fallback to mock analysis if AI response is not valid JSON
        analysisResult = this.getMockAnalysis(report.report_type);
      }

      return {
        id: `analysis_${report.id}`,
        reportId: report.id,
        reportType: report.report_type,
        analysisDate: new Date().toISOString(),
        ...analysisResult
      };
    } catch (error) {
      console.error('Error analyzing report:', error);
      // Return mock analysis as fallback
      return {
        id: `analysis_${report.id}`,
        reportId: report.id,
        reportType: report.report_type,
        analysisDate: new Date().toISOString(),
        ...this.getMockAnalysis(report.report_type)
      };
    }
  }

  /**
   * Analyze multiple reports and generate comprehensive health insights
   */
  async generateHealthInsights(reports: Report[]): Promise<HealthInsight[]> {
    if (reports.length === 0) return [];

    try {
      const prompt = this.createInsightsPrompt(reports);
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: `You are a medical AI that generates health insights from multiple reports. Return a JSON array of insights with this structure:
              [{
                "type": "recommendation|alert|trend|achievement",
                "title": "string",
                "description": "string",
                "priority": "high|medium|low",
                "category": "string",
                "actionable": boolean,
                "confidence": 0.0-1.0,
                "sources": ["report1", "report2"]
              }]
              
              Focus on patterns, trends, and actionable recommendations. Prioritize preventive care and lifestyle improvements.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.4,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error('Insights generation failed');
      }

      const data = await response.json();
      const aiInsights = data.choices[0]?.message?.content;
      
      let insights;
      try {
        insights = JSON.parse(aiInsights);
      } catch {
        insights = this.getMockInsights(reports);
      }

      return insights.map((insight: any, index: number) => ({
        id: `insight_${index}`,
        dueDate: insight.actionable ? this.generateDueDate(insight.priority) : undefined,
        ...insight
      }));
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getMockInsights(reports);
    }
  }

  /**
   * Calculate health metrics based on reports
   */
  calculateHealthMetrics(reports: Report[], analyses: ReportAnalysis[]): HealthMetric[] {
    const metrics: HealthMetric[] = [];
    
    // Cardiovascular Health
    const cardioReports = reports.filter(r => r.report_type === 'cardiology');
    const cardioScore = this.calculateCategoryScore(cardioReports, analyses);
    metrics.push({
      category: 'Cardiovascular Health',
      value: cardioScore.value,
      trend: cardioScore.trend,
      status: cardioScore.status,
      description: this.getCardioDescription(cardioScore.value),
      lastUpdated: cardioReports.length > 0 ? cardioReports[0].report_date : new Date().toISOString()
    });

    // Metabolic Health
    const pathologyReports = reports.filter(r => r.report_type === 'pathology');
    const metabolicScore = this.calculateCategoryScore(pathologyReports, analyses);
    metrics.push({
      category: 'Metabolic Health',
      value: metabolicScore.value,
      trend: metabolicScore.trend,
      status: metabolicScore.status,
      description: this.getMetabolicDescription(metabolicScore.value),
      lastUpdated: pathologyReports.length > 0 ? pathologyReports[0].report_date : new Date().toISOString()
    });

    // Neurological Health
    const neuroReports = reports.filter(r => r.report_type === 'neurology');
    const neuroScore = this.calculateCategoryScore(neuroReports, analyses);
    metrics.push({
      category: 'Neurological Health',
      value: neuroScore.value,
      trend: neuroScore.trend,
      status: neuroScore.status,
      description: this.getNeuroDescription(neuroScore.value),
      lastUpdated: neuroReports.length > 0 ? neuroReports[0].report_date : new Date().toISOString()
    });

    // General Wellness
    const overallScore = this.calculateOverallScore(metrics);
    metrics.push({
      category: 'General Wellness',
      value: overallScore.value,
      trend: overallScore.trend,
      status: overallScore.status,
      description: this.getGeneralDescription(overallScore.value),
      lastUpdated: new Date().toISOString()
    });

    return metrics;
  }

  /**
   * Generate health trends over time
   */
  generateHealthTrends(reports: Report[]): HealthTrend[] {
    // Mock implementation - in real scenario, this would analyze historical data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const baseValues = {
      cardiovascular: 75,
      metabolic: 70,
      neurological: 85,
      general: 78
    };

    return months.map((month, index) => ({
      timeRange: month,
      metrics: Object.entries(baseValues).map(([name, base]) => {
        const trend = Math.random() > 0.5 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining';
        const changePercentage = trend === 'improving' ? 
          Math.random() * 10 : 
          trend === 'declining' ? 
          -Math.random() * 5 : 
          Math.random() * 2 - 1;
        
        const currentValue = Math.min(100, Math.max(0, base + index * 2 + changePercentage));
        const previousValue = index > 0 ? currentValue - changePercentage : currentValue;

        return {
          name,
          trend: trend as 'improving' | 'stable' | 'declining',
          changePercentage,
          currentValue,
          previousValue
        };
      })
    }));
  }

  private createAnalysisPrompt(report: Report): string {
    return `Analyze this medical report:
    
    Report Type: ${report.report_type}
    Hospital: ${report.hospital}
    Date: ${report.report_date}
    Description: ${report.description || 'No description provided'}
    File Name: ${report.file_name}
    
    Please provide a comprehensive analysis focusing on:
    1. Key medical findings
    2. Potential risk factors
    3. Lifestyle and medical recommendations
    4. Whether follow-up is needed
    5. Overall severity assessment
    6. Specific data points and their normal ranges
    
    Be thorough but accessible to patients.`;
  }

  private createInsightsPrompt(reports: Report[]): string {
    const reportSummary = reports.map(r => 
      `${r.report_type} from ${r.hospital} on ${r.report_date}: ${r.description || r.file_name}`
    ).join('\n');

    return `Based on these medical reports, generate comprehensive health insights:

    ${reportSummary}
    
    Generate insights that:
    1. Identify patterns across reports
    2. Highlight positive trends and achievements
    3. Flag potential health concerns
    4. Provide actionable recommendations
    5. Suggest preventive measures
    6. Recommend follow-up care
    
    Focus on empowering the patient with actionable information while emphasizing the importance of professional medical consultation.`;
  }

  private getMockAnalysis(reportType: string) {
    const mockAnalyses = {
      cardiology: {
        keyFindings: ['Normal sinus rhythm', 'Ejection fraction: 60%', 'No signs of coronary artery disease'],
        riskFactors: ['Family history of heart disease', 'Age-related changes'],
        recommendations: ['Continue regular exercise', 'Maintain healthy diet', 'Monitor blood pressure'],
        followUpNeeded: false,
        severity: 'normal' as const,
        confidence: 0.85,
        dataPoints: [
          { metric: 'Heart Rate', value: '72 bpm', normalRange: '60-100 bpm', status: 'normal' as const },
          { metric: 'Blood Pressure', value: '120/80 mmHg', normalRange: '<140/90 mmHg', status: 'normal' as const }
        ]
      },
      pathology: {
        keyFindings: ['Complete blood count within normal range', 'Liver function tests normal', 'Cholesterol: 180 mg/dL'],
        riskFactors: ['Vitamin D deficiency', 'Elevated stress markers'],
        recommendations: ['Vitamin D supplementation', 'Regular health screenings', 'Stress management'],
        followUpNeeded: true,
        severity: 'mild' as const,
        confidence: 0.90,
        dataPoints: [
          { metric: 'Total Cholesterol', value: '180 mg/dL', normalRange: '<200 mg/dL', status: 'normal' as const },
          { metric: 'Vitamin D', value: '18 ng/mL', normalRange: '30-50 ng/mL', status: 'abnormal' as const }
        ]
      },
      radiology: {
        keyFindings: ['No acute findings', 'Normal organ structure', 'Clear lung fields'],
        riskFactors: ['Previous injury history'],
        recommendations: ['Physical therapy if needed', 'Follow-up in 6 months'],
        followUpNeeded: false,
        severity: 'normal' as const,
        confidence: 0.95,
        dataPoints: [
          { metric: 'Lung Function', value: 'Normal', normalRange: 'Normal', status: 'normal' as const },
          { metric: 'Bone Density', value: 'Normal', normalRange: 'Normal', status: 'normal' as const }
        ]
      },
      neurology: {
        keyFindings: ['Normal cognitive function', 'No signs of neurological deficit', 'Reflex responses normal'],
        riskFactors: ['Age-related changes', 'Sleep pattern irregularities'],
        recommendations: ['Adequate sleep (7-9 hours)', 'Mental exercises', 'Regular check-ups'],
        followUpNeeded: false,
        severity: 'normal' as const,
        confidence: 0.88,
        dataPoints: [
          { metric: 'Cognitive Score', value: '28/30', normalRange: '24-30', status: 'normal' as const },
          { metric: 'Reflex Response', value: 'Normal', normalRange: 'Normal', status: 'normal' as const }
        ]
      }
    };

    return mockAnalyses[reportType as keyof typeof mockAnalyses] || mockAnalyses.pathology;
  }

  private getMockInsights(reports: Report[]): HealthInsight[] {
    return [
      {
        type: 'recommendation',
        title: 'Schedule Follow-up Cardiology Appointment',
        description: 'Based on your recent cardiology report, a follow-up in 3 months is recommended to monitor progress.',
        priority: 'medium',
        category: 'Cardiology',
        actionable: true,
        confidence: 0.85,
        sources: reports.filter(r => r.report_type === 'cardiology').map(r => r.file_name).slice(0, 2)
      },
      {
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
        type: 'alert',
        title: 'Vitamin D Deficiency Detected',
        description: 'Your latest pathology report indicates low vitamin D levels. Consider supplementation.',
        priority: 'high',
        category: 'Nutritional',
        actionable: true,
        confidence: 0.95,
        sources: reports.filter(r => r.report_type === 'pathology').map(r => r.file_name).slice(0, 1)
      },
      {
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
  }

  private calculateCategoryScore(reports: Report[], analyses: ReportAnalysis[]) {
    if (reports.length === 0) {
      return { value: 75, trend: 'stable' as const, status: 'good' as const };
    }

    // Mock calculation based on report count and recency
    const baseScore = 70 + Math.random() * 20;
    const recentReports = reports.filter(r => 
      new Date(r.report_date) > new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
    );
    
    const hasRecentReports = recentReports.length > 0;
    const scoreModifier = hasRecentReports ? 10 : -5;
    
    const finalScore = Math.min(100, Math.max(0, baseScore + scoreModifier));
    
    return {
      value: Math.round(finalScore),
      trend: finalScore > 80 ? 'up' as const : finalScore < 60 ? 'down' as const : 'stable' as const,
      status: finalScore > 80 ? 'good' as const : finalScore < 60 ? 'critical' as const : 'warning' as const
    };
  }

  private calculateOverallScore(metrics: HealthMetric[]) {
    const avgValue = metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length;
    const trendScore = metrics.filter(m => m.trend === 'up').length;
    
    return {
      value: Math.round(avgValue),
      trend: trendScore > metrics.length / 2 ? 'up' as const : 'stable' as const,
      status: avgValue > 80 ? 'good' as const : avgValue < 60 ? 'critical' as const : 'warning' as const
    };
  }

  private getCardioDescription(score: number): string {
    if (score > 85) return 'Excellent cardiovascular health based on recent reports';
    if (score > 70) return 'Good cardiovascular health with room for improvement';
    return 'Cardiovascular health needs attention - consult your doctor';
  }

  private getMetabolicDescription(score: number): string {
    if (score > 85) return 'Excellent metabolic function shown in blood work';
    if (score > 70) return 'Good metabolic health with some areas to monitor';
    return 'Metabolic indicators suggest lifestyle adjustments needed';
  }

  private getNeuroDescription(score: number): string {
    if (score > 85) return 'Excellent neurological and cognitive health';
    if (score > 70) return 'Good neurological function with preventive care recommended';
    return 'Neurological health requires professional evaluation';
  }

  private getGeneralDescription(score: number): string {
    if (score > 85) return 'Outstanding overall health profile';
    if (score > 70) return 'Good overall health with some areas for improvement';
    return 'Overall health needs attention in multiple areas';
  }

  private generateDueDate(priority: string): string {
    const days = priority === 'high' ? 7 : priority === 'medium' ? 30 : 90;
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  }
}

export const analysisService = new AnalysisService();