
// Security utility functions

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const generateSecureToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const isSessionValid = (): boolean => {
  const sessionExpiry = localStorage.getItem("sessionExpiry");
  if (!sessionExpiry) return false;
  
  const expiryTime = parseInt(sessionExpiry);
  return Date.now() < expiryTime;
};

export const clearSecureStorage = (): void => {
  localStorage.removeItem("user");
  localStorage.removeItem("sessionExpiry");
  localStorage.removeItem("wishlist");
  localStorage.removeItem("userPreferences");
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

// Admin user validation
export const isAdminUser = (email: string, password: string): boolean => {
  return email === "admin@admin.com" && password === "administrador";
};

export const createAdminSession = () => {
  const adminUser = {
    id: "admin",
    name: "Administrador",
    email: "admin@admin.com",
    role: "admin",
    sessionToken: generateSecureToken()
  };
  
  localStorage.setItem("user", JSON.stringify(adminUser));
  localStorage.setItem("sessionExpiry", (Date.now() + 24 * 60 * 60 * 1000).toString()); // 24 hours
  
  return adminUser;
};

// Rate limiting helper (simple in-memory implementation)
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return false;
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return false;
    }

    // Increment attempts
    userAttempts.count += 1;
    userAttempts.lastAttempt = now;

    return userAttempts.count > this.maxAttempts;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;

    const timeLeft = this.windowMs - (Date.now() - userAttempts.lastAttempt);
    return Math.max(0, timeLeft);
  }
}

export const loginRateLimiter = new RateLimiter();
