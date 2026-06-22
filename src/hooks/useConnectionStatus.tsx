import { useNetInfo } from "@react-native-community/netinfo";

export const useConnectionStatus = () => {
  const netInfo = useNetInfo();
  return {
    isOffline: netInfo.isConnected === false,
  };
};
