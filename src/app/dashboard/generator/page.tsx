"use client";

import React, { useState } from 'react';
import { Card } from '../../../presentation/components/Card';
import { Input } from '../../../presentation/components/Input';
import { Button } from '../../../presentation/components/Button';
import { Wand2, Copy, Check } from 'lucide-react';
import styles from './generator.module.css';
import { generateMessageAction } from '../../../application/actions/aiActions';

export default function GeneratorPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [clientType, setClientType] = useState('');
  const [service, setService] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientType || !service) return;

    setIsGenerating(true);
    setErrorMsg('');
    
    try {
      const result = await generateMessageAction(clientType, service);
      setGeneratedMessage(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Une erreur est survenue lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Générateur de Message (IA)</h1>
        <p className={styles.subtitle}>Générez des messages d'approche personnalisés et ultra-efficaces.</p>
      </div>

      <div className={styles.contentGrid}>
        {/* Formulaire */}
        <Card padding="md" className={styles.formCard}>
          <h2 className={styles.sectionTitle}>Contexte du Lead</h2>
          <form className={styles.form} onSubmit={handleGenerate}>
            <Input 
              label="Type de client" 
              placeholder="ex: Propriétaire de restaurant"
              value={clientType}
              onChange={(e) => setClientType(e.target.value)}
              required
            />
            <div className={styles.inputGroup}>
              <label className={styles.label}>Service proposé</label>
              <textarea 
                className={styles.textarea}
                placeholder="ex: Création de site web vitrine avec menu en ligne"
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
                rows={3}
              />
            </div>
            
            {errorMsg && (
              <div style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {errorMsg}
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              isLoading={isGenerating}
              leftIcon={<Wand2 size={18} />}
            >
              Générer le message
            </Button>
          </form>
        </Card>

        {/* Résultat */}
        <Card padding="md" className={styles.resultCard}>
          <h2 className={styles.sectionTitle}>Résultat</h2>
          {generatedMessage ? (
            <div className={styles.resultContainer}>
              <div className={styles.messageBox}>
                {generatedMessage}
              </div>
              <Button 
                variant="secondary" 
                fullWidth 
                leftIcon={isCopied ? <Check size={18} className={styles.successIcon} /> : <Copy size={18} />}
                onClick={handleCopy}
              >
                {isCopied ? "Copié !" : "Copier le message"}
              </Button>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Wand2 size={48} className={styles.emptyIcon} />
              <p>Remplissez le formulaire à gauche pour générer un message d'approche sur-mesure.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
