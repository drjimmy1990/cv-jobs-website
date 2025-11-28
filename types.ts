// Brand Colors Enum
export enum BrandColor {
  Primary = '#1D4E89',
  Secondary = '#1ABC9C',
  Accent = '#F39C12',
  Background = '#F5F5F5',
  Surface = '#FFFFFF',
  Text = '#2C3E50'
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  role: 'user' | 'admin';
  creditsCv: number;
  creditsChat: number;
}

// Comparison System (Phase 6 Updated)
export interface ComparisonResult {
  // Business A Data
  businessA: string;
  businessA_Score: number;
  businessA_Count: number;
  strengthsA: string[];
  weaknessesA: string[];

  // Business B Data
  businessB: string;
  businessB_Score: number;
  businessB_Count: number;
  strengthsB: string[];
  weaknessesB: string[];

  // Analysis
  winner: string;
  summary: string;
  recommendation: string;

  // Visuals
  chartUrlMonthly: string;
  chartUrlQuarterly: string;
  chartUrlSentiment: string;
}

// Chat System
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ConsultationRequest {
  id: string;
  userId: string;
  email?: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'closed';
  date: string;
}

export interface ContactSubmission {
  id: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export type Language = 'en' | 'ar';

export interface LangContextType {
  lang: Language;
  toggleLang: () => void;
  t: (key: string) => any;
  isRTL: boolean;
}