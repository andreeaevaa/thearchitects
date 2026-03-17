import { useLocation, Link } from "react-router-dom";
import NutritionLabel from "../components/NLabel";

export default function FoodPage() {
  const location = useLocation();
  const food = location.state?.food;

  if (!food) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>No food data found</h2>
        <Link to="/search">
          <button>Go Back</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>{food.description}</h1>

      <NutritionLabel food={food} />

      <br />

      <Link to="/search">
        <button>Back to Search</button>
      </Link>
    </div>
  );
}