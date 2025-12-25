import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllUserCollections, calculateStats, fetchUserInfo, UserInfo } from '@/services/bangumiService';
import { UserCollection, BangumiStats, CollectionType, themes, Theme } from '@/types/bangumi';

export function useBangumi(userId: string | null) {
  const {
    data: collections = [],
    isLoading: isLoadingCollections,
    error: collectionsError,
    refetch,
  } = useQuery({
    queryKey: ['bangumi-collections', userId],
    queryFn: () => (userId ? fetchAllUserCollections(userId) : Promise.resolve([])),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: userInfo,
    isLoading: isLoadingUser,
  } = useQuery({
    queryKey: ['bangumi-user', userId],
    queryFn: () => (userId ? fetchUserInfo(userId) : Promise.resolve(null)),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const stats = collections.length > 0 ? calculateStats(collections) : null;

  return {
    collections,
    stats,
    userInfo,
    isLoading: isLoadingCollections, // Only wait for collections, not user info
    error: collectionsError,
    refetch,
  };
}

export function useTheme() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  const applyTheme = useCallback((theme: Theme) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--card', theme.colors.card);
    root.style.setProperty('--muted', theme.colors.muted);
    root.style.setProperty('--border', theme.colors.border);
    root.style.setProperty('--ring', theme.colors.ring);
    root.style.setProperty('--popover', theme.colors.card);
    root.style.setProperty('--input', theme.colors.muted);
    root.style.setProperty('--secondary', theme.colors.muted);
    // Update gradients
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${theme.colors.primary}) 0%, hsl(${theme.colors.accent}) 100%)`);
    root.style.setProperty('--shadow-glow', `0 0 30px hsl(${theme.colors.primary} / 0.3)`);
    root.style.setProperty('--shadow-accent-glow', `0 0 30px hsl(${theme.colors.accent} / 0.3)`);
    setCurrentTheme(theme);
  }, []);

  return {
    currentTheme,
    themes,
    applyTheme,
  };
}

export function useCollectionFilter(collections: UserCollection[]) {
  const [filterType, setFilterType] = useState<CollectionType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'name'>('rating');

  const filteredCollections = collections
    .filter(c => {
      if (filterType && c.type !== filterType) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          c.subject.name.toLowerCase().includes(query) ||
          c.subject.name_cn?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rate || 0) - (a.rate || 0);
        case 'name':
          return (a.subject.name_cn || a.subject.name).localeCompare(
            b.subject.name_cn || b.subject.name
          );
        case 'date':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

  return {
    filteredCollections,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  };
}
