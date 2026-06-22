//this component is responsible for rendering the product card in the product list screen
import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  DimensionValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "@/types";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import { useCartStore } from "@/store/useCart";

interface ProductCardProps {
  product: Product;
  cardWidth?: DimensionValue;
}

const ProductCardComponent: React.FC<ProductCardProps> = ({
  product,
  cardWidth,
}) => {
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));

  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <Link
      href={{
        pathname: "/product/[id]",
        params: { id: product.id },
      }}
      asChild
    >
      <TouchableOpacity
        style={StyleSheet.flatten([
          styles.card,
          { width: cardWidth || "100%" },
        ])}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          contentFit="cover"
          accessibilityLabel={`Image of ${product.name}`}
        />

        {/* Favorite Toggle Button */}
        <TouchableOpacity
          style={styles.favoriteBtn}
          onPress={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
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
          <View style={styles.bottomRow}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>

            <TouchableOpacity
              testID="add-to-cart-btn"
              style={styles.cartBtn}
              onPress={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <Ionicons name="cart-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 8,
  },
});
// 💡 FIX: Deep comparison rule to optimize for state tracking
export const ProductCard = memo(
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
