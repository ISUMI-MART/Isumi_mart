// const API_URL = import.meta.env.VITE_API_URL;


// export async function getProducts() {
//   const response = await fetch(`${API_URL}/products`);

//   if (!response.ok) {
//     throw new Error("Unable to load products");
//   }

//   const result = await response.json();

//   const products = Array.isArray(result)
//     ? result
//     : Array.isArray(result.data)
//       ? result.data
//       : result.data?.products || result.products || [];

//   if (!Array.isArray(products)) {
//     console.error("Invalid products response:", result);
//     return [];
//   }

//   return products
//   .filter((product) => product.isActive !== false)
//   .map((product) => {
//     const available = Number(product.stockConfig?.quantity ?? 0);
//     const threshold = Number(
//       product.stockConfig?.lowStockThreshold ?? 5
//     );

//     return {
//       ...product,
//       price: Number(product.price),
//       image: product.imageUrl || product.image || "",
//       category: product.category?.name || "",
//       categorySlug: product.category?.slug || "",
//       available,
//       stock:
//         available <= 0
//           ? "Out of Stock"
//           : available <= threshold
//             ? "Low Stock"
//             : "In Stock",
//     };
//   });
// }


// export async function getProductById(id) {
//   const response = await fetch(`${API_URL}/products/${id}`);

//   if (!response.ok) {
//     if (response.status === 404) {
//       return null;
//     }

//     throw new Error("Unable to load product");
//   }

//   const result = await response.json();
//   const product = result.data;

//   if (!product || !product.id) {
//     return null;
//   }

//   const available = Number(product.stockConfig?.quantity ?? 0);

//   const threshold = Number(
//     product.stockConfig?.lowStockThreshold ?? 5
//   );

//   let stock = "In Stock";

//   if (available <= 0) {
//     stock = "Out of Stock";
//   } else if (available <= threshold) {
//     stock = "Low Stock";
//   }

//   return {
//     ...product,
//     price: Number(product.price),
//     image: product.imageUrl || "",
//     category: product.category?.name || "",
//     categorySlug: product.category?.slug || "",
//     available,
//     stock,
//   };
// }



// export async function getCategories() {
//   const response = await fetch(`${API_URL}/categories`);

//   if (!response.ok) {
//     throw new Error("Unable to load categories");
//   }

//   const result = await response.json();

//   console.log("Categories API response:", result);

//   const categories = Array.isArray(result)
//     ? result
//     : result.data || result.categories || [];

//   return Array.isArray(categories) ? categories : [];
// }


const API_URL = import.meta.env.VITE_API_URL;

async function handleResponse(response, message) {
  if (!response.ok) {
    throw new Error(message);
  }

  return response.json();
}

function mapProduct(product) {
  const available = Number(product.stockConfig?.quantity ?? 0);
  const threshold = Number(
    product.stockConfig?.lowStockThreshold ?? 5
  );

  return {
    ...product,
    price: Number(product.price),
    image: product.imageUrl || "",
    categoryName: product.category?.name || "",
    categorySlug: product.category?.slug || "",
    available,
    stock:
      available <= 0
        ? "Out of Stock"
        : available <= threshold
          ? "Low Stock"
          : "In Stock",
  };
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`);
  const result = await handleResponse(
    response,
    "Unable to load products"
  );

  const products = result.data?.products || [];

  if (!Array.isArray(products)) {
    throw new Error("Invalid products response");
  }

  return products
    .filter((product) => product.isActive !== false)
    .map(mapProduct);
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/products/${id}`);

  if (response.status === 404) {
    return null;
  }

  const result = await handleResponse(
    response,
    "Unable to load product"
  );

  const product = result.data?.product || result.data;

  return product?.id ? mapProduct(product) : null;
}

export async function getCategories() {
  const response = await fetch(`${API_URL}/categories`);

  const result = await handleResponse(
    response,
    "Unable to load categories"
  );

  const categories = result.data?.categories || result.data || [];

  return Array.isArray(categories) ? categories : [];
}
