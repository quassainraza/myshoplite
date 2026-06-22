import React from "react";
import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Product } from "@/types";
import { Colors } from "@/constants/Colors";

interface ProductListProps<Product> {
  data: Product[];
  numColumns: number;
  isRefetching?: boolean;
  onRefresh?: () => void;
  // Allows different empty states per screen if needed
  emptyMessage?: string;
  renderItem?: ListRenderItem<Product>;
  ListEmptyComponent?: React.ReactElement;
  isFetchingMore?: boolean;
  onEndReached?: () => void;
}

export const ProductList: React.FC<ProductListProps<Product>> = ({
  data,
  numColumns,
  isRefetching = false,
  onRefresh,
  renderItem,
  ListEmptyComponent,
  isFetchingMore = false,
  onEndReached,
}) => {
  // The loader to show at the bottom
  const renderFooter = () => {
    if (!isFetchingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };
  return (
    <FlashList
      key={`grid-${numColumns}`} // 💡 Keeps FlashList performance key
      data={data}
      style={styles.list}
      keyExtractor={(item) => item?.id}
      numColumns={numColumns}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
      removeClippedSubviews={Platform.OS === "android"}
      scrollEventThrottle={16}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      ListEmptyComponent={
        <View style={styles.emptyContainer}>{ListEmptyComponent}</View>
      }
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 8,
    flexGrow: 1, // Ensures empty state centers correctly
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.text,
  },
  footerLoader: {
    alignItems: "center",
    marginTop: 10,
  },
});
