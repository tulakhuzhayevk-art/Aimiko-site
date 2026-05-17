import { client } from "./client";
import { products as localProducts } from "@/data/products";
import type { Product, ProductSpec } from "@/data/products";

export async function getProducts(): Promise<Product[]> {
  try {
    const query = `*[_type == "product"] | order(_createdAt desc) {
      "id": slug.current,
      name,
      category,
      categoryId,
      subcategoryId,
      description,
      price,
      oldPrice,
      wholesalePrice,
      status,
      specs,
      shortSpecs,
      "images": images[].asset->url,
      isPopular,
      isNew
    }`;

    const sanityProducts = await client.fetch(query);

    if (!sanityProducts || sanityProducts.length === 0) {
      console.log("Sanity пуст — используем локальные данные");
      return localProducts;
    }

    // Объединяем: Sanity товары + локальные
    const sanityIds = sanityProducts.map((p: any) => p.id);
    const localOnly = localProducts.filter((p) => !sanityIds.includes(p.id));

    const formatted = sanityProducts.map((p: any) => ({
      id: p.id || "",
      name: p.name || "",
      category: p.category || "",
      categoryId: p.categoryId || "",
      subcategoryId: p.subcategoryId || "",
      description: p.description || "",
      price: p.price || "0 ₽",
      oldPrice: p.oldPrice || undefined,
      wholesalePrice: p.wholesalePrice || "",
      status: p.status || "В наличии",
      specs: (p.specs || []).map((s: any) => ({
        label: s.label || "",
        value: s.value || "",
      })) as ProductSpec[],
      shortSpecs: p.shortSpecs || [],
      images: (p.images || []).filter(Boolean),
      isPopular: p.isPopular || false,
      isNew: p.isNew || false,
    }));

    return [...formatted, ...localOnly];
  } catch (error) {
    console.error("Ошибка загрузки из Sanity:", error);
    return localProducts;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const query = `*[_type == "product" && slug.current == $id][0] {
      "id": slug.current,
      name,
      category,
      categoryId,
      subcategoryId,
      description,
      price,
      oldPrice,
      wholesalePrice,
      status,
      specs,
      shortSpecs,
      "images": images[].asset->url,
      isPopular,
      isNew
    }`;

    const p = await client.fetch(query, { id });

    if (!p) {
      // Ищем в локальных
      return localProducts.find((lp) => lp.id === id) || null;
    }
    return {
      id: p.id || "",
      name: p.name || "",
      category: p.category || "",
      categoryId: p.categoryId || "",
      subcategoryId: p.subcategoryId || "",
      description: p.description || "",
      price: p.price || "0 ₽",
      oldPrice: p.oldPrice || undefined,
      wholesalePrice: p.wholesalePrice || "",
      status: p.status || "В наличии",
      specs: (p.specs || []).map((s: any) => ({
        label: s.label || "",
        value: s.value || "",
      })) as ProductSpec[],
      shortSpecs: p.shortSpecs || [],
      images: (p.images || []).filter(Boolean),
      isPopular: p.isPopular || false,
      isNew: p.isNew || false,
    };
  } catch (error) {
    console.error("Ошибка загрузки товара из Sanity:", error);
    return localProducts.find((lp) => lp.id === id) || null;
  }
}