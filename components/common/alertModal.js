// Modal.js
import React from 'react';
//import './Modal.css'; // You can style your modal here

const Modal = ({ message, onClose, onConfirm, onCancel, type}) => {
  return (
       <div className="alert-modal-overlay">
      <div className="alert-modal-content">
      <h2>{type === "confirmation" ? "Confirm Deletion" : type === "clear_all" ? "Clear All Orders" : "Alert"}</h2>
      <p>{message}</p>
        <div>
        {type === "confirmation" || type === "clear_all" ? (
            <div className='alert-modal-btns'>
              <button className='delete-btn' onClick={onConfirm}>{type === "clear_all" ? "Yes, Clear All" : "Yes"}</button>
              <button onClick={onCancel}>No</button>
            </div>
          ) : (
            <button onClick={onClose}>Close</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;