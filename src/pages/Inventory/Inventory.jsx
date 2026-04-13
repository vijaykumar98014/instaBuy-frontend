import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { inventoryAPI,orderAPI} from "../../services/api";
import "./Inventory.css";

// Toast System 
function ToastContainer({ toasts }) {
  const icons = { error: "⚠", success: "✓", info: "ℹ" };
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`}>
          <span>{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

// Confirm Modal 
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-box__icon">🗑</div>
        <h3 className="modal-box__title">Confirm Delete</h3>
        <p className="modal-box__msg">{message}</p>
        <div className="modal-box__btns">
          <button className="modal-box__cancel" onClick={onCancel}>Cancel</button>
          <button className="modal-box__delete" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton Row 
function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} style={{ padding: "18px 20px" }}>
          <div
            className="skeleton-cell"
            style={{ width: i === 3 ? "60px" : "100%" }}
          />
        </td>
      ))}
    </tr>
  );
}

// Stock Status Helper 
function stockStatus(qty) {
  if (qty <= 0)  return { label: "Out of Stock", cls: "inv-stock-badge--out" };
  if (qty <= 5)  return { label: "Low Stock",    cls: "inv-stock-badge--low" };
  return           { label: "In Stock",          cls: "inv-stock-badge--in"  };
}

// Main Component
function Inventory() {
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [name,          setName]          = useState("");
  const [price,         setPrice]         = useState("");
  const [quantity,      setQuantity]      = useState("");
  const [editId,        setEditId]        = useState(null);
  const [toasts,        setToasts]        = useState([]);
  const [confirm,       setConfirm]       = useState(null);
  const [search,        setSearch]        = useState("");
  const [submitting,    setSubmitting]    = useState(false);
  const [formOpen,      setFormOpen]      = useState(false);

  const role     = localStorage.getItem("role");
  const userName = localStorage.getItem("userName");
  const uid = localStorage.getItem("userId");
  const wallet = localStorage.getItem("wallet");
  
  //console.log(uid);
  //console.log(userName);
  const navigate = useNavigate();

  // Toasts 
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  //  API Calls 
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await inventoryAPI.get("/api/inventory/products");
      setProducts(res.data);
    } catch {
      addToast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async () => {
    if (!name || price <= 0 || quantity <= 0) { addToast("Enter Valid inputs", "error"); return; }
    
    setSubmitting(true);
    try {
      await inventoryAPI.post("/api/inventory/admin/add", { name, price, quantity });
      addToast(`"${name}" added to inventory`);
      clearForm();
      fetchProducts();
      setFormOpen(false);
    } catch { addToast("Failed to add product", "error"); }
    finally   { setSubmitting(false); }
  };

  const deleteProduct = async (id) => {
    try {
      await inventoryAPI.delete(`/api/inventory/admin/delete?productId=${id}`);
      addToast("Product removed from inventory");
      fetchProducts();
    } catch { addToast("Failed to delete product", "error"); }
    setConfirm(null);
  };

  const increaseStock = async (id, pName) => {
    try {
      await inventoryAPI.post(`/api/inventory/admin/increase?productId=${id}&quantity=1`);
      addToast(`Stock increased for "${pName}"`, "info");
      fetchProducts();
    } catch { addToast("Failed to increase stock", "error"); }
  };

  const reduceStock = async (id, pName) => {
    try {
      await inventoryAPI.post(`/api/inventory/reduce?productId=${id}&quantity=1`);
      addToast(`Stock reduced for "${pName}"`, "info");
      fetchProducts();
    } catch { addToast("Failed to reduce stock", "error"); }
  };

  const updateProduct = async () => {
    if (!name || !price || !quantity) { addToast("All fields are required", "error"); return; }
    setSubmitting(true);
    try {
      await inventoryAPI.post(`/api/inventory/admin/update?id=${editId}`, { name, price, quantity });
      addToast(`"${name}" updated successfully`);
      clearForm();
      fetchProducts();
      setFormOpen(false);
    } catch { addToast("Failed to update product", "error"); }
    finally   { setSubmitting(false); }
  };

  const addToCart = async (p) => {
    const uid = localStorage.getItem("userId") ;
    //console.log(uid);
    if (p.quantity <= 0) { addToast("Product is out of stock", "error"); return; }
    try {
      const { default: axios } = await import("axios");
      await orderAPI.post(`/api/orders/cart/add/${uid}`, {
        productId: p.id,
        quantity:  1,
        price:     p.price,
      });
      addToast(`"${p.name}" added to cart 🛒`);
    } catch { addToast("Failed to add to cart", "error"); }
  };

  //  Helpers 
  const clearForm   = () => { setEditId(null); setName(""); setPrice(""); setQuantity(""); };
  const cancelEdit  = () => { clearForm(); setFormOpen(false); };
  const startEdit   = (p) => {
    setEditId(p.id); setName(p.name); setPrice(p.price); setQuantity(p.quantity);
    setFormOpen(true);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  useEffect(() => { fetchProducts(); }, []); 

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  //  Summary card data 
  const summaryCards = [
    { label: "Total Products", value: products.length,                                          icon: "📦", color: "#6c63ff" },
    { label: "In Stock",       value: products.filter((p) => p.quantity > 5).length,            icon: "✅", color: "#43e97b" },
    { label: "Low Stock",      value: products.filter((p) => p.quantity > 0 && p.quantity <= 5).length, icon: "⚠️", color: "#f5c842" },
    { label: "Out of Stock",   value: products.filter((p) => p.quantity <= 0).length,           icon: "❌", color: "#ff4d6d" },
  ];

  //  Action buttons config 
  const rowActions = (p) => [
    { emoji: "➕", title: "Add stock",    cls: "icon-btn--increase", action: () => increaseStock(p.id, p.name) },
    { emoji: "➖", title: "Reduce stock", cls: "icon-btn--reduce",   action: () => reduceStock(p.id, p.name)  },
    { emoji: "✏️", title: "Edit",         cls: "icon-btn--edit",     action: () => startEdit(p)               },
    { emoji: "🗑", title: "Delete",       cls: "icon-btn--delete",   action: () => setConfirm({ id: p.id, name: p.name }) },
  ];

  //  Form fields config 
  const formFields = [
    { label: "Product Name", icon: "📦", value: name,     setter: setName,     placeholder: "e.g. Nike Air Max", type: "text"   },
    { label: "Price (₹)",    icon: "💰", value: price,    setter: setPrice,    placeholder: "e.g. 2999",         type: "number" },
    { label: "Quantity",     icon: "🔢", value: quantity, setter: setQuantity, placeholder: "e.g. 50",           type: "number" },
  ];

  //  Render 
  return (
    <div className="inv-wrapper">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="inv-nav">
        <div className="inv-nav__left">
          <button className="inv-nav__back-btn" onClick={() => navigate("/home")}>← Home</button>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div className="inv-nav__logo-icon">🛍</div>
            <span className="inv-nav__logo-text">
              Insta<span>Buy</span>
            </span>
          </div>
        </div>

        <div className="inv-nav__right">
          <span className="inv-nav__count">{products.length} products</span>
          <span className={`inv-nav__role-badge ${role === "ADMIN" ? "inv-nav__role-badge--admin" : "inv-nav__role-badge--user"}`}>
            {role === "ADMIN" ? "🛡" : "👤"} {userName}
          </span>
          <span className="inv-nav__wallet-badge">
              💰 ₹{wallet}
          </span>
          {role !== "ADMIN" && (<button className="inv-nav__cart-btn"    onClick={() => navigate("/cart")}>🛒 Cart</button>)}
          <button className="inv-nav__orders-btn"  onClick={() => navigate("/orders")}>📋 Orders</button>
          <button className="inv-nav__refresh-btn" onClick={fetchProducts}>⟳ Refresh</button>
        </div>
      </nav>

      <div className="inv-inner">


        {/* ── Page Header ──────────────────────────────────────── */}
        <div className="inv-header">
          <div>
            <h1 className="inv-header__title">Inventory</h1>
            <p className="inv-header__subtitle">
              {role === "ADMIN" ? "Manage your products, stock and pricing." : "Browse available products."}
            </p>
          </div>
          {role === "ADMIN" && !formOpen && (
            <button className="add-btn" onClick={() => { clearForm(); setFormOpen(true); }}>
              + Add Product
            </button>
          )}
        </div>

        {/* ── Search ───────────────────────────────────────────── */}
        <div className="inv-search">
          <span className="inv-search__icon">🔍</span>
          <input
            className="inv-search__input"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ── Table ────────────────────────────────────────────── */}
        <div className="inv-table-wrap">
          <table className="inv-table">
            <thead>
              <tr>
                {["Product Name", "Price", "Stock Status", role === "ADMIN" ? "Actions" : ""].filter(Boolean).map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={role === "ADMIN" ? 4 : 3}>
                    <div className="inv-empty">
                      <div className="inv-empty__icon">📭</div>
                      <div className="inv-empty__title">No products found</div>
                      <div className="inv-empty__sub">
                        {search ? `No results for "${search}"` : "Add your first product below"}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const { label, cls } = stockStatus(p.quantity);
                  return (
                    <tr
                      key={p.id}
                      className="inv-row"
                      style={{ borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                    >
                      {/* Name */}
                      <td>
                        <div className="inv-product-cell">
                          <div className="inv-product-icon">📦</div>
                          <div>
                            <div className="inv-product-name">{p.name}</div>
                            <div className="inv-product-id">ID #{p.id}</div>
                          </div>
                        </div>
                      </td>

                      {/* Price */}
                      <td>
                        <span className="inv-price">₹{Number(p.price).toLocaleString()}</span>
                      </td>

                      {/* Stock */}
                      <td>
                        <div className="inv-stock-cell">
                          <span className={`inv-stock-badge ${cls}`}>{label}</span>
                          <span className="inv-stock-qty">Qty: <b>{p.quantity}</b></span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        {role === "ADMIN" ? (
                          <div className="inv-actions">
                            {rowActions(p).map(({ emoji, title, cls: btnCls, action }) => (
                              <button
                                key={title}
                                className={`icon-btn ${btnCls}`}
                                onClick={action}
                                title={title}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            className={`cart-btn ${p.quantity <= 0 ? "cart-btn--disabled" : "cart-btn--active"}`}
                            onClick={() => addToCart(p)}
                            disabled={p.quantity <= 0}
                            title="Add to Cart"
                          >
                            🛒 Add to Cart
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Add / Edit Form ───────────────────────────────────── */}
        {role === "ADMIN" && formOpen && (
          <div className="inv-form">
            <div className="inv-form__header">
              <div>
                <h3 className="inv-form__title">
                  {editId ? "✏️ Update Product" : "✦ Add New Product"}
                </h3>
                <p className="inv-form__subtitle">
                  {editId ? "Modify the product details below" : "Fill in the details to add a new product"}
                </p>
              </div>
              <button className="cancel-btn" onClick={cancelEdit}>✕ Cancel</button>
            </div>

            <div className="inv-form__grid">
              {formFields.map(({ label, icon, value, setter, placeholder, type }) => (
                <div key={label}>
                  <label className="inv-form__label">{label}</label>
                  <div className="inv-form__input-wrap">
                    <span className="inv-form__input-icon">{icon}</span>
                    <input
                      className="inv-form__input"
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="inv-form__actions">
              <button
                className={`submit-btn ${editId ? "submit-btn--edit" : "submit-btn--add"}`}
                onClick={editId ? updateProduct : addProduct}
                disabled={submitting}
              >
                {submitting ? (
                  <><span className="spinner" /> Processing...</>
                ) : editId ? "Update Product" : "Add to Inventory"}
              </button>
              <button className="cancel-btn cancel-btn--lg" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        )}

        {/* ── Summary Cards ─────────────────────────────────────── */}
        <div className="inv-summary">
          {summaryCards.map(({ label, value, icon, color }) => (
            <div key={label} className="inv-summary__card">
              <span className="inv-summary__icon">{icon}</span>
              <div>
                <div className="inv-summary__value" style={{ color }}>{value}</div>
                <div className="inv-summary__label">{label}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Modals & Toasts ──────────────────────────────────────── */}
      {confirm && (
        <ConfirmModal
          message={`Are you sure you want to delete "${confirm.name}"? This action cannot be undone.`}
          onConfirm={() => deleteProduct(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default Inventory;
