import { ILeadRepository } from '../../core/repositories/ILeadRepository';
import { Lead, LeadStatus } from '../../core/entities/Lead';
import { SupabaseClient } from '@supabase/supabase-js';

export class SupabaseLeadRepository implements ILeadRepository {
  constructor(private client: SupabaseClient) {}

  async getLeads(userId: string): Promise<Lead[]> {
    const { data, error } = await this.client
      .from('leads')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Lead[];
  }

  async getLeadById(id: string): Promise<Lead | null> {
    const { data, error } = await this.client
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Lead | null;
  }

  async addLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> {
    const { data, error } = await this.client
      .from('leads')
      .insert(lead)
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  }

  async updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
    const { data, error } = await this.client
      .from('leads')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  }

  async updateLeadNotes(id: string, notes: string): Promise<Lead> {
    const { data, error } = await this.client
      .from('leads')
      .update({ notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  }

  async deleteLead(id: string): Promise<boolean> {
    const { error } = await this.client
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
