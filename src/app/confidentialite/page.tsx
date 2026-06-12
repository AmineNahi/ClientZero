import React from 'react';
import Link from 'next/link';

export default function PolitiqueConfidentialite() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', fontFamily: 'var(--font-geist-sans)' }}>
      <Link href="/" style={{ color: 'var(--brand-primary)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>&larr; Retour à l'accueil</Link>

      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Politique de Confidentialité (RGPD)</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>1. Données collectées</h2>
        <p>
          Dans le cadre de l'utilisation de l'application <strong>ClientZero</strong>, nous collectons les données suivantes :<br />
          - Votre adresse email (lors de l'inscription).<br />
          - Les données des prospects (leads) que vous ajoutez ou générez depuis l'application (nom, email public, numéro de téléphone public, site web).
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>2. Utilisation des données</h2>
        <p>
          Les données collectées sont utilisées exclusivement pour :<br />
          - Vous permettre d'accéder à votre compte et utiliser nos services.<br />
          - Sauvegarder vos prospects pour votre utilisation personnelle au sein du CRM.<br />
          - Générer des messages personnalisés via des partenaires d'Intelligence Artificielle (vos requêtes sont transmises à notre partenaire IA, actuellement Groq/OpenAI, sans utiliser vos données à des fins d'entraînement selon leurs politiques respectives).
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>3. Conservation des données</h2>
        <p>
          Vos données et celles de vos prospects sont conservées tant que votre compte est actif. Vous pouvez à tout moment demander la suppression complète de votre compte et de toutes les données associées en nous contactant à l'adresse email mentionnée dans nos mentions légales.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>4. Vos droits (RGPD)</h2>
        <p>
          Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de portabilité et d'effacement de vos données. Pour exercer ces droits, veuillez nous contacter par email.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>5. Sécurité</h2>
        <p>
          Vos données sont stockées de manière sécurisée grâce à notre partenaire d'infrastructure Supabase, qui respecte les plus hauts standards de sécurité du marché. Les mots de passe sont hachés et sécurisés de bout en bout.
        </p>
      </section>
    </div>
  );
}
