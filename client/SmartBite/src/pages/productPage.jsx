import { useLocation, Link } from "react-router-dom";
import NutritionLabel from "../components/NLabel";

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

  const score = product.healthScore ?? 0;

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{product.productName}</h1>

      <div style={styles.content}>
        {/* Image */}
        <div style={styles.imageBox}>
          <img
            src={product.image}
            alt={product.productName}
            style={styles.image}
          />
        </div>

        {/* Health Score */}
        <div style={styles.scoreBox}>
          <h2 style={styles.scoreTitle}>Health Score</h2>
          <div style={styles.scoreNumber}>{score}/100</div>

          <div style={styles.scaleWrapper}>
            <div style={styles.scaleBar}></div>
            <div
              style={{
                ...styles.scaleMarker,
                left: `${score}%`,
              }}
            ></div>
          </div>

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

function getScoreMessage(score) {
  if (score >= 80) return "Very healthy choice";
  if (score >= 60) return "Moderately healthy";
  if (score >= 40) return "Average nutritional quality";
  if (score >= 20) return "Less healthy choice";
  return "Low nutritional quality";
}

const styles = {
  page: {
    textAlign: "center",
    padding: "40px",
  },
  title: {
    marginBottom: "20px",
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
    borderRadius: "10px",
  },
  scoreBox: {
    width: "280px",
    minHeight: "250px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  scoreTitle: {
    marginBottom: "10px",
  },
  scoreNumber: {
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
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
    backgroundColor: "#222",
    borderRadius: "6px",
  },
  scoreText: {
    fontSize: "16px",
    color: "#444",
  },
  ingredientsBox: {
    width: "700px",
    maxWidth: "90%",
    margin: "0 auto 30px auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "20px",
    textAlign: "left",
    backgroundColor: "white",
  },
  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};