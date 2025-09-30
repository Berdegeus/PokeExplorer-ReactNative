import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useFavorites } from "../src/context/FavoritesContext";
import { capitalize, formatPokemonNumber } from "../src/utils/text";

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();

  const handleNavigate = (pokemonId: number) => {
    router.push({
      pathname: "/pokemon/[id]",
      params: { id: pokemonId.toString() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={favorites.length === 0 ? styles.emptyList : styles.listContent}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => handleNavigate(item.id)}>
            <View style={styles.cardHeader}>
              <Image source={{ uri: item.image }} style={styles.cardImage} resizeMode="contain" />
              <View>
                <Text style={styles.cardTitle}>{capitalize(item.name)}</Text>
                <Text style={styles.cardSubtitle}>{formatPokemonNumber(item.id)}</Text>
                <View style={styles.typesRow}>
                  {item.types.map((type) => (
                    <View key={type} style={styles.typeTag}>
                      <Text style={styles.typeTagText}>{capitalize(type)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            <Pressable
              style={styles.favoriteButton}
              onPress={() => toggleFavorite(item)}
              accessibilityRole="button"
            >
              <MaterialIcons name="star" size={24} color="#f4c430" />
              <Text style={styles.favoriteButtonText}>Remover</Text>
            </Pressable>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum Pokemon favoritado ainda.</Text>
            <Text style={styles.emptyHelp}>Adicione alguns na tela de detalhes.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
  },
  cardImage: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2b2d42",
  },
  cardSubtitle: {
    fontSize: 16,
    color: "#8d99ae",
    marginTop: 4,
  },
  typesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  typeTag: {
    backgroundColor: "#edf2f4",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  typeTagText: {
    color: "#2b2d42",
    fontWeight: "600",
  },
  favoriteButton: {
    marginTop: 16,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    backgroundColor: "#fff5c1",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  favoriteButtonText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#c79300",
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 32,
  },
  emptyContainer: {
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2b2d42",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyHelp: {
    color: "#8d99ae",
    textAlign: "center",
  },
});
