import React from "react";
import { Link } from "react-router-dom";

function ProductCard({ product, addToCart }) {
  const isOutOfStock = product.stock === "Out of Stock";

  const badgeClass =
    product.stock === "In Stock"
      ? "in-stock"
      : product.stock === "Low Stock"
      ? "low-stock"
      : "out-stock";

  return (
    <div className="product-card">
      {/* Clicking the picture opens the Product Details page */}
      <Link to={`/products/${product.id}`} className="product-image">
        {product.image ? (
        <img src={product.image} alt={product.name} />
        ) : (
        <span>{product.icon}</span>
        )}
        <div className={`stock-badge ${badgeClass}`}>{product.stock}</div>
      </Link>

      <div className="product-info">
        <h3>
          <Link to={`/products/${product.id}`} className="product-name-link">
            {product.name}
          </Link>
        </h3>

        <p className="product-unit">{product.unit}</p>

        <div className="product-bottom">
          <strong>Rs. {product.price.toLocaleString()}</strong>

          <button
            className="add-button"
            disabled={isOutOfStock}
            onClick={() => addToCart(product)}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
