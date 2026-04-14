import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

// 🔥 Toastify import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Home from "./pages/Home/Home";
import Inventory from "./pages/Inventory/Inventory";
import Cart from "./pages/Cart/Cart";
import Orders from "./pages/Orders/Orders";

// Theme init
const defaultTheme =
  typeof window !== "undefined"
    ? localStorage.getItem("theme") || "dark"
    : "dark";

if (typeof document !== "undefined") {
  document.body.setAttribute("data-theme", defaultTheme);
}

function App() {
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    document.body.setAttribute("data-theme", theme);
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </BrowserRouter>

      {/* 🔥 GLOBAL TOAST (IMPORTANT) */}
      <ToastContainer
        position="top-right" 
        autoClose={1000}      
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="dark"
      />
    </>
  );
}

export default App;