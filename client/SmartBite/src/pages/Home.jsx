import React from "react";

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
          <button style={styles.primaryBtn}>Scan Product</button>
          <button style={styles.secondaryBtn}>Search Products</button>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.features}>
        <div style={styles.featureCard}>
          <h3>📷 Scan Products</h3>
          <p>Use your camera to instantly analyze packaged foods.</p>
        </div>

        <div style={styles.featureCard}>
          <h3>🥗 Health Score</h3>
          <p>Get a simple score based on ingredients and nutrition.</p>
        </div>

        <div style={styles.featureCard}>
          <h3>⚖️ Compare Foods</h3>
          <p>See which products are the healthier choice.</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 SmartBite</p>
      </footer>

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