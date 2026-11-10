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

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const currentPage = Math.max(
    1,
    Number(searchParams.get("page")) || 1
  );

  const categorySlug = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  // Load categories once
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Category loading error:", err);
      }
    };

    loadCategories();
  }, []);


  // Load products whenever page, search or category changes
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getProducts({
          page: currentPage,
          limit: 10,
          search,
          categorySlug,
        });

        setProducts(result.products);
        setPagination(result.pagination);
      } catch (err) {
        console.error("Products loading error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, search, categorySlug]);




  const updateParams = (changes) => {
    const next = new URLSearchParams(searchParams);

    Object.entries(changes).forEach(([key, value]) => {
      if (value && value !== "All") {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    setSearchParams(next);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Products</h1>
        <p>Search and filter the grocery catalogue</p>
      </div>

      <div className="products-controls">
        <div className="products-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search preview-icon"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              updateParams({ search: e.target.value })
            }
          />
        </div>
      </div>

      <div className="category-tabs">
        <button
          className={
            !categorySlug
              ? "category-tab active"
              : "category-tab"
          }
          onClick={() => updateParams({ category: "" })}
        >
          All
        </button>

        {categories.map((item) => (
          <button
            key={item.id}
            className={
              categorySlug === item.slug
                ? "category-tab active"
                : "category-tab"
            }
            onClick={() =>
              updateParams({ category: item.slug })
            }
          >
            {item.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
              />
            ))}
          </div>

          {pagination.totalPages > 0 && (
            <div className="products-pagination">
              <button
                disabled={currentPage <= 1}
                onClick={() =>
                  updateParams({ page: String(currentPage - 1) })
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left preview-icon"><path d="m15 18-6-6 6-6" /></svg>
              </button>

              <span>
                Page {currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={currentPage >= pagination.totalPages}
                onClick={() =>
                  updateParams({ page: String(currentPage + 1) })
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right preview-icon"><path d="m9 18 6-6-6-6" /></svg>
              </button>
            </div>
          )}



          {products.length === 0 && (
            <div className="empty-box">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search preview-icon"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg></span>
              <h3>No products found</h3>
              <p>Try another product name or category.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Products;
