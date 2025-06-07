export interface User {
  id: string;
  email?: string;
  isAnonymous: boolean;
  accessCode?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email?: string;
  accessCode?: string;
}

export interface RegisterRequest {
  email?: string;
  isAnonymous?: boolean;
}

export interface VerifyPinRequest {
  email: string;
  pin: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface AnonymousRegistrationResponse {
  accessCode: string;
  user: User;
}