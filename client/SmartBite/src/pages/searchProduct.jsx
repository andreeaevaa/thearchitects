import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  async function handleSearch() {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      const data = await response.json();

      const filteredProducts = data.filter((product) =>
        product.productName.toLowerCase().includes(query.toLowerCase())
      );

      console.log("Filtered results:", filteredProducts)

      setResults(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Search Products</h1>

      <input
        type="text"
        placeholder="Search for a product..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "250px" }}
      />

      <br /><br />

      <button onClick={handleSearch}>Search</button>

      <br /><br />

      <div>
        {results.length > 0 ? (
          results.map((product) => (
            <div
              key={product._id}
              style={styles.card}
              onClick={() =>
                navigate(`/product/${product._id}`, { state: { product } })
              }
            >
              <img
                src={product.image}
                alt={product.productName}
                style={styles.image}
              />
              <h3>{product.productName}</h3>
              <p style={{ color: "#555" }}>Click to view details</p>
            </div>
          ))
        ) : (
          <p>No results yet</p>
        )}
      </div>

      <br />

      <Link to="/">
        <button>Back Home</button>
      </Link>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    margin: "10px auto",
    width: "300px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  image: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "10px",
  },
};