import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const pageSize = 5;
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const API_BASE = "https://sewarwellnessclinic1.runasp.net";

  const sortData = (data) =>
    data.sort((a, b) => {
      const roleA = a.role?.toLowerCase?.() || "";
      const roleB = b.role?.toLowerCase?.() || "";
      if (roleA === "scheduler_admin" && roleB !== "scheduler_admin") return -1;
      if (roleB === "scheduler_admin" && roleA !== "scheduler_admin") return 1;
      return 0;
    });

  const fetchFeedbacks = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/Ranking/all?page=${page}&pageSize=${pageSize}`
      );

      // 🔹 تعديل: تأكد من شكل البيانات
      const newData = Array.isArray(res.data) ? res.data : res.data.data || [];

      if (page === 1) {
        setFeedbacks(sortData(newData));
      } else {
        setFeedbacks((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const unique = newData.filter((f) => !existingIds.has(f.id));
          return sortData([...prev, ...unique]);
        });
      }

      setHasMore(newData.length === pageSize); // 🔹 ضبط hasMore بدقة
    } catch (err) {
      console.error("❌ خطأ في جلب التعليقات:", err);
    } finally {
      setLoading(false); // 🔹 مهم جدًا لإيقاف وميض الزر
      setInitialLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    fetchFeedbacks();
  }, [page, fetchFeedbacks]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        hasMore &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading]);

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
      await axios.delete(`${API_BASE}/api/Ranking/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      alert("✅ تم حذف التعليق بنجاح");
    } catch (err) {
      console.error("❌ خطأ أثناء الحذف:", err);
      alert("حدث خطأ أثناء حذف التعليق");
    }
  };

  const handleEdit = (id) => navigate(`/writefeedback/${id}`);

  if (initialLoading)
    return (
      <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>
        <h2 style={{ color: "#2a7371", marginBottom: "20px" }}>Feedback</h2>
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
        Feedback
      </h2>

      {feedbacks.length === 0 && !loading && (
        <p style={{ textAlign: "center", color: "#666" }}>لا توجد تعليقات بعد.</p>
      )}

      {feedbacks.map((fb) => {
        const type = fb.role?.toLowerCase?.();

        const fullImageUrls = (fb.imageUrls || []).map((url) => {
          if (!url) return null;
          if (!url.startsWith("http")) {
            return `${API_BASE}/${url.replace(/^\/+/, "")}`;
          }
          return url;
        }).filter(Boolean);

        const isLoggedIn = Boolean(user && user.token);
        const isOwner =
          isLoggedIn &&
          (
            (fb.userId && user.userId && fb.userId === user.userId) ||
            (fb.authorEmail && user.email && fb.authorEmail.toLowerCase() === user.email.toLowerCase()) ||
            (fb.authorEmail && user.fullName &&
              fb.authorEmail.split("@")[0].toLowerCase() === user.fullName.split(" ")[0].toLowerCase())
          );

        return (
          <div
            key={fb.id}
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
                  : getUsernameFromEmail(fb.authorEmail)}
              </h3>
              <span style={{ fontSize: "13px", color: "#777" }}>
                {formatDate(fb.createdAt)}
              </span>
            </div>

            {type === "patient" && (
              <div style={{ color: "gold", fontSize: "20px", marginBottom: "10px" }}>
                {"★".repeat(fb.stars || 0)}
                {"☆".repeat(5 - (fb.stars || 0))}
              </div>
            )}

            {fb.content && (
              <p style={{ margin: "10px 0", fontSize: "15px", color: "#444" }}>
                {fb.content}
              </p>
            )}

            {fullImageUrls.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                {fullImageUrls.map((url, i) =>
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
                      }}
                    />
                  ) : (
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
                      onError={(e) => {
                        e.target.style.display = "none";
                        console.warn("⚠️ صورة غير موجودة:", url);
                      }}
                    />
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

      {/* 🔹 زر عرض المزيد مع الحفاظ على التصميم */}
      {feedbacks.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loading || !hasMore}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2a7371",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading || !hasMore ? "not-allowed" : "pointer",
              opacity: loading || !hasMore ? 0.7 : 1,
              transition: "opacity 0.3s",
            }}
          >
            {loading
              ? "جار التحميل..."
              : hasMore
              ? "عرض المزيد"
              : "لا توجد تعليقات أخرى"}
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;