import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../services/api";

function ProductDetails({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("Product details loading error:", err);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-container">
        <h1>Product not found</h1>
        <div className="empty-box">
          <p>{error || "We could not find that product."}</p>
          <Link to="/products" className="green-button">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const available = Number(product.available ?? 0);
  const isOutOfStock = available <= 0;

  const stock =
    product.stock ||
    (available <= 0
      ? "Out of Stock"
      : available <= 5
        ? "Low Stock"
        : "In Stock");

  const badgeClass =
    stock === "In Stock"
      ? "in-stock"
      : stock === "Low Stock"
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
        <Link
          to={`/products?category=${encodeURIComponent(
            product.categorySlug || product.category
          )}`}
        >
          {product.category}
        </Link>{" "}
        / {product.name}
      </p>

      <div className="pd-layout">
        <div className="pd-main-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            "No image available"
          )}
        </div>

        <div className="pd-info">
          <h1>{product.name}</h1>

          <p className="pd-sub">
            {product.category} · {product.unit || ""}
          </p>

          <p className="pd-price">
            Rs. {product.price.toLocaleString()}
          </p>

          <div className="pd-meta">
            <span className={`stock-pill ${badgeClass}`}>
              {stock}
            </span>

            <span>Available: {available}</span>

            {product.expiry && (
              <span>Expiry: {product.expiry}</span>
            )}
          </div>

          <p className="pd-description">
            {product.description || "No description available."}
          </p>

          <div className="pd-quantity">
            <span>Quantity</span>

            <div className="qty-control">
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
                disabled={isOutOfStock || quantity <= 1}
              >
                −
              </button>

              <span>{quantity}</span>

              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(available, q + 1))
                }
                disabled={isOutOfStock || quantity >= available}
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
            <button
              className="green-button"
              onClick={handleAdd}
              disabled={isOutOfStock}
            >
              Add to Cart
            </button>

            <button
              className="light-button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
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
