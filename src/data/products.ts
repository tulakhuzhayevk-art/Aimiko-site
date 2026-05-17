export type ProductSpec = {
  label: string;
  value: string;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  subcategoryId: string;
  description: string;
  price: string;
  oldPrice?: string;
  wholesalePrice: string;
  status: string;
  specs: ProductSpec[];
  shortSpecs: string[];
  images: string[];
  isPopular?: boolean;
  isNew?: boolean;
};

export const products: Product[] = [];