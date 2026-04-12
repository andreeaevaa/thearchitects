import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../components/ProductCard.css";

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
    <div style={s.page}>

      {/* ── Top bar ── */}
      <div style={s.topBar}>
        <Link to="/profile" style={{ textDecoration: "none" }}>
          {profilePic ? (
            <img src={profilePic} alt="Profile" style={s.profileImg} />
          ) : (
            <div style={s.profilePlaceholder}>
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <button onClick={handleLogout} style={s.logoutBtn}>Log out</button>
      </div>

      {/* ── Hero ── */}
      <section style={s.hero}>
        <h1 style={s.title}>SmartBite</h1>
        {displayName && (
          <p style={s.welcome}>Welcome back, {displayName}!</p>
        )}
        <p style={s.tagline}>
          Scan a product barcode or search for a food to receive a personalized
          health score based on your nutrition goals.
        </p>

        <div style={s.buttons}>
          <Link to="/scan">
            <button style={s.btnPrimary}>
              <span style={s.btnIcon}>⬡</span> Scan Product
            </button>
          </Link>
          <Link to="/search">
            <button style={s.btnSecondary}>Search Products</button>
          </Link>
          <Link to="/product-comparison">
            <button style={s.btnSecondary}>Compare Products</button>
          </Link>
        </div>
      </section>

      {/* ── Comparison History ── */}
      <section style={s.historyCard}>
        <div style={s.historyHeader}>
          <div style={{ textAlign: "left" }}>
            <h2 style={s.historyTitle}>Comparison History</h2>
            <p style={s.historySubtext}>
              Reopen a past comparison and review the health ratings again.
            </p>
          </div>
          <Link to="/product-comparison" style={s.newCompBtn}>
            New Comparison
          </Link>
        </div>

        {comparisonHistory.length > 0 ? (
          <div style={s.historyList}>
            {comparisonHistory.map((entry) => (
              <button
                key={entry.key}
                style={s.historyRow}
                onClick={() => navigate(`/compare?ids=${entry.ids.join(",")}`)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <strong style={{ color: "#1a1a1a" }}>{entry.names[0]}</strong>
                  <span style={s.vs}>vs</span>
                  <strong style={{ color: "#1a1a1a" }}>{entry.names[1]}</strong>
                </div>
                <span style={s.historyDate}>
                  {new Date(entry.date).toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <p style={s.noHistory}>You haven't run a comparison yet.</p>
        )}
      </section>

    </div>
  );
}

const s = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#edf2ee",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0 0 60px",
    color: "#1a1a1a",
  },

  /* top bar */
  topBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
  },
  profileImg: {
    width: 48, height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #2d6a4f",
    display: "block",
  },
  profilePlaceholder: {
    width: 48, height: 48,
    borderRadius: "50%",
    background: "#2d6a4f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#fff",
  },
  logoutBtn: {
    padding: "9px 22px",
    background: "#fff",
    color: "#2d6a4f",
    border: "2px solid #2d6a4f",
    borderRadius: 50,
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    transition: "background 0.2s, color 0.2s",
  },

  /* hero */
  hero: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "60px 24px 48px",
    maxWidth: 700,
    width: "100%",
  },
  logoMark: {
    width: 72, height: 72,
    borderRadius: "50%",
    background: "linear-gradient(160deg, #3e8560, #1e4f3a)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: 1,
    marginBottom: 20,
    boxShadow: "0 8px 28px rgba(45,106,79,0.35)",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "clamp(2.6rem, 6vw, 4rem)",
    fontWeight: 400,
    color: "#1a1a1a",
    margin: "0 0 10px",
    lineHeight: 1.1,
  },
  welcome: {
    fontSize: 16,
    color: "#2d6a4f",
    fontWeight: 600,
    margin: "0 0 16px",
  },
  tagline: {
    fontSize: 17,
    color: "#666",
    lineHeight: 1.75,
    margin: "0 0 36px",
    maxWidth: 520,
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: 14,
    flexWrap: "wrap",
  },
  btnPrimary: {
    padding: "14px 32px",
    fontSize: 15,
    fontWeight: 700,
    background: "linear-gradient(160deg, #3e8560, #1e4f3a)",
    color: "#fff",
    border: "none",
    borderRadius: 50,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: "0 6px 20px rgba(45,106,79,0.35)",
    display: "flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: 0.3,
  },
  btnIcon: {
    fontSize: 16,
  },
  btnSecondary: {
    padding: "14px 32px",
    fontSize: 15,
    fontWeight: 700,
    background: "#fff",
    color: "#2d6a4f",
    border: "2px solid #2d6a4f",
    borderRadius: 50,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    letterSpacing: 0.3,
  },

  /* history */
  historyCard: {
    width: "calc(100% - 80px)",
    maxWidth: 900,
    background: "#fff",
    borderRadius: 28,
    padding: "36px 44px",
    boxShadow: "0 6px 28px rgba(0,0,0,0.07)",
  },
  historyHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 24,
  },
  historyTitle: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: 24,
    fontWeight: 400,
    color: "#1a1a1a",
    margin: "0 0 6px",
  },
  historySubtext: {
    fontSize: 14,
    color: "#888",
    margin: 0,
    lineHeight: 1.6,
  },
  newCompBtn: {
    padding: "12px 28px",
    borderRadius: 999,
    background: "#eef7f1",
    color: "#2d6a4f",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    border: "2px solid #2d6a4f",
    whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
  },
  historyList: {
    display: "grid",
    gap: 10,
  },
  historyRow: {
    width: "100%",
    textAlign: "left",
    padding: "16px 20px",
    borderRadius: 14,
    background: "#f7f9f8",
    border: "1px solid #e4ede8",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    fontFamily: "'DM Sans', sans-serif",
  },
  vs: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: 500,
  },
  historyDate: {
    color: "#aaa",
    fontSize: 13,
    whiteSpace: "nowrap",
  },
  noHistory: {
    color: "#aaa",
    fontSize: 15,
    marginTop: 8,
  },
};