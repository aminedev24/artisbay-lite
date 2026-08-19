import React, { useState } from 'react';
import { useUser } from '../user/userContext';
import Modal from "../common/alertModal";
import { apiBaseUrl } from '../utilities/apiBase';

const Settings = ({ user, setUser }) => {
  const { triggerSessionRefresh } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");  // Could be 'alert', 'confirmation', or 'clear_all'


  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const showAlert = (message, type = "alert") => {
    setTimeout(() => {
      setModalMessage(message);
      setModalType(type);
      setShowModal(true);
    }, 1000); // Delay for 1 second
  };
  
  
  const [details, setDetails] = useState([
    {
      key: 'joined_date',
      label: 'Date of Registration',
      type: 'date',
      editable: false,
      value: user?.joined_date ? new Date(user.joined_date).toLocaleDateString() : ''
    },
    {
      key: 'company',
      label: 'Company Name',
      type: 'text',
      editable: true,
      value: user?.company || ''
    },
    {
      key: 'full_name',
      label: 'Your Name',
      type: 'text',
      editable: true,
      value: user?.full_name || ''
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'tel',
      editable: false,
      value: user?.phone || ''
    },
    {
      key: 'country',
      label: 'Country',
      type: 'text',
      editable: true,
      value: user?.country || ''
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      editable: false,
      value: user?.email || '',
      verified: user?.is_verified
    },
    {
      key: 'address',
      label: 'Address',
      type: 'text',
      editable: true,
      value: user?.address || ''
    }
  ]);

  const [isEditing, setIsEditing] = useState({});
  const [error, setError] = useState(null);

  const apiUrl = apiBaseUrl;

  const handleEditToggle = (key) => {
    setIsEditing((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleInputChange = (key, value) => {
    setDetails((prev) =>
      prev.map((detail) =>
        detail.key === key ? { ...detail, value: value } : detail
      )
    );
  };

  const handleSave = async (key) => {
    try {
      const detail = details.find((d) => d.key === key);

      const response = await fetch(`${apiUrl}/users/update_profile.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [key]: detail.value,
        }),
      });

      triggerSessionRefresh();

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      handleEditToggle(key);
      setError(null);
    } catch (error) {
      setError(error.message);
      console.error('Update failed:', error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await fetch(`${apiUrl}/auth/send-email-verification.php`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user?.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }
      showAlert('Verification email sent!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="settings-container">

    {showModal && (
          <Modal
            message={modalMessage}
            onClose={handleCloseModal}
            type={modalType}
          />
      )}
      {error && <div className="error-message">{error}</div>}
      <table className="settings-table">
        <tbody>
          {details.map((detail) => (
            <tr key={detail.key}>
              <th>{detail.label}</th>
              <td>
                {isEditing[detail.key] && detail.editable ? (
                  <div className="edit-mode">
                    <input
                      className="settings-input"
                      type={detail.type}
                      value={detail.value}
                      onChange={(e) =>
                        handleInputChange(detail.key, e.target.value)
                      }
                    />
                    <div className="edit-buttons">
                      <button
                        className="btn btn-save"
                        onClick={() => handleSave(detail.key)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => handleEditToggle(detail.key)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{gap: '10px'}} className="view-mode">
                    {detail.value}
                    {detail.key === 'email' && (
                      <>
                        {detail.verified ? (
                          <><span className="verified-status"></span><span style={{fontWeight: 'bold'}}>Verified</span></>
                        ) : (
                          <button
                            className="btn btn-verify"
                            onClick={handleVerifyEmail}
                          >
                            Verify
                          </button>
                        )}
                      </>
                    )}
                    {detail.editable ? (
                      <button
                        className="btn btn-edit"
                        onClick={() => handleEditToggle(detail.key)}
                      >
                        Edit
                      </button>
                    ) : (
                      <button className="btn btn-hidden">Edit</button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Settings;