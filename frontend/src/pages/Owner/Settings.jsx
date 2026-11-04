
function Settings() {
  return (
    <section className="content">
      <div className="eyebrow">SHOP CONFIGURATION</div>

      <h1 className="heading">Settings</h1>
      <p className="sub">
        Manage your Isumi Mart shop information.
      </p>

      <div className="panel">
        <h3>Shop settings</h3>
        <p className="muted">
          Isumi Mart · Your neighbourhood grocery
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
            maxWidth: 450,
            marginTop: 20,
          }}
        >
          <label className="muted">
            Shop name
            <input className="field" value="Isumi Mart" readOnly />
          </label>

          <label className="muted">
            Currency
            <input
              className="field"
              value="Sri Lankan Rupees (LKR)"
              readOnly
            />
          </label>

          <label className="muted">
            Payment method
            <input
              className="field"
              value="Cash on Delivery"
              readOnly
            />
          </label>
        </div>
      </div>
    </section>
  );
}

export default Settings;
