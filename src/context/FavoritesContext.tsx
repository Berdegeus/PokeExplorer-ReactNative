import { ReactNode, createContext, useCallback, useContext, useMemo, useState } from "react";

export type FavoritePokemon = {
  id: number;
  name: string;
  image: string;
  types: string[];
};

type FavoritesContextValue = {
  favorites: FavoritePokemon[];
  isFavorite: (pokemonId: number) => boolean;
  toggleFavorite: (pokemon: FavoritePokemon) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoritePokemon[]>([]);

  const toggleFavorite = useCallback((pokemon: FavoritePokemon) => {
    setFavorites((current) => {
      const exists = current.some((fav) => fav.id === pokemon.id);

      if (exists) {
        return current.filter((fav) => fav.id !== pokemon.id);
      }

      const next = [...current, pokemon];
      next.sort((a, b) => a.id - b.id);
      return next;
    });
  }, []);

  const idSet = useMemo(() => new Set(favorites.map((fav) => fav.id)), [favorites]);

  const isFavorite = useCallback((pokemonId: number) => idSet.has(pokemonId), [idSet]);

  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, toggleFavorite]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }

  return context;
}
