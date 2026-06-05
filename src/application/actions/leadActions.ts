"use server";

import { revalidatePath } from 'next/cache';
import { SupabaseLeadRepository } from '../../infrastructure/supabase/SupabaseLeadRepository';
import { ManageLeadsUseCase } from '../use-cases/ManageLeadsUseCase';
import { LeadStatus } from '../../core/entities/Lead';
import { createServerSupabaseClient } from '../../infrastructure/supabase/server';

async function getUseCase() {
  const supabase = await createServerSupabaseClient();
  const leadRepo = new SupabaseLeadRepository(supabase);
  return new ManageLeadsUseCase(leadRepo);
}

export async function fetchLeadsAction() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const useCase = await getUseCase();
  return useCase.getAllLeads(user.id);
}

export async function addLeadAction(name: string, website?: string, email?: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const useCase = await getUseCase();
  const lead = await useCase.addNewLead(user.id, name, website, email);
  revalidatePath('/dashboard/crm');
  revalidatePath('/dashboard/leads');
  return lead;
}

export async function updateLeadStatusAction(leadId: string, status: LeadStatus) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const useCase = await getUseCase();
  const lead = await useCase.changeLeadStatus(leadId, status);
  revalidatePath('/dashboard/crm');
  return lead;
}
