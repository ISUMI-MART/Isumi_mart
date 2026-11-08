import { useState } from "react";

function WalkInSales({ products, saveProducts, sales, saveSales }) {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [completedSale, setCompletedSale] = useState(null);
  const [error, setError] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      product.stock > 0
  );

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  function addToCart(product) {
    setError("");

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        if (existing.quantity >= product.stock) {
          setError("Not enough stock available.");
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          unit: product.unit,
          emoji: product.emoji,
          quantity: 1,
        },
      ];
    });
  }

  function changeQuantity(productId, newQuantity) {
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    if (newQuantity <= 0) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId)
      );
      return;
    }

    if (newQuantity > product.stock) {
      setError(`Only ${product.stock} units of ${product.name} are available.`);
      return;
    }

    setError("");

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }

  function completeSale() {
    setError("");

    if (cart.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    // Check stock again before completing the sale.
    for (const item of cart) {
      const product = products.find((p) => p.id === item.id);

      if (!product || product.stock < item.quantity) {
        setError(`Insufficient stock for ${item.name}.`);
        return;
      }
    }

    const updatedProducts = products.map((product) => {
      const soldItem = cart.find((item) => item.id === product.id);

      if (!soldItem) return product;

      const newStock = product.stock - soldItem.quantity;

      return {
        ...product,
        stock: newStock,
        status:
          newStock === 0
            ? "Out of Stock"
            : newStock <= 10
            ? "Low Stock"
            : "In Stock",
      };
    });

    const sale = {
      id: `BILL-${Date.now()}`,
      date: new Date().toISOString(),
      customerName: customerName.trim() || "Walk-in Customer",
      paymentMethod,
      items: cart.map((item) => ({ ...item })),
      subtotal,
      total: subtotal,
      type: "WALK_IN",
    };

    saveProducts(updatedProducts);
    saveSales([sale, ...sales]);

    setCompletedSale(sale);
    setCart([]);
    setCustomerName("Walk-in Customer");
  }

  function startNewSale() {
    setCompletedSale(null);
    setCart([]);
    setSearch("");
    setError("");
  }

  if (completedSale) {
    return (
      <section className="content">
        <div className="panel receipt">
          <div className="receipt-header">
            <h2>Isumi Mart</h2>
            <p>Walk-in Sales Receipt</p>
            <span className="pill">Payment recorded</span>
          </div>

          <hr />

          <p><b>Bill No:</b> {completedSale.id}</p>
          <p>
            <b>Date:</b>{" "}
            {new Date(completedSale.date).toLocaleString()}
          </p>
          <p><b>Customer:</b> {completedSale.customerName}</p>
          <p><b>Payment:</b> {completedSale.paymentMethod}</p>

          <div className="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody>
                {completedSale.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>Rs. {item.price.toFixed(2)}</td>
                    <td>
                      Rs. {(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="receipt-total">
            Total: Rs. {completedSale.total.toFixed(2)}
          </h3>

          <p className="receipt-thanks">
            Thank you for shopping with Isumi Mart!
          </p>

          <div className="filters no-print">
            <button className="btn" onClick={() => window.print()}>
              Print bill
            </button>

            <button className="btn light" onClick={startNewSale}>
              New sale
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="content">
      <div className="eyebrow">POINT OF SALE</div>

      <h1 className="heading">Walk-in Sales</h1>
      <p className="sub">
        Sell products to customers visiting the shop.
      </p>

      {error && <p className="sale-error">{error}</p>}

      <div className="pos-layout">
        <div className="panel">
          <div className="panelhead">
            <h3>Available products</h3>
          </div>

          <input
            className="field search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="pos-products">
            {filteredProducts.map((product) => (
              <button
                className="pos-product"
                key={product.id}
                onClick={() => addToCart(product)}
              >
                <span className="pos-emoji">{product.emoji || "🛒"}</span>
                <b>{product.name}</b>
                <span>Rs. {Number(product.price).toFixed(2)}</span>
                <small>{product.stock} {product.unit} available</small>
              </button>
            ))}

            {filteredProducts.length === 0 && (
              <p className="empty">No available products found.</p>
            )}
          </div>
        </div>

        <div className="panel">
          <h3>Current bill</h3>

          <label className="pos-label">
            Customer name
            <input
              className="field"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Walk-in Customer"
            />
          </label>

          <div className="cart-items">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <b>{item.name}</b>
                  <small>
                    Rs. {item.price.toFixed(2)} each
                  </small>
                </div>

                <div className="quantity-control">
                  <button
                    onClick={() =>
                      changeQuantity(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      changeQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <b>
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </b>
              </div>
            ))}

            {cart.length === 0 && (
              <p className="empty">Select products to start a bill.</p>
            )}
          </div>

          <div className="pos-total">
            <span>Total amount</span>
            <strong>Rs. {subtotal.toFixed(2)}</strong>
          </div>

          

          <button
            className="btn complete-sale"
            disabled={cart.length === 0}
            onClick={completeSale}
          >
            Complete sale & generate bill
          </button>
        </div>
      </div>
    </section>
  );
}

export default WalkInSales;