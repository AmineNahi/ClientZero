"use client";

import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Plus, ChevronRight, ChevronLeft, Trash2, X } from 'lucide-react';
import styles from '../../app/dashboard/crm/crm.module.css';
import { Lead, LeadStatus } from '../../core/entities/Lead';
import { updateLeadStatusAction, deleteLeadAction, addLeadAction } from '../../application/actions/leadActions';
import { Input } from './Input';

const COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: 'a_contacter', title: 'À contacter' },
  { id: 'contacte', title: 'Contacté' },
  { id: 'repondu', title: 'Répondu' },
  { id: 'client', title: 'Client' }
];

export const KanbanBoard = ({ initialLeads }: { initialLeads: Lead[] }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadWebsite, setNewLeadWebsite] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;
    
    setIsAdding(true);
    try {
      const newLead = await addLeadAction(newLeadName, newLeadWebsite, newLeadEmail, '');
      setLeads(prev => [newLead, ...prev]);
      setIsModalOpen(false);
      setNewLeadName('');
      setNewLeadWebsite('');
      setNewLeadEmail('');
    } catch (error) {
      console.error("Failed to add lead manually", error);
      alert("Erreur lors de l'ajout du prospect.");
    } finally {
      setIsAdding(false);
    }
  };

  // Delete Confirmation State
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  const handleDeleteClick = (leadId: string) => {
    setLeadToDelete(leadId);
  };

  const confirmDelete = async () => {
    if (!leadToDelete) return;
    
    setLoadingId(leadToDelete);
    const idToDelete = leadToDelete;
    setLeadToDelete(null); // Close modal immediately

    try {
      setLeads(prev => prev.filter(l => l.id !== idToDelete));
      await deleteLeadAction(idToDelete);
    } catch (e) {
      console.error(e);
      setLeads(initialLeads);
    } finally {
      setLoadingId(null);
    }
  };

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
        <Button leftIcon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Ajouter un lead manuel
        </Button>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem',
            width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            position: 'relative'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{
              position: 'absolute', top: '1rem', right: '1rem', background: 'none', 
              border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'
            }}>
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Nouveau Prospect</h2>
            <form onSubmit={handleAddManualLead} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input 
                label="Nom de l'entreprise ou contact" 
                placeholder="Ex: Boulangerie Dubois" 
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                required
              />
              <Input 
                label="Site Web (Optionnel)" 
                type="url"
                placeholder="https://..." 
                value={newLeadWebsite}
                onChange={(e) => setNewLeadWebsite(e.target.value)}
              />
              <Input 
                label="Email (Optionnel)" 
                type="email"
                placeholder="contact@exemple.com" 
                value={newLeadEmail}
                onChange={(e) => setNewLeadEmail(e.target.value)}
              />
              <Button type="submit" variant="primary" fullWidth isLoading={isAdding}>
                Ajouter au CRM
              </Button>
            </form>
          </div>
        </div>
      )}

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
                    <div className={styles.leadCardHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 className={styles.leadName} style={{ margin: 0, paddingRight: '1rem' }}>{lead.name}</h4>
                      <button 
                        onClick={() => handleDeleteClick(lead.id)}
                        disabled={loadingId === lead.id}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                        title="Supprimer ce lead"
                      >
                        <Trash2 size={14} />
                      </button>
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

      {leadToDelete && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, 
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'var(--surface)', padding: '2rem', borderRadius: '1rem',
            width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <Trash2 size={40} color="var(--danger)" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--text-primary)' }}>Supprimer ce prospect ?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Cette action est irréversible. Toutes les données associées à ce prospect seront perdues.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button variant="secondary" fullWidth onClick={() => setLeadToDelete(null)}>
                Annuler
              </Button>
              <Button variant="danger" fullWidth onClick={confirmDelete} isLoading={loadingId === leadToDelete}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
