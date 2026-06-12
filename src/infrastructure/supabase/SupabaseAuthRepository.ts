import { IAuthRepository } from '../../core/repositories/IAuthRepository';
import { UserProfile } from '../../core/entities/Lead';
import { createClient } from './client';

export class SupabaseAuthRepository implements IAuthRepository {
  private client = createClient();

  async signInWithEmail(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async signUpWithEmail(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }

  async signInWithGoogle(): Promise<void> {
    await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  async signInWithGithub(): Promise<void> {
    await this.client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  async getCurrentUser(): Promise<UserProfile | null> {
    const { data: { session } } = await this.client.auth.getSession();
    if (!session?.user) return null;

    const { data: profile } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return profile as UserProfile | null;
  }
}
