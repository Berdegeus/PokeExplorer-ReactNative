import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import {
  PAGE_SIZE,
  PokemonListItem,
  fetchPokemonDetail,
  fetchPokemonPage,
} from "../src/api/pokeApi";
import { capitalize } from "../src/utils/text";

export default function HomeScreen() {
  const router = useRouter();

  const [items, setItems] = useState<PokemonListItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadInitial = async () => {
    setOffset(0);
    await loadMore(true);
  };

  const loadMore = async (reset = false) => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const nextOffset = reset ? 0 : offset;
      const page = await fetchPokemonPage(nextOffset, PAGE_SIZE);

      setItems((current) => (reset ? page.items : [...current, ...page.items]));
      setHasMore(page.hasMore);
      setOffset(nextOffset + PAGE_SIZE);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToDetail = (pokemonId: number) => {
    router.push({
      pathname: "/pokemon/[id]",
      params: { id: pokemonId.toString() },
    });
  };

  const handleLoadMorePress = () => {
    if (!hasMore) {
      return;
    }

    loadMore();
  };

  const handleFavoritesPress = () => {
    router.push("/favorites");
  };

  const handleSearch = async () => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      setSearchError("Digite o nome ou numero do Pokemon.");
      return;
    }

    setSearchError(null);
    setSearchLoading(true);

    try {
      const pokemon = await fetchPokemonDetail(query);
      Keyboard.dismiss();
      setSearchTerm("");
      router.push({
        pathname: "/pokemon/[id]",
        params: { id: pokemon.id.toString() },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Pokemon nao encontrado.";
      setSearchError(message);
    } finally {
      setSearchLoading(false);
    }
  };

  const listEmptyComponent = useMemo(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef5350" />
          <Text style={styles.loadingText}>Carregando Pokemons...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadInitial}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Nenhum Pokemon encontrado.</Text>
      </View>
    );
  }, [error, loadInitial, loading]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pokedex Explorer</Text>
        <Pressable style={styles.favoritesButton} onPress={handleFavoritesPress}>
          <Text style={styles.favoritesButtonText}>Favoritos</Text>
        </Pressable>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Buscar por nome ou numero"
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <Pressable
          style={[styles.searchButton, searchLoading && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={searchLoading}
        >
          <Text style={styles.searchButtonText}>{searchLoading ? "Buscando..." : "Buscar"}</Text>
        </Pressable>
      </View>
      {searchError ? <Text style={styles.errorText}>{searchError}</Text> : null}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={items.length === 0 ? styles.listEmpty : styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => handleNavigateToDetail(item.id)}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
            <Text style={styles.cardTitle}>{capitalize(item.name)}</Text>
          </Pressable>
        )}
        ListEmptyComponent={listEmptyComponent}
      />

      {items.length > 0 ? (
        <Pressable
          style={[styles.loadMoreButton, (!hasMore || loading) && styles.loadMoreButtonDisabled]}
          onPress={handleLoadMorePress}
          disabled={!hasMore || loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loadMoreText}>{hasMore ? "Carregar mais" : "Fim da lista"}</Text>
          )}
        </Pressable>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2b2d42",
  },
  favoritesButton: {
    backgroundColor: "#ef5350",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  favoritesButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: "#3b4cca",
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  errorText: {
    color: "#ef5350",
    marginBottom: 8,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 16,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  columnWrapper: {
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2b2d42",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#2b2d42",
  },
  retryButton: {
    backgroundColor: "#3b4cca",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  loadMoreButton: {
    backgroundColor: "#3b4cca",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  loadMoreButtonDisabled: {
    backgroundColor: "#9aa0ff",
  },
  loadMoreText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
