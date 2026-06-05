import { ILeadRepository } from '../../core/repositories/ILeadRepository';
import { Lead, LeadStatus } from '../../core/entities/Lead';

export class ManageLeadsUseCase {
  constructor(private leadRepository: ILeadRepository) {}

  async getAllLeads(userId: string): Promise<Lead[]> {
    return this.leadRepository.getLeads(userId);
  }

  async addNewLead(userId: string, name: string, website?: string, email?: string): Promise<Lead> {
    return this.leadRepository.addLead({
      user_id: userId,
      name,
      website: website || null,
      email: email || null,
      status: 'a_contacter',
      notes: null,
    });
  }

  async changeLeadStatus(leadId: string, newStatus: LeadStatus): Promise<Lead> {
    return this.leadRepository.updateLeadStatus(leadId, newStatus);
  }

  async addNoteToLead(leadId: string, notes: string): Promise<Lead> {
    return this.leadRepository.updateLeadNotes(leadId, notes);
  }
}
