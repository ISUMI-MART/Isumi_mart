
const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts({
  page = 1,
  limit = 10,
  search = "",
  categorySlug = "",
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) {
    params.set("search", search);
  }

  if (categorySlug) {
    params.set("categorySlug", categorySlug);
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  const result = await response.json();

  const products = result.data?.products || [];

  const formattedProducts = products
    .filter((product) => product.isActive !== false)
    .map((product) => {
      const available = Number(
        product.stockConfig?.quantity ?? 0
      );

      const threshold = Number(
        product.stockConfig?.lowStockThreshold ?? 5
      );

      return {
        ...product,
        price: Number(product.price),
        image: product.imageUrl || product.image || "",
        category: product.category?.name || "",
        categorySlug: product.category?.slug || "",
        available,
        stock:
          available <= 0
            ? "Out of Stock"
            : available <= threshold
              ? "Low Stock"
              : "In Stock",
      };
    });

  return {
    products: formattedProducts,
    pagination: result.data?.pagination,
  };
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error("Unable to load product");
  }

  const result = await response.json();
  const product = result.data;

  if (!product || !product.id) {
    return null;
  }

  const available = Number(product.stockConfig?.quantity ?? 0);

  const threshold = Number(
    product.stockConfig?.lowStockThreshold ?? 5
  );

  let stock = "In Stock";

  if (available <= 0) {
    stock = "Out of Stock";
  } else if (available <= threshold) {
    stock = "Low Stock";
  }

  return {
    ...product,
    price: Number(product.price),
    image: product.imageUrl || "",
    category: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    available,
    stock,
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

export async function getProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/users/profile`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Unable to load profile");
    }

    const result = await response.json();

    console.log("PROFILE API RESPONSE:", result);

    return result.user;
}

export async function updateProfile(profileData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update profile");
  }

  return result.user;
}