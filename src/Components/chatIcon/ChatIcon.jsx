import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const ChatIcon = () => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 1000,
      }}
    >
      {/* Tooltip */}
      {hover && (
        <div
          style={{
            position: "absolute",
            bottom: "70px", // فوق الدائرة
            right: "50%",
            transform: "translateX(50%)",
            backgroundColor: "#2a7371",
            color: "beige",
            padding: "8px 12px",
            borderRadius: "8px",
            whiteSpace: "nowrap",
            fontSize: "14px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          تواصل معنا 
        </div>
      )}

      {/* الزر */}
      <a
        href="https://wa.me/+970592245331"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          backgroundColor: "#25D366",
          color: "white",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "40px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
        }}
      >
        <FaWhatsapp />
      </a>
    </div>
  );
};

export default ChatIcon;