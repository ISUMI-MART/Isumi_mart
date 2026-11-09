// import React from "react";
// import { useSearchParams } from "react-router-dom";
// import ProductCard from "../components/ProductCard";
// import { products, categories } from "../data/products";

// function Products({ addToCart }) {
//   // The filter lives in the web address, e.g. /products?category=Fruits&search=ban
//   // This way the Home category cards and Footer links can open a filtered list.
//   const [searchParams, setSearchParams] = useSearchParams();

//   const categoryParam = searchParams.get("category");
//   const category = categories.includes(categoryParam) ? categoryParam : "All";
//   const search = searchParams.get("search") || "";

//   const updateParams = (changes) => {
//     const next = new URLSearchParams(searchParams);
//     Object.entries(changes).forEach(([key, value]) => {
//       if (value && value !== "All") next.set(key, value);
//       else next.delete(key);
//     });
//     setSearchParams(next, { replace: true });
//   };

//   const filteredProducts = products.filter((product) => {
//     const matchesCategory = category === "All" || product.category === category;
//     const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   return (
//     <div className="page-container">
//       <div className="page-header">
//         <h1>Products</h1>
//         <p>Search and filter the grocery catalogue</p>
//       </div>

//       <div className="products-controls">
//         <div className="products-search">
//           🔎
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={search}
//             onChange={(e) => updateParams({ search: e.target.value })}
//           />
//         </div>
//       </div>

//       <div className="category-tabs">
//         {categories.map((item) => (
//           <button
//             key={item}
//             className={category === item ? "category-tab active" : "category-tab"}
//             onClick={() => updateParams({ category: item })}
//           >
//             {item}
//           </button>
//         ))}
//       </div>

//       <div className="product-grid">
//         {filteredProducts.map((product) => (
//           <ProductCard key={product.id} product={product} addToCart={addToCart} />
//         ))}
//       </div>

//       {filteredProducts.length === 0 && (
//         <div className="empty-box">
//           <span>🔎</span>
//           <h3>No products found</h3>
//           <p>Try another product name or category.</p>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Products;

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/api";

function Products({ addToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryParam = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productData, categoryData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);

        setProducts(productData);
        setCategories(categoryData);
      } catch (err) {
        console.error("Products page loading error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value && value !== "All") {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next, { replace: true });
  };

  const categoryOptions = [
    { name: "All", slug: "All" },
    ...categories.map((item) => ({
      name: item.name,
      slug: item.slug,
    })),
  ];

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      categoryParam === "All" ||
      product.category?.toLowerCase() ===
      categoryOptions.find((item) => item.slug === categoryParam)?.name?.toLowerCase() ||
      product.category?.toLowerCase() === categoryParam.toLowerCase() ||
      product.category?.slug === categoryParam;

    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products</h1>
        <p>Search and filter the grocery catalogue</p>
      </div>

      <div className="products-controls">
        <div className="products-search">
          🔎
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => updateParams({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="category-tabs">
        {categoryOptions.map((item) => (
          <button
            key={item.slug}
            className={
              categoryParam === item.slug ||
                (categoryParam === "All" && item.slug === "All")
                ? "category-tab active"
                : "category-tab"
            }
            onClick={() => updateParams({ category: item.slug })}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-box">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search preview-icon"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg></span>
          <h3>No products found</h3>
          <p>Try another product name or category.</p>
        </div>
      )}
    </div>
  );
}

export default Products;
