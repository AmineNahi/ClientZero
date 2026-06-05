import { IAuthRepository } from '../../core/repositories/IAuthRepository';
import { UserProfile } from '../../core/entities/Lead';
import { createClient } from './client';

export class SupabaseAuthRepository implements IAuthRepository {
  private client = createClient();

  async signInWithGoogle(): Promise<void> {
    await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
  }

  async signInWithGithub(): Promise<void> {
    await this.client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
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
