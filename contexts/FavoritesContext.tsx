import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface FavoriteItem {
  id: string;
  title: string;
  icon: string;
  type: 'sim-sale' | 'menu';
  onPress: () => void;
}

interface FavoritesContextValue {
  favorites: string[];
  favoriteItems: FavoriteItem[];
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  isLoading: boolean;
}

const STORAGE_KEY = 'user_favorites';

export const [FavoritesProvider, useFavorites] = createContextHook(() => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const saveFavorites = useCallback(async (ids: string[], items: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ids, items }));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedFavorites) {
        let parsed;
        try {
          parsed = typeof storedFavorites === 'string' ? JSON.parse(storedFavorites) : storedFavorites;
        } catch (e) {
          console.error('Failed to parse favorites data:', e);
          parsed = { ids: [], items: [] };
        }
        setFavorites(parsed.ids || []);
        setFavoriteItems(parsed.items || []);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addToFavorites = useCallback(async (item: FavoriteItem) => {
    if (!favorites.includes(item.id)) {
      const newFavorites = [...favorites, item.id];
      const newItems = [...favoriteItems, item];
      
      setFavorites(newFavorites);
      setFavoriteItems(newItems);
      await saveFavorites(newFavorites, newItems);
      
      console.log('Added to favorites:', item.title);
    }
  }, [favorites, favoriteItems, saveFavorites]);

  const removeFromFavorites = useCallback(async (itemId: string) => {
    const newFavorites = favorites.filter(id => id !== itemId);
    const newItems = favoriteItems.filter(item => item.id !== itemId);
    
    setFavorites(newFavorites);
    setFavoriteItems(newItems);
    await saveFavorites(newFavorites, newItems);
    
    console.log('Removed from favorites:', itemId);
  }, [favorites, favoriteItems, saveFavorites]);

  const isFavorite = useCallback((itemId: string): boolean => {
    return favorites.includes(itemId);
  }, [favorites]);

  // Load favorites from storage on initialization
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return useMemo(() => ({
    favorites,
    favoriteItems,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    isLoading,
  }), [favorites, favoriteItems, addToFavorites, removeFromFavorites, isFavorite, isLoading]);
});

export type { FavoriteItem };