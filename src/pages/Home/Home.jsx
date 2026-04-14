import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { toast } from "react-toastify";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "USER";
  const userName = localStorage.getItem("userName");
  const wallet = localStorage.getItem("wallet");

  const cards = [
    {
      icon: "📦",
      iconBg: "rgba(108,99,255,0.15)",
      color: "#6c63ff",
      title: "Product Inventory",
      desc: "Browse and manage your complete product catalog with real-time stock tracking.",
      action: "View Products",
      onClick: () => navigate("/inventory"),
    },
    {
      icon: "🛒",
      iconBg: "rgba(245,200,66,0.1)",
      color: "#f5c842",
      title: "My Cart",
      desc: "Review items in your cart and place orders instantly.",
      action: "View Cart",
      onClick: () => navigate("/cart"),
    },
    {
      icon: "📋",
      iconBg: "rgba(67,233,123,0.1)",
      color: "#43e97b",
      title: role === "ADMIN" ? "All Orders" : "My Orders",
      desc:
        role === "ADMIN"
          ? "View and update status of all customer orders across the platform."
          : "Track the status of your placed orders in real-time.",
      action: role === "ADMIN" ? "Manage Orders" : "Track Orders",
      onClick: () => navigate("/orders"),
    },
    {
      icon: "🛡",
      iconBg: "rgba(255,101,132,0.1)",
      color: "#ff6584",
      title: role === "ADMIN" ? "Admin Controls" : "Browse Store",
      desc:
        role === "ADMIN"
          ? "Add, update, delete products and manage the entire store inventory."
          : "Explore all available products and add them to your cart.",
      action: role === "ADMIN" ? "Manage Store" : "Shop Now",
      onClick: () => navigate("/inventory"),
    },
  ];

  return (
    <div className="home-page">
      <div className="home-glow" />

      {/* Navbar */}
      <Navbar showInventoryButton={true} />

      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-eyebrow">✦ Your Smart Shopping Platform</div>
        <h1 className="home-hero-title">
          Shop Fast.<br />
          <span className="home-hero-grad">Shop Smart.</span>
        </h1>
        <p className="home-hero-sub">
          Browse products, track stock and manage your store — all in one place.
        </p>
        <div className="home-hero-btns">
          <button
            className="home-primary-btn"
            onClick={() => navigate("/inventory")}
          >
            📦 View Products
          </button>
          {role === "ADMIN" && (
            <button
              className="home-primary-btn"
              onClick={() => navigate("/inventory")}
            >
              🛡 Admin Panel
            </button>
          )}
        </div>
      </section>

      {/* Stats */}
      <div className="home-stats-row">
        {[
          ["Real-time", "Inventory Updates"],
          ["Role-based", "Access Control"],
          ["REST API", "Spring Boot Backend"],
          ["Secure", "Authentication"],
        ].map(([num, label]) => (
          <div key={label} className="home-stat-item">
            <div className="home-stat-num">{num}</div>
            <div className="home-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="home-section">
        <h2 className="home-section-title">Quick Actions</h2>
        <div className="home-cards-grid">
          {cards.map((card) => (
            <div key={card.title} className="home-card">
              <div
                className="home-card-icon"
                style={{ background: card.iconBg }}
              >
                {card.icon}
              </div>
              <div className="home-card-title">{card.title}</div>
              <p className="home-card-desc">{card.desc}</p>
              <button
                className="home-card-action"
                style={{ color: card.color }}
                onClick={card.onClick}
              >
                {card.action} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <span>© 2026 InstaBuy — Powered by Spring Boot</span>
        <span>Built with ♥ for modern commerce</span>
      </footer>
    </div>
  );
}

export default Home;
