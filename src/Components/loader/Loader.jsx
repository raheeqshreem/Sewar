import React from "react";

const Loader = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "70vh", // يأخذ تقريباً وسط الصفحة
      textAlign: "center",
      flexDirection: "column"
    }}>
      <div style={{
        border: "8px solid #f3f3f3",
        borderTop: "8px solid #2a7371",
        borderRadius: "50%",
        width: "80px",
        height: "80px",
        animation: "spin 1s linear infinite",
        marginBottom: "20px"
      }}></div>
      <p style={{ fontSize: "24px", color: "#2a7371", fontWeight: "bold" }}>جاري التحميل...</p>

      {/* إضافة animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;