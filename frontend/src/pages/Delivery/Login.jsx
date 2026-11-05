
import { useState } from "react";
import { Link } from "react-router-dom";

function Login({ onLogin }) {
  const [id, setId] = useState("AG-001");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id.trim() || !password.trim()) return;

    onLogin(id.trim());
  };

  return (
    <div className="loginpage">
      <form className="loginbox" onSubmit={handleSubmit}>
        <div className="loginbrand">
          <div className="brandmark">🌿</div>

          <div>
            <strong style={{ font: "800 20px Manrope" }}>
              Isumi Mart
            </strong>
            <small style={{ display: "block", fontSize: 10 }}>
              DELIVERY PORTAL
            </small>
          </div>
        </div>

        <h1>Welcome, delivery partner</h1>

        <p>
          Sign in to view and manage your assigned deliveries.
        </p>

        <label>
          Agent ID
          <input
            className="field"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter your agent ID"
          />
        </label>

        <label>
          Password
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </label>

        <button className="btn" type="submit">
          Sign in →
        </button>

        <p className="hint">
          Demo access: enter any Agent ID and password.
          Credentials are not verified in this demonstration.
        </p>

        {/* <p style={{ marginTop: 18 }}>
          <Link to="/" style={{ color: "#39734a", fontSize: 12 }}>
            ← Back to Isumi Mart
          </Link>
        </p> */}
      </form>
    </div>
  );
}

export default Login;
