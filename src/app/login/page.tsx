"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '../../presentation/components/Button';
import { Input } from '../../presentation/components/Input';
import { Card } from '../../presentation/components/Card';
import styles from './login.module.css';
import { createClient } from '../../infrastructure/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <main className={styles.main}>
      <Card padding="lg" className={styles.loginCard}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>First Client</Link>
          <h1 className={styles.title}>Bon retour 👋</h1>
          <p className={styles.subtitle}>Connectez-vous pour accéder à votre espace de prospection.</p>
        </div>

        <form className={styles.form}>
          <Input 
            label="Adresse Email" 
            type="email" 
            placeholder="vous@exemple.com" 
            required
          />
          <Input 
            label="Mot de passe" 
            type="password" 
            placeholder="••••••••" 
            required
          />
          <Button fullWidth type="button" disabled={isLoading}>Se connecter</Button>
        </form>

        <div className={styles.divider}>
          <span>Ou continuez avec</span>
        </div>

        <div className={styles.oauthGroup}>
          <Button variant="secondary" fullWidth type="button" onClick={() => handleOAuth('google')} disabled={isLoading}>
            Google
          </Button>
          <Button variant="secondary" fullWidth type="button" onClick={() => handleOAuth('github')} disabled={isLoading}>
            GitHub
          </Button>
        </div>

        <p className={styles.footerText}>
          Pas encore de compte ? <Link href="#" className={styles.link}>Inscrivez-vous</Link>
        </p>
      </Card>
    </main>
  );
}
