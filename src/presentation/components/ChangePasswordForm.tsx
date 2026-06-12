"use client";

import React, { useState } from 'react';
import { Button } from './Button';
import { updatePasswordAction } from '../../application/actions/authActions';

export const ChangePasswordForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      await updatePasswordAction(newPassword);
      setMessage('Mot de passe mis à jour avec succès.');
      setNewPassword('');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
          Changer de mot de passe
        </Button>
        {message && <span style={{ color: 'var(--brand-primary)', fontSize: '0.85rem' }}>{message}</span>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '300px' }}>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        minLength={6}
        style={{
          padding: '0.5rem 0.75rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--background)',
          color: 'var(--text-primary)',
          outline: 'none',
        }}
      />
      {error && <span style={{ color: 'red', fontSize: '0.85rem' }}>{error}</span>}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)} disabled={isLoading}>
          Annuler
        </Button>
        <Button variant="primary" size="sm" type="submit" isLoading={isLoading}>
          Enregistrer
        </Button>
      </div>
    </form>
  );
};
