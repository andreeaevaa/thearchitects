import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ProductComparison() {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products", err);
        setError("Unable to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  function toggleSelection(id) {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return current;
      return [...current, id];
    });
  }

  function handleCompare() {
    if (selectedIds.length === 2) {
      navigate(`/compare?ids=${selectedIds.join(",")}`);
    }
  }

  const canCompare = selectedIds.length === 2;

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Back to Home</Link>
        <h1 style={styles.title}>Compare Products</h1>
        <p style={styles.subtitle}>
          Select two products to compare their health ratings side by side.
        </p>
      </div>

      {/* Action bar */}
      <div style={styles.actionRow}>
        <button
          onClick={handleCompare}
          disabled={!canCompare}
          style={{
            ...styles.primaryBtn,
            opacity: canCompare ? 1 : 0.5,
            cursor: canCompare ? "pointer" : "not-allowed",
          }}
        >
          {canCompare ? "Compare Now" : `Select ${2 - selectedIds.length} more`}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={styles.stateBox}>Loading products...</div>
      ) : error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : (
        <div style={styles.grid}>
          {products.map((product) => {
            const selected = selectedIds.includes(product._id);
            return (
              <button
                key={product._id}
                type="button"
                onClick={() => toggleSelection(product._id)}
                style={{
                  ...styles.card,
                  border: selected
                    ? "2px solid #2d5a3d"
                    : "2px solid transparent",
                  boxShadow: selected
                    ? "0 0 0 3px rgba(45,90,61,0.15)"
                    : "0 2px 12px rgba(0,0,0,0.06)",
                }}
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  style={styles.image}
                />
                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.productName}</h3>
                  <span
                    style={{
                      ...styles.badge,
                      background: selected ? "#2d5a3d" : "#f0f4f1",
                      color: selected ? "#fff" : "#888",
                    }}
                  >
                    {selected ? "✓ Selected" : "Tap to select"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e8ede9",
    padding: "40px 40px 60px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#111",
  },
  header: {
    textAlign: "center",
    marginBottom: "28px",
  },
  backLink: {
    display: "inline-block",
    color: "#2d5a3d",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: "0.9rem",
    marginBottom: "20px",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2.4rem",
    fontWeight: 400,
    margin: "0 0 12px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    color: "#666",
    fontSize: "15px",
    maxWidth: "500px",
    margin: "0 auto",
    lineHeight: 1.6,
  },
  actionRow: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "32px",
  },
  primaryBtn: {
    padding: "13px 36px",
    borderRadius: "50px",
    border: "none",
    background: "#2d5a3d",
    color: "#fff",
    fontWeight: 700,
    fontSize: "15px",
    fontFamily: "'DM Sans', sans-serif",
    transition: "opacity 0.2s",
  },
  stateBox: {
    textAlign: "center",
    color: "#888",
    fontSize: "15px",
    padding: "40px",
  },
  errorBox: {
    textAlign: "center",
    color: "#c0392b",
    background: "#fdf0ef",
    padding: "20px",
    borderRadius: "16px",
    maxWidth: "600px",
    margin: "0 auto",
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
  },
  card: {
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    textAlign: "left",
    background: "#ffffff",
    padding: 0,
    transition: "box-shadow 0.15s, border 0.15s",
  },
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
  },
  cardBody: {
    padding: "16px",
  },
  productName: {
    margin: "0 0 12px",
    fontSize: "1rem",
    fontWeight: 700,
    color: "#111",
    lineHeight: 1.3,
  },
  badge: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "50px",
    fontWeight: 700,
    fontSize: "0.8rem",
    transition: "all 0.15s",
  },
};