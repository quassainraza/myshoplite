// app/(tabs)/favorites.tsx
import { useCallback, useMemo } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { ProductCard } from "@/components/ProductCard";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Product } from "@/types";
import { ProductList } from "@/components/ProductList";

export default function FavoritesScreen() {
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1;
  const cardWidth = width >= 768 ? width / 2 - 24 : "100%"; // Responsive card width

  // 1. Get the list of favorited IDs from Zustand
  // Because Zustand is reactive, this screen will update instantly
  // if you unfavorite something from the details screen....
  const favoriteIds = useFavoritesStore((state) => state.favorites);
  const hasHydrated = useFavoritesStore((state) => state._hasHydrated);

  // 2. Fetch all products going in tanstack cache
  const { data: allProducts } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  // 3. Filter products to only show favorites
  const favoriteProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter((product) => favoriteIds.includes(product.id));
  }, [allProducts, favoriteIds]);

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => {
      return <ProductCard product={item} cardWidth={cardWidth} />;
    },
    [cardWidth],
  );

  if (!hasHydrated) {
    return null;
  }
  return (
    <View style={styles.container}>
      <ProductList
        key={`grid-${numColumns}`}
        data={favoriteProducts}
        numColumns={numColumns}
        renderItem={renderProduct}
        // 💡 5. Brought over FlatList performance props

        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color="#8E8E93" />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptyText}>
              Tap the heart icon on products to save them here.
            </Text>

            {/* Quick link back to Home tab */}
            <Link href="/" style={styles.browseButton}>
              <Text style={styles.browseButtonText}>Browse Products</Text>
            </Link>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, // Standard iOS background from PDF
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
    flexGrow: 1, // Ensures empty state centers correctly
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 32,
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    overflow: "hidden", // Required for Link component styling
  },
  browseButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
