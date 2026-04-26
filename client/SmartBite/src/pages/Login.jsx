import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      navigate("/");
    } catch (err) {
      setError("Could not connect to server");
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>SmartBite</h1>
        <p style={styles.tagline}>Scan food. Understand your health.</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="current-password"
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.primaryBtn} disabled={loading}>
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e8ede9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "52px 44px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    textAlign: "center",
  },
  logo: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2.6rem",
    fontWeight: 400,
    color: "#111",
    margin: "0 0 10px",
    letterSpacing: "-0.5px",
  },
  tagline: {
    color: "#888",
    fontSize: "0.95rem",
    marginBottom: "36px",
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "13px 20px",
    fontSize: "15px",
    borderRadius: "50px",
    border: "1.5px solid #dde5de",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    background: "#f7faf7",
    color: "#222",
    transition: "border-color 0.2s",
  },
  primaryBtn: {
    marginTop: "6px",
    padding: "14px",
    fontSize: "15px",
    fontWeight: 700,
    background: "#2d5a3d",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    letterSpacing: "0.3px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s",
  },
  error: {
    color: "#c0392b",
    fontSize: "14px",
    margin: "0",
    padding: "10px 16px",
    background: "#fdf0ef",
    borderRadius: "12px",
    textAlign: "left",
  },
  switchText: {
    marginTop: "28px",
    color: "#777",
    fontSize: "14px",
  },
  link: {
    color: "#2d5a3d",
    fontWeight: 700,
    textDecoration: "none",
  },
};