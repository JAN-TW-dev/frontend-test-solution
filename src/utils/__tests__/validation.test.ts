import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidAccessCode, isValidPin } from '../validation';

describe('validation utilities', () => {
  describe('isValidEmail', () => {
    it('validates correct email formats', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user+tag@domain.co.uk')).toBe(true);
      expect(isValidEmail('firstname.lastname@company.org')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidAccessCode', () => {
    it('validates 16-digit access codes', () => {
      expect(isValidAccessCode('1234567890123456')).toBe(true);
      expect(isValidAccessCode('0000000000000000')).toBe(true);
    });

    it('rejects invalid access codes', () => {
      expect(isValidAccessCode('123456789012345')).toBe(false); // 15 digits
      expect(isValidAccessCode('12345678901234567')).toBe(false); // 17 digits
      expect(isValidAccessCode('123456789012345a')).toBe(false); // contains letter
      expect(isValidAccessCode('')).toBe(false);
    });
  });

  describe('isValidPin', () => {
    it('validates 6-digit PINs', () => {
      expect(isValidPin('123456')).toBe(true);
      expect(isValidPin('000000')).toBe(true);
    });

    it('rejects invalid PINs', () => {
      expect(isValidPin('12345')).toBe(false); // 5 digits
      expect(isValidPin('1234567')).toBe(false); // 7 digits
      expect(isValidPin('12345a')).toBe(false); // contains letter
      expect(isValidPin('')).toBe(false);
    });
  });
});