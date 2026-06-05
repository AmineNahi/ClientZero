"use client";

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Plus, ChevronRight, ChevronLeft } from 'lucide-react';
import styles from '../../app/dashboard/crm/crm.module.css';
import { Lead, LeadStatus } from '../../core/entities/Lead';
import { updateLeadStatusAction } from '../../application/actions/leadActions';

const COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: 'a_contacter', title: 'À contacter' },
  { id: 'contacte', title: 'Contacté' },
  { id: 'repondu', title: 'Répondu' },
  { id: 'client', title: 'Client' }
];

export const KanbanBoard = ({ initialLeads }: { initialLeads: Lead[] }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const moveLead = async (leadId: string, currentStatus: LeadStatus, direction: 'forward' | 'backward') => {
    const currentIndex = COLUMNS.findIndex(c => c.id === currentStatus);
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex < 0 || newIndex >= COLUMNS.length) return;
    const newStatus = COLUMNS[newIndex].id;

    setLoadingId(leadId);
    try {
      // Optimistic update
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      await updateLeadStatusAction(leadId, newStatus);
    } catch (e) {
      console.error(e);
      // Revert on error
      setLeads(initialLeads);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={`animate-fade-in ${styles.page}`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>CRM (Pipeline)</h1>
          <p className={styles.subtitle}>Faites avancer vos prospects dans le tunnel de vente.</p>
        </div>
        <Button leftIcon={<Plus size={18} />}>Ajouter un lead manuel</Button>
      </div>

      <div className={styles.kanbanBoard}>
        {COLUMNS.map((column, index) => {
          const columnLeads = leads.filter(l => l.status === column.id);
          return (
            <div key={column.id} className={styles.column}>
              <div className={styles.columnHeader}>
                <h3 className={styles.columnTitle}>{column.title}</h3>
                <span className={styles.leadCount}>{columnLeads.length}</span>
              </div>
              
              <div className={styles.columnContent}>
                {columnLeads.map(lead => (
                  <Card key={lead.id} padding="sm" className={styles.leadCard}>
                    <div className={styles.leadCardHeader}>
                      <h4 className={styles.leadName}>{lead.name}</h4>
                    </div>
                    <p className={styles.leadWebsite}>{lead.website || 'Pas de site'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                      <button 
                        className={styles.moreButton} 
                        disabled={index === 0 || loadingId === lead.id}
                        onClick={() => moveLead(lead.id, lead.status, 'backward')}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button 
                        className={styles.moreButton}
                        disabled={index === COLUMNS.length - 1 || loadingId === lead.id}
                        onClick={() => moveLead(lead.id, lead.status, 'forward')}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </Card>
                ))}
                
                {columnLeads.length === 0 && (
                  <div className={styles.emptyColumn}>
                    Aucun prospect
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
