"use server";

import { createServerSupabaseClient } from '../../infrastructure/supabase/server';

export async function updatePasswordAction(newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Utilisateur non connecté.");
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  });

  if (error) {
    console.error("Erreur mise à jour mot de passe:", error);
    throw new Error(error.message);
  }

  return true;
}
