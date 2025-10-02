import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function RatingToast() {
  const navigate = useNavigate();
  const [ratingsCount, setRatingsCount] = useState([0, 0, 0, 0, 0]);

  const totalReviews = ratingsCount.reduce((a, b) => a + b, 0);
  const average =
    totalReviews === 0
      ? 0
      : (
          ratingsCount.reduce((sum, count, i) => sum + count * (i + 1), 0) /
          totalReviews
        ).toFixed(1);

  const getLabel = () => {
    if (totalReviews === 0) return "No reviews";
    if (average < 2) return "Poor";
    if (average < 3) return "Fair";
    if (average < 4) return "Good";
    return "Excellent";
  };

  const handleWriteFeedback = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      navigate("/writefeedback");
    } else {
      // عرض Toast منسق بدل alert
      toast.custom(
        (t) => (
          <div
            style={{
              padding: "16px 24px",
              background: "white",
              color: "black",
              borderRadius: "12px",
              fontFamily: "Arial, sans-serif",
              fontWeight: "bold",
              fontSize: "20px", // خط أكبر
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            يرجى تسجيل الدخول
          </div>
        ),
        { duration: 3000 } // يظهر 3 ثواني
      );
      navigate("/signin");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "150px auto" }}>
      {/* الصف الأول */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
        <span style={{ fontSize: "16px" }}>
          Reviews {totalReviews.toLocaleString()}
        </span>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={{
                color: average >= star ? "orange" : "#ccc",
                fontSize: "18px",
              }}
            >
              ★
            </span>
          ))}
        </div>
        <span style={{ fontWeight: "bold" }}>{average}</span>
      </div>

      {/* زر شاركنا رأيك */}
      <div
        onClick={handleWriteFeedback}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "5px 5px",
          backgroundColor: "#2a7371",
          color: "beige",
          borderRadius: "8px",
          fontSize: "28px",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        ✍ شاركنا رأيك
      </div>

      {/* الصندوق الأبيض */}
      <div
        style={{
          border: "1px solid #eee",
          borderRadius: "10px",
          padding: "20px",
          backgroundColor: "white",
          display: "flex",
          gap: "20px",
        }}
      >
        <div style={{ flex: "1", textAlign: "center" }}>
          <h1 style={{ margin: "0", fontSize: "40px" }}>{average}</h1>
          <p style={{ margin: "0", color: "gray", fontSize: "18px" }}>
            {getLabel()}
          </p>
          <div style={{ fontSize: "20px", margin: "10px 0" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  color: average >= star ? "orange" : "#ccc",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <p style={{ color: "gray" }}>{totalReviews.toLocaleString()} reviews</p>
        </div>

        <div style={{ flex: "2" }}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingsCount[star - 1];
            const percent =
              totalReviews === 0 ? 0 : ((count / totalReviews) * 100).toFixed(0);
            const color =
              star === 5
                ? "green"
                : star === 4
                ? "limegreen"
                : star === 3
                ? "gold"
                : star === 2
                ? "orange"
                : "red";

            return (
              <div
                key={star}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span style={{ width: "50px" }}>{star}-star</span>
                <div
                  style={{
                    flex: 1,
                    height: "10px",
                    background: "#eee",
                    borderRadius: "5px",
                    marginRight: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: "100%",
                      background: color,
                    }}
                  ></div>
                </div>
                <span>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}