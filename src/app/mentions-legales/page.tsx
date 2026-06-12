import React from 'react';
import Link from 'next/link';

export default function MentionsLegales() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'var(--font-geist-sans)' }}>
      <Link href="/" style={{ color: 'var(--brand-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>&larr; Retour à l'accueil</Link>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Mentions Légales</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Éditeur du site</h2>
        <p>
          Le site <strong>ClientZero</strong> est édité par :<br />
          Nahi Amine<br />
          Statut juridique : Particulier (Projet personnel / Portfolio)<br />
          Email de contact : nahiamine1@gmail.com
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Directeur de la publication</h2>
        <p>Le Directeur de la publication est : Nahi Amine.</p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Hébergement</h2>
        <p>
          Le site est hébergé par :<br />
          Vercel Inc.<br />
          340 S Lemon Ave #4133<br />
          Walnut, CA 91789, USA<br />
          <a href="https://vercel.com" style={{ color: 'var(--brand-primary)' }}>https://vercel.com</a>
        </p>
        <p style={{ marginTop: '1rem' }}>
          La base de données et l'authentification sont fournies par :<br />
          Supabase Inc.<br />
          <a href="https://supabase.com" style={{ color: 'var(--brand-primary)' }}>https://supabase.com</a>
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Propriété intellectuelle</h2>
        <p>
          L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.
        </p>
      </section>
    </div>
  );
}
