import { useState, useCallback } from "react";

const useModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("alert");

  const showAlert = useCallback((message, type = "alert") => {
    setTimeout(() => {
      setModalMessage(message);
      setModalType(type);
      setShowModal(true);
    }, 1000);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    showModal,
    modalMessage,
    modalType,
    showAlert,
    handleCloseModal,
    setShowModal,
    setModalMessage,
    setModalType,
  };
};

export default useModal;
