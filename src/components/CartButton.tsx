import { useCartStore } from "@/store/useCart";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { DrawerActions } from "expo-router/build/react-navigation";
import { TouchableOpacity, View, Text } from "react-native";

const CartButton = () => {
  const navigation = useNavigation();
  const totalItems = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      style={{ marginRight: 16, flexDirection: "row", alignItems: "center" }}
    >
      <Ionicons name="cart-outline" size={24} color="#000" />
      {totalItems > 0 && (
        <View
          style={{
            backgroundColor: "red",
            borderRadius: 10,
            paddingHorizontal: 6,
            position: "absolute",
            top: -5,
            right: -10,
          }}
        >
          <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
            {totalItems}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CartButton;
