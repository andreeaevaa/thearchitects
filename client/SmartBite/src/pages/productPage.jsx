import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../components/ProductCard.css";

function getHealthTags(product) {
  const tags = [];
  const ingredientsText = (product.ingredients || []).join(" ").toLowerCase();
  const carbs   = product.nutrition?.carbs  ?? Infinity;
  const sugar   = product.nutrition?.sugar  ?? Infinity;
  const sodium  = product.nutrition?.sodium ?? Infinity;
  const protein = product.nutrition?.protein ?? 0;

  if (ingredientsText && !/(wheat|barley|rye|spelt|triticale|malt|semolina|durum)/.test(ingredientsText)) {
    tags.push("Gluten Free");
  }
  if (carbs <= 5 && sugar <= 5) tags.push("Keto-Friendly");
  if (protein >= 10)             tags.push("High Protein");
  if (sugar <= 5)               tags.push("Low Sugar");
  if (sodium <= 100)            tags.push("Low Sodium");
  if (carbs <= 15 && carbs > 5) tags.push("Low Carbs");

  return [...new Set(tags)];
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res  = await fetch(`http://localhost:5000/api/products/${id}`);
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

  if (loading)  return <div className="pc-page" style={{ color: "#2d6a4f", fontSize: 22, justifyContent: "center", alignItems: "center" }}>Loading...</div>;
  if (!product) return <div className="pc-page" style={{ color: "#2d6a4f", fontSize: 22, justifyContent: "center", alignItems: "center" }}>Product not found. <Link to="/search">Back</Link></div>;

  const score     = product.healthScore || 0;
  const nutrition = product.nutrition   || {};

  // Score ring (110px viewBox, radius 42)
  const radius        = 42;
  const circumference = 2 * Math.PI * radius;
  const offset        = circumference - (score / 100) * circumference;

  let ringColor  = "#2d6a4f";
  let scoreClass = "great";
  let scoreText  = "Great Choice";
  if (score < 40)      { ringColor = "#c0392b"; scoreClass = "poor";     scoreText = "Poor Choice"; }
  else if (score < 70) { ringColor = "#b07d00"; scoreClass = "moderate"; scoreText = "Okay Choice"; }

  const healthTags = getHealthTags(product);
  const fmt = (val, unit = "") => (val != null && val !== "") ? `${val}${unit}` : "—";

  return (
    <div className="pc-page">

      {/* ── Main nutrition card ── */}
      <div className="pc-card">

        {/* Sidebar */}
        <div className="pc-sidebar">
          <span className="pc-brand-badge">{product.brand || "SmartBite"}</span>

          <div className="pc-image-circle">
            {product.image ? (
              <img src={product.image} alt={product.productName} />
            ) : (
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="28" fill="rgba(255,255,255,0.18)" />
                <rect x="24" y="20" width="32" height="36" rx="6" fill="rgba(255,255,255,0.5)" />
                <rect x="30" y="14" width="20" height="9" rx="4.5" fill="rgba(255,255,255,0.3)" />
              </svg>
            )}
          </div>

          <div className="pc-sidebar-text">
            <p className="pc-sidebar-name">{product.productName}</p>
            <p className="pc-sidebar-sub">
              {nutrition.servingSize || product.category || ""}
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="pc-panel">

          {/* Header */}
          <div className="pc-header">
            <div>
              <h2 className="pc-product-name">{product.productName}</h2>
              <p className="pc-subtitle">
                {[product.category, product.brand].filter(Boolean).join(" · ")}
              </p>
            </div>

            {/* Score ring */}
            <div className="pc-score-block">
              <svg className="pc-score-ring" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={radius} fill="none" stroke="#e0ede8" strokeWidth="7" />
                <circle
                  cx="55" cy="55" r={radius}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 55 55)"
                />
                <text x="55" y="50" textAnchor="middle"
                  fontFamily="DM Sans,sans-serif" fontSize="26" fontWeight="700" fill="#111">
                  {score}
                </text>
                <text x="55" y="66" textAnchor="middle"
                  fontFamily="DM Sans,sans-serif" fontSize="13" fill="#bbb">
                  /100
                </text>
              </svg>
              <p className={`pc-score-label ${scoreClass}`}>{scoreText}</p>
            </div>
          </div>

          <div className="pc-divider" />

          {/* Nutrition Facts */}
          <div className="pc-nf-header">
            <span className="pc-nf-title">Nutrition Facts</span>
            {nutrition.servingSize && (
              <span className="pc-nf-serving">Per serving · {nutrition.servingSize}</span>
            )}
          </div>

          <div className="pc-calories-row">
            <span className="pc-cal-label">Calories</span>
            <span className="pc-cal-value">
              {nutrition.calories ?? "—"} <span className="pc-cal-unit">kcal</span>
            </span>
          </div>

          <div className="pc-nutrient-grid">
            <div className="pc-nutrient-cell">
              <span className="pc-nutrient-name">Total Fat</span>
              <span className="pc-nutrient-value">{fmt(nutrition.fat, "g")}</span>
            </div>
            <div className="pc-nutrient-cell">
              <span className="pc-nutrient-name">Sodium</span>
              <span className="pc-nutrient-value">{fmt(nutrition.sodium, "mg")}</span>
            </div>
            <div className="pc-nutrient-cell">
              <span className="pc-nutrient-name">Saturated Fat</span>
              <span className="pc-nutrient-value">{fmt(nutrition.saturatedFat, "g")}</span>
            </div>
            <div className="pc-nutrient-cell">
              <span className="pc-nutrient-name">Total Carbs</span>
              <span className="pc-nutrient-value">{fmt(nutrition.carbs, "g")}</span>
            </div>
            <div className="pc-nutrient-cell">
              <span className="pc-nutrient-name">Total Sugars</span>
              <span className="pc-nutrient-value">{fmt(nutrition.sugar, "g")}</span>
            </div>
            <div className="pc-nutrient-cell empty" />
          </div>

          <div className="pc-protein-row">
            <span className="pc-protein-label">Protein</span>
            <span className="pc-protein-value">{fmt(nutrition.protein, "g")}</span>
          </div>

        </div>
      </div>

      {/* ── Ingredients card ── */}
      <div className="pc-ingredients-card">
        <h3>Ingredients</h3>
        <p>
          {product.ingredients?.length
            ? product.ingredients.join(", ")
            : "Ingredients not listed."}
        </p>
        <div className="pc-tag-row">
          {healthTags.length > 0
            ? healthTags.map((tag) => <span key={tag} className="pc-tag">{tag}</span>)
            : <span className="pc-tag">No health tags available</span>}
        </div>
      </div>

      {/* ── Back button ── */}
      <button className="pc-back-btn" onClick={() => navigate("/search")}>
        ← Back to Search
      </button>

    </div>
  );
}