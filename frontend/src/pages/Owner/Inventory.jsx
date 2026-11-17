import React, { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
  createStockMovement,
} from "../../services/api";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [showStockForm, setShowStockForm] = useState(false);
  const [selectedStockProduct, setSelectedStockProduct] = useState(null);

  const [stockType, setStockType] = useState("IN");
  const [stockQuantity, setStockQuantity] = useState("");
  const [stockNote, setStockNote] = useState("");
  const [stockSaving, setStockSaving] = useState(false);

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    unit: "pcs",
    categorySlug: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // LOAD PRODUCTS
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProducts({
        page: 1,
        limit: 50,
      });

      setProducts(result.products || []);
    } catch (err) {
      console.error("Inventory loading error:", err);
      setError(err.message || "Unable to load inventory");
    } finally {
      setLoading(false);
    }
  };

  // LOAD CATEGORIES
  const loadCategories = async () => {
    try {
      const result = await getCategories();
      setCategories(result);
    } catch (err) {
      console.error("Category loading error:", err);
      setActionError("Unable to load categories.");
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  // FORM INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // OPEN ADD FORM
  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(emptyForm);
    setActionError("");
    setShowForm(true);
  };

  // OPEN EDIT FORM
  const handleEdit = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      imageUrl: product.imageUrl || "",
      unit: product.unit || "pcs",
      categorySlug: product.categorySlug || "",
    });

    setActionError("");
    setShowForm(true);
  };

  // ADD / UPDATE PRODUCT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setActionError("");

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
        imageUrl: formData.imageUrl.trim() || null,
        unit: formData.unit.trim(),
        categorySlug: formData.categorySlug.trim(),
      };

      if (!editingProduct) {
        if (!formData.categorySlug) {
          throw new Error("Please select a category.");
        }

        productData.categorySlug = formData.categorySlug;

        await createProduct(productData);
      } else {
        // UPDATE SCHEMA DOES NOT CURRENTLY ACCEPT categorySlug
        await updateProduct(editingProduct.id, productData);
      }

      setShowForm(false);
      setEditingProduct(null);
      setFormData(emptyForm);

      await loadProducts();
    } catch (err) {
      console.error("Product save error:", err);
      setActionError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  // DELETE PRODUCT
  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    try {
      setActionError("");

      await deleteProduct(product.id);

      await loadProducts();
    } catch (err) {
      console.error("Product delete error:", err);

      setActionError(err.message || "Unable to delete product.");
    }
  };

  // STOCK CALCULATIONS
  const lowStock = products.filter(
    (product) => product.available > 0 && product.stock === "Low Stock",
  );

  const outOfStock = products.filter((product) => product.available <= 0);

  // OPEN STOCK UPDATE FORM
  const handleOpenStockForm = (product) => {
    setSelectedStockProduct(product);
    setStockType("IN");
    setStockQuantity("");
    setStockNote("");
    setActionError("");
    setShowStockForm(true);
  };

  // RECORD STOCK MOVEMENT
  const handleStockSubmit = async (e) => {
    e.preventDefault();

    const quantity = Number(stockQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setActionError("Please enter a valid whole number greater than zero.");
      return;
    }

    // Stock In = positive quantity
    // Stock Out = negative quantity
    const signedQuantity = stockType === "IN" ? quantity : -quantity;

    try {
      setStockSaving(true);
      setActionError("");

      const result = await createStockMovement({
        productId: Number(selectedStockProduct.id),
        quantity: signedQuantity,
        note: stockNote.trim() || undefined,
      });

      setShowStockForm(false);
      setSelectedStockProduct(null);
      setStockQuantity("");
      setStockNote("");

      await loadProducts();

      alert(`Stock updated successfully! New quantity: ${result.currentStock}`);
    } catch (err) {
      console.error("Stock update error:", err);
      setActionError(err.message || "Unable to update stock.");
    } finally {
      setStockSaving(false);
    }
  };

  return (
    <section className="content">
      <div className="eyebrow">INVENTORY MANAGEMENT</div>

      <h1 className="heading">Inventory</h1>

      <p className="sub">
        Monitor products, manage product details and stock levels.
      </p>

      {actionError && (
        <div className="sale-error" style={{ marginBottom: "16px" }}>
          {actionError}
        </div>
      )}

      {/* ADD PRODUCT BUTTON */}

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
        }}
      >
        <button className="btn" onClick={handleAdd}>
          + Add Product
        </button>
      </div>

      {/* ADD / EDIT PRODUCT FORM */}

      {showForm && (
        <div className="panel" style={{ marginBottom: "24px" }}>
          <div className="panelhead">
            <div>
              <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

              <span className="muted">
                Enter the product information below.
              </span>
            </div>

            <button
              type="button"
              className="btn"
              onClick={() => {
                setShowForm(false);
                setActionError("");
              }}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              className="inventory-form"
            // style={{
            //   display: "grid",
            //   gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            //   gap: "16px",
            // }}
            >
              <div>
                <label>Product Name *</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  minLength={2}
                  maxLength={100}
                  required
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>

              <div>
                <label>Price (Rs.) *</label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0.01"
                  max="99999999.99"
                  step="0.01"
                  required
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>

              <div>
                <label>Unit *</label>

                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  placeholder="e.g. kg, pcs, bottle"
                  maxLength={30}
                  required
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>
              <div>
                <label>Category *</label>
                <select
                  className="form-group"
                  name="categorySlug"
                  value={formData.categorySlug}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", marginTop: "6px" }}
                >
                  <option value="">Select category</option>

                  {categories.map((category) => (
                    <option
                      key={category.id || category.slug}
                      value={category.slug}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>



              <div>
                <label>Image URL</label>

                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>

              <div>
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  maxLength={500}
                  rows={3}
                  style={{ width: "100%", marginTop: "6px" }}
                />
              </div>
            </div>

            {actionError && (
              <div className="sale-error" style={{ marginTop: "16px" }}>
                {actionError}
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <button type="submit" className="btn" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UPDATE STOCK FORM */}

      {showStockForm && selectedStockProduct && (
        <div className="panel stock-update-panel">
          <div className="panelhead">
            <div>
              <h3>Update Stock</h3>
              <span className="muted">{selectedStockProduct.name}</span>
            </div>

            <button
              type="button"
              className="btn"
              onClick={() => {
                setShowStockForm(false);
                setSelectedStockProduct(null);
                setActionError("");
              }}
            >
              Cancel
            </button>
          </div>

          <div className="current-stock-info">
            Current stock:{" "}
            <strong>
              {selectedStockProduct.available}{" "}
              {selectedStockProduct.unit || "units"}
            </strong>
          </div>

          <form onSubmit={handleStockSubmit}>
            <div className="inventory-form">
              <div>
                <label>Movement Type *</label>

                <select
                  value={stockType}
                  onChange={(e) => setStockType(e.target.value)}
                  required
                >
                  <option value="IN">Stock In</option>
                  <option value="OUT">Stock Out</option>
                </select>
              </div>

              <div>
                <label>Quantity *</label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  required
                />
              </div>

              <div>
                <label>Note</label>

                <textarea
                  value={stockNote}
                  onChange={(e) => setStockNote(e.target.value)}
                  placeholder="e.g. New stock received"
                  maxLength={255}
                  rows={3}
                />
              </div>
            </div>

            {stockType === "OUT" && stockQuantity !== "" && (
              <p className="stock-preview">
                Remaining stock:{" "}
                <strong>
                  {selectedStockProduct.available - Number(stockQuantity)}
                </strong>
              </p>
            )}

            {actionError && (
              <div className="sale-error" style={{ marginTop: "12px" }}>
                {actionError}
              </div>
            )}

            <div style={{ marginTop: "20px" }}>
              <button type="submit" className="btn" disabled={stockSaving}>
                {stockSaving ? "Updating..." : "Confirm Stock Update"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LOADING */}

      {loading && (
        <div className="panel">
          <div className="empty">Loading inventory...</div>
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="panel">
          <div className="sale-error">{error}</div>

          <button
            className="btn"
            onClick={loadProducts}
            style={{ marginTop: "12px" }}
          >
            Try again
          </button>
        </div>
      )}

      {/* INVENTORY CONTENT */}

      {!loading && !error && (
        <>
          {/* STATISTICS */}

          <div className="stats">
            <div className="stat">
              <div className="stat-top">
                <span>Total products</span>
              </div>

              <strong>{products.length}</strong>

              <small>Products in catalogue</small>
            </div>

            <div className="stat">
              <div className="stat-top">
                <span>Low stock</span>
              </div>

              <strong>{lowStock.length}</strong>

              <small>Restock soon</small>
            </div>

            <div className="stat">
              <div className="stat-top">
                <span>Out of stock</span>
              </div>

              <strong>{outOfStock.length}</strong>

              <small>Unavailable products</small>
            </div>
          </div>

          {/* PRODUCT TABLE */}

          <div className="panel">
            <div className="panelhead">
              <div>
                <h3>Stock overview</h3>

                <span className="muted">{products.length} products</span>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="empty">
                No products found. Add your first product.
              </div>
            ) : (
              <div className="tablewrap">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Current stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="productcell">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />
                            )}

                            <b className="strong">{product.name}</b>
                          </div>
                        </td>

                        <td>{product.category || "-"}</td>

                        <td>Rs. {Number(product.price).toFixed(2)}</td>

                        <td>
                          <span className="strong">{product.available}</span>{" "}
                          {product.unit || "units"}
                        </td>

                        <td>
                          <span
                            className={`pill ${product.stock === "Out of Stock"
                              ? "red"
                              : product.stock === "Low Stock"
                                ? "orange"
                                : ""
                              }`}
                          >
                            {product.stock}
                          </span>
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              type="button"
                              className="btn stock-update-btn"
                              onClick={() => handleOpenStockForm(product)}
                            >
                              Update Stock
                            </button>
                            <button
                              type="button"
                              className="btn"
                              onClick={() => handleEdit(product)}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="btn"
                              onClick={() => handleDelete(product)}
                              style={{
                                background: "#dc3545",
                                color: "white",
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default Inventory;
