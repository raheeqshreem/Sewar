import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    try {
      const res = await axios.get(
        "https://sewarwellnessclinic1.runasp.net/api/Notifications/my",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("حدث خطأ أثناء جلب الإشعارات:", err);
    } finally {
      setLoading(false);
    }
  };

const handleNotificationClick = async (notification) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    localStorage.setItem("redirectAfterLogin", "/notifications");
    navigate("/signin");
    return;
  }

  try {
    // تعليم الإشعار كمقروء
    if (!notification.isRead) {
      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Notifications/mark-read/${notification.id}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    }

    const userType = (user.userType || "").toLowerCase();

    if (!userType) return;

    if (notification.consultationId) {
      if (userType === "doctor") {
        // ✅ تمرير بيانات الإشعار مباشرة كـ state
        navigate("/consultation-doctor", { 
          state: { 
            newReply: {
              consultationId: notification.consultationId,
              parentMessageId: notification.parentMessageId || null
            } 
          } 
        });
      } else {
        navigate("/myinquiry", { state: { newReply: {
              consultationId: notification.consultationId,
              parentMessageId: notification.parentMessageId || null
            } } });
      }
    }
  } catch (err) {
    console.error("خطأ أثناء تعليم الإشعار كمقروء:", err);
  }
};

  if (loading) return <p>جاري التحميل...</p>;

  return (
    <div style={{ padding: "120px 20px 20px", maxWidth: "800px", margin: "0 auto", direction: "rtl" }}>
      <h2 style={{ textAlign: "center", color: "#2a7371", marginBottom: "25px" }}>الإشعارات</h2>

      {notifications.length === 0 ? (
        <p style={{ textAlign: "center", color: "#666" }}>لا توجد إشعارات</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n.id}
              onClick={() => handleNotificationClick(n)}
              style={{
                marginBottom: "12px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                background: n.isRead ? "#f8f9fa" : "#fff5f5",
                cursor: n.consultationId ? "pointer" : "default",
                transition: "0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#eefaf9")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = n.isRead ? "#f8f9fa" : "#fff5f5")}
            >
              <b style={{ color: "#2a7371" }}>{n.title}</b>
              <p style={{ margin: "8px 0", color: "#444" }}>{n.message}</p>
              <small style={{ color: "#777" }}>{new Date(n.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}