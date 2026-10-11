'use client';
import { create } from 'zustand';
import { Product, Category } from '@/lib/types';

interface SearchStore {
  query: string;
  results: Product[];
  categoryResults: Category[];
  isOpen: boolean;
  isLoading: boolean;
  setQuery: (query: string) => void;
  setResults: (products: Product[], categories: Category[]) => void;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
  clearSearch: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSearchStore = create<SearchStore>()((set) => ({
  query: '',
  results: [],
  categoryResults: [],
  isOpen: false,
  isLoading: false,

  setQuery: (query) => set({ query }),
  setResults: (products, categories) =>
    set({ results: products, categoryResults: categories }),
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false, query: '', results: [], categoryResults: [] }),
  toggleSearch: () => set((s) => ({ isOpen: !s.isOpen })),
  clearSearch: () => set({ query: '', results: [], categoryResults: [] }),
  setLoading: (isLoading) => set({ isLoading }),
}));
