import { UserProfile } from '../entities/Lead';

export interface IAuthRepository {
  signInWithGoogle(): Promise<void>;
  signInWithGithub(): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
}
