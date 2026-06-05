"use client";

import React, { useState } from 'react';
import { Card } from '../../../presentation/components/Card';
import { Input } from '../../../presentation/components/Input';
import { Button } from '../../../presentation/components/Button';
import { Search, MapPin, Plus, Check } from 'lucide-react';
import styles from './leads.module.css';
import { addLeadAction } from '../../../application/actions/leadActions';

export default function LeadsPage() {
  const [addedLeads, setAddedLeads] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const mockLeads = [
    { id: 'mock-1', name: 'Restaurant Le Petit Chef', website: 'lepetitchef.fr', email: 'contact@lepetitchef.fr' },
    { id: 'mock-2', name: 'Boulangerie Martin', website: 'boulangerie-martin.com', email: 'hello@boulangerie-martin.com' },
    { id: 'mock-3', name: 'Café de la Place', website: 'N/A', email: 'info@cafedelaplace.fr' },
  ];

  const handleAddLead = async (lead: any) => {
    setIsLoading(prev => ({ ...prev, [lead.id]: true }));
    try {
      await addLeadAction(lead.name, lead.website === 'N/A' ? '' : lead.website, lead.email);
      setAddedLeads(prev => ({ ...prev, [lead.id]: true }));
    } catch (error) {
      console.error("Failed to add lead", error);
    } finally {
      setIsLoading(prev => ({ ...prev, [lead.id]: false }));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Recherche de Leads</h1>
        <p className={styles.subtitle}>Trouvez de nouveaux prospects en utilisant des mots-clés.</p>
      </div>

      <Card padding="md" className={styles.searchCard}>
        <div className={styles.searchForm}>
          <Input 
            icon={<Search size={18} />}
            placeholder="Mots-clés (ex: restaurant, coach)"
            className={styles.searchInput}
          />
          <Input 
            icon={<MapPin size={18} />}
            placeholder="Localisation (ex: Paris)"
            className={styles.searchInput}
          />
          <Button variant="primary">Rechercher</Button>
        </div>
      </Card>

      <div className={styles.resultsSection}>
        <h2 className={styles.resultsTitle}>Résultats ({mockLeads.length})</h2>
        <div className={styles.leadsGrid}>
          {mockLeads.map((lead) => (
            <Card key={lead.id} padding="md" className={styles.leadCard}>
              <div className={styles.leadInfo}>
                <h3>{lead.name}</h3>
                <p className={styles.leadMeta}>🌐 {lead.website}</p>
                <p className={styles.leadMeta}>📧 {lead.email}</p>
              </div>
              <div className={styles.leadActions}>
                <Button 
                  size="sm" 
                  variant={addedLeads[lead.id] ? "ghost" : "secondary"}
                  leftIcon={addedLeads[lead.id] ? <Check size={16} className={styles.successIcon} /> : <Plus size={16} />}
                  onClick={() => handleAddLead(lead)}
                  isLoading={isLoading[lead.id]}
                  disabled={addedLeads[lead.id]}
                >
                  {addedLeads[lead.id] ? "Ajouté" : "Ajouter au CRM"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
