import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanPage() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Press 'Start Camera' to begin");
  const foundRef = useRef(false);
  const navigate = useNavigate();

  function stopScanner() {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch (e) {}
      readerRef.current = null;
    }
    setScanning(false);
  }

  async function startScanner() {
    setError("");
    setStatus("Starting camera...");
    foundRef.current = false;
    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      setScanning(true);
      setStatus("Point camera at a barcode...");
      await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, err) => {
          if (foundRef.current) return;
          if (result) {
            const barcode = result.getText();
            setStatus(`Detected: ${barcode}`);
            foundRef.current = true;
            stopScanner();
            await lookupProduct(barcode);
          }
        }
      );
    } catch (err) {
      setError("Camera access denied. Please check permissions.");
      setScanning(false);
    }
  }

  async function lookupProduct(barcode) {
    try {
      const response = await fetch(`http://localhost:5000/api/products/barcode/${barcode}`);
      const product = await response.json();
      if (!product || !product._id) {
        setError(`Product ${barcode} not found in our database.`);
        foundRef.current = false;
        return;
      }
      navigate(`/product/${product._id}`, { state: { product } });
    } catch (err) {
      setError("Server connection error.");
      foundRef.current = false;
    }
  }

  useEffect(() => {
    return () => stopScanner();
  }, []);

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Scan Product</h1>
        <p style={s.subtitle}>
          Hold the barcode up to the camera to receive a health score.
        </p>

        <div style={s.videoWrapper}>
          <video
            ref={videoRef}
            style={{ ...s.video, display: scanning ? "block" : "none" }}
          />
          {!scanning && (
            <div style={s.placeholder}>
              <span style={s.cameraIcon}>📷</span>
              <p style={s.placeholderText}>Camera is off</p>
            </div>
          )}
          {scanning && <div style={s.scanLine} />}
        </div>

        <p style={s.status}>{status}</p>
        {error && <p style={s.error}>{error}</p>}

        <div style={s.buttons}>
          {!scanning ? (
            <button onClick={startScanner} style={s.primaryBtn}>
              Start Camera
            </button>
          ) : (
            <button onClick={stopScanner} style={s.stopBtn}>
              Stop Camera
            </button>
          )}
        </div>

        <Link to="/" style={s.linkFix}>
          <button style={s.outlineBtn}>← Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

const s = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    minHeight: "100vh",
    background: "#e8ede9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    width: "100%",
    maxWidth: 500,
    background: "#ffffff",
    borderRadius: "24px",
    padding: "48px 44px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
    textAlign: "center",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "2.2rem",
    fontWeight: 400,
    color: "#111",
    margin: "0 0 10px",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#888",
    margin: "0 0 28px",
    lineHeight: 1.6,
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    height: "280px",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#f0f4f1",
    marginBottom: "20px",
    border: "1.5px solid #dde5de",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    gap: "8px",
  },
  cameraIcon: {
    fontSize: "2rem",
    opacity: 0.4,
  },
  placeholderText: {
    fontSize: "14px",
    color: "#aaa",
    margin: 0,
  },
  scanLine: {
    position: "absolute",
    left: "10%",
    width: "80%",
    height: "2px",
    background: "#2d5a3d",
    borderRadius: "2px",
    boxShadow: "0 0 10px rgba(45,90,61,0.4)",
    zIndex: 10,
    top: "50%",
  },
  status: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
    fontWeight: 500,
  },
  error: {
    fontSize: "13px",
    color: "#c0392b",
    background: "#fdf0ef",
    padding: "10px 16px",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  buttons: {
    marginBottom: "14px",
  },
  primaryBtn: {
    padding: "13px 36px",
    fontSize: "15px",
    fontWeight: 700,
    background: "#2d5a3d",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  stopBtn: {
    padding: "13px 36px",
    fontSize: "15px",
    fontWeight: 700,
    background: "#fff",
    color: "#c0392b",
    border: "1.5px solid #c0392b",
    borderRadius: "50px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  outlineBtn: {
    padding: "11px 28px",
    borderRadius: "50px",
    border: "1.5px solid #2d5a3d",
    background: "transparent",
    color: "#2d5a3d",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  linkFix: {
    textDecoration: "none",
    display: "inline-block",
    color: "inherit",
  },
};