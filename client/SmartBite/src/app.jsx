import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Scan from "./pages/scan";
import Search from "./pages/searchProduct";
import ProductPage from "./pages/productPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/scan" element={<PrivateRoute><Scan /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
      <Route path="/product/:id" element={<PrivateRoute><ProductPage /></PrivateRoute>} />
    </Routes>
  );
}

export default App;