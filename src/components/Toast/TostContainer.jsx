function ToastContainer({ toasts }) {
  return (
    <div style={{
      position: "fixed",
      bottom: "30px",
      right: "30px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          padding: "14px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          fontWeight: "500",
          color: t.type === "error" ? "#ff4d6d" : "#43e97b",
          background: t.type === "error"
            ? "rgba(255,77,109,0.12)"
            : "rgba(67,233,123,0.12)",
          border: `1px solid ${
            t.type === "error" ? "#ff4d6d" : "#43e97b"
          }`,
        }}>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;