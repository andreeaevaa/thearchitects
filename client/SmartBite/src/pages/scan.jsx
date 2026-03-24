import { Link } from "react-router-dom"

export default function ScanPage() {
  return (
    <div style={{ textAlign: "center", padding: "60px 40px", minHeight: "100vh", background: "linear-gradient(160deg, #1a5c2a 0%, #2d8a3e 40%, #f5a623 100%)", color: "white" }}>
      <h1>Scan Product</h1>
      <p>Use your camera to scan a product barcode.</p>

      <button>Start Camera</button>

      <br /><br />

      <Link to="/">
        <button>Back Home</button>
      </Link>
    </div>
  )
}