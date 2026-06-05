import { Lead, LeadStatus } from '../entities/Lead';

export interface ILeadRepository {
  getLeads(userId: string): Promise<Lead[]>;
  getLeadById(id: string): Promise<Lead | null>;
  addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<Lead>;
  updateLeadNotes(id: string, notes: string): Promise<Lead>;
  deleteLead(id: string): Promise<boolean>;
}
