import React from "react";
import { Link } from "react-router-dom";


function Cart({ cart = [], removeFromCart, updateQuantity }) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const delivery = cart.length > 0 ? 200 : 0;

  return (
    <div className="page-container">
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-box">
          <span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shopping-cart preview-icon"><path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18" /><path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25" /><circle cx="18" cy="20" r="2" /><circle cx="8" cy="20" r="2" /></svg></span>
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus preview-icon"><path d="M5 12h14"/></svg>
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.available}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus preview-icon"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
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
