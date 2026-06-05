import React from 'react';
import { Card } from '../../presentation/components/Card';
import { Button } from '../../presentation/components/Button';
import { Target, Send, Reply, TrendingUp } from 'lucide-react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  return (
    <div className="animate-fade-in">
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Vue d'ensemble</h1>
          <p className={styles.subtitle}>Voici un résumé de ton activité de prospection.</p>
        </div>
        <Button>Nouveau Lead</Button>
      </div>

      <div className={styles.kpiGrid}>
        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Objectif</span>
            <Target size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>1 / 3</div>
          <div className={styles.kpiTrend}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: '33%' }}></div>
            </div>
            <span className={styles.kpiSubtext}>clients signés</span>
          </div>
        </Card>

        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Messages Envoyés</span>
            <Send size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>12</div>
          <div className={styles.kpiTrend}>
            <span className={styles.kpiSubtext}>cette semaine</span>
          </div>
        </Card>

        <Card padding="md" className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiTitle}>Taux de Réponse</span>
            <Reply size={20} className={styles.kpiIcon} />
          </div>
          <div className={styles.kpiValue}>25%</div>
          <div className={styles.kpiTrend}>
            <TrendingUp size={16} className={styles.trendUp} />
            <span className={styles.trendUp}>+5%</span>
            <span className={styles.kpiSubtext}>vs semaine pro.</span>
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
          <Button variant="primary">Trouver des leads</Button>
        </Card>
      </div>
    </div>
  );
}
