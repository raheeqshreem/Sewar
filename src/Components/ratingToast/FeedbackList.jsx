import React, { useEffect, useState } from "react";
import axios from "axios";

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const pageSize = 5;

  const fetchFeedbacks = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://sewarwellnessclinic1.runasp.net/api/Ranking/all?page=${page}&pageSize=${pageSize}`
      );
      const newData = res.data || [];

      // دمج البيانات بدون تكرار
      if (page === 1) {
        setFeedbacks(sortData(newData));
      } else {
        setFeedbacks((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const unique = newData.filter((f) => !existingIds.has(f.id));
          const merged = [...prev, ...unique];
          return sortData(merged);
        });
      }

      if (newData.length < pageSize) setHasMore(false);
    } catch (err) {
      console.error("خطأ في جلب التعليقات:", err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  // دالة لترتيب التعليقات: السكرتير أولًا
  const sortData = (data) => {
    return data.sort((a, b) => {
      const roleA = a.role?.toLowerCase?.() || "";
      const roleB = b.role?.toLowerCase?.() || "";
      if (roleA === "scheduler_admin" && roleB !== "scheduler_admin") return -1;
      if (roleB === "scheduler_admin" && roleA !== "scheduler_admin") return 1;
      return 0;
    });
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page]);

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
          Feedback
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
        Feedback
      </h2>

      {feedbacks.length === 0 && !hasMore && (
        <p style={{ textAlign: "center", color: "#666" }}>
          لا توجد تعليقات بعد.
        </p>
      )}

      {feedbacks.map((fb) => {
        const type = fb.role?.toLowerCase?.();
        const fullImageUrl = fb.imageUrl?.startsWith("http")
          ? fb.imageUrl
          : `https://sewarwellnessclinic1.runasp.net${fb.imageUrl}`;

        return (
          <div
            key={fb.id}
            style={{
              background: "white",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
              marginBottom: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
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
              <div
                style={{
                  color: "gold",
                  fontSize: "20px",
                  marginBottom: "10px",
                }}
              >
                {"★".repeat(fb.stars || 0)}{"☆".repeat(5 - (fb.stars || 0))}
              </div>
            )}

            {fb.content && (
              <p style={{ margin: "10px 0", fontSize: "15px", color: "#444" }}>
                {fb.content}
              </p>
            )}

            {type === "scheduler_admin" && fb.imageUrl && (
              <div style={{ marginTop: "10px" }}>
                {/\.(mp4|webm|mov)$/i.test(fullImageUrl) ? (
                  <video
                    src={fullImageUrl}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      maxHeight: "400px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <img
                    src={fullImageUrl}
                    alt="feedback"
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      maxHeight: "400px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {hasMore && feedbacks.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setPage((p) => p + 1)}
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
    </div>
  );
};

export default FeedbackList;