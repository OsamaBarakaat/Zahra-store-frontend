// ─── Product ──────────────────────────────────────────────────────────────
export interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

export interface ProductVariant {
  id: string;
  name: string;       // e.g. "أبيض", "L", "قطن", "عمولة"
  type: "color" | "size" | "material" | "pattern" | "cover_type";
  value: string;      // hex for color, label for others
  available: boolean;
  priceModifier?: number; // e.g. +200 EGP for custom
  image?: string;     // optional texture or preview image
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;        // percentage
  images: ProductImage[];
  category: string;         // category slug
  categoryName: string;
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  inStock: boolean;
  stockCount?: number;
  sku?: string;
  tags?: string[];
  material?: string;
  dimensions?: string;
  isChairCover?: boolean;   // Flag for chair cover customization flow
}

// ─── Category ────────────────────────────────────────────────────────────
export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  image: string;
  productCount: number;
  featured?: boolean;
}

// ─── Review ───────────────────────────────────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// ─── Cart ─────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;               // unique cart item id (productId + variant combo)
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedVariants: Record<string, string>; // { "لون القماش": "وردي غامق", "شكل النقشة": "مربعات وجواها زهور", "نوع التلبيسة": "عمولة (+200 جنيه)" }
  customChairImage?: string; // photo uploaded by customer for custom chair order
  customNotes?: string;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────
export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  addedAt: string;
}

// ─── Checkout / Order ─────────────────────────────────────────────────────
export type PaymentMethod = "cod" | "vodafone_cash" | "instapay";
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

export interface ShippingAddress {
  governorate: string;
  city: string;
  street: string;
  apartment?: string;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  customer: CustomerInfo;
  address: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery?: string;
}

// ─── Filter / Sort ────────────────────────────────────────────────────────
export type SortOption =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "best_selling"
  | "top_rated";

export interface FilterState {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  materials?: string[];
  inStock?: boolean;
  onSale?: boolean;
  sort: SortOption;
}

// ─── Search ───────────────────────────────────────────────────────────────
export interface SearchResult {
  products: Product[];
  categories: Category[];
  total: number;
  query: string;
}

// ─── UI State ─────────────────────────────────────────────────────────────
export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

// ─── User / Auth ──────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: ShippingAddress[];
  orders: string[]; // order IDs
}

// ─── Egyptian Governorates ────────────────────────────────────────────────
export const EGYPTIAN_GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الدقهلية",
  "البحيرة",
  "الفيوم",
  "الغربية",
  "الإسماعيلية",
  "المنوفية",
  "المنيا",
  "القليوبية",
  "الوادي الجديد",
  "السويس",
  "أسوان",
  "أسيوط",
  "بني سويف",
  "بورسعيد",
  "دمياط",
  "الشرقية",
  "جنوب سيناء",
  "كفر الشيخ",
  "مطروح",
  "الأقصر",
  "قنا",
  "شمال سيناء",
  "سوهاج",
  "البحر الأحمر",
] as const;

export type EgyptianGovernorate = (typeof EGYPTIAN_GOVERNORATES)[number];
