import React, { useState, useEffect, useRef } from 'react';


const Tooltip = ({ message, onTypingStart }) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null); // Ref to store the timer ID

  // Show the tooltip when the question mark is clicked
  const handleClick = () => {
    setIsVisible(true);

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Hide the tooltip after 5 seconds
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // 5 seconds
  };

  // Hide the tooltip when typing starts
  useEffect(() => {
    if (isVisible && onTypingStart) {
      // Pass a function to hide the tooltip
      onTypingStart(() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current); // Clear the 5-second timer
        }
        setIsVisible(false); // Hide the tooltip immediately
      });
    }
  }, [isVisible, onTypingStart]);

  return (
    <div className="tooltip-container">
      <span 
        className="tooltip-icon" 
        onClick={handleClick}
      >
        ?
      </span>
      {isVisible && (
        <div className="tooltip-message">
          {message}
        </div>
      )}
    </div>
  );
};

export default Tooltip;