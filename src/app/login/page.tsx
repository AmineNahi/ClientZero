"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../presentation/components/Button';
import { Input } from '../../presentation/components/Input';
import { Card } from '../../presentation/components/Card';
import styles from './login.module.css';
import { SupabaseAuthRepository } from '../../infrastructure/supabase/SupabaseAuthRepository';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  // Use useMemo to avoid recreating the repository on every render
  const authRepo = React.useMemo(() => new SupabaseAuthRepository(), []);



  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        await authRepo.signUpWithEmail(email, password);
        setErrorMsg('Vérifiez vos emails pour confirmer votre inscription.');
      } else {
        await authRepo.signInWithEmail(email, password);
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <Card padding="lg" className={styles.loginCard}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>ClientZero</Link>
          <h1 className={styles.title}>{isSignUp ? 'Créer un compte 👋' : 'Bon retour 👋'}</h1>
          <p className={styles.subtitle}>
            {isSignUp ? 'Inscrivez-vous pour commencer votre prospection.' : 'Connectez-vous pour accéder à votre espace de prospection.'}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleEmailAuth}>
          {errorMsg && <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>{errorMsg}</p>}
          <Input
            label="Adresse Email"
            type="email"
            placeholder="vous@exemple.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isSignUp && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '1rem', marginTop: '0.5rem' }}>
              <input
                type="checkbox"
                id="consent"
                required
                style={{ marginTop: '0.25rem', cursor: 'pointer' }}
              />
              <label htmlFor="consent" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                J'accepte les <Link href="/mentions-legales" style={{ color: 'var(--brand-primary)' }}>mentions légales</Link> et la <Link href="/confidentialite" style={{ color: 'var(--brand-primary)' }}>politique de confidentialité</Link>.
              </label>
            </div>
          )}
          <Button fullWidth type="submit" disabled={isLoading}>
            {isSignUp ? "S'inscrire" : "Se connecter"}
          </Button>
        </form>



        <p className={styles.footerText}>
          {isSignUp ? 'Déjà un compte ?' : 'Pas encore de compte ?'}{' '}
          <button
            type="button"
            className={styles.link}
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit' }}
          >
            {isSignUp ? 'Connectez-vous' : 'Inscrivez-vous'}
          </button>
        </p>
      </Card>
    </main>
  );
}
