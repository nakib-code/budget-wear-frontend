import api from "@/lib/api";

interface UpdateInventoryResponse {
  success: boolean;
  message: string;
  data: {
    id: number;
    productId: number;
    size: string;
    stock: number;
  };
}

export const updateInventory = async (
  inventoryId: number,
  stock: number,
): Promise<UpdateInventoryResponse> => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  return api<UpdateInventoryResponse>(
    `/inventory/${inventoryId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stock,
      }),
    },
  );
};