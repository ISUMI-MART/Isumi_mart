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

  const response = await fetch(`${API_URL}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Unable to load products");
  }

  const result = await response.json();

  const products = result.data?.products || [];

  const formattedProducts = products
    .filter((product) => product.isActive !== false)
    .map((product) => {
      const available = Number(product.stockConfig?.quantity ?? 0);

      const threshold = Number(product.stockConfig?.lowStockThreshold ?? 5);

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

  const threshold = Number(product.stockConfig?.lowStockThreshold ?? 5);

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

  const categories = Array.isArray(result)
    ? result
    : result.data || result.categories || [];

  return Array.isArray(categories) ? categories : [];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getProfile() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Unable to update profile");
  }

  return result.user;
}
export async function deleteProfile() {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid delete profile response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Unable to delete account.");
  }

  return data;
}

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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
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
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to clear cart");
  }

  return data;
}

// OWNER - ORDERS

export const getOrders = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid orders response from server.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders.");
  }

  return data;
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (orderId, status, extraData = {}) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      status,
      ...extraData,
    }),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid order update response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to update order status.");
  }

  return data;
}; // CUSTOMER - CANCEL ORDER
export const cancelOrder = async (orderId) => {
  return await updateOrderStatus(orderId, "CANCELLED");
};

// ===============================
// OWNER - STOCK
// ===============================

export const getStock = async () => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/stocks`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid stock response from server.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch stock.");
  }

  return data;
};

// OWNER - PRODUCT MANAGEMENT

export const createProduct = async (productData) => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create product");
  }

  return data;
};

export const updateProduct = async (id, productData) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update product");
  }

  return data;
};

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete product");
  }

  return data;
};

// RECORD STOCK MOVEMENT (OWNER)

export const createStockMovement = async (movementData) => {
  const response = await fetch(`${API_URL}/stock-movements`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(movementData),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid stock movement response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to update stock.");
  }

  return data;
};

// GET STOCK MOVEMENT HISTORY

export const getStockMovements = async (productId) => {
  const endpoint = productId
    ? `${API_URL}/stock-movements/product/${productId}`
    : `${API_URL}/stock-movements`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid stock history response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load stock history.");
  }

  return data;
};

// OWNER - DELIVERY AGENTS

export const getDeliveryAgents = async () => {
  const response = await fetch(`${API_URL}/users/delivery-agents`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid delivery agents response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load delivery agents.");
  }

  return data.data || [];
};

export const createDeliveryAgent = async (agentData) => {
  const response = await fetch(`${API_URL}/users/delivery-agents`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(agentData),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid create-agent response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to create delivery agent.");
  }

  return data;
};

// ASSIGN DELIVERY AGENT TO ORDER

export const assignDeliveryAgent = async (orderId, deliveryAgentId) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/assign-agent`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      deliveryAgentId: Number(deliveryAgentId),
    }),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid agent assignment response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to assign delivery agent.");
  }

  return data;
};
// ===============================
// OWNER - WALK-IN SALES
// ===============================

export const getWalkInSales = async () => {
  const response = await fetch(`${API_URL}/walk-in-sales`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid walk-in sales response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load walk-in sales.");
  }

  return data.sales || [];
};

export const createWalkInSale = async (saleData) => {
  const response = await fetch(`${API_URL}/walk-in-sales`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(saleData),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid create sale response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to complete walk-in sale.");
  }

  return data.sale;
};

export const getWalkInSaleById = async (id) => {
  const response = await fetch(`${API_URL}/walk-in-sales/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid walk-in sale response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load walk-in sale.");
  }

  return data.sale;
};

export const getWalkInSaleItems = async (saleId) => {
  const response = await fetch(`${API_URL}/walk-in-sale-items/sale/${saleId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid walk-in sale items response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to load sale items.");
  }

  return data.items || [];
};

export const deleteDeliveryAgent = async (id) => {
  const response = await fetch(`${API_URL}/users/delivery-agents/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid delete-agent response.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete delivery agent.");
  }

  return data;
};
