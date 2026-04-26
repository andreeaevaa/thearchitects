import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const navigate = useNavigate();

  async function handleSearch() {
    if (!query.trim()) return;
    try {
      setLoading(true);
      setSearched(true);
      setResults([]);

      const response = await fetch(`http://localhost:5000/api/products`);
      const data = await response.json();

      const filteredProducts = data.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div style={s.page}>

      {/* Search header card */}
      <div style={s.searchCard}>
        <h1 style={s.title}>Search Products</h1>
        <p style={s.subtitle}>Find any food and get its nutrition breakdown and health score.</p>

        <div style={s.inputRow}>
          <input
            type="text"
            placeholder="Search for a product..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={s.input}
          />
          <button onClick={handleSearch} style={s.searchBtn}>Search</button>
        </div>
      </div>

      {/* Results */}
      {loading && (
        <div style={s.loadingRow}>
          <div style={s.spinner} />
          <span style={s.loadingText}>Searching...</span>
        </div>
      )}

      {searched && !loading && (
        <div style={s.resultsArea}>
          {results.length > 0 ? (
            <div style={s.grid}>
              {results.map((product) => (
                <div
                  key={product._id}
                  style={s.resultCard}
                  onClick={() => navigate(`/product/${product._id}`, { state: { product } })}
                >
                  {product.image && (
                    <div style={s.imgWrap}>
                      <img src={product.image} alt={product.productName} style={s.img} />
                    </div>
                  )}
                  <div style={s.cardBody}>
                    <p style={s.productName}>{product.productName}</p>
                    {product.brand && <p style={s.brand}>{product.brand}</p>}
                    <span style={s.viewBtn}>View details →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={s.emptyState}>
              <p style={s.emptyText}>No products found for "<strong>{query}</strong>"</p>
              <p style={s.emptyHint}>Try a different search term.</p>
            </div>
          )}
        </div>
      )}

      <Link to="/" style={{ textDecoration: "none", marginTop: 8 }}>
        <button style={s.homeBtn}>← Home</button>
      </Link>
    </div>
  );
}

const s = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#e8ede9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 40px 60px",
    gap: 28,
  },
  searchCard: {
    width: "100%",
    maxWidth: 700,
    background: "#fff",
    borderRadius: 24,
    padding: "44px 52px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    textAlign: "center",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 36,
    fontWeight: 400,
    color: "#111",
    margin: "0 0 10px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: 15,
    color: "#999",
    margin: "0 0 28px",
    lineHeight: 1.6,
  },
  inputRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    maxWidth: 380,
    padding: "13px 22px",
    fontSize: 15,
    borderRadius: 50,
    border: "1.5px solid #dde5de",
    outline: "none",
    fontFamily: "'DM Sans', sans-serif",
    color: "#333",
    background: "#f7faf7",
  },
  searchBtn: {
    padding: "13px 32px",
    fontSize: 15,
    fontWeight: 700,
    background: "#2d5a3d",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
  },
  resultsArea: {
    width: "100%",
    maxWidth: 900,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 18,
  },
  resultCard: {
    background: "#fff",
    borderRadius: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
  },
  imgWrap: {
    width: "100%",
    height: 160,
    background: "#f0f4f1",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: {
    padding: "18px 20px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#111",
    margin: 0,
    lineHeight: 1.35,
  },
  brand: {
    fontSize: 13,
    color: "#aaa",
    margin: 0,
  },
  viewBtn: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: 700,
    color: "#2d5a3d",
  },
  emptyState: {
    background: "#fff",
    borderRadius: 20,
    padding: "48px 32px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
  },
  emptyText: { fontSize: 17, color: "#444", margin: "0 0 8px" },
  emptyHint: { fontSize: 14, color: "#aaa", margin: 0 },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  spinner: {
    width: 22,
    height: 22,
    border: "3px solid #dde5de",
    borderTop: "3px solid #2d5a3d",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: 14,
    color: "#888",
  },
  homeBtn: {
    padding: "13px 36px",
    borderRadius: 50,
    border: "1.5px solid #2d5a3d",
    background: "transparent",
    color: "#2d5a3d",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
};