export interface ProductInventory {
  id: number;
  productId: number;
  size: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string;
  isActive: boolean;
  inventories: ProductInventory[];
}