import { UserProfile } from '../entities/Lead';

export interface IAuthRepository {
  signInWithGoogle(): Promise<void>;
  signInWithGithub(): Promise<void>;
  signInWithEmail(email: string, password: string): Promise<void>;
  signUpWithEmail(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
}
