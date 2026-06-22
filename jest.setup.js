// jest.setup.js
import mockAsyncStorage from "@react-native-async-storage/async-storage/jest/async-storage-mock";

// Mock AsyncStorage (already mocked in __mocks__, but we need to ensure it's used in tests....)
jest.mock("@react-native-async-storage/async-storage", () => mockAsyncStorage);

// Mock Reanimated (if you use react-native-reanimated)
jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  return {
    ...Reanimated,
    // Add additional mock overrides here if needed
    useAnimatedStyle: jest.fn(),
    useSharedValue: jest.fn(),
    withTiming: jest.fn(),
  };
});
