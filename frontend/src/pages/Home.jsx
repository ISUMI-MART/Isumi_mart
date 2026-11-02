import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { products, homeCategories } from "../data/products";

function Home({ addToCart }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // The reference home page shows the first 6 products
  const featuredProducts = products.slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : "/products");
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-label">Your neighbourhood grocery</span>

            <h1>
              Fresh essentials, <span>from our shelves to your door.</span>
            </h1>

            <p>
              Shop everyday groceries with clear availability, reliable local
              delivery and simple Cash on Delivery.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="primary-button">Shop groceries</Link>
              <Link to="/login" className="secondary-button">Login or register</Link>
            </div>
          </div>

          <div className="hero-image">
            <img className="hero-photo" src="/images/hero.jpg" alt="Fresh groceries" />
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="search-section">
        <form className="search-box" onSubmit={handleSearch}>
          <span>🔎</span>
          <input
            type="text"
            placeholder="What are you shopping for today?"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="search-button">Search products</button>
        </form>
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
          {homeCategories.map((category) => (
            <Link
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              key={category.name}
            >
              <div className="category-icon">{category.icon}</div>
              <div>
                <h3>{category.name}</h3>
                <p>{category.count} items</p>
              </div>
              <span className="category-arrow">→</span>
            </Link>
          ))}
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

        <div className="product-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Staff */}
      <section className="staff-section">
        <div>
          <h2>Isumi Mart staff</h2>
          <p className="staff-text">Manage the shop or continue with assigned deliveries.</p>
        </div>

        <div className="staff-buttons">
          <Link to="/owner" className="staff-card">
            <span>👨‍💼</span>
            <div>
              <strong>Owner / Cashier</strong>
            </div>
            →
          </Link>

          <Link to="/delivery" className="staff-card">
            <span>🚚</span>
            <div>
              <strong>Delivery agent</strong>
            </div>
            →
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;