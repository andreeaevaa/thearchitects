import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
//import { BrowserMultiFormatReader } from "@zxing/browser";

export default function ScanPage() {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Press 'Start Camera' to begin scanning");
  const [found, setFound] = useState(false);
  const navigate = useNavigate();

  function stopScanner() {
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (e) {}
      readerRef.current = null;
    }
    setScanning(false);
  }

  async function startScanner() {
    setError("");
    setStatus("Starting camera...");
    setFound(false);

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;
      setScanning(true);
      setStatus("Point camera at a barcode...");

      await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        async (result, err) => {
          if (found) return;

          if (result) {
            const barcode = result.getText();
            setStatus(`Barcode detected: ${barcode} — looking up product...`);
            setFound(true);
            stopScanner();
            await lookupProduct(barcode);
          }
        }
      );
    } catch (err) {
      setError("Could not access camera. Make sure you've granted camera permissions.");
      setScanning(false);
    }
  }

  async function lookupProduct(barcode) {
    try {
      const response = await fetch(`http://localhost:5000/api/products/barcode/${barcode}`);
      const product = await response.json();

      if (!product || !product._id) {
        setStatus("");
        setError(`No product found for barcode: ${barcode}. It may not be in the database yet.`);
        setFound(false);
        return;
      }

      navigate(`/product/${product._id}`, { state: { product } });
    } catch (err) {
      setError("Error connecting to server.");
      setFound(false);
    }
  }

  useEffect(() => {
    return () => stopScanner();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Scan Product</h1>
        <p style={styles.subtitle}>Hold the barcode up to the camera</p>

        {/* Video feed */}
        <div style={styles.videoWrapper}>
          <video
            ref={videoRef}
            style={{
              ...styles.video,
              display: scanning ? "block" : "none",
            }}
          />
          {!scanning && (
            <div style={styles.placeholder}>
              <span style={styles.placeholderIcon}></span>
              <p style={styles.placeholderText}>Camera off</p>
            </div>
          )}
          {/* Scanning overlay */}
          {scanning && (
            <div style={styles.scanLine} />
          )}
        </div>

        {/* Status message */}
        <p style={styles.status}>{status}</p>

        {/* Error message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Buttons */}
        <div style={styles.buttons}>
          {!scanning ? (
            <button onClick={startScanner} style={styles.startBtn}>
              Start Camera
            </button>
          ) : (
            <button onClick={stopScanner} style={styles.stopBtn}>
              Stop Camera
            </button>
          )}
        </div>

        <Link to="/" style={styles.backLink}>Back</Link>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 50%, #f5a623 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Lato, sans-serif",
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    padding: "40px 32px",
    width: "100%",
    maxWidth: "480px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  title: {
    fontSize: "1.8rem",
    color: "#1a5c2a",
    fontWeight: "900",
    marginBottom: "6px",
  },
  subtitle: {
    color: "#666",
    fontSize: "0.95rem",
    marginBottom: "24px",
  },
  videoWrapper: {
    position: "relative",
    width: "100%",
    height: "280px",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#1a1a1a",
    marginBottom: "16px",
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
    color: "#888",
  },
  placeholderIcon: {
    fontSize: "3rem",
    marginBottom: "10px",
  },
  placeholderText: {
    fontSize: "0.9rem",
  },
  scanLine: {
    position: "absolute",
    top: "50%",
    left: "10%",
    width: "80%",
    height: "3px",
    background: "rgba(245, 166, 35, 0.85)",
    borderRadius: "2px",
    boxShadow: "0 0 12px rgba(245,166,35,0.7)",
    animation: "scanPulse 1.5s ease-in-out infinite",
  },
  status: {
    color: "#444",
    fontSize: "0.9rem",
    marginBottom: "8px",
    minHeight: "20px",
  },
  error: {
    color: "#d62828",
    fontSize: "0.9rem",
    padding: "10px 14px",
    background: "#fff0f0",
    borderRadius: "10px",
    marginBottom: "12px",
  },
  buttons: {
    marginBottom: "20px",
  },
  startBtn: {
    padding: "13px 36px",
    fontSize: "15px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #2d8a3e, #1a5c2a)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(45,138,62,0.35)",
    letterSpacing: "0.5px",
  },
  stopBtn: {
    padding: "13px 36px",
    fontSize: "15px",
    fontWeight: "bold",
    background: "linear-gradient(135deg, #d62828, #a01010)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(214,40,40,0.35)",
    letterSpacing: "0.5px",
  },
  backLink: {
    color: "#2d8a3e",
    textDecoration: "none",
    fontSize: "0.9rem",
    fontWeight: "bold",
  },
};