import { useLocation, Link } from "react-router-dom";
import NutritionLabel from "../components/NLabel";
import { calculatePersonalizedScore, getScoreColor, getScoreMessage } from "../utils/scoreUtils";
import { useState, useEffect } from "react";

export default function ProductPage() {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <div style={styles.page}>
        <h2>No product data found</h2>
        <Link to="/search">
          <button style={styles.button}>Back to Search</button>
        </Link>
      </div>
    );
  }

  const [userProfile, setUserProfile] = useState(null);

useEffect(() => {
  async function loadProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.profile) setUserProfile(data.profile);
    } catch (err) {}
  }
  loadProfile();
}, []);

const score = userProfile
  ? calculatePersonalizedScore(product, userProfile)
  : (product.healthScore ?? 0);

const scoreColor = getScoreColor(score);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{product.productName}</h1>

      <div style={styles.content}>
        <div style={styles.imageBox}>
          <img
            src={product.image}
            alt={product.productName}
            style={styles.image}
          />
        </div>

        <div style={styles.scoreBox}>
  <h2 style={styles.scoreTitle}>
    {userProfile ? "Your Personal Score" : "Health Score"}
  </h2>
  <div style={{ ...styles.scoreNumber, color: scoreColor }}>{score}/100</div>
  <p style={styles.scoreText}>{getScoreMessage(score)}</p>
</div>

        {/* Nutrition Label */}
        <NutritionLabel food={product} />
      </div>

      <div style={styles.ingredientsBox}>
        <h2>Ingredients</h2>
        <p>
          {product.ingredients && product.ingredients.length > 0
            ? product.ingredients.join(", ")
            : "Ingredients not available."}
        </p>
      </div>

      <Link to="/search">
        <button style={styles.button}>Back to Search</button>
      </Link>
    </div>
  );
}

const styles = {
  page: {
    textAlign: "center",
    padding: "40px 20px",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 60%, #f5a623 100%)",
    color: "white",
  },
  title: {
    marginBottom: "24px",
    fontSize: "2rem",
    fontWeight: "bold",
    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  serving: {
    fontSize: "18px",
    marginBottom: "30px",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "30px",
    flexWrap: "wrap",
    marginBottom: "30px",
  },
  imageBox: {
    width: "260px",
  },
  image: {
    width: "250px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
  },
  scoreBox: {
    width: "280px",
    minHeight: "250px",
    border: "none",
    borderRadius: "20px",
    padding: "24px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  scoreTitle: {
    marginBottom: "10px",
    fontSize: "1.1rem",
    textTransform: "uppercase",
    letterSpacing: "1px",
    opacity: 0.9,
  },
  scoreNumber: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "20px",
    textShadow: "0 2px 8px rgba(0,0,0,0.2)",
  },
  scaleWrapper: {
    position: "relative",
    width: "100%",
    height: "30px",
    marginBottom: "20px",
  },
  scaleBar: {
    width: "100%",
    height: "14px",
    borderRadius: "999px",
    background:
      "linear-gradient(to right, #d62828 0%, #f77f00 35%, #fcbf49 50%, #90be6d 75%, #2a9d8f 100%)",
    marginTop: "8px",
  },
  scaleMarker: {
    position: "absolute",
    top: "0px",
    transform: "translateX(-50%)",
    width: "16px",
    height: "30px",
    backgroundColor: "white",
    borderRadius: "6px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
  },
  scoreText: {
    fontSize: "16px",
    opacity: 0.9,
  },
  ingredientsBox: {
    width: "700px",
    maxWidth: "90%",
    margin: "0 auto 30px auto",
    border: "none",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "left",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    color: "white",
    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
  },
  button: {
    padding: "12px 28px",
    border: "2px solid rgba(255,255,255,0.7)",
    borderRadius: "50px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    backdropFilter: "blur(8px)",
  },
};