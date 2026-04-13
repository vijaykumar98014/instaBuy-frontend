import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../../services/api";
import "./Signup.css";

function Toast({ message, type }) {
  return (
    <div className={`signup-toast ${type}`}>
      {type === "error" ? "⚠ " : "✓ "}{message}
    </div>
  );
}

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSignup = async () => {
    if (!username || !email || !password || !role) {
      showToast("All fields are required", "error"); return;
    }
    if (!email.includes("@gmail")) {
      showToast("Please enter a valid email", "error"); return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error"); return;
    }
    setLoading(true);
    try {
      await userAPI.post("/api/users/register", {
        name: username, email, password, role,
      });
      showToast("Account created successfully!");
      setTimeout(() => navigate("/login"), 900);
    } catch {
      showToast("Signup failed. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-glow1" />
      <div className="signup-glow2" />

      {/* Left Panel */}
      <div className="signup-left">
        <div className="signup-brand-mark">✨</div>
        <div className="signup-brand-name">
          Join <span>InstaBuy</span>
        </div>
        <p className="signup-tagline">
          Create your account and start managing your store in minutes.
        </p>

        <ul className="signup-step-list">
          {[
            ["Fill in your details", "Username, email and a secure password"],
            ["Choose your role", "USER for shopping, ADMIN for management"],
            ["Get started instantly", "Access your dashboard right away"],
          ].map(([title, desc], i) => (
            <li key={i} className="signup-step-item">
              <span className="signup-step-num">{i + 1}</span>
              <div className="signup-step-text">
                <div className="signup-step-text-title">{title}</div>
                <div>{desc}</div>
              </div>
            </li>
          ))}
        </ul>

        <button
          className="signup-switch-btn"
          onClick={() => navigate("/login")}
        >
          ← Back to Login
        </button>
      </div>

      {/* Right Panel */}
      <div className="signup-right">
        <div className="signup-form-box">
          <h2 className="signup-form-title">Create account</h2>
          <p className="signup-form-sub">Fill in the details to get started</p>

          <div className="signup-input-wrap">
            <label className="signup-label">Username</label>
            <span className="signup-input-icon">👤</span>
            <input
              className="signup-input"
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="off"
              name="instabuy-username-x9k"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
            />
          </div>

          <div className="signup-input-wrap">
            <label className="signup-label">Email Address</label>
            <span className="signup-input-icon">✉</span>
            <input
              className="signup-input"
              type="email"
              placeholder="you12345@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              name="instabuy-email-x9k"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
            />
          </div>

          <div className="signup-input-wrap">
            <label className="signup-label">Password</label>
            <span className="signup-input-icon">🔑</span>
            <input
              className="signup-input"
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              name="instabuy-password-x9k"
              readOnly
              onFocus={(e) => e.target.removeAttribute("readOnly")}
            />
          </div>

          {/* <div className="signup-input-wrap">
            <label className="signup-label">Account Role</label>
            <span className="signup-input-icon">🎛</span>
            <select
              className="signup-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="USER">👤 User — Browse & Shop</option>
              <option value="ADMIN">🛡 Admin — Manage Inventory</option>
            </select>
          </div> */}

          <button
            className="signup-primary-btn"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="signup-spinner" />
                Creating account...
              </>
            ) : "Create Account →"}
          </button>

          <div className="signup-divider">
            <div className="signup-divider-line" />
            <span>or</span>
            <div className="signup-divider-line" />
          </div>

          <p className="signup-bottom-text">
            Already have an account?{" "}
            <button className="signup-bottom-link" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </p>
        </div>
      </div>

      {toast && (
        <div className="signup-toast-wrapper">
          <Toast message={toast.message} type={toast.type} />
        </div>
      )}
    </div>
  );
}

export default Signup;
