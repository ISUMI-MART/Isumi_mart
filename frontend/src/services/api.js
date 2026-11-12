
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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order");
  }

  return data;
};

export const createOrderItem = async (itemData) => {
  const response = await fetch(`${API_URL}/order-items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(itemData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create order item");
  }

  return data;
};

export const getMyOrders = async () => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load orders");
  }

  return data;
};

export const getOrderById = async (id) => {
  if (!id) {
    throw new Error("Order ID is missing");
  }

  const response = await fetch(`${API_URL}/orders/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load order");
  }

  return data;
};


export async function getCart() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/carts`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get cart");
  }

  return data;
}


// ADD TO CART
export async function addCartItem(productId, quantity = 1) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/carts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add product to cart");
  }

  return data;
}


// UPDATE QUANTITY
export async function updateCartItem(productId, quantity) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/carts/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update cart");
  }

  return data;
}


// REMOVE FROM CART
export async function removeCartItem(productId) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/carts/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to remove item");
  }

  return data;
}


// CLEAR CART
export async function clearCart() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/carts`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to clear cart");
  }

  return data;
}
