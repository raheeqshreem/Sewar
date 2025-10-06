import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FeedbackList from "./FeedbackList";
export default function RatingToast() {
  const navigate = useNavigate();
  const feedbackRef = useRef(null); // 🔹 مرجع للتعليق
  const [summary, setSummary] = useState({
    totalRatings: 0,
    average: 0,
    percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  const [alertMessage, setAlertMessage] = useState(""); // 🔹 لعرض التنبيه
  const [userFeedback, setUserFeedback] = useState(null); // 🔹 حفظ تقييم المستخدم

  useEffect(() => {
    axios
      .get("https://sewarwellnessclinic1.runasp.net/api/Ranking/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));
  }, []);

  const { totalRatings, average, percentages } = summary;

  const getLabel = () => {
    if (totalRatings === 0) return "لا يوجد تقييمات بعد";
    if (average < 2) return "ضعيف";
    if (average < 3) return "متوسط";
    if (average < 4) return "جيد";
    return "ممتاز";
  };

  const handleWriteFeedback = () => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🟡 لو المستخدم مش داخل → فقط نعرض توست بدون توجيه
    if (!user || !user.token) {
      toast.custom(
        () => (
          <div
            style={{
              padding: "16px 24px",
              background: "white",
              color: "black",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "20px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            👋  لتكتب رأيك يرجى تسجيل الدخول
          </div>
        ),
        { duration: 3000 }

      );
      localStorage.removeItem("redirectAfterLogin"); // ❌ نحذف أي توجيه سابق
      localStorage.setItem("redirectAfterLogin", window.location.hash);
      navigate("/signin")
      return; // ❌ لا تنتقل لصفحة تسجيل الدخول تلقائيًا
    }

    // 🟢 المستخدم داخل → نكمل كالمعتاد
    axios
      .get(
        `https://sewarwellnessclinic1.runasp.net/api/Ranking/user/${user.email}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      )
      .then((res) => {
        const feedback = Array.isArray(res.data) ? res.data[0] : null;

        if (feedback && feedback.id) {
          setUserFeedback(feedback);
          setAlertMessage("لقد قمت بكتابة تقييم من قبل ✅");

          setTimeout(() => {
            if (feedbackRef.current) {
              feedbackRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 800);
        } else {
          navigate("/writefeedback");
        }
      })
      .catch((err) => {
        console.error("خطأ جلب تقييم المستخدم:", err.response || err);
        navigate("/writefeedback");
      });
  };

  return (
    <>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          maxWidth: "600px",
          margin: "150px auto",
          minHeight: "100vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {/* 🟡 التنبيه (Alert) */}
        {alertMessage && (
          <div
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fef3c7",
              color: "#92400e",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {alertMessage}
          </div>
        )}

        {/* الصف الأول */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <span style={{ fontSize: "16px" }}>
            Reviews {totalRatings.toLocaleString()}
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
            flexDirection: "column",
          }}
        >
          {/* بيانات المستخدم لو موجودة */}
          {userFeedback && (
            <div
              ref={feedbackRef}
              style={{
                border: "2px solid #2a7371",
                borderRadius: "10px",
                padding: "15px",
                background: "#f8fdfd",
              }}
            >
              <h3 style={{ margin: "0 0 10px" }}>
                تعليقك السابق ⭐ ({userFeedback.rating}/5)
              </h3>
              <p style={{ margin: "0", color: "gray" }}>
                {userFeedback.comment || "لم تكتب تعليقًا نصيًا"}
              </p>
            </div>
          )}

          {/* التقييم العام */}
          <div style={{ display: "flex", gap: "20px" }}>
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
              <p style={{ color: "gray" }}>
                {totalRatings.toLocaleString()} reviews
              </p>
            </div>

            <div style={{ flex: "2" }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const percent = percentages[star] || 0;
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
        <FeedbackList />
      </div>
    </>
  );
}