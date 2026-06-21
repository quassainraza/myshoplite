import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { fetchProducts } from "../../services/api";
import { useFavoritesStore } from "../../store/useFavoritesStore";

export default function ProductDetailsScreen() {
  // Grab the dynamic ID from the URL (e.g., /product/123 -> id = '123')...
  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch all products and find the one that matches the ID
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // Find the specific product
  const product = products?.find((p) => p.id === id);

  // Zustand State
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) =>
    state.isFavorite(id as string),
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.name,
          headerBackTitle: "Back",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => toggleFavorite(product.id)}
              style={{ padding: 8 }}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? "#FF3B30" : "#000"}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {/* If the mock API doesn't have a description, provide a fallback... */}
            {product.description ||
              "No description available for this product."}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Standard iOS background from PDF
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  image: {
    width: "100%",
    height: 350,
    backgroundColor: "#FFF",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // Overlaps the image slightly for a clean UI
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
    color: "#000",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#FF3B30",
  },
});
