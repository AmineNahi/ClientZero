import React from 'react';
import { DashboardLayout } from '../../presentation/components/DashboardLayout';
import { createServerSupabaseClient } from '../../infrastructure/supabase/server';
import { redirect } from 'next/navigation';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardLayout email={user.email || 'User'}>
      {children}
    </DashboardLayout>
  );
}
