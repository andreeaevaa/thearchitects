import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NutritionLabel from "../components/NLabel"; 
export default function ProductPage() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading Health Data...</div>;
  if (!product) return <div style={styles.loading}>Product not found. <Link to="/search">Back</Link></div>;


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
    <div style={styles.page}>
      <h1 style={styles.title}>{product.productName}</h1>

      <div style={styles.content}>
        {/* Product Image Section */}
        <div style={styles.imageBox}>
          <img src={product.image} alt={product.productName} style={styles.image} />
        </div>

        {/* --- THE SCORE BOX (Pattern: Input Feedback) --- */}
        <div style={{ ...styles.scoreBox, backgroundColor: boxColor }}>
          <h2 style={styles.scoreLabel}>Health Score</h2>
          <div style={styles.scoreNumber}>{score}/100</div>
          <p style={styles.statusText}>{statusText}</p>
          
          {/* A Simple Visual Indicator Bar */}
          <div style={styles.progressContainer}>
            <div style={{ ...styles.progressBar, left: `${score}%` }}></div>
          </div>
        </div>

        {/* Nutrition Info */}
        <NutritionLabel food={product} />
      </div>

      {/* Ingredients Section */}
      <div style={styles.ingredientsBox}>
        <h3>Ingredients</h3>
        <p>{product.ingredients?.join(", ") || "Ingredients not listed."}</p>
      </div>

      <Link to="/search">
        <button style={styles.button}>Back to Search</button>
      </Link>
    </div>
  );
}

const styles = {
  page: { textAlign: "center", padding: "40px", background: "#1a4c2a", minHeight: "100vh", color: "white", fontFamily: "Arial, sans-serif" },
  loading: { padding: "100px", fontSize: "20px" },
  title: { marginBottom: "30px", fontSize: "2.5rem", fontWeight: "800" },
  content: { display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap", marginBottom: "30px" },
  imageBox: { width: "280px" },
  image: { width: "100%", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" },
  scoreBox: { 
    width: "320px", 
    padding: "40px", 
    borderRadius: "30px", 
    display: "flex", 
    flexDirection: "column", 
    justifyContent: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    transition: "background-color 0.6s ease" 
  },
  scoreLabel: { fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "2px", marginBottom: "10px", opacity: 0.8 },
  scoreNumber: { fontSize: "64px", fontWeight: "bold" },
  statusText: { fontSize: "22px", fontWeight: "bold", marginTop: "10px" },
  progressContainer: { width: "100%", height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", marginTop: "20px", position: "relative" },
  progressBar: { position: "absolute", top: "-4px", width: "4px", height: "16px", background: "white", borderRadius: "2px" },
  ingredientsBox: { width: "800px", maxWidth: "90%", margin: "0 auto 40px", padding: "25px", background: "rgba(255,255,255,0.1)", borderRadius: "15px", textAlign: "left" },
  button: { padding: "14px 40px", borderRadius: "50px", border: "2px solid white", background: "transparent", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }
};