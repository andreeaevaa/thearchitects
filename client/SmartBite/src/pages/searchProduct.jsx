import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const observer = useRef();

  async function handleSearch() {
    try {
      setLoading(true);

      // reset when new search happens
      setResults([]);
      setPage(1);

      const response = await fetch(`http://localhost:5000/api/products?page=1`);
      const data = await response.json();

      const filteredProducts = data.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );

      setResults(filteredProducts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  // 🔥 fetch more when page changes
  useEffect(() => {
    if (page === 1) return; // already handled in search

    async function fetchMore() {
      try {
        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/products?page=${page}`
        );
        const data = await response.json();

        const filteredProducts = data.filter((product) =>
          product.productName.toLowerCase().includes(query.toLowerCase())
        );

        // append instead of replace
        setResults((prev) => [...prev, ...filteredProducts]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching more products:", error);
      }
    }

    fetchMore();
  }, [page]);

  // 🔥 Infinite Scroll Observer
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 40%, #f5a623 100%)",
        color: "white",
      }}
    >
      <h1>Search Products</h1>

      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          padding: "12px 20px",
          fontSize: "16px",
          width: "260px",
          borderRadius: "50px",
          border: "none",
          outline: "none",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      />

      <br />
      <br />

      <button
        onClick={handleSearch}
        style={{
          padding: "12px 28px",
          fontSize: "16px",
          fontWeight: "bold",
          background: "linear-gradient(135deg, #f5a623, #f76b1c)",
          color: "white",
          border: "none",
          borderRadius: "50px",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(247,107,28,0.4)",
          marginLeft: "10px",
        }}
      >
        Search
      </button>

      <br />
      <br />

      <div>
        {results.length > 0 ? (
          results.map((product, index) => {
            // 🔥 attach observer to LAST item
            if (index === results.length - 1) {
              return (
                <div
                  ref={lastProductRef}
                  key={product._id}
                  style={styles.card}
                  onClick={() =>
                    navigate(`/product/${product._id}`, {
                      state: { product },
                    })
                  }
                >
                  <img
                    src={product.image}
                    alt={product.productName}
                    style={styles.image}
                  />
                  <h3>{product.productName}</h3>
                  <p style={{ color: "#555" }}>
                    Click to view details
                  </p>
                </div>
              );
            }

            return (
              <div
                key={product._id}
                style={styles.card}
                onClick={() =>
                  navigate(`/product/${product._id}`, {
                    state: { product },
                  })
                }
              >
                <img
                  src={product.image}
                  alt={product.productName}
                  style={styles.image}
                />
                <h3>{product.productName}</h3>
                <p style={{ color: "#555" }}>
                  Click to view details
                </p>
              </div>
            );
          })
        ) : (
          <p></p>
        )}
      </div>

      {loading && <p>Loading more products...</p>}

      <br />

      <Link
        to="/"
        style={{ display: "flex", justifyContent: "center", textDecoration: "none" }}
      >
        <button style={styles.button}>Home</button>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    border: "none",
    padding: "15px",
    margin: "12px auto",
    width: "300px",
    borderRadius: "16px",
    cursor: "pointer",
    background: "rgba(255,255,255,0.95)",
    color: "#1a3a20",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "10px",
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