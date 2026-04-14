import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../services/api";
import { toast } from "react-toastify";
import ThemeToggle from "../../components/ThemeToggle";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await userAPI.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("userId", res.data.id);
      localStorage.setItem(
        "role",
        res.data.role || (email.includes("admin") ? "ADMIN" : "USER")
      );
      localStorage.setItem("userName", res.data.name);
      localStorage.setItem("wallet", res.data.walletBalance);

      toast.success(res.data.message || "Login successful!");

      setTimeout(() => navigate("/home"), 800);
    } catch {
      toast.error("Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-page">
      <div className="login-glow1" />
      <div className="login-glow2" />

      {/* Left Panel */}
      <div className="login-left">
        <div className="login-brand-mark">🛍</div>
        <div className="login-brand-name">
          Insta<span>Buy</span>
        </div>
        <p className="login-tagline">
          Your premium destination for seamless commerce experiences.
        </p>

        <ul className="login-feature-list">
          {[
            ["🔒", "Secure Authentication"],
            ["📦", "Real-time Inventory"],
            ["⚡", "Instant Updates"],
            ["🎛", "Admin Dashboard"],
          ].map(([icon, text]) => (
            <li key={text} className="login-feature-item">
              <span className="login-feature-icon">{icon}</span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <button
          className="login-switch-btn"
          onClick={() => navigate("/")}
        >
          Create Account →
        </button>
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-theme-row">
          <ThemeToggle />
        </div>

        <div className="login-form-box">
          <h2 className="login-form-title">Welcome back</h2>
          <p className="login-form-sub">
            Sign in to your account to continue
          </p>

          <div className="login-input-wrap">
            <label className="login-label">Email Address</label>
            <span className="login-input-icon">✉</span>
            <input
              className="login-input"
              type="email"
              placeholder="you1234@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="login-input-wrap">
            <label className="login-label">Password</label>
            <span className="login-input-icon">🔑</span>
            <input
              className="login-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="login-primary-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner" />
                Signing in...
              </>
            ) : (
              "Sign In →"
            )}
          </button>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span>or</span>
            <div className="login-divider-line" />
          </div>

          <p className="login-bottom-text">
            Don't have an account?{" "}
            <button
              className="login-bottom-link"
              onClick={() => navigate("/")}
            >
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;