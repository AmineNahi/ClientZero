"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, MessageSquare, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import styles from './DashboardLayout.module.css';
import { createClient } from '../../infrastructure/supabase/client';

interface DashboardLayoutProps {
  children: React.ReactNode;
  email: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, email }) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = [
    { name: 'Vue d\'ensemble', href: '/dashboard', icon: Home },
    { name: 'Recherche Leads', href: '/dashboard/leads', icon: Users },
    { name: 'Générateur IA', href: '/dashboard/generator', icon: MessageSquare },
    { name: 'CRM (Pipeline)', href: '/dashboard/crm', icon: LayoutDashboard },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <span className={styles.logo}>First Client</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.navItem}>
            <Settings size={20} />
            <span>Paramètres</span>
          </button>
          <button className={`${styles.navItem} ${styles.logout}`} onClick={handleSignOut}>
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            {/* Header placeholder (e.g. Breadcrumbs or User Profile) */}
            <div className={styles.userProfile}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{email}</span>
              <div className={styles.avatar}>{email.charAt(0).toUpperCase()}</div>
            </div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};
