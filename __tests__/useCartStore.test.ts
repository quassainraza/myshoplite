jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

import { useCartStore } from "@/store/useCart";

const mockProduct = {
  id: "1",
  name: "Test Headphones",
  price: 100,
  image: "test-image.jpg",
  description: "A test product",
};

describe("Cart Store Zustand", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("should add a product to the cart", () => {
    useCartStore.getState().addToCart(mockProduct);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].name).toBe("Test Headphones");
    expect(items[0].quantity).toBe(1);
  });

  it("should increase quantity if the same product is added twice", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().addToCart(mockProduct);

    const items = useCartStore.getState().items;
    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
  });

  it("should calculate the correct total price", () => {
    useCartStore.getState().addToCart(mockProduct);
    useCartStore.getState().addToCart(mockProduct);

    const total = useCartStore.getState().getCartTotal();
    expect(total).toBe(200);
  });
});
