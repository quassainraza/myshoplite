// services/api.ts
import { Product } from "@/types";
import { sampleProducts } from "./mockData";

//const API_URL = "https://mocki.io/v1/c53fb45e-5085-487a-afac-0295f62fb86e";

export const fetchProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return sampleProducts;
};

//   try {
//     const response = await fetch(API_URL);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error; // TanStack Query will catch this for error handling
//   }
