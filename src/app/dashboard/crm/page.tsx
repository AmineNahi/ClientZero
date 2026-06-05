import React from 'react';
import { KanbanBoard } from '../../../presentation/components/KanbanBoard';
import { fetchLeadsAction } from '../../../application/actions/leadActions';

export default async function CrmPage() {
  const leads = await fetchLeadsAction();

  return (
    <KanbanBoard initialLeads={leads} />
  );
}
