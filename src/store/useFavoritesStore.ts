import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface FavoritesState {
  favorites: string[];
  _hasHydrated: boolean; // 💡 Track if AsyncStorage is finished loading
  setHasHydrated: (state: boolean) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

//2. creating store with zustand and persist middleware to save favorites in async storage..
export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
      toggleFavorite: (productId: string) => {
        set((state) => ({
          favorites: state.favorites.includes(productId)
            ? state.favorites.filter((id) => id !== productId)
            : [...state.favorites, productId],
        }));
      },
      isFavorite: (productId: string) => {
        return get().favorites.includes(productId);
      },
    }),
    {
      name: "favorites-storage", // unique name
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
      version: 1, // (optional) versioning for migrations
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
