export type CraftDifficulty = 'Easy' | 'Medium' | 'Hard';

export type CraftCategory = 
  | 'Home Decor' 
  | 'Gifts' 
  | 'Kids' 
  | 'Art' 
  | 'Recycling' 
  | 'Festival' 
  | 'Fashion'
  | 'All';

export type CraftOccasion = 
  | 'Birthday' 
  | 'Festival' 
  | 'School Project' 
  | 'Decoration' 
  | 'General'
  | 'All';

export interface CraftIdea {
  id: string;
  title: string;
  tagline?: string;
  description: string;
  materialsRequired: string[];
  category: string;
  difficulty: CraftDifficulty | string;
  estimatedTime: string;
  occasion: string;
  steps: string[];
  tips?: string[];
  safetyNotes?: string;
  savedAt?: string;
  isSaved?: boolean;
}

export interface GenerateRequest {
  materials: string[];
  category?: string;
  difficulty?: string;
  occasion?: string;
  count: number;
}

export interface GenerateResponse {
  success: boolean;
  crafts?: CraftIdea[];
  engine?: string;
  count?: number;
  note?: string;
  error?: string;
}

export interface SavedCraftsResponse {
  success: boolean;
  crafts: CraftIdea[];
  count: number;
  error?: string;
}

export interface HealthStatus {
  status: string;
  database: 'mongodb' | 'json_fallback' | string;
  gemini_configured: boolean;
}
