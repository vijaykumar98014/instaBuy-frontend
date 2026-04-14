import "./ConfirmModal.css";

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

export default ConfirmModal;