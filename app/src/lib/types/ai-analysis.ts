/**
 * AI Analysis Types
 * For analyzing survey responses with OpenAI
 */

export type SentimentType = "positive" | "neutral" | "negative" | "mixed";

export interface SentimentAnalysis {
  overall: SentimentType;
  positive: number; // Percentage 0-100
  neutral: number;
  negative: number;
  confidence: number; // 0-1
}

export interface KeyTheme {
  theme: string;
  mentions: number;
  sentiment: SentimentType;
  examples: string[]; // Sample quotes
}

export interface NPSMetrics {
  score: number; // -100 to 100
  promoters: number; // Count
  passives: number;
  detractors: number;
  promotersPercent: number; // Percentage
  passivesPercent: number;
  detractorsPercent: number;
}

export interface ActionableInsight {
  category: "product" | "pricing" | "support" | "ux" | "feature_request" | "other";
  insight: string;
  priority: "high" | "medium" | "low";
  affectedUsers: number;
  quotes: string[];
}

export interface AIAnalysisResult {
  surveyId: string;
  totalResponses: number;
  analyzedAt: Date;

  // Sentiment Analysis
  sentiment: SentimentAnalysis;

  // Key Themes
  themes: KeyTheme[];

  // NPS (if applicable)
  nps?: NPSMetrics;

  // Actionable Insights
  insights: ActionableInsight[];

  // Summary
  summary: string; // AI-generated executive summary

  // Top Quotes (most representative)
  topQuotes: {
    positive: string[];
    negative: string[];
  };
}

export interface AnalysisRequest {
  surveyId: string;
  forceReanalyze?: boolean; // Force re-analysis even if cached
}
