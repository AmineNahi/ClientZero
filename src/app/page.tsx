import React from 'react';
import Link from 'next/link';
import { Button } from '../presentation/components/Button';
import { Card } from '../presentation/components/Card';
import { ArrowRight, Target, MessageSquare, LineChart } from 'lucide-react';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>First Client</div>
        <nav className={styles.nav}>
          <Link href="/login" className={styles.navLink}>Connexion</Link>
          <Link href="/login">
            <Button size="sm">Essayer gratuitement</Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} animate-fade-in`}>
            Trouve tes premiers clients freelance <span className={styles.highlight}>sans galérer.</span>
          </h1>
          <p className={styles.subtitle}>
            L'outil ultra-simple pour les étudiants et freelances débutants.
            Organise ta prospection, génère des messages efficaces et signe tes 3 premiers clients.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/login">
              <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                Démarrer maintenant
              </Button>
            </Link>
            <p className={styles.freeText}>Sans carte de crédit • 10 leads gratuits</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresGrid}>
          <Card padding="lg" className={styles.featureCard}>
            <div className={styles.featureIcon}><Target size={24} /></div>
            <h3>Recherche de Leads</h3>
            <p>Trouve rapidement des prospects qualifiés par mots-clés et localisation.</p>
          </Card>
          <Card padding="lg" className={styles.featureCard}>
            <div className={styles.featureIcon}><MessageSquare size={24} /></div>
            <h3>Messages par IA</h3>
            <p>Ne sais plus "quoi dire". Notre IA génère un message d'approche prêt à envoyer.</p>
          </Card>
          <Card padding="lg" className={styles.featureCard}>
            <div className={styles.featureIcon}><LineChart size={24} /></div>
            <h3>Suivi Ultra-Simple</h3>
            <p>Un mini-CRM pour savoir exactement où tu en es avec chaque prospect.</p>
          </Card>
        </div>
      </section>
    </main>
  );
}
