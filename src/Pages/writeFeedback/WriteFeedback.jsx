/*import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import React, { useState } from "react";

const RatingBox = () => {
  const [hovered, setHovered] = useState(null);

  // تحديد اللون حسب النجمة
  const getColor = (index) => {
    if (hovered === null) return "#f9f9f9"; // اللون الافتراضي للمستطيلات
    if (index === 0 || index === 1) return "red";
    if (index === 2) return "yellow";
    if (index === 3 || index === 4) return "green";
    return "#f9f9f9";
  };

  return (
    <div style={{minHeight:'70vh'}}>
    <div
      style={{
        width: "400px",
        padding: "30px",
        borderRadius: "15px",
        backgroundColor: "white",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)", // ظل خفيف
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        margin:"200px auto 0 auto",
      }}
    >
      <h3 style={{ marginBottom: "20px", fontWeight: "normal" }}>
        How would you rate your experience?
      </h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: getColor(index),
              transition: "0.3s",
              fontSize: "24px",
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default RatingBox;*/


import React, { useState } from "react";

const RatingBox = () => {
  const [hovered, setHovered] = useState(null);

  // تحديد اللون حسب النجمة اللي واقف عليها فقط
  const getColor = (index) => {
    if (hovered === index) {
      if (index === 0 || index === 1) return "red";
      if (index === 2) return "yellow";
      if (index === 3 || index === 4) return "green";
    }
    return "#f9f9f9"; // الافتراضي
  };

  return (
        <div style={{minHeight:'70vh'}}>

    <div
      style={{
        width: "400px",
        padding: "30px",
        borderRadius: "15px",
        backgroundColor: "white",
        boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        margin: "100px auto 0 auto",
        margin:"200px auto 0 auto",

      }}
    >
      <h3 style={{ marginBottom: "20px", fontWeight: "normal" }}>
        How would you rate your experience?
      </h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
              backgroundColor: getColor(index),
              transition: "0.3s",
              fontSize: "24px",
            }}
          >
            ⭐
          </div>
        ))}
      </div>
    </div>
        </div>

  );
};

export default RatingBox;