import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Could not connect to server");
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🥦 SmartBite</h1>
        <p style={styles.tagline}>Your personal nutrition companion.</p>

        <h2 style={styles.heading}>Create an account</h2>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={styles.input}
            autoComplete="new-password"
          />

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.link}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 50%, #f5a623 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Georgia, serif",
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    padding: "48px 40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  logo: {
    fontSize: "2.2rem",
    color: "#1a5c2a",
    fontWeight: "bold",
    marginBottom: "6px",
  },
  tagline: {
    color: "#666",
    fontSize: "0.9rem",
    marginBottom: "32px",
  },
  heading: {
    fontSize: "1.4rem",
    color: "#1a3a20",
    marginBottom: "24px",
    fontWeight: "bold",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  input: {
    padding: "13px 18px",
    fontSize: "15px",
    borderRadius: "50px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontFamily: "Georgia, serif",
  },
  btn: {
    marginTop: "6px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #f5a623, #f76b1c)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    boxShadow: "0 6px 18px rgba(247,107,28,0.35)",
  },
  error: {
    color: "#d62828",
    fontSize: "14px",
    margin: "0",
    padding: "8px 14px",
    background: "#fff0f0",
    borderRadius: "8px",
  },
  success: {
    color: "#2d8a3e",
    fontSize: "14px",
    margin: "0",
    padding: "8px 14px",
    background: "#f0fff4",
    borderRadius: "8px",
  },
  switchText: {
    marginTop: "28px",
    color: "#555",
    fontSize: "14px",
  },
  link: {
    color: "#f76b1c",
    fontWeight: "bold",
    textDecoration: "none",
  },
};