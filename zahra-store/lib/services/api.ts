import { Product, Category, Order, CustomerInfo, ShippingAddress, PaymentMethod } from "@/lib/types";
import { products, getProductBySlug, getFeaturedProducts, getSaleProducts, getProductsByCategory, searchProducts } from "@/lib/data/products";
import { categories, getCategoryBySlug } from "@/lib/data/categories";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const STORE_KEY = process.env.NEXT_PUBLIC_STORE_KEY || "zahra-storefront-key-2026";

/**
 * Standard Headers for Zahra Store APIs
 */
function getHeaders(extraHeaders: Record<string, string> = {}) {
  const headers: Record<string, string> = {
    "Accept": "application/json",
    ...extraHeaders,
  };
  if (STORE_KEY) {
    headers["x-api-key"] = STORE_KEY;
    headers["Authorization"] = `Bearer ${STORE_KEY}`;
  }
  return headers;
}

/**
 * Service Layer for Zahra Store
 * Connects directly to backend API on Vercel with graceful fallback to mock data
 */

export const ProductService = {
  async getAll(): Promise<Product[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          headers: getHeaders(),
          next: { revalidate: 60 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return products;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/${slug}`, {
          headers: getHeaders(),
          next: { revalidate: 60 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return getProductBySlug(slug) || null;
  },

  async getFeatured(): Promise<Product[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/featured`, {
          headers: getHeaders(),
          next: { revalidate: 60 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return getFeaturedProducts();
  },

  async getSale(): Promise<Product[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/products/sale`, {
          headers: getHeaders(),
          next: { revalidate: 60 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return getSaleProducts();
  },

  async getByCategory(categorySlug: string): Promise<Product[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/${categorySlug}/products`, {
          headers: getHeaders(),
          next: { revalidate: 60 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return getProductsByCategory(categorySlug);
  },

  async search(query: string): Promise<Product[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
          headers: getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return searchProducts(query);
  },
};

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories`, {
          headers: getHeaders(),
          next: { revalidate: 3600 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return categories;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/categories/${slug}`, {
          headers: getHeaders(),
          next: { revalidate: 3600 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return getCategoryBySlug(slug) || null;
  },
};

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
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/shipping/zones`, {
          headers: getHeaders(),
          next: { revalidate: 3600 },
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Shipping zones fetch error:", e);
      }
    }
    return [];
  },
};

export const ChairCustomService = {
  async uploadPhoto(file: File): Promise<string | null> {
    if (!API_BASE_URL) return null;
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/chair-custom/upload`, {
        method: "POST",
        headers: {
          "x-api-key": STORE_KEY,
        },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (e) {
      console.warn("Chair photo upload failed:", e);
    }
    return null;
  },
};

export const OrderService = {
  async createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">): Promise<Order> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: "POST",
          headers: getHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify(orderData),
        });
        if (res.ok) {
          const createdOrder = await res.json();
          // Save locally in customer's browser storage
          if (typeof window !== "undefined") {
            try {
              const saved = JSON.parse(localStorage.getItem("zahra_orders") || "[]");
              localStorage.setItem("zahra_orders", JSON.stringify([createdOrder, ...saved]));
            } catch (_) {}
          }
          return createdOrder;
        }
      } catch (e) {
        console.warn("Backend API unavailable, saving order locally:", e);
      }
    }

    // Mock local creation
    const newOrder: Order = {
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
        localStorage.setItem("zahra_orders", JSON.stringify([newOrder, ...saved]));
      } catch (_) {}
    }

    return newOrder;
  },

  async getOrderById(id: string): Promise<Order | null> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
          headers: getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API error:", e);
      }
    }

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
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/track?q=${encodeURIComponent(query)}`, {
          headers: getHeaders(),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Track order error:", e);
      }
    }
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
