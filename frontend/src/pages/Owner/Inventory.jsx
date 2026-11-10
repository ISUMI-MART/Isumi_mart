function Inventory({ products }) {
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= 10
  );

  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <section className="content">
      <div className="eyebrow">INVENTORY MANAGEMENT</div>

      <h1 className="heading">Inventory</h1>
      <p className="sub">
        Monitor product availability and stock levels.
      </p>

      <div className="stats">
        <div className="stat">
          <span>Total products</span>
          <strong>{products.length}</strong>
          <small>Products in catalogue</small>
        </div>

        <div className="stat">
          <span>Low stock</span>
          <strong>{lowStock.length}</strong>
          <small>Restock soon</small>
        </div>

        <div className="stat">
          <span>Out of stock</span>
          <strong>{outOfStock.length}</strong>
          <small>Unavailable products</small>
        </div>
      </div>

      <div className="panel">
        <div className="panelhead">
          <h3>Stock overview</h3>
        </div>

        <div className="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Current stock</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="productcell">
                      <span className="thumb">{product.emoji}</span>
                      <b className="strong">{product.name}</b>
                    </div>
                  </td>

                  <td>{product.category}</td>
                  <td>{product.stock} {product.unit}</td>

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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Inventory;