import React from 'react';
import Link from 'next/link';
import { Card } from '../../presentation/components/Card';
import { Button } from '../../presentation/components/Button';
import { Target, Send, Reply, TrendingUp } from 'lucide-react';
import styles from './dashboard.module.css';
import { fetchLeadsAction } from '../../application/actions/leadActions';

export default async function DashboardPage() {
  let leads = [];
  try {
    leads = await fetchLeadsAction();
  } catch (error) {
    console.error("Failed to fetch leads for dashboard", error);
  }

  // Calcul des KPIs
  const totalClients = leads.filter(l => l.status === 'client').length;
  
  // On considère comme "message envoyé" les leads qui ont été contactés, qui ont répondu, ou qui sont clients.
  const leadsContacted = leads.filter(l => l.status === 'contacte' || l.status === 'repondu' || l.status === 'client');
  const totalMessages = leadsContacted.length;
  
  // Taux de réponse = (leads ayant répondu ou étant clients) / (leads contactés)
  const leadsReplied = leads.filter(l => l.status === 'repondu' || l.status === 'client');
  const responseRate = totalMessages > 0 ? Math.round((leadsReplied.length / totalMessages) * 100) : 0;

  // Progression vers l'objectif (ex: 3 clients)
  const targetClients = 3;
  const progressPercent = Math.min(100, Math.round((totalClients / targetClients) * 100));

  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vue d'ensemble</h1>
          <p className={styles.subtitle}>Voici un résumé de ton activité de prospection.</p>
        </div>
        <Link href="/dashboard/leads">
          <Button>Nouveau Lead</Button>
        </Link>
      </div>

      <div className={styles.kpiGrid}>
        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Objectif</span>
            <Target size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{totalClients} / {targetClients}</div>
          <div className={styles.kpiTrend}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className={styles.kpiSubtext}>clients signés</span>
          </div>
        </Card>

        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Messages Envoyés</span>
            <Send size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{totalMessages}</div>
          <div className={styles.kpiTrend}>
            <span className={styles.kpiSubtext}>au total</span>
          </div>
        </Card>

        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Taux de Réponse</span>
            <Reply size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>{responseRate}%</div>
          <div className={styles.kpiTrend}>
            {responseRate > 0 && <TrendingUp size={16} className={styles.trendUp} />}
            <span className={styles.kpiSubtext}>sur les {totalMessages} envois</span>
          </div>
        </Card>
      </div>

      <div className={styles.actionPlanSection}>
        <h2 className={styles.sectionTitle}>Plan d'action quotidien</h2>
        <Card padding="lg" className={styles.actionCard}>
          <div className={styles.actionIcon}>🎯</div>
          <div className={styles.actionContent}>
            <h3>Envoie 5 messages aujourd'hui</h3>
            <p>La régularité est la clé. Trouve de nouveaux leads et génère des messages pour atteindre ton objectif.</p>
          </div>
          <Link href="/dashboard/leads">
            <Button variant="primary">Trouver des leads</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
