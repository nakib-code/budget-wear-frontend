import api from "@/lib/api";
import { Product } from "@/types/product";

interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
}

interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Product;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  price: string;
  sizes: {
    size: string;
    stock: number;
  }[];
  image: File;
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await api<ProductsResponse>("/products");

  return response.data;
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<CreateProductResponse> => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("description", payload.description);
  formData.append("price", payload.price);
  formData.append("sizes", JSON.stringify(payload.sizes));
  formData.append("image", payload.image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  const data = (await response.json()) as CreateProductResponse;

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create product",
    );
  }

  return data;
};

export const deleteProduct = async (
  productId: number,
): Promise<void> => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const data = (await response.json()) as {
    success: boolean;
    message: string;
  };

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete product",
    );
  }
};