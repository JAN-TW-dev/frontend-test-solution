import { describe, it, expect, beforeEach } from 'vitest';
import { mockApi } from '../mockApi';

describe('mockApi', () => {
  beforeEach(() => {
    // Clear any stored state before each test
    localStorage.clear();
  });

  describe('login', () => {
    it('throws PIN_REQUIRED for email login', async () => {
      await expect(mockApi.login({ email: 'test@example.com' }))
        .rejects.toThrow('PIN_REQUIRED');
    });

    it('throws error for invalid email format', async () => {
      await expect(mockApi.login({ email: 'invalid-email' }))
        .rejects.toThrow('Invalid email format');
    });

    it('throws error for invalid access code format', async () => {
      await expect(mockApi.login({ accessCode: '123' }))
        .rejects.toThrow('Invalid access code format');
    });

    it('throws error for non-existent access code', async () => {
      await expect(mockApi.login({ accessCode: '1234567890123456' }))
        .rejects.toThrow('Invalid access code');
    });
  });

  describe('verifyPin', () => {
    it('verifies correct PIN', async () => {
      // First trigger PIN generation
      try {
        await mockApi.login({ email: 'test@example.com' });
      } catch (error) {
        // Expected PIN_REQUIRED error
      }

      const response = await mockApi.verifyPin({
        email: 'test@example.com',
        pin: '123456'
      });

      expect(response.user).toBeDefined();
      expect(response.user.email).toBe('test@example.com');
      expect(response.accessToken).toBeDefined();
    });

    it('throws error for incorrect PIN', async () => {
      // First trigger PIN generation
      try {
        await mockApi.login({ email: 'test@example.com' });
      } catch (error) {
        // Expected PIN_REQUIRED error
      }

      await expect(mockApi.verifyPin({
        email: 'test@example.com',
        pin: '000000'
      })).rejects.toThrow('Invalid PIN');
    });
  });

  describe('register', () => {
    it('generates anonymous access code', async () => {
      const response = await mockApi.register({ isAnonymous: true });
      
      expect('accessCode' in response).toBe(true);
      if ('accessCode' in response) {
        expect(response.accessCode).toMatch(/^\d{16}$/);
        expect(response.user.isAnonymous).toBe(true);
      }
    });

    it('throws PIN_REQUIRED for email registration', async () => {
      await expect(mockApi.register({ email: 'test@example.com' }))
        .rejects.toThrow('PIN_REQUIRED');
    });
  });

  describe('googleLogin', () => {
    it('returns user and access token', async () => {
      const response = await mockApi.googleLogin();
      
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe('user@gmail.com');
      expect(response.accessToken).toBeDefined();
    });
  });
});