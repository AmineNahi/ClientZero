import React from 'react';
import { Card } from '../../../presentation/components/Card';
import { createServerSupabaseClient } from '../../../infrastructure/supabase/server';
import { User, Mail, CreditCard, Shield } from 'lucide-react';
import styles from './settings.module.css';
import { ChangePasswordForm } from '../../../presentation/components/ChangePasswordForm';

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <h1 className={styles.title}>Profil & Paramètres</h1>
        <p className={styles.subtitle}>Gérez vos informations personnelles et vos préférences.</p>
      </div>

      <div className={styles.contentGrid}>
        {/* Informations Personnelles */}
        <Card padding="lg" className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <User className={styles.icon} size={24} />
            <h2 className={styles.sectionTitle}>Informations du compte</h2>
          </div>
          
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Adresse Email</label>
            <div className={styles.valueRow}>
              <Mail size={18} className={styles.inputIcon} />
              <input type="text" value={user.email || ''} readOnly className={styles.input} />
            </div>
            <p className={styles.helpText}>L'email utilisé pour votre connexion.</p>
          </div>
        </Card>

        {/* Abonnement */}
        <Card padding="lg" className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <CreditCard className={styles.icon} size={24} />
            <h2 className={styles.sectionTitle}>Abonnement</h2>
          </div>
          
          <div className={styles.subscriptionBox}>
            <div className={styles.planInfo}>
              <h3>Plan Actuel : <strong>100% Gratuit</strong></h3>
              <p>Vous êtes sur le plan gratuit. Profitez-en pour trouver vos premiers clients sans aucune limite ! 🎉</p>
            </div>
            <div className={styles.badge}>Actif</div>
          </div>
        </Card>

        {/* Sécurité */}
        <Card padding="lg" className={styles.settingsCard}>
          <div className={styles.cardHeader}>
            <Shield className={styles.icon} size={24} />
            <h2 className={styles.sectionTitle}>Sécurité</h2>
          </div>
          
          <div className={styles.securityBox}>
            <p>Mot de passe</p>
            <ChangePasswordForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
