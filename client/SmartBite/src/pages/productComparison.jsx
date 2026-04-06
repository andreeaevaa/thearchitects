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
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }
      if (current.length >= 2) {
        return current;
      }
      return [...current, id];
    });
  }

  function handleCompare() {
    if (selectedIds.length === 2) {
      navigate(`/compare?ids=${selectedIds.join(",")}`);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1>Compare Products</h1>
        <p style={styles.subtitle}>
          Select up to two products and compare their health ratings side by side.
        </p>
      </div>

      <div style={styles.actionRow}>
        <button
          onClick={handleCompare}
          disabled={selectedIds.length !== 2}
          style={{
            ...styles.compareButton,
            opacity: selectedIds.length === 2 ? 1 : 0.55,
            cursor: selectedIds.length === 2 ? "pointer" : "not-allowed",
          }}
        >
          Compare {selectedIds.length === 2 ? "Now" : `(Select ${2 - selectedIds.length} more)`}
        </button>
        <Link to="/" style={styles.backLink}>
          Back to Home
        </Link>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
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
                  borderColor: selected ? "#f5a623" : "rgba(255,255,255,0.18)",
                  background: selected ? "rgba(245,166,35,0.18)" : "rgba(255,255,255,0.12)",
                }}
              >
                <img src={product.image} alt={product.productName} style={styles.image} />
                <div style={styles.cardBody}>
                  <h3 style={styles.productName}>{product.productName}</h3>
                  <span style={styles.statusBadge}>
                    {selected ? "Selected" : "Tap to select"}
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
    padding: "40px",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 40%, #f5a623 100%)",
    color: "white",
    fontFamily: "Lato, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  subtitle: {
    maxWidth: "680px",
    margin: "16px auto 0",
    opacity: 0.9,
    lineHeight: 1.7,
  },
  actionRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },
  compareButton: {
    padding: "14px 32px",
    borderRadius: "999px",
    border: "none",
    background: "#f5a623",
    color: "#1a1a1a",
    fontWeight: 700,
    fontSize: "16px",
  },
  backLink: {
    padding: "14px 32px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.16)",
    color: "white",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.35)",
    fontWeight: 700,
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    color: "#ffdddd",
    background: "rgba(255,0,0,0.12)",
    padding: "18px",
    borderRadius: "18px",
    maxWidth: "640px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },
  card: {
    borderRadius: "24px",
    overflow: "hidden",
    border: "2px solid rgba(255,255,255,0.18)",
    cursor: "pointer",
    textAlign: "left",
    background: "rgba(255,255,255,0.12)",
    padding: 0,
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
  },
  cardBody: {
    padding: "18px 16px 20px",
  },
  productName: {
    margin: 0,
    fontSize: "1.1rem",
  },
  brandText: {
    margin: "10px 0 0",
    color: "rgba(255,255,255,0.78)",
    fontSize: "0.95rem",
  },
  statusBadge: {
    display: "inline-block",
    marginTop: "16px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.16)",
    fontWeight: 700,
    color: "white",
    fontSize: "0.85rem",
  },
};
