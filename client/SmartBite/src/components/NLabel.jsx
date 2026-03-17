export default function NutritionLabel({ food }) {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Nutrition Facts</h2>

      <div style={styles.lineThick}></div>

      <p><strong>Serving Size:</strong> {food.servingSize || "N/A"}</p>

      <div style={styles.line}></div>

      <p style={styles.calories}>
        <strong>Calories</strong> {getNutrient(food, "Energy")}
      </p>

      <div style={styles.lineThick}></div>

      <table style={styles.table}>
        <tbody>
          <tr>
            <td><strong>Total Fat</strong></td>
            <td>{getNutrient(food, "Total lipid (fat)")} g</td>
          </tr>

          <tr>
            <td style={styles.indent}>Saturated Fat</td>
            <td>{getNutrient(food, "Fatty acids, total saturated")} g</td>
          </tr>

          <tr>
            <td><strong>Cholesterol</strong></td>
            <td>{getNutrient(food, "Cholesterol")} mg</td>
          </tr>

          <tr>
            <td><strong>Sodium</strong></td>
            <td>{getNutrient(food, "Sodium, Na")} mg</td>
          </tr>

          <tr>
            <td><strong>Total Carbohydrate</strong></td>
            <td>{getNutrient(food, "Carbohydrate, by difference")} g</td>
          </tr>

          <tr>
            <td style={styles.indent}>Dietary Fiber</td>
            <td>{getNutrient(food, "Fiber, total dietary")} g</td>
          </tr>

          <tr>
            <td style={styles.indent}>Total Sugars</td>
            <td>{getNutrient(food, "Sugars, total including NLEA")} g</td>
          </tr>

          <tr>
            <td><strong>Protein</strong></td>
            <td>{getNutrient(food, "Protein")} g</td>
          </tr>
        </tbody>
      </table>

      <div style={styles.lineThick}></div>
    </div>
  );
}

// 🔍 Helper function
function getNutrient(food, nutrientName) {
  const nutrient = food.foodNutrients?.find(
    (n) => n.nutrientName === nutrientName
  );
  return nutrient ? nutrient.value : "0";
}

const styles = {
  container: {
    width: "300px",
    border: "2px solid black",
    padding: "10px",
    fontFamily: "Arial",
    margin: "20px auto",
    backgroundColor: "white",
  },

  title: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "5px",
  },

  calories: {
    fontSize: "18px",
    fontWeight: "bold",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  indent: {
    paddingLeft: "15px",
  },

  line: {
    borderTop: "1px solid black",
    margin: "5px 0",
  },

  lineThick: {
    borderTop: "3px solid black",
    margin: "8px 0",
  },
};