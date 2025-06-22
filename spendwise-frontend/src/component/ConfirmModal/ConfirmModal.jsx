import { useState } from "react";
import ButtonLoader from '../ButtonLoader/ButtonLoader'
import "./confirmModal.css";

const ConfirmModal = ({ message, onConfirm, onCancel, isOpen }) => {
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  const confirmDelete = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  }

  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-contents">
          <h2>Warning</h2>
          <p>{message || "Are you sure you want to proceed?"}</p>
        </div>
        <div className="modal-btns">
          <button disabled={loading} onClick={onCancel}>Cancel</button>
          <button disabled={loading} onClick={confirmDelete}>{
            loading ? <ButtonLoader /> : "Delete"
            }</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
