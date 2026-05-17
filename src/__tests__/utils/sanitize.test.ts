import { describe, test, expect } from 'vitest';
import { sanitize, validateEmail, validatePassword } from '../../utils/sanitize';

describe('Utils Functions', () => {

  describe('sanitize()', () => {
    test('removes HTML tags', () => {
      const input = '<h1>Hello</h1>';
      expect(sanitize(input)).toBe('Hello');
    });

    test('removes script tags', () => {
      const input = '<script>alert("hack")</script>';
      expect(sanitize(input)).toBe('alert("hack")');
    });

    test('trims whitespace', () => {
      const input = '   Hello World   ';
      expect(sanitize(input)).toBe('Hello World');
    });

    test('handles empty string', () => {
      expect(sanitize('')).toBe('');
    });

    test('handles no HTML content', () => {
      expect(sanitize('Plain text')).toBe('Plain text');
    });
  });

  describe('validateEmail()', () => {
    test('valid email passes', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    test('invalid email fails (no @)', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    test('invalid email fails (no domain)', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    test('invalid email fails (spaces)', () => {
      expect(validateEmail('test @example.com')).toBe(false);
    });

    test('empty email fails', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('validatePassword()', () => {
    test('valid password (>=8 chars)', () => {
      expect(validatePassword('password123')).toBe(true);
    });

    test('invalid password (<8 chars)', () => {
      expect(validatePassword('12345')).toBe(false);
    });

    test('exactly 8 characters passes', () => {
      expect(validatePassword('12345678')).toBe(true);
    });

    test('empty password fails', () => {
      expect(validatePassword('')).toBe(false);
    });
  });

});