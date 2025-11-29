
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
  text_content?: string; // <--- ADD THIS LINE
  created_at: string;
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


// Add these to your existing types.ts

export interface CvWorkExperience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface CvEducation {
  institution: string;
  degree: string;
  field: string;
  gradDate: string;
  gpa: string;
}

export interface CvSkill {
  name: string;
}

export interface CvLanguage {
  name: string;
  proficiency: string;
}

export interface CvProject {
  name: string;
  date: string;
  description: string;
  link: string;
}

export interface CvCertification {
  name: string;
  org: string;
  date: string;
  link: string;
}

export interface CvAward {
  name: string;
  org: string;
  year: string;
}

export interface CustomSectionItem {
  title: string;
  description: string;
  date?: string;
  fields: { label: string; value: string; }[];
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface CvData {
  // Personal
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  photoBase64: string; // We will convert image to string

  // Sections
  summary: string;
  experience: CvWorkExperience[];
  education: CvEducation[];
  skills: CvSkill[];
  languages: CvLanguage[];
  projects: CvProject[];
  certifications: CvCertification[];
  awards: CvAward[];
  hobbies: string;
  references: string;
  customSections: CustomSection[];
}