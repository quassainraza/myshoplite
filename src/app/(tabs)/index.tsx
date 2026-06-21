// this is home page of the app, it will show the list of products
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
  TextInput,
  Platform,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/services/api";
import { ProductCard } from "@/components/ProductCard";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { Product } from "@/types";
import { useFavoritesStore } from "@/store/useFavoritesStore";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 2 : 1; // 2 columns for tablets/web, 1 for mobile
  const hashydrated = useFavoritesStore((state) => state._hasHydrated);
  const {
    data: products,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false, // Prevents refetching when the window regains focus
    refetchOnMount: false, // Prevents refetching when the component mounts
  });
  // 💡 Trap the log here:
  useEffect(() => {
    if (products) {
      console.log(
        `✅ Products safely loaded in background. Count: ${products.length}`,
      );
    }
  }, [products]);

  const renderProduct = useCallback(({ item }: { item: Product }) => {
    if (!item) return null;
    return <ProductCard product={item} />;
  }, []);
  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [products, searchQuery]);

  if (!hashydrated) {
    return null;
  }
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.error} />
        <Text style={styles.errorText}>Failed to load products.</Text>
        <Text style={styles.retryText} onPress={() => refetch()}>
          Tap to retry
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing" // Adds an 'x' button on iOS
          accessibilityLabel="Search products input"
        />
      </View>

      {/* Product List */}
      <FlatList
        key={`grid-${numColumns}`}
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
        renderItem={renderProduct}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === "android"} // Only for Android
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        // Empty State
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={Colors.text} />
            <Text style={styles.emptyText}>No products match your search.</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={Colors.primary}
          />
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.greyBackground, // Standard iOS grey background from PDF
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 44,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    color: Colors.error,
    fontWeight: "600",
  },
  retryText: {
    marginTop: 8,
    fontSize: 16,
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.text,
  },
});
