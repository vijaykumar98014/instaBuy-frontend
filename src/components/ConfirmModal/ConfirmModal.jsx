function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#16161f",
        padding: "30px",
        borderRadius: "20px"
      }}>
        <h3>Confirm Delete</h3>
        <p>{message}</p>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}

export default ConfirmModal;