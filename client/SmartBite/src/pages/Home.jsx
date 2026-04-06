import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [comparisonHistory, setComparisonHistory] = useState([]);
  const username = localStorage.getItem("username") || "";
  const HISTORY_KEY = "comparisonHistory";

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.profile) {
          setProfilePic(data.profile.profilePicture || "");
          setDisplayName(data.profile.displayName || "");
        }
      } catch (err) {}
    }
    loadProfile();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY);
    if (saved) {
      try {
        setComparisonHistory(JSON.parse(saved));
      } catch (err) {
        setComparisonHistory([]);
      }
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  }

  return (
    <div style={styles.page}>

      {/* Top bar */}
      <div style={styles.topBar}>
        {/* Profile icon — top left */}
        <Link to="/profile" style={styles.profileLink}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" style={styles.profileImg} />
          ) : (
            <div style={styles.profilePlaceholder}>
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        {/* Logout — top right */}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Log out
        </button>
      </div>

      {/* Header */}
      <header style={styles.header}>
        <h1 style={{ fontSize: "3.5rem", fontWeight: "900", letterSpacing: "2px", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
          SmartBite
        </h1>
        {displayName && (
          <p style={{ fontSize: "1rem", opacity: 0.8, marginTop: "2px" }}>
            Welcome back, {displayName}!
          </p>
        )}
      </header>

      {/* Hero */}
      <section style={styles.hero}>
        <p style={{ fontSize: "1.1rem", opacity: 0.88, lineHeight: "1.7" }}>
          Scan a product barcode or search for a food to receive a personalized
          health score based on your nutrition goals.
        </p>

        <div style={styles.buttons}>
          <Link to="/scan">
            <button style={styles.primaryBtn}>Scan Product</button>
          </Link>
          <Link to="/search">
            <button style={styles.secondaryBtn}>Search Products</button>
          </Link>
          <Link to="/product-comparison">
            <button style={styles.cmprsonPrimaryBtn}>Compare Products</button>
          </Link>
        </div>
      </section>

      <section style={styles.historySection}>
        <div style={styles.historyHeader}>
          <div>
            <h2 style={styles.historyTitle}>Comparison History</h2>
            <p style={styles.historySubtext}>
              Reopen a past comparison and review the health ratings again.
            </p>
          </div>
          <Link to="/product-comparison" style={styles.historyAction}>
            New Comparison
          </Link>
        </div>

        {comparisonHistory.length > 0 ? (
          <div style={styles.historyList}>
            {comparisonHistory.map((entry) => (
              <button
                key={entry.key}
                style={styles.historyCard}
                onClick={() => navigate(`/compare?ids=${entry.ids.join(",")}`)}
              >
                <div>
                  <strong>{entry.names[0]}</strong>
                  <span style={styles.historySeparator}>vs</span>
                  <strong>{entry.names[1]}</strong>
                </div>
                <div style={styles.historyDate}>
                  {new Date(entry.date).toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p style={styles.noHistory}>You haven’t run a comparison yet.</p>
        )}
      </section>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "Lato, sans-serif",
    textAlign: "center",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 40%, #f5a623 100%)",
    display: "flex",
    flexDirection: "column",
    color: "white",
    position: "relative",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
  },
  profileLink: {
    textDecoration: "none",
  },
  profileImg: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid rgba(255,255,255,0.8)",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    display: "block",
  },
  profilePlaceholder: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    border: "3px solid rgba(255,255,255,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.3rem",
    fontWeight: "900",
    color: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  logoutBtn: {
    padding: "8px 18px",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.5)",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "13px",
    fontFamily: "Lato, sans-serif",
  },
  header: {
    padding: "20px 40px 10px",
  },
  hero: {
    maxWidth: "640px",
    margin: "40px auto 50px auto",
    padding: "0 20px",
  },
  buttons: {
    marginTop: "32px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #f2a13d 0%, #e4600d 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(247,107,28,0.4)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontFamily: "Lato, sans-serif",
  },

  cmprsonPrimaryBtn: {
     padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #f23dc5 0%, #821177 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 20px rgba(247,107,28,0.4)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontFamily: "Lato, sans-serif",
  },

  secondaryBtn: {
    padding: "14px 32px",
    fontSize: "16px",
    fontWeight: "bold",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(8px)",
    color: "white",
    border: "2px solid rgba(255,255,255,0.6)",
    borderRadius: "50px",
    cursor: "pointer",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontFamily: "Lato, sans-serif",
  },
  historySection: {
    maxWidth: "900px",
    margin: "0 auto 50px auto",
    padding: "24px 20px 32px",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "24px",
    boxShadow: "0 12px 40px rgba(0,0,0,0.2)",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },
  historyTitle: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 700,
  },
  historySubtext: {
    margin: "8px 0 0",
    opacity: 0.85,
    maxWidth: "560px",
    lineHeight: 1.6,
  },
  historyAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "12px 26px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.16)",
    color: "white",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.35)",
    fontWeight: 700,
  },
  historyList: {
    display: "grid",
    gap: "14px",
  },
  historyCard: {
    width: "100%",
    textAlign: "left",
    padding: "18px 22px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
    color: "white",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  historySeparator: {
    margin: "0 10px",
    opacity: 0.7,
  },
  historyDate: {
    opacity: 0.75,
    fontSize: "0.9rem",
  },
  noHistory: {
    opacity: 0.9,
    marginTop: "12px",
  },
};