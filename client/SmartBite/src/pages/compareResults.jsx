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
    if (products.length !== 2 || products.some((product) => !product?._id)) {
      return;
    }

    const ids = products.map((product) => product._id);
    const names = products.map((product) => product.productName || "Unknown product");
    const sortedKey = [...ids].sort().join("_");

    const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    const updatedHistory = stored.filter((entry) => entry.key !== sortedKey);
    const nextEntry = {
      key: sortedKey,
      ids,
      names,
      date: new Date().toISOString(),
    };

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify([nextEntry, ...updatedHistory].slice(0, 10))
    );
  }, [products]);

  function buildScoreBox(product) {
    const score = product.healthScore || 0;
    let boxColor = "#2eb82e";
    let statusText = "Great Choice!";

    if (score < 40) {
      boxColor = "#ff4d4d";
      statusText = "Poor Choice";
    } else if (score < 70) {
      boxColor = "#ffcc00";
      statusText = "Moderate Choice";
    }

    return (
      <div style={{ ...styles.scoreBox, backgroundColor: boxColor }}>
        <h2 style={styles.scoreLabel}>Health Score</h2>
        <div style={styles.scoreNumber}>{score}/100</div>
        <p style={styles.statusText}>{statusText}</p>
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, left: `${score}%` }}></div>
        </div>
      </div>
    );
  }

  function getHealthTags(product) {
    const tags = [];
    const ingredientsText = (product.ingredients || []).join(" ").toLowerCase();
    const carbs = product.nutrition?.carbs ?? Infinity;
    const sugar = product.nutrition?.sugar ?? Infinity;
    const sodium = product.nutrition?.sodium ?? Infinity;
    const protein = product.nutrition?.protein ?? 0;

    if (ingredientsText && !/(wheat|barley|rye|spelt|triticale|oats|malt|semolina|durum)/.test(ingredientsText)) {
      tags.push("Gluten Free");
    }
    if (carbs <= 5 && sugar <= 5) {
      tags.push("Keto-Friendly");
    }
    if (protein >= 8) {
      tags.push("High protein");
    }
    if (sugar <= 5) {
      tags.push("Low sugar");
    }
    if (sodium <= 140) {
      tags.push("Low sodium");
    }
    if (carbs <= 15 && carbs > 5) {
      tags.push("Low carbs");
    }

    if (tags.length === 0) {
      tags.push("No health tags available");
    }

    return [...new Set(tags)];
  }

  if (loading) {
    return <div style={styles.page}>Loading comparison...</div>;
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1>Compare Products</h1>
        <p>{error}</p>
        <Link to="/product-comparison" style={styles.button}>
          Choose products again
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1>Comparison Result</h1>
        <p style={styles.subtext}>
          See both product health ratings and nutrition details side by side.
        </p>
      </header>

      <div style={styles.grid}>
        {products.map((product) => (
          <div key={product._id} style={styles.productCard}>
            <h2 style={styles.productTitle}>{product.productName}</h2>
            <div style={styles.content}>
              <div style={styles.imageBox}>
                <img src={product.image} alt={product.productName} style={styles.image} />
              </div>
              {buildScoreBox(product)}
              <div style={styles.nutritionCard}>
                <NutritionLabel food={product} />
              </div>
            </div>
            <div style={styles.ingredientsBox}>
              <h3>Ingredients</h3>
              <p>{product.ingredients?.length ? product.ingredients.join(", ") : "Ingredients not listed."}</p>
              <div style={styles.tagRow}>
                {getHealthTags(product).map((tag) => (
                  <span key={tag} style={styles.tagBadge}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.buttonRow}>
        <Link to="/product-comparison" style={styles.secondaryButton}>
          Compare different products
        </Link>
        <Link to="/" style={styles.button}>
          Back to Home
        </Link>
      </div>
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
  subtext: {
    opacity: 0.9,
    maxWidth: "680px",
    margin: "16px auto 0",
    lineHeight: 1.7,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  productCard: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: "calc(100vh - 220px)",
    overflow: "hidden",
  },
  productTitle: {
    marginBottom: "14px",
    fontSize: "1.4rem",
    fontWeight: 700,
  },
  content: {
    display: "flex",
    justifyContent: "center",
    gap: "24px",
    flexWrap: "wrap",
    marginBottom: "22px",
    width: "100%",
  },
  imageBox: {
    width: "240px",
  },
  image: {
    width: "100%",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    height: "200px",
    objectFit: "cover",
  },
  scoreBox: {
    width: "100%",
    maxWidth: "280px",
    padding: "24px",
    borderRadius: "28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.18)",
    marginBottom: "18px",
  },
  scoreLabel: {
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "2px",
    marginBottom: "12px",
    opacity: 0.85,
  },
  scoreNumber: {
    fontSize: "4rem",
    fontWeight: 800,
  },
  statusText: {
    marginTop: "12px",
    fontSize: "1.05rem",
    fontWeight: 700,
  },
  progressContainer: {
    width: "100%",
    height: "8px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "10px",
    marginTop: "22px",
    position: "relative",
  },
  progressBar: {
    position: "absolute",
    top: "-4px",
    width: "4px",
    height: "16px",
    background: "white",
    borderRadius: "2px",
  },
  nutritionCard: {
    width: "100%",
    marginTop: "24px",
    maxHeight: "190px",
    overflowY: "auto",
  },
  ingredientsBox: {
    width: "100%",
    marginTop: "18px",
    padding: "18px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "20px",
    textAlign: "left",
    maxHeight: "180px",
    overflowY: "auto",
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "16px",
  },
  tagBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.16)",
    color: "white",
    fontWeight: 700,
    fontSize: "0.85rem",
  },
  buttonRow: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  button: {
    padding: "14px 32px",
    background: "#f5a623",
    color: "#1a1a1a",
    border: "none",
    borderRadius: "999px",
    fontWeight: "700",
    textDecoration: "none",
  },
  secondaryButton: {
    padding: "14px 32px",
    background: "rgba(255,255,255,0.16)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "999px",
    textDecoration: "none",
  },
};
