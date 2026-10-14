/**
 * Universal Cookie Management Utility for Zahra Store
 * Adheres to SOLID principles: Single Responsibility for cookie persistence.
 */

export interface CookieOptions {
  days?: number;
  path?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export const CookieStorage = {
  /**
   * Set a cookie in the client browser
   */
  set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return;

    const { days = 7, path = '/', secure = false, sameSite = 'Lax' } = options;
    let expires = '';

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }

    const secureFlag = secure || (typeof window !== 'undefined' && window.location.protocol === 'https:') ? '; Secure' : '';
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}${expires}; path=${path}${secureFlag}; SameSite=${sameSite}`;
  },

  /**
   * Retrieve a cookie by name
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = `${encodeURIComponent(name)}=`;
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  },

  /**
   * Delete a cookie
   */
  remove(name: string, path: string = '/'): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; Max-Age=-99999999; path=${path}; SameSite=Lax`;
  },
};
