import { Link } from "react-router-dom"

export default function SearchPage() {
  return (
    <div style={{textAlign:"center", padding:"40px"}}>
      <h1>Search Products</h1>

      <input
        type="text"
        placeholder="Search for a food..."
        style={{padding:"10px", fontSize:"16px"}}
      />

      <br /><br />

      <button>Search</button>

      <br /><br />

      <Link to="/">
        <button>Back Home</button>
      </Link>
    </div>
  )
}