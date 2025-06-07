export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidAccessCode(code: string): boolean {
  return /^\d{16}$/.test(code);
}

export function isValidPin(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}