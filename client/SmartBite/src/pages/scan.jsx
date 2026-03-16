import { Link } from "react-router-dom"

export default function ScanPage() {
  return (
    <div style={{textAlign:"center", padding:"40px"}}>
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