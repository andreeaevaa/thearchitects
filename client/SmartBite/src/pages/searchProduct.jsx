import { useState } from "react";
import { Link } from "react-router-dom";
import NutritionLabel from "../components/NLabel";
import { useNavigate } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const navigate = useNavigate();

  const API_KEY = "ieyM7Rc0igKN6eHp8UU2l5hbrLQgFr7MBpW6kbuN";

  async function handleSearch() {
    if (!query) return;

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: query,
            pageSize: 10,
          }),
        }
      );

      const data = await response.json();
      setResults(data.foods || []);
    } catch (error) {
      console.error("Error fetching USDA data:", error);
    }
  }

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>Search Products (USDA)</h1>

      {/* Input */}
      <input
        type="text"
        placeholder="Search for a food..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", width: "250px" }}
      />

      <br /><br />

      <button onClick={handleSearch}>Search</button>

      <br /><br />

      <div>
  {results.length > 0 ? (
    results.map((food) => (
      <div
        key={food.fdcId}
        style={styles.card}
        onClick={() =>
          navigate(`/product/${food.fdcId}`, { state: { food } })
        }
      >
        <h3>{food.description}</h3>
        <p style={{ color: "#555" }}>Click to view details</p>
      </div>
    ))
  ) : (
    <p>No results yet</p>
  )}
</div>

      
      {selectedFood && (
  <div>
    <p>Selected food: {selectedFood.description}</p>
    <NutritionLabel food={selectedFood} />
  </div>
)}

      <br />

      <Link to="/">
        <button>Back Home</button>
      </Link>
    </div>
  );
}

// 🔍 Helper to extract nutrients
function getNutrient(food, nutrientName) {
  const nutrient = food.foodNutrients?.find(
    (n) => n.nutrientName === nutrientName
  );
  return nutrient ? nutrient.value : "N/A";
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    margin: "10px auto",
    width: "300px",
    borderRadius: "10px",
  },
};