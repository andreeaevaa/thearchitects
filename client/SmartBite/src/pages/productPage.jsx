import { useLocation, Link } from "react-router-dom";
import NutritionLabel from "../components/NLabel";

export default function ProductPage() {
  const location = useLocation();
  const food = location.state?.food;

  if (!food) {
    return (
      <div style={styles.page}>
        <h2>No product data found</h2>
        <Link to="/search">
          <button style={styles.button}>Back to Search</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{food.description}</h1>

      <div style={styles.content}>
        <NutritionLabel food={food} />

        <div style={styles.ingredientsBox}>
          <h2>Ingredients</h2>
          <p style={styles.ingredientsText}>
            {food.ingredients || "Ingredients not available for this product."}
          </p>
        </div>
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
    padding: "10px",
  },
  title: {
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
  ingredientsBox: {
    width: "320px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#fff",
  },
  ingredientsText: {
    lineHeight: "1.5",
  },
  button: {
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};