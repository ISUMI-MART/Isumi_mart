import React from "react";
import { Link } from "react-router-dom";
import { DELIVERY_FEE } from "../data/orders";

function Cart({ cart, removeFromCart, updateQuantity }) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const delivery = cart.length > 0 ? DELIVERY_FEE : 0;

  return (
    <div className="page-container">
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-box">
          <span>🛒</span>
          <p>Your cart is empty. Browse products to add items.</p>
          <Link to="/products" className="green-button">Browse Products</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-row" key={item.id}>
                <div className="cart-thumb">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    item.icon
                  )}
                </div>

                <div className="cart-row-info">
                  <Link to={`/products/${item.id}`}>{item.name}</Link>
                  <small>{item.unit} · Rs. {item.price.toLocaleString()}</small>
                </div>

                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.available}
                  >
                    +
                  </button>
                </div>

                <strong className="cart-line-total">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </strong>

                <button
                  type="button"
                  className="cart-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Cart Summary</h3>
            <div><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div><span>Delivery Fee</span><span>Rs. {delivery.toLocaleString()}</span></div>
            <div className="cart-summary-total">
              <strong>Total</strong>
              <strong>Rs. {(subtotal + delivery).toLocaleString()}</strong>
            </div>
            <Link to="/checkout/address" className="green-button">Continue to Checkout</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
