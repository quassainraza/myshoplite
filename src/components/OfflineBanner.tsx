import { Colors } from "@/constants/Colors";
import { useConnectionStatus } from "@/hooks/useConnectionStatus";
import { View, Text, StyleSheet } from "react-native";

// components/OfflineBanner.tsx
export const OfflineBanner = () => {
  const { isOffline } = useConnectionStatus();

  if (!isOffline) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        No internet connection. Viewing cached data.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.error,
    padding: 10,
    alignItems: "center",
  },
  text: { color: "white", fontWeight: "bold" },
});
