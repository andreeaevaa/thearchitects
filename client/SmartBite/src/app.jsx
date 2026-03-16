import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home";
import Scan from "./pages/scan";
import Search from "./pages/searchProduct";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan" element={<Scan />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;