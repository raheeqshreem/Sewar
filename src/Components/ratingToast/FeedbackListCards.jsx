import React, { useEffect, useState, useCallback } from "react"; 
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import Modal from "react-modal";
import { useLocation } from "react-router-dom";

const FeedbackListCards = () => { 
  const [feedbacks, setFeedbacks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [zoomVideo, setZoomVideo] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const API_BASE = "https://sewarwellnessclinic1.runasp.net";
const { state } = useLocation();
const serviceId = state?.serviceId;
console.log("📌 Service ID:", serviceId);
const [serviceTitle] = useState(state?.serviceTitle || "");

  const sortData = (data) =>
    data.sort((a, b) => {
      const roleA = a.role?.toLowerCase?.() || "";
      const roleB = b.role?.toLowerCase?.() || "";
      if (roleA === "scheduler_admin" && roleB !== "scheduler_admin") return -1;
      if (roleB === "scheduler_admin" && roleA !== "scheduler_admin") return 1;
      return 0;
    });

  const fetchFeedbacks = useCallback(async () => {
  if (!serviceId) return; // يمنع الطلب إذا لم يوجد serviceId
  setLoading(true);
  try {
    const res = await axios.get(`${API_BASE}/api/Services/service/${serviceId}/feedbacks`);
    const data = res.data || [];
    setFeedbacks(sortData(data));
  } catch (err) {
    console.error("❌ خطأ في جلب التعليقات:", err);
  } finally {
    setLoading(false);
    setInitialLoading(false);
  }
}, [serviceId]); // ✅ أضف serviceId هنا


useEffect(() => {
  fetchFeedbacks();
}, [fetchFeedbacks, serviceId]);







  const getUsernameFromEmail = (email) =>
    email ? email.split("@")[0] : "مستخدم مجهول";

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("ar-EG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

const handleDelete = async (id) => {
  if (!window.confirm("هل أنت متأكد من حذف هذا التعليق؟")) return;

  try {
    // الآن نحذف التعليق عبر endpoint الجديد
    const res = await axios.delete(`${API_BASE}/api/Services/${id}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    });

    // تحقق من رسالة النجاح من الباك
    if (res.data?.message === "Feedback deleted successfully") {
      // إزالة التعليق من الواجهة
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      setVisibleCount((prev) => Math.min(prev, feedbacks.length - 1));
      alert("✅ تم حذف التعليق بنجاح");
    } else {
      alert("❌ لم يتم حذف التعليق، حاول مرة أخرى");
    }
  } catch (err) {
    console.error("❌ خطأ أثناء الحذف:", err);
    alert("حدث خطأ أثناء حذف التعليق");
  }
};


const handleEdit = (id) =>
 navigate(`/writefeedbackCards/${id}`, { 
    state: { 
      serviceId,
      serviceTitle   // ⬅️ إرسال الاسم
    } 
  });
  if (initialLoading)
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
<h2
  style={{
    textAlign: "center",
    marginBottom: "20px",
    color: "#2a7371",
    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
  }}
>
  آراء المرضى عن {serviceTitle} {/* ⭐ هنا بالعامية العربية */}
</h2>
        <div>جارِ التحميل...</div>
      </div>
    );

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto" }}>
      <h2
  style={{
    textAlign: "center",
    marginBottom: "20px",
    color: "#2a7371",
    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
  }}
>
  آراء المرضى عن {serviceTitle}
</h2>


      {feedbacks.length === 0 && (
        <p style={{ textAlign: "center", color: "#666" }}>لا توجد تعليقات بعد.</p>
      )}

      {feedbacks.slice(0, visibleCount).map((fb) => {
          console.log("📌 تعليق:", fb); // ✅ هنا كل تعليق على حدة

        const type = fb.role?.toLowerCase?.();
        const allMedia = [
          ...(fb.imageUrls || []),
          ...(fb.videoUrls || []),
          ...(fb.media || []),
        ].filter(Boolean);

        const fixedUrls = allMedia
          .map((url) => {
            if (!url.startsWith("http")) {
              return `${API_BASE}/${url.replace(/^\/+/, "")}`;
            }
            return url;
          })
          .filter(Boolean);

        const isLoggedIn = Boolean(user && user.token);
        const isOwner =
          isLoggedIn &&
          fb.authorEmail &&
          user.email &&
          fb.authorEmail.toLowerCase() === user.email.toLowerCase();

        return (
          <div
            key={fb.id}
            id={`feedback-${fb.id}`}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              marginBottom: "15px",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <h3 style={{ margin: 0, color: "#2a7371", fontSize: "18px" }}>
                {type === "scheduler_admin"
                  ? "Sewar-Clinic"
                  : fb.fullname || getUsernameFromEmail(fb.authorEmail)}
              </h3>
              <span style={{ fontSize: "13px", color: "#777" }}>
                {formatDate(fb.createdAt)}
              </span>
            </div>

            {fb.content && (
              <p style={{ margin: "10px 0", fontSize: "15px", color: "#444" }}>
                {fb.content}
              </p>
            )}

            {fixedUrls.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                {fixedUrls.map((url, i) =>
                  /\.(mp4|webm|mov)$/i.test(url) ? (
                    <video
                      key={i}
                      src={url}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        maxHeight: "400px",
                        objectFit: "cover",
                        marginBottom: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => setZoomVideo(url)}
                    />
                  ) : (
                    <Zoom>
                      <img
                        key={i}
                        src={url}
                        alt="feedback"
                        style={{
                          width: "100%",
                          borderRadius: "10px",
                          maxHeight: "400px",
                          objectFit: "cover",
                          marginBottom: "10px",
                        }}
                      />
                    </Zoom>
                  )
                )}
              </div>
            )}

            {isOwner && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => handleEdit(fb.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#2a7371",
                  }}
                  title="تعديل"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(fb.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                  }}
                  title="حذف"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        );
      })}

      {visibleCount < feedbacks.length && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + 5)}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2a7371",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "جار التحميل..." : "عرض المزيد"}
          </button>
        </div>
      )}

      <Modal
        isOpen={!!zoomVideo}
        onRequestClose={() => setZoomVideo(null)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%, -50%)",
            maxWidth: "90%",
            maxHeight: "90%",
            background: "transparent",
            border: "none",
            padding: "0",
          },
          overlay: {
            backgroundColor: "rgba(0,0,0,0.8)",
          },
        }}
      >
        {zoomVideo && (
          <div
            onClick={() => setZoomVideo(null)}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <video
              src={zoomVideo}
              controls
              autoPlay
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default FeedbackListCards;
