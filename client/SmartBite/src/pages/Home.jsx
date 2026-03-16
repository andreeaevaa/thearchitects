import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={styles.page}>
      
      {/* Header */}
      <header style={styles.header}>
        <h1>SmartBite</h1>
        <p>Scan food. Understand your health.</p>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h2>Make Better Food Choices Instantly</h2>
        <p>
          Scan a product barcode or search for a food to receive a clear
          health score based on ingredients and nutritional data.
        </p>

        <div style={styles.buttons}>
          <Link to="/scan">
            <button style={styles.primaryBtn}>Scan Product</button>
          </Link>

          <Link to="/search">
            <button style={styles.secondaryBtn}>Search Products</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "40px",
  },

  header: {
    marginBottom: "40px",
  },

  hero: {
    maxWidth: "600px",
    margin: "0 auto 50px auto",
  },

  buttons: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },

  primaryBtn: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "12px 20px",
    fontSize: "16px",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  features: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  featureCard: {
    width: "220px",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
  },

  footer: {
    marginTop: "60px",
    fontSize: "14px",
    color: "#777",
  },
};