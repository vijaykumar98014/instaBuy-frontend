import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../../services/api";
import { userAPI } from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import { toast } from "react-toastify";
import "./Cart.css";

//  Main Component 
function Cart() {
  const [cartItems,   setCartItems]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [placing,     setPlacing]     = useState(false);
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

  //  Fetch Cart   
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await orderAPI.get(`/api/orders/cart/${userId}`);
      setCartItems(res.data || []);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };


const removeItem = async (productId) => {
  setRemovingId(productId);
  try {
    await orderAPI.get(`/api/orders/cart/remove/${userId}/${productId}`);
    toast.info("Item removed ❌");
    fetchCart();
  } catch {
    toast.error("Failed to remove item");
  } finally {
    setRemovingId(null);
  }
};

const updateQuantity = async (productId, newQuantity) => {
  if (newQuantity < 1) {
    return;
  }
  try {
    // Get current item to find price
    const currentItem = cartItems.find(item => item.productId === productId);
    if (!currentItem) {
      return;
    }

    // Update local state immediately (no page refresh)
    const updatedCart = cartItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedCart);

    // Remove the item first
    await orderAPI.get(`/api/orders/cart/remove/${userId}/${productId}`);
    
    // Re-add with new quantity
    await orderAPI.post(`/api/orders/cart/add/${userId}`, {
      productId: productId,
      quantity: newQuantity,
      price: currentItem.price,
    });
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Failed to update quantity");
    // Revert if API fails
    fetchCart();
  }
};

const increaseQuantity = (productId, currentQty) => {
  updateQuantity(productId, currentQty + 1);
};

const decreaseQuantity = (productId, currentQty) => {
  if (currentQty <= 1) {
    toast.error("Quantity cannot be less than 1");
    return;
  }
  updateQuantity(productId, currentQty - 1);
};

  // Place Order  
  //    Body: { shippingAddress, phone }  (matches OrderRequest DTO)
  const placeOrder = async () => {
  if (cartItems.length === 0) {
    toast.error("Your cart is empty");
    return;
  }
  if (!address.trim()) {
    toast.error("Please enter a shipping address");
    return;
  }
  if (!phone.trim()) {
    toast.error("Please enter a phone number");
    return;
  }
  if (!/^\d{10}$/.test(phone)) {
  toast.error("Phone number must be exactly 10 digits");
  return;
  
 }
 if (wallet < total) {
    toast.error("❌ Insufficient wallet balance");
    return;
  }
  setPlacing(true);
  try {
  const res = await orderAPI.post(`/api/orders/place/${userId}`, {
    shippingAddress: address,
    phone: phone,
  });


 if (res?.data?.status === "CONFIRMED") {

  toast.success("Payment successful ✅ Order placed 🎉");

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
   toast.error("❌ Payment failed. Try again");
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
      <Navbar
        showBackButton={true}
        backText="← Inventory"
        backPath="/inventory"
        showCount={true}
        countText={`${cartItems.length} item${cartItems.length !== 1 ? "s" : ""} in cart`}
        showCartButton={false}
      />

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
                        <span>₹{Number(item.price).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="cart-item__right-section">
                      

                      {/* Amount */}
                      <div className="cart-item__subtotal">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </div>

                      {/* Quantity Controls */}
                      <div className="cart-item__controls">
                        <button
                          className="cart-item__qty-btn cart-item__qty-btn--decrease"
                          onClick={() => decreaseQuantity(item.productId, item.quantity)}
                          title="Decrease quantity"
                        >
                          ➖
                        </button>
                        <span className="cart-item__qty-display">{item.quantity}</span>
                        <button
                          className="cart-item__qty-btn cart-item__qty-btn--increase"
                          onClick={() => increaseQuantity(item.productId, item.quantity)}
                          title="Increase quantity"
                        >
                          ➕
                        </button>
                        
                      </div>
                      {/* Remove Button */}
                      <button
                        className="cart-item__remove"
                        onClick={() => removeItem(item.productId)}
                        title="Remove item"
                      >
                        ❌
                      </button>
                    </div>
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
    </div>
  );
}

export default Cart;
