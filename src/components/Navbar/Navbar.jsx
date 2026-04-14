import { useNavigate } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { toast } from "react-toastify";
import "./Navbar.css";

function Navbar({
  showBackButton = false,
  backText = "← Home",
  backPath = "/home",
  showCount = false,
  countText = "",
  showCartButton = true,
  showOrdersButton = true,
  showInventoryButton = false,
  customButtons = []
}) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "USER";
  const userName = localStorage.getItem("userName");
  const wallet = localStorage.getItem("wallet");

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");

  toast.success("Logged out successfully"); 

  navigate("/login");
};

  return (
    <nav className="navbar">
      <div className="navbar__left">
        {showBackButton && (
          <button className="navbar__back-btn" onClick={() => navigate(backPath)}>
            {backText}
          </button>
        )}

        <div className="navbar__brand">
          <div className="navbar__logo-icon">🛍</div>
          <span className="navbar__logo-text">
            Insta<span className="navbar__logo-accent">Buy</span>
          </span>
        </div>
      </div>

      <div className="navbar__right">
        {showCount && (
          <span className="navbar__count">{countText}</span>
        )}


        {showInventoryButton && (
          <button
            className="navbar__inventory-btn"
            onClick={() => navigate("/inventory")}
          >
            📦 Inventory
          </button>
        )}

        {showCartButton && role !== "ADMIN" && (
          <button className="navbar__cart-btn" onClick={() => navigate("/cart")}>
            🛒 Cart
          </button>
        )}

        {showOrdersButton && (
          <button className="navbar__orders-btn" onClick={() => navigate("/orders")}>
            📋 {role === "ADMIN" ? "Orders" : "My Orders"}
          </button>
        )}

        {/* Custom buttons
        {customButtons.map((btn, index) => (
          <button
            key={index}
            className={btn.className}
            onClick={btn.onClick}
          >
            {btn.text}
          </button>
        ))} */}

        
        <span className="navbar__wallet-badge">
          💰 ₹{wallet}
        </span>
        <span className={`navbar__role-badge ${role === "ADMIN" ? "navbar__role-badge--admin" : "navbar__role-badge--user"}`}>
          {role === "ADMIN" ? "🛡" : "👤"} {userName}
        </span>
        <button
          className="navbar__logout-btn"
          onClick={handleLogout}
        >
          Sign Out
        </button>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navbar;