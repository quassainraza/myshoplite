//this component is responsible for rendering the product card in the product list screen
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";

interface ProductCardProps {
  product: Product;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({ product }) => {
  const { width } = useWindowDimensions();
  // Responsive check: if width >= 768px (Tablet/Web), use half screen width minus padding..
  const isLargeScreen = width >= 768;
  const cardWidth = isLargeScreen ? width / 2 - 24 : "100%";
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));

  console.log(
    `Rendering ProductCard for ${product.name} (ID: ${product.id}) - Favorite: ${isFavorite}`,
  ); // Debugging line

  // Debugging line
  return (
    <Link
      href={{
        pathname: "/product/[id]",
        params: { id: product.id },
      }}
      asChild
    >
      <TouchableOpacity
        style={StyleSheet.flatten([styles.card, { width: cardWidth }])}
        activeOpacity={0.8}
      >
        {/* Product Image */}
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`Image of ${product.name}`}
        />

        {/* Favorite Toggle Button */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={() => toggleFavorite(product.id)}
          accessibilityLabel={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
          accessibilityRole="button"
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? Colors.error : Colors.text}
          />
        </TouchableOpacity>

        {/* Product Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
  },
  favoriteBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary, // iOS Blue from design guidelines
  },
});
// 💡 FIX: Deep comparison rule to optimize for state tracking
export const ProductCard = React.memo(
  ProductCardComponent,
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.name === nextProps.product.name &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.image === nextProps.product.image
    );
  },
);
