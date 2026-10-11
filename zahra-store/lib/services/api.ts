import { Product, Category, Order, CustomerInfo, ShippingAddress, PaymentMethod } from "@/lib/types";
import { products, getProductBySlug, getFeaturedProducts, getSaleProducts, getProductsByCategory, searchProducts } from "@/lib/data/products";
import { categories, getCategoryBySlug } from "@/lib/data/categories";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Service Layer for Zahra Store
 * Designed for immediate backend API connection:
 * When NEXT_PUBLIC_API_URL is set, methods fetch from real backend.
 * Otherwise, seamlessly fall back to comprehensive local mock data.
 */

export const ProductService = {
  async getAll(): Promise<Product[]> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/products`, { next: { revalidate: 60 } });
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
        const res = await fetch(`${API_BASE_URL}/products/${slug}`, { next: { revalidate: 60 } });
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
        const res = await fetch(`${API_BASE_URL}/products/featured`, { next: { revalidate: 60 } });
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
        const res = await fetch(`${API_BASE_URL}/products/sale`, { next: { revalidate: 60 } });
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
        const res = await fetch(`${API_BASE_URL}/categories/${categorySlug}/products`, { next: { revalidate: 60 } });
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
        const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
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
        const res = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 3600 } });
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
        const res = await fetch(`${API_BASE_URL}/categories/${slug}`, { next: { revalidate: 3600 } });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, using mock data:", e);
      }
    }
    return getCategoryBySlug(slug) || null;
  },
};

export const OrderService = {
  async createOrder(orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "status">): Promise<Order> {
    if (API_BASE_URL) {
      try {
        const res = await fetch(`${API_BASE_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        if (res.ok) return await res.json();
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
      status: "confirmed",
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
        const res = await fetch(`${API_BASE_URL}/orders/${id}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Backend API unavailable, checking local orders:", e);
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
