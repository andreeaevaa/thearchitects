import { Link } from "react-router-dom";

function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "/login";
}

export default function Home() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "bold", letterSpacing: "2px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
          🥦 SmartBite
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.9, marginTop: "8px", letterSpacing: "0.5px" }}>
          Scan food. Understand your health.
        </p>
        <button onClick={handleLogout} style={{ position: "absolute", top: "20px", right: "20px", padding: "8px 18px", background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "50px", cursor: "pointer" }}>
          Log out
        </button>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h2 style={{ fontSize: "2rem", marginBottom: "16px", fontWeight: "bold", textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          Make Better Food Choices Instantly
        </h2>
        <p style={{ fontSize: "1.1rem", opacity: 0.88, lineHeight: "1.7" }}>
          Scan a product barcode or search for a food to receive a clear
          health score based on ingredients and nutritional data.
        </p>

        <div style={styles.buttons}>
          <Link to="/scan">
            <button style={styles.primaryBtn}>Scan Product</button>
          </Link>

          <Link to="/search">
            <button style={styles.secondaryBtn}>Search Products</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Georgia', serif",
    textAlign: "center",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 40%, #f5a623 100%)",
    padding: "0",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },

  header: {
    padding: "48px 40px 32px",
    color: "white",
    background: "rgba(0,0,0,0.15)",
    backdropFilter: "blur(4px)",
  },

  hero: {
    maxWidth: "640px",
    margin: "60px auto 50px auto",
    padding: "0 20px",
    color: "white",
  },

  buttons: {
    marginTop: "32px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #f5a623 0%, #f76b1c 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(247,107,28,0.4)",
    transition: "transform 0.2s, box-shadow 0.2s",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  secondaryBtn: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(8px)",
    color: "white",
    border: "2px solid rgba(255,255,255,0.6)",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "transform 0.2s, background 0.2s",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  featureCard: {
    width: "220px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },

  footer: {
    marginTop: "60px",
    fontSize: "14px",
    color: "#777",
  },
};