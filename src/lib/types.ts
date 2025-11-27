export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  imageHint: string;
  category?: string;
  tags?: string[];
  priceRange?: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
