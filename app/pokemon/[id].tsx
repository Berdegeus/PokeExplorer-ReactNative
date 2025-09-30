import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

import { PokemonDetail, fetchPokemonDetail } from "../../src/api/pokeApi";
import { useFavorites } from "../../src/context/FavoritesContext";
import { capitalize, formatPokemonNumber } from "../../src/utils/text";

export default function PokemonDetailScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { isFavorite, toggleFavorite } = useFavorites();

  const identifier = useMemo(() => {
    if (!params.id) {
      return null;
    }

    return Array.isArray(params.id) ? params.id[0] : params.id;
  }, [params.id]);

  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDetails = useCallback(async () => {
    if (!identifier) {
      setError("Pokemon invalido.");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetchPokemonDetail(identifier);
      setPokemon(response);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao carregar detalhes.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    loadDetails();
  }, [loadDetails]);

  const handleToggleFavorite = useCallback(() => {
    if (!pokemon) {
      return;
    }

    toggleFavorite({
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
    });
  }, [pokemon, toggleFavorite]);

  const favoriteActive = pokemon ? isFavorite(pokemon.id) : false;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: pokemon ? capitalize(pokemon.name) : "Detalhes",
      headerRight: () => (
        <Pressable onPress={handleToggleFavorite} style={styles.headerButton}>
          <MaterialIcons
            name={favoriteActive ? "star" : "star-border"}
            size={24}
            color="#f4c430"
          />
        </Pressable>
      ),
    });
  }, [favoriteActive, navigation, handleToggleFavorite, pokemon]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#ef5350" />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error || "Pokemon nao encontrado."}</Text>
        <Pressable style={styles.retryButton} onPress={loadDetails}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: pokemon.image }} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
        <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.rowWrap}>
          {pokemon.types.map((type) => (
            <View key={type} style={styles.chip}>
              <Text style={styles.chipText}>{capitalize(type)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        {pokemon.abilities.map((ability) => (
          <Text key={ability} style={styles.listItem}>
            {"\u2022"} {capitalize(ability)}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informacoes</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Altura</Text>
          <Text style={styles.infoValue}>{pokemon.height / 10} m</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Peso</Text>
          <Text style={styles.infoValue}>{pokemon.weight / 10} kg</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#2b2d42",
  },
  errorText: {
    color: "#ef5350",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
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
  headerButton: {
    paddingHorizontal: 4,
  },
  content: {
    padding: 20,
  },
  imageWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: 200,
    height: 200,
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  name: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2b2d42",
  },
  number: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8d99ae",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2b2d42",
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    backgroundColor: "#edf2f4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: "#2b2d42",
    fontWeight: "600",
  },
  listItem: {
    fontSize: 16,
    marginBottom: 6,
    color: "#2b2d42",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2b2d42",
  },
  infoValue: {
    fontSize: 16,
    color: "#2b2d42",
  },
});
