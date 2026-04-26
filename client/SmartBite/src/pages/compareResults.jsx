import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import NutritionLabel from "../components/NLabel";

const HISTORY_KEY = "comparisonHistory";

export default function CompareResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ids = params.get("ids")?.split(",").filter(Boolean).slice(0, 2) || [];

    if (ids.length !== 2) {
      setError("Please choose exactly two products to compare.");
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        const responses = await Promise.all(
          ids.map((id) => fetch(`http://localhost:5000/api/products/${id}`))
        );
        const data = await Promise.all(responses.map((res) => res.json()));
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load comparison products.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [location.search]);

  useEffect(() => {
    if (products.length !== 2 || products.some((p) => !p?._id)) return;
    const ids = products.map((p) => p._id);
    const names = products.map((p) => p.productName || "Unknown product");
    const sortedKey = [...ids].sort().join("_");
    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const updated = stored.filter((e) => e.key !== sortedKey);
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([{ key: sortedKey, ids, names, date: new Date().toISOString() }, ...updated].slice(0, 10))
    );
  }, [products]);

  function getScoreStyle(score) {
    if (score >= 70) return { color: "#2d5a3d", bg: "#edf7f0", label: "Great Choice" };
    if (score >= 40) return { color: "#b7791f", bg: "#fef9ec", label: "Moderate Choice" };
    return { color: "#c0392b", bg: "#fdf0ef", label: "Poor Choice" };
  }

  function getHealthTags(product) {
    const tags = [];
    const ingredientsText = (product.ingredients || []).join(" ").toLowerCase();
    const carbs = product.nutrition?.carbs ?? Infinity;
    const sugar = product.nutrition?.sugar ?? Infinity;
    const sodium = product.nutrition?.sodium ?? Infinity;
    const protein = product.nutrition?.protein ?? 0;

    if (ingredientsText && !/(wheat|barley|rye|spelt|triticale|oats|malt|semolina|durum)/.test(ingredientsText))
      tags.push("Gluten Free");
    if (carbs <= 5 && sugar <= 5) tags.push("Keto-Friendly");
    if (protein >= 8) tags.push("High Protein");
    if (sugar <= 5) tags.push("Low Sugar");
    if (sodium <= 140) tags.push("Low Sodium");
    if (carbs <= 15 && carbs > 5) tags.push("Low Carbs");
    if (tags.length === 0) tags.push("No tags available");

    return [...new Set(tags)];
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.stateBox}>Loading comparison...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h1 style={styles.title}>Compare Products</h1>
          <p style={{ color: "#888", marginBottom: "24px" }}>{error}</p>
          <Link to="/product-comparison" style={styles.primaryBtn}>
            Choose products again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Comparison Results</h1>
        <p style={styles.subtitle}>
          Side-by-side health ratings and nutrition details.
        </p>
      </div>

      {/* Product cards grid */}
      <div style={styles.grid}>
        {products.map((product) => {
          const score = product.healthScore || 0;
          const { color, bg, label } = getScoreStyle(score);
          const tags = getHealthTags(product);

          return (
            <div key={product._id} style={styles.card}>
              {/* Product image */}
              <img
                src={product.image}
                alt={product.productName}
                style={styles.image}
              />

              {/* Product name */}
              <div style={styles.cardBody}>
                <h2 style={styles.productName}>{product.productName}</h2>

                {/* Health score */}
                <div style={{ ...styles.scoreBox, background: bg }}>
                  <div style={{ ...styles.scoreNumber, color }}>{score}<span style={styles.scoreOf}>/100</span></div>
                  <div style={{ ...styles.scoreLabel, color }}>{label}</div>
                  <div style={styles.scoreBarTrack}>
                    <div style={{ ...styles.scoreBarFill, width: `${score}%`, background: color }} />
                  </div>
                </div>

                {/* Health tags */}
                <div style={styles.tagRow}>
                  {tags.map((tag) => (
                    <span key={tag} style={styles.tag}>{tag}</span>
                  ))}
                </div>

                {/* Nutrition label */}
                <div style={styles.nutritionWrapper}>
                  <NutritionLabel food={product} />
                </div>

                {/* Ingredients */}
                <div style={styles.ingredientsBox}>
                  <p style={styles.ingredientsTitle}>Ingredients</p>
                  <p style={styles.ingredientsText}>
                    {product.ingredients?.length
                      ? product.ingredients.join(", ")
                      : "Not listed."}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom buttons */}
      <div style={styles.buttonRow}>
        <Link to="/product-comparison" style={styles.outlineBtn}>
          Compare different products
        </Link>
        <Link to="/" style={styles.primaryBtn}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#e8ede9",
    padding: "48px 40px 60px",
    fontFamily: "'DM Sans', sans-serif",
    color: "#111",
  },
  header: {
    textAlign: "center",
    marginBottom: "36px",
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
    margin: 0,
    lineHeight: 1.6,
  },
  stateBox: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#888",
    fontSize: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  cardBody: {
    padding: "24px",
  },
  productName: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "1.4rem",
    fontWeight: 400,
    margin: "0 0 20px",
    letterSpacing: "-0.3px",
  },
  scoreBox: {
    borderRadius: "16px",
    padding: "20px 24px",
    marginBottom: "20px",
  },
  scoreNumber: {
    fontSize: "3rem",
    fontWeight: 800,
    lineHeight: 1,
    marginBottom: "4px",
  },
  scoreOf: {
    fontSize: "1.2rem",
    fontWeight: 400,
    opacity: 0.6,
  },
  scoreLabel: {
    fontSize: "0.9rem",
    fontWeight: 700,
    marginBottom: "14px",
  },
  scoreBarTrack: {
    height: "6px",
    background: "rgba(0,0,0,0.08)",
    borderRadius: "50px",
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: "50px",
    transition: "width 0.5s ease",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "20px",
  },
  tag: {
    padding: "6px 14px",
    borderRadius: "50px",
    background: "#f0f4f1",
    color: "#2d5a3d",
    fontWeight: 700,
    fontSize: "0.78rem",
    border: "1.5px solid #dde5de",
  },
  nutritionWrapper: {
    marginBottom: "20px",
    maxHeight: "200px",
    overflowY: "auto",
    borderRadius: "12px",
    border: "1.5px solid #e8ede9",
    padding: "4px",
  },
  ingredientsBox: {
    background: "#f7faf7",
    borderRadius: "12px",
    padding: "16px",
  },
  ingredientsTitle: {
    fontWeight: 700,
    fontSize: "0.85rem",
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 8px",
  },
  ingredientsText: {
    fontSize: "13px",
    color: "#555",
    lineHeight: 1.6,
    margin: 0,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "13px 32px",
    background: "#2d5a3d",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    fontWeight: 700,
    fontSize: "14px",
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  outlineBtn: {
    padding: "13px 32px",
    background: "transparent",
    color: "#2d5a3d",
    border: "1.5px solid #2d5a3d",
    borderRadius: "50px",
    fontWeight: 700,
    fontSize: "14px",
    textDecoration: "none",
    fontFamily: "'DM Sans', sans-serif",
  },
};
