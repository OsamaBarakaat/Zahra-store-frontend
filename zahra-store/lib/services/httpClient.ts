import { CookieStorage } from '@/lib/utils/cookies';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  throwOnError?: boolean;
}

export class HttpClient {
  private baseUrl: string;
  private defaultStoreKey: string;

  constructor(baseUrl?: string, defaultStoreKey?: string) {
    this.baseUrl = baseUrl || process.env.NEXT_PUBLIC_API_URL || '';
    this.defaultStoreKey = defaultStoreKey || process.env.NEXT_PUBLIC_STORE_KEY || 'zahra-storefront-key-2026';
  }

  /**
   * Retrieves active auth token: checks cookies first, then fallback to Storefront key
   */
  public getAuthToken(): string {
    const cookieToken = CookieStorage.get('zahra_token');
    if (cookieToken) return cookieToken;
    return this.defaultStoreKey;
  }

  /**
   * Sets token in cookie and persists for 7 days
   */
  public setAuthToken(token: string): void {
    CookieStorage.set('zahra_token', token, { days: 7 });
  }

  /**
   * Clears token from cookie
   */
  public clearAuthToken(): void {
    CookieStorage.remove('zahra_token');
  }

  /**
   * Builds headers with cookie token or storefront key
   */
  public getHeaders(customHeaders: HeadersInit = {}, isFormData: boolean = false): HeadersInit {
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
      headers['Accept'] = 'application/json';
    }

    const token = this.getAuthToken();
    if (token) {
      headers['x-api-key'] = token;
      headers['Authorization'] = `Bearer ${token}`;
    }

    return { ...headers, ...(customHeaders as Record<string, string>) };
  }

  /**
   * Universal fetch with base URL resolution and query parameter serialization
   */
  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T | null> {
    if (!this.baseUrl) return null;

    const { params, headers, ...restOptions } = options;
    let url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
      const qs = searchParams.toString();
      if (qs) url += (url.includes('?') ? '&' : '?') + qs;
    }

    try {
      const isFormData = typeof FormData !== 'undefined' && restOptions.body instanceof FormData;
      const res = await fetch(url, {
        ...restOptions,
        headers: this.getHeaders(headers, isFormData),
      });

      if (!res.ok) {
        let errorMsg = `HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          if (errJson?.message) {
            errorMsg = Array.isArray(errJson.message) ? errJson.message.join(', ') : errJson.message;
          }
        } catch (_) {}
        console.warn(`HTTP ${res.status} on ${url}:`, errorMsg);
        if (options.throwOnError) {
          throw new Error(errorMsg);
        }
        return null;
      }

      return (await res.json()) as T;
    } catch (error) {
      if (options.throwOnError) {
        throw error;
      }
      console.warn(`Fetch error on ${url}:`, error);
      return null;
    }
  }

  public get<T>(endpoint: string, params?: Record<string, any>, init?: RequestOptions): Promise<T | null> {
    return this.request<T>(endpoint, { method: 'GET', params, ...init });
  }

  public post<T>(endpoint: string, body?: any, init?: RequestOptions): Promise<T | null> {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      ...init,
    });
  }

  public put<T>(endpoint: string, body?: any, init?: RequestOptions): Promise<T | null> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
      ...init,
    });
  }

  public delete<T>(endpoint: string, init?: RequestOptions): Promise<T | null> {
    return this.request<T>(endpoint, { method: 'DELETE', ...init });
  }
}

export const httpClient = new HttpClient();
