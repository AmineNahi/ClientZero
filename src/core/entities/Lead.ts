export type LeadStatus = 'a_contacter' | 'contacte' | 'repondu' | 'client';

export interface Lead {
  id: string;
  user_id: string;
  name: string;
  website?: string | null;
  email?: string | null;
  status: LeadStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  subscription_tier: 'freemium' | 'premium';
}
