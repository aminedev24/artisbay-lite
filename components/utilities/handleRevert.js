import React, {useState} from 'react';
import { useUser } from '../user/userContext'; // adjust the path as needed
import Modal from '../common/alertModal';
import { apiBaseUrl } from './apiBase';

const RevertImpersonationButton = () => {
  const { setUser } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");  // e.g., 'alert', 'confirmation', etc.
  const apiUrl = apiBaseUrl;


    const showAlert = (message, type = "alert") => {
    setTimeout(() => {
        setModalMessage(message);
        setModalType(type);
        setShowModal(true);
    }, 1000);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };
  const handleRevert = async () => {
    try {
      const response = await fetch(`${apiUrl}/users/stop_impersonation.php`, {
        method: 'POST',
        credentials: 'include', // Send cookies/session info
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        // Update the user context with the admin's details from the response
        setUser(data.user);
        // Optionally redirect or update the UI as needed
        showAlert("Reverted back to admin successfully!");
        //alert("Reverted back to admin successfully!");
        // Clear the message after 5 seconds
      setTimeout(() => {

        window.location.reload()
      }, 500);
      } else {
        alert(data.error || data.message);
      }
    } catch (error) {
      console.error("Error reverting impersonation:", error);
      showAlert("Reverted back to admin successfully!");
      //alert("Error reverting impersonation. Please try again.");
    }
  };

  return (
    <>
    {showModal && (
        <Modal
          message={modalMessage}
          onClose={handleCloseModal}
          type={modalType}
        />
    )}
    <button
      onClick={handleRevert}
      className='logout-btn'
      style={{
        background: 'var(--accent-color)',
        textTransform: 'unset',
        margin: '5px',
        padding: '10px 0'
      }}
    >
      Revert to Admin
    </button>   
    </>
 
  );
};

export default RevertImpersonationButton;