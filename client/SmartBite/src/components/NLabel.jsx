export default function NutritionLabel({ food }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Nutrition Facts</h2>

      <div style={styles.lineThick}></div>

      <p><strong>Serving Size:</strong> {food.servingSize || "N/A"}</p>

      <div style={styles.line}></div>

      <p style={styles.calories}>
        <strong>Calories</strong> {food.nutrition?.calories ?? "N/A"}
      </p>

      <div style={styles.lineThick}></div>

      <table style={styles.table}>
        <tbody>
          <tr>
            <td><strong>Total Fat</strong></td>
            <td>{food.nutrition?.fat ?? "N/A"} g</td>
          </tr>
          <tr>
            <td style={styles.indent}>Saturated Fat</td>
            <td>{food.nutrition?.saturatedFat ?? "N/A"} g</td>
          </tr>
          <tr>
            <td><strong>Sodium</strong></td>
            <td>{food.nutrition?.sodium ?? "N/A"} mg</td>
          </tr>
          <tr>
            <td><strong>Total Carbohydrate</strong></td>
            <td>{food.nutrition?.carbs ?? "N/A"} g</td>
          </tr>
          <tr>
            <td style={styles.indent}>Total Sugars</td>
            <td>{food.nutrition?.sugar ?? "N/A"} g</td>
          </tr>
          <tr>
            <td><strong>Protein</strong></td>
            <td>{food.nutrition?.protein ?? "N/A"} g</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    width: "320px",
    border: "3px solid #1a5c2a",
    borderRadius: "12px",
    padding: "16px",
    fontFamily: "Georgia, serif",
    backgroundColor: "white",
    color: "#1a3a20",
    textAlign: "left",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
  },
  calories: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "8px 0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  indent: {
    paddingLeft: "16px",
  },
  line: {
    borderTop: "1px solid black",
    margin: "6px 0",
  },
  lineThick: {
    borderTop: "4px solid black",
    margin: "8px 0",
  },
};