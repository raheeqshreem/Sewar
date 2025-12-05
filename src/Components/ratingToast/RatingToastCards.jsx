import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import FeedbackListCards from "./FeedbackListCards";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react"; // أيقونة السهم للرجوع

export default function RatingToastCards() {
  const navigate = useNavigate();
  const feedbackRef = useRef(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [userFeedbackId, setUserFeedbackId] = useState(null);
const location = useLocation();
const [serviceId, setServiceId] = useState(location.state?.serviceId);
console.log("📌 ServiceId المستلم:", serviceId); // ✅ هنا ستشوف الـ id

const serviceTitle = location.state?.serviceTitle; // ⭐ الاسم المستلم

const handleWriteFeedback = () => {
const user = JSON.parse(localStorage.getItem("user"));
  console.log("📌 المستخدم الحالي:", user); // ✅ هنا تطبع معلومات المستخدم
  console.log("📌 ServiceId عند الضغط:", serviceId); // ✅ هنا تطبع الـ id عند الضغط

  if (!user || !user.token) {
    toast.custom(
      () => (
        <div style={{
          padding: "16px 24px",
          background: "white",
          color: "black",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "20px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          👋 لتكتب رأيك يرجى تسجيل الدخول
        </div>
      ),
      { duration: 3000 }
    );
    localStorage.setItem("redirectAfterLogin", "/FeedbackOnOurSpecialties");
    navigate("/signin");
    return;
  }

  // يمكنك هنا التحقق من الدور فقط إذا أردت
  const role = user.roles?.[0];
  if (!["patient", "scheduler_admin"].includes(role)) {
    toast.custom(
      () => (
        <div style={{
          padding: "16px 24px",
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}>
          ❌ هذا الدور لا يمكنه كتابة رأي
        </div>
      ),
      { duration: 3000 }
    );
    return;
  }

  // الانتقال مباشرة لصفحة كتابة الفيدباك
// الانتقال مباشرة لصفحة كتابة الفيدباك
navigate("/writefeedbackCards", { 
  state: { 
    serviceId, 
    serviceTitle // ⭐ أرسل العنوان أيضاً
  } 
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
        }}
      >
        {alertMessage && (
          <div
            style={{
              backgroundColor: "#fef3c7",
              color: "#92400e",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {alertMessage}
          </div>
        )}
{/* ← سهم الرجوع للخلف */}
<div
  onClick={() => navigate("/feedback")} // يرجع على صفحة feedback
  style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#2a7371"
  }}
>
  <ChevronLeft size={24} /> {/* أيقونة السهم */}
  <span>الرجوع لصفحة التقييمات</span>
</div>

        {/* زر كتابة رأي */}
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
          }}
        >
          ✍ شاركنا رأيك
        </div>

        {/* فقط قائمة الفيدباكات */}
<FeedbackListCards />
      </div>

      
    </>
  );
}
