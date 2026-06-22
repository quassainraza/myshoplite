import { render, fireEvent } from "@testing-library/react-native";
import { ProductCard } from "@/components/ProductCard";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));
jest.mock("expo-router", () => ({
  Link: ({ children }: any) => children,
  useRouter: () => ({ push: jest.fn() }),
}));
const mockProduct = {
  id: "2",
  name: "Leather Wallet",
  price: 45.0,
  image: "wallet.jpg",
  category: "Accessories",
  description: "A stylish leather wallet.",
};

describe("ProductCard Component", () => {
  const mockProduct = {
    id: "1",
    name: "Leather Wallet",
    price: 45.0,
    image: "https://example.com/image.jpg",
    category: "Accessories",
    description: "A stylish leather wallet.",
  };

  it("renders product details correctly", async () => {
    // 💡 Destructure the query methods directly
    const { getByText } = await render(<ProductCard product={mockProduct} />);

    expect(getByText("Leather Wallet")).toBeTruthy();
    expect(getByText("$45.00")).toBeTruthy();
  });

  it('adds item to Zustand cart when "Add to Cart" button is pressed', async () => {
    // 💡 Destructure getByTestId
    const { getByTestId } = await render(<ProductCard product={mockProduct} />);

    const addToCartBtn = getByTestId("add-to-cart-btn");
    fireEvent.press(addToCartBtn);

    // Optional: Add an assertion here to verify your store state changed
  });
});
