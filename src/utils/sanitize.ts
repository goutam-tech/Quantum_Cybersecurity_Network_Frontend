/**
 * Sanitizes input strings by removing HTML tags and trimming whitespace.
 */
export const sanitize = (str: string): string => {
  return str.replace(/<[^>]*>?/gm, '').trim();
};

/**
 * Validates email format.
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates password strength (min 8 characters).
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 8;
};
