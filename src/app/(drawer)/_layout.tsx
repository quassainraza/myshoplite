import { Drawer } from "expo-router/drawer";
import { CartDrawer } from "@/components/CartDrawer"; // Adjust path if needed

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={() => <CartDrawer />}
      screenOptions={{
        drawerPosition: "right",
        headerShown: false, // 🛑 Hide the Drawer header so the Tabs header shows!
        drawerType: "front", // Makes it slide smoothly over the screen
      }}
    >
      {/* Map to the (tabs) folder inside the drawer */}
      <Drawer.Screen name="(tabs)" />
    </Drawer>
  );
}
