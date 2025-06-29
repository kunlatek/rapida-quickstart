export interface AuthUser {
  userId: string;
  email: string;
  activeRole: string | null;
  availableRoles: string[];
}

export interface AuthStoreType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
}