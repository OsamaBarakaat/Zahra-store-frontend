import { Product, Category, Order, CustomerInfo, ShippingAddress, PaymentMethod, User } from "@/lib/types";
import { products, getProductBySlug, getFeaturedProducts, getSaleProducts, getProductsByCategory, searchProducts } from "@/lib/data/products";
import { categories, getCategoryBySlug } from "@/lib/data/categories";
import { httpClient } from "./httpClient";

/**
 * Re-export HttpClient & Cookie Storage for clean access
 */
export { httpClient } from "./httpClient";
export { CookieStorage } from "@/lib/utils/cookies";

/**
 * ── 1. PRODUCT SERVICE (Single Responsibility: Products Data) ──
 */
export const ProductService = {
  async getAll(): Promise<Product[]> {
    const data = await httpClient.get<Product[]>("/products", undefined, { next: { revalidate: 60 } });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return products;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const data = await httpClient.get<Product>(`/products/${slug}`, undefined, { next: { revalidate: 60 } });
    if (data) return data;
    return getProductBySlug(slug) || null;
  },

  async getFeatured(): Promise<Product[]> {
    const data = await httpClient.get<Product[]>("/products/featured", undefined, { next: { revalidate: 60 } });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return getFeaturedProducts();
  },

  async getSale(): Promise<Product[]> {
    const data = await httpClient.get<Product[]>("/products/sale", undefined, { next: { revalidate: 60 } });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return getSaleProducts();
  },

  async getByCategory(categorySlug: string): Promise<Product[]> {
    const data = await httpClient.get<Product[]>(`/categories/${categorySlug}/products`, undefined, { next: { revalidate: 60 } });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return getProductsByCategory(categorySlug);
  },

  async search(query: string): Promise<Product[]> {
    const data = await httpClient.get<Product[]>("/search", { q: query });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return searchProducts(query);
  },
};

/**
 * ── 2. CATEGORY SERVICE (Single Responsibility: Categories Data) ──
 */
export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const data = await httpClient.get<Category[]>("/categories", undefined, { next: { revalidate: 3600 } });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return categories;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const data = await httpClient.get<Category>(`/categories/${slug}`, undefined, { next: { revalidate: 3600 } });
    if (data) return data;
    return getCategoryBySlug(slug) || null;
  },
};

/**
 * ── 3. SHIPPING SERVICE (Live Rates from Supabase) ──
 */
export interface ShippingZone {
  id: string;
  governorate_name_ar: string;
  governorate_name_en?: string;
  shipping_fee: number;
  estimated_days: string;
  is_active: boolean;
}

export const ShippingService = {
  async getZones(): Promise<ShippingZone[]> {
    const data = await httpClient.get<ShippingZone[]>("/shipping/zones", undefined, { next: { revalidate: 3600 } });
    if (data && Array.isArray(data) && data.length > 0) return data;
    return [];
  },
};

/**
 * ── 4. CHAIR CUSTOM SERVICE (Uploads & Tailoring Requests) ──
 */
export const ChairCustomService = {
  async uploadPhoto(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);

    const data = await httpClient.post<{ url: string }>("/chair-custom/upload", formData);
    if (data?.url) return data.url;
    return null;
  },
};

/**
 * ── 5. ORDER SERVICE (Order Creation, Tracking, History) ──
 */
export const OrderService = {
  async createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">): Promise<Order> {
    const createdOrder = await httpClient.post<Order>("/orders", orderData);

    if (createdOrder) {
      if (typeof window !== "undefined") {
        try {
          const saved = JSON.parse(localStorage.getItem("zahra_orders") || "[]");
          localStorage.setItem("zahra_orders", JSON.stringify([createdOrder, ...saved]));
        } catch (_) {}
      }
      return createdOrder;
    }

    // Local fallback creation
    const fallbackOrder: Order = {
      ...orderData,
      id: `ord_${Date.now()}`,
      orderNumber: `ZHR-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: "pending",
      estimatedDelivery: "خلال 2-4 أيام عمل",
    };

    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("zahra_orders") || "[]");
        localStorage.setItem("zahra_orders", JSON.stringify([fallbackOrder, ...saved]));
      } catch (_) {}
    }

    return fallbackOrder;
  },

  async getOrderById(id: string): Promise<Order | null> {
    const remote = await httpClient.get<Order>(`/orders/${id}`);
    if (remote) return remote;

    if (typeof window !== "undefined") {
      try {
        const saved: Order[] = JSON.parse(localStorage.getItem("zahra_orders") || "[]");
        const found = saved.find((o) => o.id === id || o.orderNumber === id);
        if (found) return found;
      } catch (_) {}
    }
    return null;
  },

  async trackOrder(query: string): Promise<Order[] | null> {
    const data = await httpClient.get<Order[]>("/orders/track", { q: query });
    if (data && Array.isArray(data)) return data;
    return null;
  },

  async getCustomerOrders(): Promise<Order[]> {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("zahra_orders") || "[]");
      } catch (_) {
        return [];
      }
    }
    return [];
  },
};

/**
 * ── 6. AUTH SERVICE (Cookie-based Session Management) ──
 */
export const AuthService = {
  async login(email: string, password: string): Promise<{ accessToken: string; user: any } | null> {
    const res = await httpClient.post<{ accessToken: string; user: any }>("/auth/login", { email, password });
    if (res?.accessToken) {
      httpClient.setAuthToken(res.accessToken);
    }
    return res;
  },

  async me(): Promise<any | null> {
    return httpClient.get<any>("/auth/me");
  },

  logout(): void {
    httpClient.clearAuthToken();
  },
};
