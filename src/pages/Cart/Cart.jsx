import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../../services/api";
import { userAPI } from "../../services/api";
import "./Cart.css";

//  Toast System 
function ToastContainer({ toasts }) {
  const icons = { success: "✓", error: "⚠", info: "ℹ" };
  return (
    <div className="cart-toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`cart-toast cart-toast--${t.type}`}>
          <span>{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

//  Main Component 
function Cart() {
  const [cartItems,   setCartItems]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [placing,     setPlacing]     = useState(false);
  const [toasts,      setToasts]      = useState([]);
  const [address,     setAddress]     = useState("");
  const [phone,       setPhone]       = useState("");

  const navigate = useNavigate();
  const [removingId, setRemovingId] = useState(null);
  const [wallet, setWallet] = useState(
  Number(localStorage.getItem("wallet"))
);
  const role     = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");
  const userId = localStorage.getItem("userId");
  //const wallet = localStorage.getItem("wallet");

  //  Toasts 
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  //  Fetch Cart   
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.get(`/api/orders/cart/${userId}`);
      setCartItems(res.data || []);
    } catch {
      addToast("Failed to load cart", "error");
    } finally {
      setLoading(false);
    }
  };


const removeItem = async (productId) => {
  setRemovingId(productId);
  try {
    await orderAPI.get(`/api/orders/cart/remove/${userId}/${productId}`);
    addToast("Item removed ❌", "info");
    fetchCart();
  } catch {
    addToast("Failed to remove item", "error");
  } finally {
    setRemovingId(null);
  }
};

  // Place Order  
  //    Body: { shippingAddress, phone }  (matches OrderRequest DTO)
  const placeOrder = async () => {
  if (cartItems.length === 0) {
    addToast("Your cart is empty", "error");
    return;
  }
  if (!address.trim()) {
    addToast("Please enter a shipping address", "error");
    return;
  }
  if (!phone.trim()) {
    addToast("Please enter a phone number", "error");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
  addToast("Phone number must be exactly 10 digits", "error");  
  return;
  
 }
 if (wallet < total) {
    addToast("❌ Insufficient wallet balance", "error");
    return;
  }
  setPlacing(true);
  try {
  const res = await orderAPI.post(`/api/orders/place/${userId}`, {
    shippingAddress: address,
    phone: phone,
  });


 if (res?.data?.status === "CONFIRMED") {

  addToast("Payment successful ✅ Order placed 🎉", "success");

  //  FETCH LATEST WALLET FROM BACKEND
  const userRes = await userAPI.get(`/api/users/${userId}`);
  localStorage.setItem("wallet", userRes.data.wallet);

  const updatedWallet = userRes.data.wallet;

  //  UPDATE wallet
  localStorage.setItem("wallet", updatedWallet);
  setWallet(updatedWallet);

  setCartItems([]);
  setTimeout(() => navigate("/orders"), 1500);
}

} catch (err) {
   addToast("❌ Payment failed. Try again", "error");
}finally{
  setPlacing(false);
}
};



  useEffect(() => { fetchCart(); }, []); 

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="cart-page">
      <div className="cart-glow"   />
      <div className="cart-glow-2" />

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="cart-nav">
        <div className="cart-nav__left">
          <button className="cart-nav__back-btn" onClick={() => navigate("/inventory")}>
            ← Inventory
          </button>
          <div className="cart-nav__brand">
            <div className="cart-nav__logo-icon">🛍</div>
            <span className="cart-nav__logo-text">
              Insta<span>Buy</span>
            </span>
          </div>
        </div>

        <div className="cart-nav__right">
          <span className="cart-nav__count">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in cart
          </span>
          <span className={`inv-nav__role-badge ${role === "ADMIN" ? "inv-nav__role-badge--admin" : "inv-nav__role-badge--user"}`}>
            {role === "ADMIN" ? "🛡" : "👤"} {userName}
          </span>
          <span className="inv-nav__wallet-badge">
              💰 ₹{wallet}
          </span>
          <button
            className="cart-nav__orders-btn"
            onClick={() => navigate("/orders")}
          >
            📋 My Orders
          </button>
        </div>
      </nav>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <div className="cart-content">

        {/* Header */}
        <div className="cart-header">
          <h1 className="cart-header__title">🛒 Your Cart</h1>
          <p className="cart-header__subtitle">
            Review your items and fill in delivery details to place your order.
          </p>
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div className="cart-skeleton">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="cart-skeleton__row" />
            ))}
          </div>

        ) : cartItems.length === 0 ? (
          /* ── Empty State ── */
          <div className="cart-empty">
            <span className="cart-empty__icon">🛒</span>
            <h3 className="cart-empty__title">Your cart is empty</h3>
            <p className="cart-empty__sub">Browse the inventory and add some products!</p>
            <button className="cart-empty__btn" onClick={() => navigate("/inventory")}>
              Browse Products →
            </button>
          </div>

        ) : (
          <div className="cart-layout">

            {/* Items Panel */}
            <div className="cart-items-panel">
              <div className="cart-items-wrap">

                <div className="cart-items-header">
                  <span className="cart-items-header__title">Cart Items</span>
                  <span className="cart-items-header__badge">{cartItems.length} items</span>
                </div>

                {cartItems.map((item, i) => (
                  <div key={item.id || item.productId || i} className="cart-item">
                    <div className="cart-item__icon">📦</div>

                    <div className="cart-item__info">
                      <div className="cart-item__name">
                        {item.productName || item.name || `Product #${item.productId}`}
                      </div>
                      <div className="cart-item__meta">
                        Qty: {item.quantity} &times; <span>₹{Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="cart-item__subtotal">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                    <button
                        className="cart-item__remove"
                        onClick={() => removeItem(item.productId)}
                        >
                        ❌
                    </button>
                  </div>
                ))}

                <div className="cart-shipping-notice">
                  🚚 Free delivery on this order
                </div>
              </div>
            </div>

            {/* Order Summary + Address Panel */}
            <div className="cart-summary-panel">
              <div className="cart-summary-box">
                <h3 className="cart-summary-box__title">Order Summary</h3>

                <div className="cart-summary-rows">
                  <div className="cart-summary-row">
                    <span>Items ({cartItems.length})</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                  <div className="cart-summary-row cart-summary-row--free">
                    <span>Delivery</span>
                    <span>Free</span>
                  </div>
                  <div className="cart-summary-divider" />
                  <div className="cart-summary-total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Address + Phone — required by OrderRequest DTO */}
                <div className="cart-address-form">
                  <div className="cart-address-form__title">Delivery Details</div>

                  <div className="cart-address-form__field">
                    <label className="cart-address-form__label">Shipping Address</label>
                    <input
                      className="cart-address-form__input"
                      type="text"
                      placeholder="Enter full address..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="cart-address-form__field">
                    <label className="cart-address-form__label">Phone Number</label>
                    <input
                      className="cart-address-form__input"
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="cart-place-btn"
                  onClick={placeOrder}
                  disabled={placing}
                >
                  {placing ? (
                    <>
                      <span className="cart-place-btn__spinner" />
                      Placing order...
                    </>
                  ) : (
                    "✅ Place Order"
                  )}
                </button>

                <button
                  className="cart-continue-btn"
                  onClick={() => navigate("/inventory")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default Cart;
