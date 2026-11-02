import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/products";

function Products({ addToCart }) {
  // The filter lives in the web address, e.g. /products?category=Fruits&search=ban
  // This way the Home category cards and Footer links can open a filtered list.
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const category = categories.includes(categoryParam) ? categoryParam : "All";
  const search = searchParams.get("search") || "";

  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => {
      if (value && value !== "All") next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "category-tab active" : "category-tab"}
            onClick={() => updateParams({ category: item })}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-box">
          <span>🔎</span>
          <h3>No products found</h3>
          <p>Try another product name or category.</p>
        </div>
      )}
    </div>
  );
}

export default Products;
