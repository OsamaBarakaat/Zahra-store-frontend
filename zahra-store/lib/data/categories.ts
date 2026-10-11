import { Category } from '@/lib/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    slug: 'home-furnishings',
    name: 'مفروشات منزلية',
    description: 'كل ما يحتاجه منزلك من مفروشات عالية الجودة',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
    productCount: 24,
    featured: true,
  },
  {
    id: 'cat-2',
    slug: 'bedding',
    name: 'بياضات',
    description: 'بياضات وأغطية سرير فاخرة',
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
    productCount: 18,
    featured: true,
  },
  {
    id: 'cat-3',
    slug: 'living-room',
    name: 'مفروشات أنتريه وركنة',
    description: 'مفروشات غرفة المعيشة والأنتريه',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
    productCount: 12,
    featured: true,
  },
  {
    id: 'cat-4',
    slug: 'curtains',
    name: 'إسدالات',
    description: 'ستائر وإسدالات بتصاميم عصرية وأنيقة',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    productCount: 15,
    featured: true,
  },
  {
    id: 'cat-5',
    slug: 'headscarves',
    name: 'طرح',
    description: 'طرح وأوشحة بأجود الخامات',
    image: 'https://images.unsplash.com/photo-1590330297626-d7aff25a0431?w=400&h=300&fit=crop',
    productCount: 30,
    featured: true,
  },
  {
    id: 'cat-6',
    slug: 'pajamas',
    name: 'بيجامات حريمي',
    description: 'بيجامات نسائية مريحة وأنيقة',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=300&fit=crop',
    productCount: 22,
    featured: true,
  },
];

export const getCategoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const getFeaturedCategories = () =>
  categories.filter((c) => c.featured);