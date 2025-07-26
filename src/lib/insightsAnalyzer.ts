/**
 * Health Insights Analyzer
 * 
 * This module provides intelligent analysis of medical reports to generate:
 * - Key health insights based on report patterns and frequency
 * - Personalized improvement tips and recommendations
 * - Health scores and metrics for tracking wellness
 * 
 * The analyzer examines factors like:
 * - Report frequency and timing patterns
 * - Healthcare provider diversity
 * - Report type distribution
 * - Recent activity trends
 * - Time gaps between reports
 * 
 * Features:
 * - Real-time insights generation
 * - Personalized health score calculation
 * - Actionable improvement recommendations
 * - Comprehensive health summary statistics
 */

import { Database } from "@/integrations/supabase/types";

type Report = Database['public']['Tables']['reports']['Row'];

export interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info' | 'critical';
  category: 'frequency' | 'trends' | 'gaps' | 'recommendations';
  priority: number; // 1-5, 5 being highest priority
}

export interface ImprovementTip {
  id: string;
  title: string;
  description: string;
  actionable: string;
  category: 'preventive' | 'lifestyle' | 'monitoring' | 'followup';
  difficulty: 'easy' | 'moderate' | 'challenging';
}

export interface HealthSummary {
  totalReports: number;
  recentActivity: number; // reports in last 30 days
  reportTypes: Record<string, number>;
  averageReportsPerMonth: number;
  lastReportDate: string | null;
  mostCommonHospital: string;
}

export class InsightsAnalyzer {
  private reports: Report[];

  constructor(reports: Report[]) {
    this.reports = reports;
  }

  getHealthSummary(): HealthSummary {
    if (this.reports.length === 0) {
      return {
        totalReports: 0,
        recentActivity: 0,
        reportTypes: {},
        averageReportsPerMonth: 0,
        lastReportDate: null,
        mostCommonHospital: ''
      };
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentReports = this.reports.filter(report => 
      new Date(report.created_at) >= thirtyDaysAgo
    );

    const reportTypes: Record<string, number> = {};
    const hospitalCounts: Record<string, number> = {};

    this.reports.forEach(report => {
      reportTypes[report.report_type] = (reportTypes[report.report_type] || 0) + 1;
      hospitalCounts[report.hospital] = (hospitalCounts[report.hospital] || 0) + 1;
    });

    const mostCommonHospital = Object.entries(hospitalCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    const oldestReport = this.reports
      .map(r => new Date(r.created_at))
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    const monthsDiff = oldestReport ? 
      (now.getTime() - oldestReport.getTime()) / (1000 * 60 * 60 * 24 * 30) : 1;
    
    const averageReportsPerMonth = this.reports.length / Math.max(monthsDiff, 1);

    return {
      totalReports: this.reports.length,
      recentActivity: recentReports.length,
      reportTypes,
      averageReportsPerMonth: Math.round(averageReportsPerMonth * 10) / 10,
      lastReportDate: this.reports.length > 0 ? 
        this.reports.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0].created_at : null,
      mostCommonHospital
    };
  }

  generateInsights(): HealthInsight[] {
    const insights: HealthInsight[] = [];
    const summary = this.getHealthSummary();

    // Recent activity insights
    if (summary.recentActivity === 0 && summary.totalReports > 0) {
      insights.push({
        id: 'no-recent-activity',
        title: 'No Recent Medical Activity',
        description: 'You haven\'t uploaded any medical reports in the last 30 days.',
        type: 'info',
        category: 'frequency',
        priority: 2
      });
    } else if (summary.recentActivity > 3) {
      insights.push({
        id: 'high-activity',
        title: 'Increased Medical Activity',
        description: `You've uploaded ${summary.recentActivity} reports in the last 30 days. This is higher than usual.`,
        type: 'warning',
        category: 'frequency',
        priority: 3
      });
    }

    // Report type diversity insights
    const reportTypeCount = Object.keys(summary.reportTypes).length;
    if (reportTypeCount === 1 && summary.totalReports > 5) {
      const type = Object.keys(summary.reportTypes)[0];
      insights.push({
        id: 'limited-diversity',
        title: 'Limited Report Diversity',
        description: `All your reports are ${type} type. Consider comprehensive health checkups with different specialties.`,
        type: 'info',
        category: 'gaps',
        priority: 2
      });
    } else if (reportTypeCount >= 4) {
      insights.push({
        id: 'comprehensive-care',
        title: 'Comprehensive Healthcare Monitoring',
        description: `Great job! You're monitoring multiple aspects of your health with ${reportTypeCount} different report types.`,
        type: 'positive',
        category: 'trends',
        priority: 1
      });
    }

    // Frequency insights
    if (summary.averageReportsPerMonth > 2) {
      insights.push({
        id: 'frequent-monitoring',
        title: 'Active Health Monitoring',
        description: `You're averaging ${summary.averageReportsPerMonth} reports per month, showing good health awareness.`,
        type: 'positive',
        category: 'frequency',
        priority: 1
      });
    } else if (summary.averageReportsPerMonth < 0.5 && summary.totalReports > 3) {
      insights.push({
        id: 'infrequent-monitoring',
        title: 'Infrequent Health Monitoring',
        description: 'Consider more regular health checkups to maintain optimal health tracking.',
        type: 'info',
        category: 'frequency',
        priority: 3
      });
    }

    // Hospital diversity insight
    const hospitalCount = Object.keys(
      this.reports.reduce((acc, report) => {
        acc[report.hospital] = true;
        return acc;
      }, {} as Record<string, boolean>)
    ).length;

    if (hospitalCount === 1 && summary.totalReports > 3) {
      insights.push({
        id: 'single-provider',
        title: 'Single Healthcare Provider',
        description: `All reports are from ${summary.mostCommonHospital}. Consider getting second opinions for complex conditions.`,
        type: 'info',
        category: 'recommendations',
        priority: 2
      });
    }

    // Time gap analysis
    if (summary.lastReportDate) {
      const daysSinceLastReport = Math.floor(
        (new Date().getTime() - new Date(summary.lastReportDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastReport > 90) {
        insights.push({
          id: 'long-gap',
          title: 'Long Gap Since Last Report',
          description: `It's been ${daysSinceLastReport} days since your last report. Consider scheduling a routine checkup.`,
          type: 'warning',
          category: 'gaps',
          priority: 3
        });
      }
    }

    return insights.sort((a, b) => b.priority - a.priority);
  }

  generateImprovementTips(): ImprovementTip[] {
    const tips: ImprovementTip[] = [];
    const summary = this.getHealthSummary();

    // General tips based on report patterns
    tips.push({
      id: 'regular-checkups',
      title: 'Schedule Regular Health Checkups',
      description: 'Maintain a consistent schedule for preventive healthcare visits.',
      actionable: 'Book annual physical exams and follow recommended screening schedules for your age group.',
      category: 'preventive',
      difficulty: 'easy'
    });

    tips.push({
      id: 'organize-reports',
      title: 'Keep Reports Organized',
      description: 'Maintain a systematic approach to managing your medical records.',
      actionable: 'Use the tagging feature and add detailed descriptions to make reports easier to find.',
      category: 'monitoring',
      difficulty: 'easy'
    });

    if (summary.recentActivity > 2) {
      tips.push({
        id: 'track-trends',
        title: 'Monitor Health Trends',
        description: 'With multiple recent reports, track changes in your health metrics over time.',
        actionable: 'Compare similar test results across different dates to identify trends and discuss them with your healthcare provider.',
        category: 'monitoring',
        difficulty: 'moderate'
      });
    }

    if (Object.keys(summary.reportTypes).includes('pathology')) {
      tips.push({
        id: 'lab-tracking',
        title: 'Track Laboratory Results',
        description: 'Create a personal health log for important lab values.',
        actionable: 'Keep a spreadsheet or use a health app to track key metrics like cholesterol, blood sugar, and other relevant markers.',
        category: 'monitoring',
        difficulty: 'moderate'
      });
    }

    if (Object.keys(summary.reportTypes).includes('radiology')) {
      tips.push({
        id: 'imaging-followup',
        title: 'Follow Up on Imaging Results',
        description: 'Ensure proper follow-up for any imaging studies.',
        actionable: 'Always discuss imaging results with your doctor and ask about any necessary follow-up actions or lifestyle changes.',
        category: 'followup',
        difficulty: 'easy'
      });
    }

    tips.push({
      id: 'emergency-access',
      title: 'Prepare for Emergency Access',
      description: 'Ensure your medical information is accessible during emergencies.',
      actionable: 'Share access with trusted family members and keep a summary of key medical information readily available.',
      category: 'preventive',
      difficulty: 'moderate'
    });

    tips.push({
      id: 'lifestyle-integration',
      title: 'Integrate Health Data with Lifestyle',
      description: 'Use your medical reports to make informed lifestyle decisions.',
      actionable: 'Based on your reports, work with healthcare providers to develop personalized diet, exercise, and wellness plans.',
      category: 'lifestyle',
      difficulty: 'challenging'
    });

    tips.push({
      id: 'second-opinions',
      title: 'Seek Second Opinions When Needed',
      description: 'Don\'t hesitate to get additional medical perspectives for important decisions.',
      actionable: 'For significant diagnoses or treatment recommendations, consider consulting another specialist in the same field.',
      category: 'followup',
      difficulty: 'moderate'
    });

    return tips;
  }

  getKeyMetrics() {
    const summary = this.getHealthSummary();
    const insights = this.generateInsights();
    
    const criticalInsights = insights.filter(i => i.type === 'critical').length;
    const warningInsights = insights.filter(i => i.type === 'warning').length;
    const positiveInsights = insights.filter(i => i.type === 'positive').length;

    return {
      healthScore: this.calculateHealthScore(),
      totalInsights: insights.length,
      criticalInsights,
      warningInsights,
      positiveInsights,
      averageReportsPerMonth: summary.averageReportsPerMonth,
      recentActivity: summary.recentActivity
    };
  }

  private calculateHealthScore(): number {
    const summary = this.getHealthSummary();
    let score = 50; // Base score

    // Positive factors
    if (summary.recentActivity > 0) score += 10;
    if (summary.averageReportsPerMonth >= 1) score += 10;
    if (Object.keys(summary.reportTypes).length >= 2) score += 15;
    if (summary.totalReports >= 5) score += 10;

    // Negative factors
    if (summary.recentActivity === 0 && summary.totalReports > 0) score -= 15;
    if (summary.averageReportsPerMonth < 0.3) score -= 10;

    // Check for time gaps
    if (summary.lastReportDate) {
      const daysSinceLastReport = Math.floor(
        (new Date().getTime() - new Date(summary.lastReportDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSinceLastReport > 180) score -= 20;
      else if (daysSinceLastReport > 90) score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }
}