import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

const DIETARY_OPTIONS = [
  "Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free",
  "Nut-Free", "Keto", "Paleo", "Low-Carb",
];

const GOAL_OPTIONS = [
  { value: "lose", label: "🔥 Lose Weight" },
  { value: "maintain", label: "⚖️ Maintain Weight" },
  { value: "gain", label: "📈 Gain Weight" },
  { value: "muscle", label: "💪 Build Muscle" },
];

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary (little/no exercise)" },
  { value: "light", label: "Light (1–3 days/week)" },
  { value: "moderate", label: "Moderate (3–5 days/week)" },
  { value: "active", label: "Active (6–7 days/week)" },
  { value: "very_active", label: "Very Active (twice/day)" },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [username, setUsername] = useState("");

  const [profile, setProfile] = useState({
    displayName: "",
    profilePicture: "",
    age: "",
    weight: "",
    height: "",
    goal: "maintain",
    activityLevel: "moderate",
    dailyCalorieTarget: "",
    dietaryRestrictions: [],
    preferLowSodium: false,
    preferLowSugar: false,
    preferHighProtein: false,
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "");
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.profile) {
        setProfile({
          displayName: data.profile.displayName || "",
          profilePicture: data.profile.profilePicture || "",
          age: data.profile.age || "",
          weight: data.profile.weight || "",
          height: data.profile.height || "",
          goal: data.profile.goal || "maintain",
          activityLevel: data.profile.activityLevel || "moderate",
          dailyCalorieTarget: data.profile.dailyCalorieTarget || "",
          dietaryRestrictions: data.profile.dietaryRestrictions || [],
          preferLowSodium: data.profile.preferLowSodium || false,
          preferLowSugar: data.profile.preferLowSugar || false,
          preferHighProtein: data.profile.preferHighProtein || false,
        });
      }
    } catch (err) {
      console.error("Failed to load profile", err);
    }
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ profile }),
      });
      if (res.ok) {
        setSaveMsg("Profile saved!");
        setTimeout(() => setSaveMsg(""), 3000);
      }
    } catch (err) {
      setSaveMsg("Failed to save.");
    }
    setSaving(false);
  }

  function handlePictureUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((p) => ({ ...p, profilePicture: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function toggleDietary(option) {
    setProfile((p) => {
      const list = p.dietaryRestrictions.includes(option)
        ? p.dietaryRestrictions.filter((d) => d !== option)
        : [...p.dietaryRestrictions, option];
      return { ...p, dietaryRestrictions: list };
    });
  }

  function set(field, value) {
    setProfile((p) => ({ ...p, [field]: value }));
  }

  // Auto-calculate calorie target based on stats
  function calculateCalories() {
    const age = Number(profile.age);
    const weight = Number(profile.weight);
    const height = Number(profile.height);
    if (!age || !weight || !height) return;

    // Mifflin-St Jeor BMR (using lbs/inches)
    const weightKg = weight * 0.453592;
    const heightCm = height * 2.54;
    // Using male formula as a baseline (simplified for class project)
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

    const multipliers = {
      sedentary: 1.2, light: 1.375, moderate: 1.55,
      active: 1.725, very_active: 1.9,
    };
    let tdee = Math.round(bmr * (multipliers[profile.activityLevel] || 1.55));

    if (profile.goal === "lose") tdee -= 500;
    else if (profile.goal === "gain" || profile.goal === "muscle") tdee += 300;

    set("dailyCalorieTarget", tdee);
  }

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.card}><p style={{ color: "#666" }}>Loading profile...</p></div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Back link */}
        <Link to="/" style={styles.backLink}>← Back to Home</Link>

        {/* Profile picture */}
        <div style={styles.avatarSection}>
          <div style={styles.avatarWrapper} onClick={() => fileInputRef.current.click()}>
            {profile.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" style={styles.avatarImg} />
            ) : (
              <div style={styles.avatarPlaceholder}>
                <span style={{ fontSize: "2.5rem" }}>👤</span>
                <p style={styles.uploadHint}>Upload photo</p>
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handlePictureUpload}
          />
          <h2 style={styles.usernameDisplay}>@{username}</h2>
        </div>

        {/* Display name */}
        <div style={styles.section}>
          <label style={styles.label}>Display Name</label>
          <input
            style={styles.input}
            placeholder="What should we call you?"
            value={profile.displayName}
            onChange={(e) => set("displayName", e.target.value)}
          />
        </div>

        {/* Body stats */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Personal Stats</h3>
          <div style={styles.row}>
            <div style={styles.halfField}>
              <label style={styles.label}>Age</label>
              <input style={styles.input} type="number" value={profile.age}
                onChange={(e) => set("age", e.target.value)} />
            </div>
            <div style={styles.halfField}>
              <label style={styles.label}>Weight (lbs)</label>
              <input style={styles.input} type="number" value={profile.weight}
                onChange={(e) => set("weight", e.target.value)} />
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.halfField}>
              <label style={styles.label}>Height (inches)</label>
              <input style={styles.input} type="number" value={profile.height}
                onChange={(e) => set("height", e.target.value)} />
            </div>
            <div style={styles.halfField}>
              <label style={styles.label}>Daily Calorie Target</label>
              <input style={styles.input} type="number" value={profile.dailyCalorieTarget}
                onChange={(e) => set("dailyCalorieTarget", e.target.value)} />
            </div>
          </div>
          <button style={styles.calcBtn} onClick={calculateCalories}>
            Auto-calculate calories from my stats
          </button>
        </div>

        {/* Goal */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>My Goal</h3>
          <div style={styles.goalGrid}>
            {GOAL_OPTIONS.map((g) => (
              <button
                key={g.value}
                style={{
                  ...styles.goalBtn,
                  ...(profile.goal === g.value ? styles.goalBtnActive : {}),
                }}
                onClick={() => set("goal", g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity level */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🏃 Activity Level</h3>
          <select
            style={styles.select}
            value={profile.activityLevel}
            onChange={(e) => set("activityLevel", e.target.value)}
          >
            {ACTIVITY_OPTIONS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* Nutrition preferences */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>⚙️ Nutrition Preferences</h3>
          <div style={styles.toggleRow}>
            {[
              { key: "preferLowSodium", label: "🧂 Prefer Low Sodium" },
              { key: "preferLowSugar", label: "🍬 Prefer Low Sugar" },
              { key: "preferHighProtein", label: "🥩 Prefer High Protein" },
            ].map(({ key, label }) => (
              <button
                key={key}
                style={{
                  ...styles.toggleBtn,
                  ...(profile[key] ? styles.toggleBtnActive : {}),
                }}
                onClick={() => set(key, !profile[key])}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dietary restrictions */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🥗 Dietary Restrictions</h3>
          <div style={styles.tagGrid}>
            {DIETARY_OPTIONS.map((opt) => (
              <button
                key={opt}
                style={{
                  ...styles.tag,
                  ...(profile.dietaryRestrictions.includes(opt) ? styles.tagActive : {}),
                }}
                onClick={() => toggleDietary(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        {saveMsg && (
          <p style={saveMsg === "Profile saved!" ? styles.successMsg : styles.errorMsg}>
            {saveMsg}
          </p>
        )}
        <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>

      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 50%, #f5a623 100%)",
    padding: "40px 20px",
    fontFamily: "Lato, sans-serif",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "40px 36px",
    maxWidth: "600px",
    margin: "0 auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
  },
  backLink: {
    color: "#2d8a3e",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "0.9rem",
    display: "block",
    marginBottom: "24px",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "32px",
  },
  avatarWrapper: {
    position: "relative",
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    overflow: "hidden",
    cursor: "pointer",
    border: "4px solid #2d8a3e",
    marginBottom: "12px",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    background: "#f0f7f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOverlay: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    background: "rgba(0,0,0,0.45)",
    color: "white",
    textAlign: "center",
    fontSize: "1.1rem",
    padding: "4px 0",
  },
  uploadHint: {
    fontSize: "0.7rem",
    color: "#666",
    marginTop: "4px",
  },
  usernameDisplay: {
    color: "#1a5c2a",
    fontWeight: "900",
    fontSize: "1.1rem",
  },
  section: {
    marginBottom: "28px",
    textAlign: "left",
  },
  sectionTitle: {
    fontSize: "1rem",
    fontWeight: "900",
    color: "#1a5c2a",
    marginBottom: "14px",
    paddingBottom: "6px",
    borderBottom: "2px solid #e8f5e9",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: "700",
    color: "#555",
    marginBottom: "5px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  input: {
    width: "100%",
    padding: "11px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontFamily: "Lato, sans-serif",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "11px 16px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "2px solid #e0e0e0",
    outline: "none",
    fontFamily: "Lato, sans-serif",
    background: "white",
  },
  row: {
    display: "flex",
    gap: "14px",
    marginBottom: "14px",
  },
  halfField: {
    flex: 1,
  },
  calcBtn: {
    padding: "9px 18px",
    fontSize: "13px",
    fontWeight: "700",
    background: "#e8f5e9",
    color: "#1a5c2a",
    border: "2px solid #2d8a3e",
    borderRadius: "50px",
    cursor: "pointer",
    marginTop: "4px",
  },
  goalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  goalBtn: {
    padding: "12px 10px",
    fontSize: "14px",
    fontWeight: "700",
    background: "#f5f5f5",
    color: "#444",
    border: "2px solid #e0e0e0",
    borderRadius: "12px",
    cursor: "pointer",
  },
  goalBtnActive: {
    background: "#e8f5e9",
    color: "#1a5c2a",
    border: "2px solid #2d8a3e",
  },
  toggleRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  toggleBtn: {
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: "700",
    background: "#f5f5f5",
    color: "#444",
    border: "2px solid #e0e0e0",
    borderRadius: "50px",
    cursor: "pointer",
  },
  toggleBtnActive: {
    background: "#fff3e0",
    color: "#f76b1c",
    border: "2px solid #f5a623",
  },
  tagGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  tag: {
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "700",
    background: "#f5f5f5",
    color: "#444",
    border: "2px solid #e0e0e0",
    borderRadius: "50px",
    cursor: "pointer",
  },
  tagActive: {
    background: "#e8f5e9",
    color: "#1a5c2a",
    border: "2px solid #2d8a3e",
  },
  saveBtn: {
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "900",
    background: "linear-gradient(135deg, #2d8a3e, #1a5c2a)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(45,138,62,0.35)",
    letterSpacing: "0.5px",
  },
  successMsg: {
    color: "#2d8a3e",
    background: "#f0fff4",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
    textAlign: "center",
    fontWeight: "700",
  },
  errorMsg: {
    color: "#d62828",
    background: "#fff0f0",
    padding: "10px",
    borderRadius: "10px",
    marginBottom: "12px",
    textAlign: "center",
  },
};