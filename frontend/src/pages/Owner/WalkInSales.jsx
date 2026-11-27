import { useEffect, useState } from "react";
import { getProducts, createWalkInSale } from "../../services/api";

function WalkInSales() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("Walk-in Customer");

  const [completedSale, setCompletedSale] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 15;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts({
        page: 1,
        limit: 100,
      });

      setProducts(result.products || []);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter((product) => {
    const available = Number(product.available ?? 0);

    return (
      product.name?.toLowerCase().includes(search.toLowerCase()) &&
      available > 0
    );
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity),
    0,
  );

  function isWeightProduct(product) {
    return ["kg", "kilogram", "kilograms"].includes(
      product.unit?.trim().toLowerCase(),
    );
  }

  function addToCart(product) {
    setError("");

    const available = Number(product.available ?? 0);

    const weightProduct = isWeightProduct(product);

    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === product.id);

      // Product already in cart
      if (existing) {
        const increment = weightProduct ? 0.25 : 1;

        const newQuantity = Number(
          (Number(existing.quantity) + increment).toFixed(3),
        );

        if (newQuantity > available) {
          setError(
            `Only ${available} ${
              product.unit || "units"
            } of ${product.name} are available.`,
          );

          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
              }
            : item,
        );
      }

      // Add new product
      return [
        ...currentCart,
        {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          unit: product.unit,
          image: product.imageUrl || "",
          quantity: 1,
          available,
        },
      ];
    });
  }

  // CHANGE QUANTITY

  function changeQuantity(productId, newQuantity) {
    const product = products.find((p) => p.id === productId);

    if (!product) {
      return;
    }

    const quantity = Number(newQuantity);

    const available = Number(product.available ?? 0);

    // Invalid number
    if (!Number.isFinite(quantity)) {
      return;
    }

    // Remove item
    if (quantity <= 0) {
      setCart((currentCart) =>
        currentCart.filter((item) => item.id !== productId),
      );

      setError("");
      return;
    }

    // Check stock
    if (quantity > available) {
      setError(
        `Only ${available} ${product.unit || "units"} of ${
          product.name
        } are available.`,
      );

      return;
    }

    // Weight product
    if (isWeightProduct(product)) {
      // Weight products must be sold in 250g increments
      if (isWeightProduct(product)) {
        const isValid250g = Math.round(quantity * 4) === quantity * 4;

        if (!isValid250g) {
          setError(`${product.name} must be sold in increments of 250g.`);

          return;
        }

        setError("");

        setCart((currentCart) =>
          currentCart.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity: Number(quantity.toFixed(2)),
                }
              : item,
          ),
        );

        return;
      }

      setError("");

      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: Number(quantity.toFixed(3)),
              }
            : item,
        ),
      );

      return;
    }

    // Normal product
    if (!Number.isInteger(quantity)) {
      setError(`${product.name} must be sold in whole quantities.`);

      return;
    }

    setError("");

    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item,
      ),
    );
  }

  // REMOVE ITEM

  function removeFromCart(productId) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== productId),
    );

    setError("");
  }

  // COMPLETE SALE

  function formatWeight(quantity, unit) {
    const normalizedUnit = unit?.trim().toLowerCase();

    if (["kg", "kilogram", "kilograms"].includes(normalizedUnit)) {
      const grams = Number(quantity) * 1000;

      if (grams < 1000) {
        return `${grams} g`;
      }

      return `${Number(quantity).toFixed(2)} kg`;
    }

    return `${quantity} ${unit || "unit"}`;
  }

  async function completeSale() {
    setCurrentPage(1);
    setError("");

    if (cart.length === 0) {
      setError("Please add at least one product.");
      return;
    }

    try {
      setSaving(true);

      const saleData = {
        customerName: customerName.trim() || "Walk-in Customer",

        paymentStatus: "PAID",

        items: cart.map((item) => ({
          productId: Number(item.id),

          quantity: Number(item.quantity),
        })),
      };

      const sale = await createWalkInSale(saleData);

      setCompletedSale({
        ...sale,
        paymentMethod,
      });

      setCart([]);

      setCustomerName("Walk-in Customer");

      setSearch("");

      // Get fresh stock
      await loadProducts();
    } catch (err) {
      setError(err.message || "Failed to complete walk-in sale.");
    } finally {
      setSaving(false);
    }
  }

  // START NEW SALE

  function startNewSale() {
    setCompletedSale(null);
    setCart([]);
    setSearch("");
    setError("");
    setPaymentMethod("Cash");
    setCustomerName("Walk-in Customer");

    loadProducts();
  }

  // RECEIPT

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

          <p>
            <b>Bill No:</b> {completedSale.billNumber}
          </p>

          <p>
            <b>Date:</b> {new Date(completedSale.createdAt).toLocaleString()}
          </p>

          <p>
            <b>Customer:</b> {completedSale.customerName || "Walk-in Customer"}
          </p>

          <p>
            <b>Payment:</b> {completedSale.paymentMethod || paymentMethod}
          </p>

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
                {completedSale.items?.map((item) => {
                  const price = Number(item.price);

                  const quantity = Number(item.quantity);

                  return (
                    <tr key={item.id}>
                      <td>{item.product?.name || "Product"}</td>
                      <td>{formatWeight(quantity, item.product?.unit)}</td>
                      <td>Rs. {price.toFixed(2)}</td>
                      <td>Rs. {(price * quantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <h3 className="receipt-total">
            Total: Rs. {Number(completedSale.totalAmount).toFixed(2)}
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

  // POS SCREEN

  return (
    <section className="content">
      <div className="eyebrow">POINT OF SALE</div>

      <h1 className="heading">Walk-in Sales</h1>

      <p className="sub">Sell products to customers visiting the shop.</p>

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
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />

          {loading ? (
            <p className="empty">Loading products...</p>
          ) : (
            <>
              <div className="pos-products">
                {currentProducts.map((product) => (
                  <button
                    className="pos-product"
                    key={product.id}
                    onClick={() => addToCart(product)}
                  >
                    <span className="pos-emoji">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="product-image"
                        />
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart preview-icon"><path d="m2.05 2.05 1.099-.028a1 1 0 0 1 1.008.815l2.69 14.347A1 1 0 0 0 7.83 18H18"/><path d="M4.563 5h16.435a1 1 0 0 1 .981 1.204l-1.026 6.226A2 2 0 0 1 18.962 14H6.25"/><circle cx="18" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></svg>
                      )}
                    </span>

                    <b>{product.name}</b>

                    <span>Rs. {Number(product.price).toFixed(2)}</span>

                    <small>
                      {product.available} {product.unit || "units"} available
                    </small>
                  </button>
                ))}

                {filteredProducts.length === 0 && (
                  <p className="empty">No available products found.</p>
                )}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn light"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </button>

                  <span>
                    Page {currentPage} of {totalPages}
                  </span>

                  <button
                    className="btn light"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
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

          <label className="pos-label">
            Payment method
            <select
              className="field"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="Cash">Cash</option>
            </select>
          </label>

          <div className="cart-items">
            {cart.map((item) => {
              const weightProduct = ["kg", "kilogram", "kilograms"].includes(
                item.unit?.trim().toLowerCase(),
              );

              const step = weightProduct ? 0.25 : 1;

              return (
                <div className="cart-item" key={item.id}>
                  <div>
                    <b>{item.name}</b>

                    <small>
                      Rs. {item.price.toFixed(2)} per {item.unit || "unit"}
                    </small>
                  </div>

                  <div className="quantity-control">
                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(item.id, Number(item.quantity) - step)
                      }
                    >
                      −
                    </button>

                    <input
                      type="number"
                      min="0"
                      step={weightProduct ? "0.25" : "1"}
                      value={item.quantity}
                      onChange={(e) => changeQuantity(item.id, e.target.value)}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        changeQuantity(item.id, Number(item.quantity) + step)
                      }
                    >
                      +
                    </button>
                  </div>

                  <b>Rs. {(item.price * item.quantity).toFixed(2)}</b>

                  <button
                    type="button"
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </button>
                </div>
              );
            })}

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
            disabled={cart.length === 0 || saving}
            onClick={completeSale}
          >
            {saving ? "Completing sale..." : "Complete sale & generate bill"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default WalkInSales;
