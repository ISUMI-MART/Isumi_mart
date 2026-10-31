import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById, PRODUCT_DESCRIPTION } from "../data/products";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = getProductById(id);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="page-container">
        <h1>Product not found</h1>
        <div className="empty-box">
          <p>We could not find that product.</p>
          <Link to="/products" className="green-button">Back to Products</Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === "Out of Stock";

  const badgeClass =
    product.stock === "In Stock"
      ? "in-stock"
      : product.stock === "Low Stock"
      ? "low-stock"
      : "out-stock";

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/checkout/address");
  };

  return (
    <div className="pd-page">
      <p className="pd-breadcrumb">
        <Link to="/products">Products</Link> /{" "}
        <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>{" "}
        / {product.name}
      </p>

      <div className="pd-layout">
          <div className="pd-main-image">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              product.icon
            )}
          </div>
        

        {/* Information */}
        <div className="pd-info">
          <h1>{product.name}</h1>
          <p className="pd-sub">{product.category} · {product.unit}</p>
          <p className="pd-price">Rs. {product.price.toLocaleString()}</p>

          <div className="pd-meta">
            <span className={`stock-pill ${badgeClass}`}>{product.stock}</span>
            <span>Available: {product.available}</span>
            <span>Expiry: {product.expiry}</span>
          </div>

          <p className="pd-description">{PRODUCT_DESCRIPTION}</p>

          <div className="pd-quantity">
            <span>Quantity</span>
            <div className="qty-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={isOutOfStock || quantity <= 1}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.available, q + 1))}
                disabled={isOutOfStock || quantity >= product.available}
              >
                +
              </button>
            </div>
          </div>

          {isOutOfStock && (
            <p className="pd-warning">
              This product is out of stock. Please check back later.
            </p>
          )}

          <div className="pd-actions">
            <button className="green-button" onClick={handleAdd} disabled={isOutOfStock}>
              Add to Cart
            </button>
            <button className="light-button" onClick={handleBuyNow} disabled={isOutOfStock}>
              Buy Now
            </button>
          </div>

          {added && (
            <p className="pd-added">
              ✓ Added to cart. <Link to="/cart">View cart</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
