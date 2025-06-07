import { 
  LoginRequest, 
  RegisterRequest, 
  VerifyPinRequest, 
  AuthResponse, 
  AnonymousRegistrationResponse,
  User 
} from '../types/auth';

// Mock database
const mockUsers: User[] = [];
let mockPinStore: { [email: string]: { pin: string; expires: number } } = {};

// Utility functions
function generateAccessCode(): string {
  return Math.random().toString().slice(2, 18).padStart(16, '0');
}

function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substr(2, 9);
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidAccessCode(code: string): boolean {
  return /^\d{16}$/.test(code);
}

// Mock API implementation
export const mockApi = {
  // Login with email or access code
  async login(request: LoginRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    if (request.email) {
      if (!isValidEmail(request.email)) {
        throw new Error('Invalid email format');
      }

      // For email login, we send a PIN and don't authenticate yet
      const pin = '123456'; // Valid PIN for testing as specified
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      mockPinStore[request.email] = { pin, expires };
      
      // Return a temporary response indicating PIN was sent
      throw new Error('PIN_REQUIRED');
    }

    if (request.accessCode) {
      if (!isValidAccessCode(request.accessCode)) {
        throw new Error('Invalid access code format');
      }

      const user = mockUsers.find(u => u.accessCode === request.accessCode);
      if (!user) {
        throw new Error('Invalid access code');
      }

      return {
        user,
        accessToken: 'mock_token_' + user.id
      };
    }

    throw new Error('Email or access code required');
  },

  // Verify PIN for email login
  async verifyPin(request: VerifyPinRequest): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const storedPin = mockPinStore[request.email];
    if (!storedPin || storedPin.expires < Date.now()) {
      throw new Error('PIN expired or not found');
    }

    if (storedPin.pin !== request.pin) {
      throw new Error('Invalid PIN');
    }

    // Find or create user
    let user = mockUsers.find(u => u.email === request.email);
    if (!user) {
      user = {
        id: generateUserId(),
        email: request.email,
        isAnonymous: false,
        createdAt: new Date().toISOString()
      };
      mockUsers.push(user);
    }

    // Clean up PIN store
    delete mockPinStore[request.email];

    return {
      user,
      accessToken: 'mock_token_' + user.id
    };
  },

  // Register new user
  async register(request: RegisterRequest): Promise<AuthResponse | AnonymousRegistrationResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (request.isAnonymous) {
      // Anonymous registration
      const accessCode = generateAccessCode();
      const user: User = {
        id: generateUserId(),
        isAnonymous: true,
        accessCode,
        createdAt: new Date().toISOString()
      };
      
      mockUsers.push(user);
      
      return {
        accessCode,
        user
      };
    } else if (request.email) {
      // Email registration - check if user already exists
      if (!isValidEmail(request.email)) {
        throw new Error('Invalid email format');
      }

      const existingUser = mockUsers.find(u => u.email === request.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Send PIN for email verification
      const pin = '123456'; // Valid PIN for testing
      const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
      
      mockPinStore[request.email] = { pin, expires };
      
      throw new Error('PIN_REQUIRED');
    }

    throw new Error('Invalid registration request');
  },

  // Mock Google OAuth
  async googleLogin(): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user: User = {
      id: generateUserId(),
      email: 'user@gmail.com',
      isAnonymous: false,
      createdAt: new Date().toISOString()
    };

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === user.email);
    if (existingUser) {
      return {
        user: existingUser,
        accessToken: 'mock_token_' + existingUser.id
      };
    }

    mockUsers.push(user);
    
    return {
      user,
      accessToken: 'mock_token_' + user.id
    };
  },

  // Resend PIN
  async resendPin(email: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!isValidEmail(email)) {
      throw new Error('Invalid email format');
    }

    const pin = '123456'; // Valid PIN for testing
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    mockPinStore[email] = { pin, expires };
  }
};