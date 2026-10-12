import { Product } from '@/lib/types';

export const products: Product[] = [
  {
    id: 'p0',
    slug: 'chair-cover-elastic-jacquard',
    name: 'طقم تلبيسات كراسي سفرة 6 قطع ليكرا جاكار مطاطية (عادي وعمولة)',
    description: 'طقم تلبيسات متكامل يباع طقم على بعضه يشمل 6 تلبيسات كراسي لطقم سفرة 6 كراسي بالكامل. مصنوع من خامة الليكرا الجاكار المطاطية الفاخرة المقاومة للبقع وسهلة الفك والتركيب والغسيل. متوفر بـ 10 ألوان غنية، ونقشتين بارزتين مختلفتين، مع إمكانية الاختيار بين المقاس القياسي أو التفصيل العمولة بالمللي على مقاس كراسيك (+200 جنيه للطقم بالكامل) مع إرفاق صورة الكرسي.',
    price: 150,
    originalPrice: 220,
    discount: 32,
    images: [
      { id: 'img-chair-1', url: '/products/chair-cover/colors-grid.jpg', alt: 'ألوان تلبيسة الكرسي الـ 10' },
      { id: 'img-chair-2', url: '/products/chair-cover/pattern-squares.jpg', alt: 'نقشة مربعات وجواها زهور' },
      { id: 'img-chair-3', url: '/products/chair-cover/pattern-floral.jpg', alt: 'نقشة زهور دائرية وأوراق شجر' },
    ],
    category: 'living-room',
    categoryName: 'مفروشات أنتريه وركنة',
    isChairCover: true,
    variants: [
      // 10 Colors from user image
      { id: 'col-1', name: 'رمادي فاتح', type: 'color', value: '#9BA8B5', available: true },
      { id: 'col-2', name: 'وردي غامق', type: 'color', value: '#A34E62', available: true },
      { id: 'col-3', name: 'أزرق', type: 'color', value: '#006C9C', available: true },
      { id: 'col-4', name: 'بيج', type: 'color', value: '#C4B1A0', available: true },
      { id: 'col-5', name: 'أحمر غامق', type: 'color', value: '#8D0A1C', available: true },
      { id: 'col-6', name: 'كريمي', type: 'color', value: '#D2C1A8', available: true },
      { id: 'col-7', name: 'بني', type: 'color', value: '#4D3227', available: true },
      { id: 'col-8', name: 'رمادي', type: 'color', value: '#738090', available: true },
      { id: 'col-9', name: 'رمادي غامق', type: 'color', value: '#3C424E', available: true },
      { id: 'col-10', name: 'بترولي', type: 'color', value: '#045266', available: true },
      // 2 Patterns
      { id: 'pat-1', name: 'مربعات وجواها زهور', type: 'pattern', value: 'مربعات', available: true, image: '/products/chair-cover/pattern-squares.jpg' },
      { id: 'pat-2', name: 'زهور دائرية وأوراق شجر', type: 'pattern', value: 'زهور دائرية', available: true, image: '/products/chair-cover/pattern-floral.jpg' },
      // 2 Cover Types (Standard vs Custom +200 EGP)
      { id: 'typ-1', name: 'عادي (للكرسي الخشبي القياسي)', type: 'cover_type', value: 'standard', available: true, priceModifier: 0 },
      { id: 'typ-2', name: 'عمولة (تفصيل مخصوص على شكل ومقاس كرسيك)', type: 'cover_type', value: 'custom', available: true, priceModifier: 200 },
    ],
    rating: 4.9,
    reviewCount: 318,
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    stockCount: 85,
    material: 'ليكرا جاكار مطاطية فاخرة',
  },
  {
    id: 'p1',
    slug: 'set-bedding-floral-roses',
    name: 'طقم بياضات زهور الورد الفاخر',
    description: 'طقم بياضات فاخر مصنوع من القطن المصري الخالص بتصميم زهور الورد الرقيق. يشمل الطقم غطاء لحاف وأكياس وشيلة سرير. مثالي لإضافة لمسة رومانسية وأنيقة لغرفة نومك.',
    price: 450,
    originalPrice: 650,
    discount: 31,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop', alt: 'طقم بياضات زهور الورد' },
      { id: 'img2', url: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=600&fit=crop', alt: 'بياضات سرير' },
      { id: 'img3', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=600&fit=crop', alt: 'تفاصيل التصميم' },
    ],
    category: 'bedding',
    categoryName: 'بياضات',
    variants: [
      { id: 'v1', name: 'وردي', type: 'color', value: '#E8A4A0', available: true },
      { id: 'v2', name: 'أبيض', type: 'color', value: '#FFFFFF', available: true },
      { id: 'v3', name: 'بيج', type: 'color', value: '#D4B896', available: true },
      { id: 'v4', name: 'مفرد', type: 'size', value: 'مفرد', available: true },
      { id: 'v5', name: 'دبل', type: 'size', value: 'دبل', available: true },
      { id: 'v6', name: 'كينج', type: 'size', value: 'كينج', available: false },
    ],
    rating: 4.8,
    reviewCount: 124,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    stockCount: 15,
    material: 'قطن مصري',
  },
  {
    id: 'p2',
    slug: 'curtain-royal-velvet',
    name: 'ستارة مخمل رويال بورجوندي',
    description: 'ستارة مخمل فاخرة بلون البورجوندي الكلاسيكي. تعطي إحساساً بالفخامة والأناقة لأي غرفة. متوفرة بأطوال مختلفة.',
    price: 380,
    originalPrice: 520,
    discount: 27,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop', alt: 'ستارة مخمل' },
      { id: 'img2', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=600&fit=crop', alt: 'تفاصيل الستارة' },
    ],
    category: 'curtains',
    categoryName: 'إسدالات',
    variants: [
      { id: 'v1', name: 'بورجوندي', type: 'color', value: '#800020', available: true },
      { id: 'v2', name: 'كحلي', type: 'color', value: '#1B3A6B', available: true },
      { id: 'v3', name: 'رمادي', type: 'color', value: '#808080', available: true },
      { id: 'v4', name: '2.5 متر', type: 'size', value: '2.5 متر', available: true },
      { id: 'v5', name: '3 متر', type: 'size', value: '3 متر', available: true },
    ],
    rating: 4.7,
    reviewCount: 89,
    isNew: true,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    stockCount: 8,
    material: 'مخمل فاخر',
  },
  {
    id: 'p3',
    slug: 'pajama-silk-rose',
    name: 'بيجاما حرير ورد ناعمة',
    description: 'بيجاما نسائية فاخرة من الحرير الصناعي الناعم بتصميم زهري أنيق. مريحة جداً ومناسبة لكل المناسبات.',
    price: 280,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&h=600&fit=crop', alt: 'بيجاما حرير' },
      { id: 'img2', url: 'https://images.unsplash.com/photo-1566479179817-56bcea7c5773?w=600&h=600&fit=crop', alt: 'بيجاما وردية' },
    ],
    category: 'pajamas',
    categoryName: 'بيجامات حريمي',
    variants: [
      { id: 'v1', name: 'وردي', type: 'color', value: '#FFB6C1', available: true },
      { id: 'v2', name: 'بيج', type: 'color', value: '#F5DEB3', available: true },
      { id: 'v3', name: 'S', type: 'size', value: 'S', available: true },
      { id: 'v4', name: 'M', type: 'size', value: 'M', available: true },
      { id: 'v5', name: 'L', type: 'size', value: 'L', available: true },
      { id: 'v6', name: 'XL', type: 'size', value: 'XL', available: false },
    ],
    rating: 4.9,
    reviewCount: 203,
    isNew: true,
    isFeatured: true,
    isOnSale: false,
    inStock: true,
    stockCount: 20,
    material: 'حرير صناعي',
  },
  {
    id: 'p4',
    slug: 'headscarf-chiffon-elegant',
    name: 'طرحة شيفون أنيقة - متعددة الألوان',
    description: 'طرحة شيفون خفيفة وأنيقة مناسبة للمناسبات والخروجات اليومية. خامة فاخرة وألوان ثابتة.',
    price: 120,
    originalPrice: 180,
    discount: 33,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=600&h=600&fit=crop', alt: 'طرحة شيفون' },
    ],
    category: 'headscarves',
    categoryName: 'طرح',
    variants: [
      { id: 'v1', name: 'وردي', type: 'color', value: '#FFB6C1', available: true },
      { id: 'v2', name: 'أبيض', type: 'color', value: '#FFFFFF', available: true },
      { id: 'v3', name: 'أسود', type: 'color', value: '#000000', available: true },
      { id: 'v4', name: 'كريمي', type: 'color', value: '#FFFDD0', available: true },
      { id: 'v5', name: 'زيتي', type: 'color', value: '#808000', available: false },
    ],
    rating: 4.6,
    reviewCount: 456,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    stockCount: 50,
    material: 'شيفون',
  },
  {
    id: 'p5',
    slug: 'sofa-cover-premium',
    name: 'غطاء كنبة بريميوم مطاطي',
    description: 'غطاء كنبة مطاطي عالي الجودة، سهل التركيب والخلع والغسيل. يحمي كنبتك ويجدد شكلها.',
    price: 320,
    originalPrice: 450,
    discount: 29,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=600&fit=crop', alt: 'غطاء كنبة' },
      { id: 'img2', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop', alt: 'كنبة مغطاة' },
    ],
    category: 'living-room',
    categoryName: 'مفروشات أنتريه وركنة',
    variants: [
      { id: 'v1', name: 'رمادي', type: 'color', value: '#808080', available: true },
      { id: 'v2', name: 'بيج', type: 'color', value: '#D4B896', available: true },
      { id: 'v3', name: 'كنبة 3 أماكن', type: 'size', value: '3 seats', available: true },
      { id: 'v4', name: 'كنبة 4 أماكن', type: 'size', value: '4 seats', available: true },
      { id: 'v5', name: 'كنبة L', type: 'size', value: 'L-shape', available: true },
    ],
    rating: 4.5,
    reviewCount: 78,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    stockCount: 6,
    material: 'جاكار مطاطي',
  },
  {
    id: 'p6',
    slug: 'table-runner-embroidered',
    name: 'مفرش مائدة مطرز تراثي',
    description: 'مفرش مائدة بتطريز يدوي أصيل يعكس الذوق المصري الرفيع. مثالي للمناسبات والأعياد.',
    price: 195,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', alt: 'مفرش مطرز' },
    ],
    category: 'home-furnishings',
    categoryName: 'مفروشات منزلية',
    variants: [
      { id: 'v1', name: 'أبيض وذهبي', type: 'color', value: '#F5F5DC', available: true },
      { id: 'v2', name: 'كريمي وبورجوندي', type: 'color', value: '#FFF8DC', available: true },
    ],
    rating: 4.7,
    reviewCount: 34,
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    inStock: true,
    stockCount: 25,
    material: 'قطن مطرز',
  },
  {
    id: 'p7',
    slug: 'bedding-winter-warm',
    name: 'طقم بياضات شتوي دافئ',
    description: 'طقم بياضات شتوي من القطن الثقيل الدافئ. مثالي لليالي الشتاء الباردة. ناعم ومريح.',
    price: 520,
    originalPrice: 750,
    discount: 31,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=600&fit=crop', alt: 'بياضات شتوي' },
      { id: 'img2', url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=600&fit=crop', alt: 'طقم كامل' },
    ],
    category: 'bedding',
    categoryName: 'بياضات',
    variants: [
      { id: 'v1', name: 'أزرق', type: 'color', value: '#6BA3BE', available: true },
      { id: 'v2', name: 'رمادي', type: 'color', value: '#808080', available: true },
      { id: 'v3', name: 'دبل', type: 'size', value: 'دبل', available: true },
      { id: 'v4', name: 'كينج', type: 'size', value: 'كينج', available: true },
    ],
    rating: 4.8,
    reviewCount: 67,
    isNew: false,
    isFeatured: true,
    isOnSale: true,
    inStock: true,
    stockCount: 10,
    material: 'قطن شتوي',
  },
  {
    id: 'p8',
    slug: 'pajama-cotton-summer',
    name: 'بيجاما قطن صيفية مريحة',
    description: 'بيجاما نسائية قطن 100% خفيفة ومريحة للصيف. تصميم بسيط وعصري.',
    price: 180,
    images: [
      { id: 'img1', url: 'https://images.unsplash.com/photo-1566479179817-56bcea7c5773?w=600&h=600&fit=crop', alt: 'بيجاما قطن' },
    ],
    category: 'pajamas',
    categoryName: 'بيجامات حريمي',
    variants: [
      { id: 'v1', name: 'أبيض', type: 'color', value: '#FFFFFF', available: true },
      { id: 'v2', name: 'وردي فاتح', type: 'color', value: '#FFD1DC', available: true },
      { id: 'v3', name: 'M', type: 'size', value: 'M', available: true },
      { id: 'v4', name: 'L', type: 'size', value: 'L', available: true },
      { id: 'v5', name: 'XL', type: 'size', value: 'XL', available: true },
    ],
    rating: 4.6,
    reviewCount: 112,
    isNew: false,
    isFeatured: false,
    isOnSale: false,
    inStock: true,
    stockCount: 30,
    material: 'قطن 100%',
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getFeaturedProducts = () =>
  products.filter((p) => p.isFeatured);

export const getProductsByCategory = (categorySlug: string) =>
  products.filter((p) => p.category === categorySlug);

export const getSaleProducts = () =>
  products.filter((p) => p.isOnSale);

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      p.name.includes(q) ||
      p.description.includes(q) ||
      p.categoryName.includes(q) ||
      p.tags?.some((t) => t.includes(q))
  );
};

export const getRelatedProducts = (product: Product, limit = 4): Product[] =>
  products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);