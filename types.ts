
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

// --- CV Optimizer Types ---
export interface CvOptimizeResult {
  type?: 'pdf_update' | 'chat_message';
  message?: string;
  optimizedText: string;
  pdfBase64: string;
  suggestions?: string[];
}

export interface CvFinalizeResult {
  downloadUrl: string;
  sessionId: string;
}

// --- Database Types (Supabase Mapping) ---
export interface DbCvSession {
  id: string;
  user_id: string;
  status: string;
  original_pdf_url?: string;
  latest_draft_url?: string;
  created_at: string;
  // Recommend adding a 'text_content' column to your DB in the future to fully resume editing
}

export interface DbChatMessage {
  id: string;
  session_id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: string;
}

// --- Application Types ---
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface ComparisonResult {
  businessA: string;
  businessA_Score: number;
  businessA_Count: number;
  strengthsA: string[];
  weaknessesA: string[];
  businessB: string;
  businessB_Score: number;
  businessB_Count: number;
  strengthsB: string[];
  weaknessesB: string[];
  winner: string;
  summary: string;
  recommendation: string;
  chartUrlMonthly: string;
  chartUrlQuarterly: string;
  chartUrlSentiment: string;
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