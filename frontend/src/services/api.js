
const API_URL = import.meta.env.VITE_API_URL;


export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  const result = await response.json();

  const products = Array.isArray(result)
    ? result
    : Array.isArray(result.data)
      ? result.data
      : result.data?.products || result.products || [];

  if (!Array.isArray(products)) {
    console.error("Invalid products response:", result);
    return [];
  }

  return products
    .filter((product) => product.isActive !== false)
    .map((product) => ({
      ...product,
      price: Number(product.price),
      image: product.imageUrl || product.image || "",
      category: product.category?.name || "",
    }));
}


export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error("Unable to load product details");
  }

  const result = await response.json();

  const product = result.data?.product || result.data || result.product || result;

  if (!product || typeof product !== "object" || !product.id) {
    return null;
  }

  return {
    ...product,
    price: Number(product.price),
    image: product.imageUrl || product.image || "",
    category: product.category?.name || product.categoryName || "",
    available: product.stockQuantity ?? product.available ?? 0,
    stock:
      product.stockQuantity === undefined
        ? product.stock
        : product.stockQuantity <= 0
          ? "Out of Stock"
          : product.stockQuantity <= 5
            ? "Low Stock"
            : "In Stock",
  };
}



export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  if (!response.ok) {
    throw new Error("Unable to load categories");
  }

  const result = await response.json();

  console.log("Categories API response:", result);

  const categories = Array.isArray(result)
    ? result
    : result.data || result.categories || [];

  return Array.isArray(categories) ? categories : [];
}
