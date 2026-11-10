import { useState } from "react";
import { money } from "../../data/ownerData";

function Products({ products, saveProducts }) {
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [edit, setEdit] = useState(null);

  const emptyForm = {
    name: "",
    category: "Vegetables",
    unit: "1 kg",
    price: "",
    stock: "",
    emoji: "🛒",
  };

  const [form, setForm] = useState(emptyForm);

  const filteredProducts = products.filter((product) =>
    [product.name, product.category]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  function openProduct(product = null) {
    setEdit(product);

    setForm(
      product
        ? {
            ...product,
            price: String(product.price),
            stock: String(product.stock),
          }
        : { ...emptyForm }
    );

    setModal(true);
  }

  function submitProduct(e) {
    e.preventDefault();

    const stock = Number(form.stock);

    const product = {
      ...form,
      id: edit?.id || "PR-" + String(Date.now()).slice(-5),
      price: Number(form.price),
      stock,
      status:
        stock === 0
          ? "Out of Stock"
          : stock <= 10
          ? "Low Stock"
          : "In Stock",
    };

    const updatedProducts = edit
      ? products.map((item) =>
          item.id === edit.id ? product : item
        )
      : [product, ...products];

    saveProducts(updatedProducts);
    setModal(false);
    setEdit(null);
    setForm({ ...emptyForm });
  }

  return (
    <section className="content">
      <div className="eyebrow">PRODUCT MANAGEMENT</div>

      <div className="row">
        <div>
          <h1 className="heading">Products</h1>
          <p className="sub">
            Manage your grocery shop catalogue.
          </p>
        </div>

        <button className="btn" onClick={() => openProduct()}>
          ＋ Add product
        </button>
      </div>

      <div className="panel">
        <div className="panelhead">
          <h3>Product catalogue</h3>

          <input
            className="field search"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="productcell">
                      <span className="thumb">{product.emoji}</span>
                      <b className="strong">{product.name}</b>
                    </div>
                  </td>

                  <td>{product.category}</td>
                  <td>{product.unit}</td>
                  <td>{money(product.price)}</td>
                  <td>{product.stock}</td>

                  <td>
                    <span
                      className={
                        "pill " +
                        (product.stock === 0
                          ? "red"
                          : product.stock <= 10
                          ? "orange"
                          : "")
                      }
                    >
                      {product.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className="btn light"
                      onClick={() => openProduct(product)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filteredProducts.length && (
            <div className="empty">No products found.</div>
          )}
        </div>
      </div>

      {modal && (
        <div className="modalback">
          <form className="modal" onSubmit={submitProduct}>
            <h3>{edit ? "Edit product" : "Add new product"}</h3>

            <div className="formgrid">
              <label>
                Product name
                <input
                  className="field"
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                />
              </label>

              <label>
                Category
                <select
                  className="field"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  {[
                    "Vegetables",
                    "Fruits",
                    "Dairy & Eggs",
                    "Rice & Grains",
                    "Beverages",
                    "Household",
                  ].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Unit
                <input
                  className="field"
                  required
                  value={form.unit}
                  onChange={(e) =>
                    setForm({ ...form, unit: e.target.value })
                  }
                />
              </label>

              <label>
                Price (LKR)
                <input
                  className="field"
                  type="number"
                  min="0"
                  required
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </label>

              <label>
                Stock quantity
                <input
                  className="field"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="modalfoot">
              <button
                type="button"
                className="btn outline"
                onClick={() => setModal(false)}
              >
                Cancel
              </button>

              <button className="btn" type="submit">
                Save product
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

export default Products;