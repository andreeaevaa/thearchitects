import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function getStrength(pwd) {
  if (pwd.length === 0) return null;
  if (pwd.length < 6) return { label: "Too short", color: "#c0392b", width: "20%" };
  if (pwd.length < 8) return { label: "Weak", color: "#e67e22", width: "40%" };
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return { label: "Strong", color: "#2d5a3d", width: "100%" };
  return { label: "Fair", color: "#b7791f", width: "65%" };
}

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
        <h1 style={styles.logo}>SmartBite</h1>
        <p style={styles.tagline}>Your personal nutrition companion.</p>

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

          {(() => {
            const s = getStrength(password);
            return s ? (
              <div style={{ textAlign: "left", paddingLeft: "4px" }}>
                <div style={{ background: "#dde5de", borderRadius: "50px", height: "6px" }}>
                  <div style={{ width: s.width, background: s.color, height: "6px", borderRadius: "50px", transition: "width 0.3s" }} />
                </div>
                <p style={{ fontSize: "12px", color: s.color, marginTop: "5px", fontWeight: 700 }}>{s.label}</p>
              </div>
            ) : null;
          })()}

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

          <button type="submit" style={styles.primaryBtn} disabled={loading}>
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
  success: {
    color: "#2d5a3d",
    fontSize: "14px",
    margin: "0",
    padding: "10px 16px",
    background: "#edf7f0",
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