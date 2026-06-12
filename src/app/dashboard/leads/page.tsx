"use client";

import React, { useState } from 'react';
import { Card } from '../../../presentation/components/Card';
import { Input } from '../../../presentation/components/Input';
import { Button } from '../../../presentation/components/Button';
import { Search, MapPin, Plus, Check } from 'lucide-react';
import styles from './leads.module.css';
import { addLeadAction } from '../../../application/actions/leadActions';
import { searchLeadsAction } from '../../../application/actions/searchActions';
import { SearchResultLead } from '../../../infrastructure/osm/NominatimService';

export default function LeadsPage() {
  const [addedLeads, setAddedLeads] = useState<Record<string, boolean>>({});
  const [isAdding, setIsAdding] = useState<Record<string, boolean>>({});
  
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [leads, setLeads] = useState<SearchResultLead[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query && !location) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await searchLeadsAction(query, location);
      setLeads(results);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddLead = async (lead: SearchResultLead) => {
    setIsAdding(prev => ({ ...prev, [lead.id]: true }));
    try {
      let initialNotes = '';
      if (lead.phone) initialNotes += `Tél: ${lead.phone}\n`;
      if (lead.address) initialNotes += `Adresse: ${lead.address}\n`;

      await addLeadAction(
        lead.name, 
        lead.website || '', 
        lead.email || '',
        initialNotes.trim()
      );
      setAddedLeads(prev => ({ ...prev, [lead.id]: true }));
    } catch (error) {
      console.error("Failed to add lead", error);
    } finally {
      setIsAdding(prev => ({ ...prev, [lead.id]: false }));
    }
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Recherche de Leads</h1>
        <p className={styles.subtitle}>Trouvez de nouveaux prospects via OpenStreetMap.</p>
      </div>

      <Card padding="md" className={styles.searchCard}>
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <Input 
            icon={<Search size={18} />}
            placeholder="Mots-clés (ex: restaurant, boulangerie)"
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Input 
            icon={<MapPin size={18} />}
            placeholder="Localisation (ex: Paris)"
            className={styles.searchInput}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Button variant="primary" type="submit" isLoading={isSearching}>
            Rechercher
          </Button>
        </form>
      </Card>

      {hasSearched && (
        <div className={styles.resultsSection}>
          <h2 className={styles.resultsTitle}>
            Résultats ({leads.length})
          </h2>
          
          {leads.length > 0 ? (
            <div className={styles.leadsGrid}>
              {leads.map((lead) => (
                <Card key={lead.id} padding="md" className={styles.leadCard}>
                  <div className={styles.leadInfo}>
                    <h3>{lead.name}</h3>
                    <p className={styles.leadMeta} title={lead.address || ''}>
                      📍 {lead.address ? (lead.address.length > 40 ? lead.address.substring(0, 40) + '...' : lead.address) : 'N/A'}
                    </p>
                    {lead.website && <p className={styles.leadMeta}>🌐 <a href={lead.website} target="_blank" rel="noreferrer" style={{color: 'inherit', textDecoration: 'underline'}}>{lead.website}</a></p>}
                    {lead.email && <p className={styles.leadMeta}>✉️ {lead.email}</p>}
                    {lead.phone && <p className={styles.leadMeta}>📞 {lead.phone}</p>}
                  </div>
                  <div className={styles.leadActions}>
                    <Button 
                      size="sm" 
                      variant={addedLeads[lead.id] ? "ghost" : "secondary"}
                      leftIcon={addedLeads[lead.id] ? <Check size={16} className={styles.successIcon} /> : <Plus size={16} />}
                      onClick={() => handleAddLead(lead)}
                      isLoading={isAdding[lead.id]}
                      disabled={addedLeads[lead.id]}
                    >
                      {addedLeads[lead.id] ? "Ajouté" : "Ajouter au CRM"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            !isSearching && (
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                Aucun résultat trouvé pour cette recherche. Essayez d'autres mots-clés.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
