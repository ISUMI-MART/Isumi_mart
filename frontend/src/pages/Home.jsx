import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
// import { products, homeCategories } from "../data/products";
import { getProducts, getCategories } from "../services/api";

function Home({ addToCart }) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHomeData = async () => {
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
        console.error("Home page loading error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  const featuredProducts = products.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    navigate(
      query
        ? `/products?search=${encodeURIComponent(query)}`
        : "/products"
    );
  };

  return (
    <>
      <div className="home-page">
        <section className="home-container">

          {/* Search */}
          <form className="home-search" onSubmit={handleSearch}>
            <span className="search-icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search preview-icon"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg></span>

            <input
              type="text"
              placeholder="Search fresh groceries and everyday essentials."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          {/* Hero Banner */}
          <div className="home-hero">

            <div className="home-hero-content">
              <span className="home-hero-label">
                Fresh picks. Everyday prices.
              </span>

              <h1>
                Your neighborhood
                <br />
                grocer, at your door.
              </h1>

              <div className="home-hero-description">
                <p>From crisp vegetables to pantry staples.</p>
                <p>Good things for your everyday table.</p>
              </div>

              <Link to="/products" className="home-shop-button">
                Shop fresh essentials
              </Link>

              <span className="home-hero-note">
                Local delivery • Pay with cash when it arrives
              </span>
            </div>

            <div className="home-hero-image">
              <img
                src="/images/hero.jpg"
                alt="Fresh groceries"
              />
            </div>

          </div>

          {/* Benefits */}
          <div className="home-benefits">

            <div className="home-benefit">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck preview-icon"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg></span>
              Neighborhood delivery
            </div>

            <div className="home-benefit">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-truck preview-icon"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg></span>
              Freshly picked quality
            </div>

            <div className="home-benefit">
              <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-hand-coins preview-icon"><path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" /><path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" /><path d="m2 16 6 6" /><circle cx="16" cy="9" r="2.9" /><circle cx="6" cy="5" r="3" /></svg></span>
              Cash on Delivery only
            </div>

          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="section-heading">
            <div>
              <span className="small-title">Shop by aisle</span>
              <h2>Browse our market</h2>
            </div>
            <Link to="/products" className="view-link">View everything</Link>
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const count = products.filter(
                (product) => product.categoryId === category.id
              ).length;

              return (
                <Link
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                  className="category-card"
                  key={category.id}
                >
                  <div className="category-icon">🛒</div>

                  <div>
                    <h3>{category.name}</h3>
                    <p>{count} items</p>
                  </div>

                  <span className="category-arrow">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Products */}
        <section className="section products-section">
          <div className="section-heading">
            <div>
              <span className="small-title">Customer favourites</span>
              <h2>Fresh from the shelves</h2>
            </div>
            <Link to="/products" className="view-link">View all</Link>
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p>{error}</p>
          ) : featuredProducts.length === 0 ? (
            <p>No products available yet.</p>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  addToCart={addToCart}
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </>
  );
}

export default Home;