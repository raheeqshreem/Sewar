import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Content() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id, title, description, image } = state || {};
const [removeVideo, setRemoveVideo] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const isSchedulerAdmin = user?.userType?.toLowerCase() === "scheduler_admin";

  const [showModal, setShowModal] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [serviceMedia, setServiceMedia] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoURL(url);
      return () => URL.revokeObjectURL(url);
    } else if (!videoFile && !editingItem) {
      setVideoURL(null);
    }
  }, [videoFile, editingItem]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get(
          `https://sewarwellnessclinic1.runasp.net/api/Services/service/${id}/media`
        );
setServiceMedia(
  res.data.map((m) => ({
    ...m,
    content: m.text ?? m.content,
    url: m.video ?? m.url
  }))
);

      } catch (err) {
        console.error("❌ خطأ في جلب المحتوى:", err);
      }
    };
    if (id) fetchMedia();
  }, [id]);

const handleEdit = (item) => {
  setRemoveVideo(false);

  setEditingItem(item);

  // 👇 النص الصحيح
  setTextContent(item.text || item.content || "");

  if (item.url) {
    setVideoURL("https://sewarwellnessclinic1.runasp.net" + item.url);
  } else {
    setVideoURL(null);
  }

  setVideoFile(null);
  setShowModal(true);
};

  const handleUpdate = async () => {
  if (!editingItem) return;

  setLoading(true);

  const formData = new FormData();

  formData.append("MediaId", editingItem.id);
  formData.append("NewTextContent", textContent);

  // 🔥 لازم نرسل DeleteVideo مش RemoveVideo
  formData.append("DeleteVideo", removeVideo);

  // 🔥 لازم نرسل DeleteContent لو النص اتشال بالكامل
  formData.append("DeleteContent", textContent.trim() === "");

  // 🔥 لو في فيديو جديد
  if (videoFile) {
    formData.append("NewVideoFile", videoFile);
  }

  try {
    const token = user?.token;

    await axios.put(
      "https://sewarwellnessclinic1.runasp.net/api/Services/service/media/update",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("✔ تم تحديث المحتوى بنجاح");
    setShowModal(false);
    setEditingItem(null);
    setTextContent("");
    setRemoveVideo(false);

    // إعادة جلب البيانات
    const res = await axios.get(
      `https://sewarwellnessclinic1.runasp.net/api/Services/service/${id}/media`
    );

    setServiceMedia(
      res.data.map((m) => ({
        ...m,
        content: m.text ?? m.content,
        url: m.video ?? m.url,
      }))
    );
  } catch (err) {
    console.error("❌ Update error:", err);
    alert("❌ فشل تحديث المحتوى");
  }

  setLoading(false);
};


  const handleDelete = async (mediaId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المحتوى؟")) return;

    try {
      const token = user?.token;
      await axios.delete(
        `https://sewarwellnessclinic1.runasp.net/api/Services/service/media/delete/${mediaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServiceMedia((prev) => prev.filter((item) => item.id !== mediaId));
      alert("✔ تم حذف المحتوى بنجاح");
    } catch (err) {
      console.error("❌ خطأ أثناء الحذف:", err.response || err);
      alert("❌ حدث خطأ أثناء حذف المحتوى");
    }
  };

  const handleUpload = async () => {
    if (!textContent && !videoFile) {
      alert("يجب إدخال نص أو رفع فيديو على الأقل");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("ServiceId", id);
    formData.append("TextContent", textContent);
    if (videoFile) formData.append("VideoFile", videoFile);

    try {
      const token = user?.token;
      await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Services/service/media/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✔ تمت إضافة المحتوى بنجاح");
      setShowModal(false);
      setTextContent("");
      handleRemoveVideo();

      const res = await axios.get(
        `https://sewarwellnessclinic1.runasp.net/api/Services/service/${id}/media`
      );
setServiceMedia(
  res.data.map((m) => ({
    ...m,
    content: m.text ?? m.content,
    url: m.video ?? m.url
  }))
);    } catch (err) {
      console.error("❌ خطأ أثناء الإرسال:", err.response || err);
      alert("❌ حدث خطأ أثناء رفع المحتوى");
    } finally {
      setLoading(false);
    }
  };



const handleRemoveVideo = () => {
  setVideoFile(null);
  setVideoURL(null);
  setRemoveVideo(true);

  if (editingItem) {
    // تحديث العنصر الجاري تعديله مباشرة
    setEditingItem(prev => ({ ...prev, url: null }));
    // تحديث القائمة فوراً لعرض التغيير
    setServiceMedia(prev =>
      prev.map(item =>
        item.id === editingItem.id ? { ...item, url: null } : item
      )
    );
  }

  if (fileInputRef.current) {
    fileInputRef.current.value = "";
  }
};

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}, []);



  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "140px 20px 40px",
        direction: "rtl",
        textAlign: "right",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {isSchedulerAdmin && (
        <div className="text-center mb-4">
          <button
            onClick={() => {
              setEditingItem(null);
              setShowModal(true);
            }}
            style={{
              backgroundColor: "#2a7371",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <i className="bi bi-plus-circle" style={{ fontSize: "1.2rem" }}></i>
            إضافة محتوى
          </button>
        </div>
      )}

      {image && (
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: "15px",
            marginBottom: "25px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
          }}
        />
      )}

      <h2
        style={{
          color: "#2a7371",
          marginBottom: "70px",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {title}
      </h2>

      {/* المحتوى */}
      <div style={{ marginTop: "30px", display: "grid", gap: "30px" }}>
        {serviceMedia.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              borderRadius: "15px",
              background: "linear-gradient(145deg, #ffffff, #e6f0f0)",
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              transition: "transform 0.3s, box-shadow 0.3s",
              position: "relative",
            }}
          >
            {item.content && (
              <div
                style={{
                  background: "linear-gradient(120deg, #e0f7f7, #ffffff)",
                  padding: "15px 20px",
                  borderRadius: "12px",
                  boxShadow: "inset 0 3px 8px rgba(0,0,0,0.05)",
                  fontSize: "1.15rem",
                  lineHeight: "1.8",
                  color: "#2a7371",
                  fontWeight: 500,
                  transition: "transform 0.3s",
                  marginBottom: "25px",
                }}
              >
                {item.content}
              </div>
            )}

            {item.url && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "56.25%",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#000",
                }}
              >
                <video
                  src={`https://sewarwellnessclinic1.runasp.net${item.url}`}
                  controls
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />
              </div>
            )}

            {isSchedulerAdmin && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "15px",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => handleEdit(item)}
                  style={{
                    background: "#f0ad4e",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  ✎ تعديل
                </button>

                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: "#d9534f",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  🗑 حذف
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ⭐ المودال */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              width: "90%",
              maxWidth: "500px",
              padding: "25px",
              borderRadius: "15px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
              animation: "fadeIn 0.2s ease-in-out",
              direction: "rtl",
            }}
          >
            <h4
              style={{
                marginBottom: "15px",
                color: "#2a7371",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {editingItem ? "تعديل المحتوى" : "إضافة محتوى جديد"}
            </h4>

            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="اكتب المحتوى هنا..."
              style={{
                width: "100%",
                height: "120px",
                borderRadius: "10px",
                border: "1px solid #2a7371",
                padding: "10px",
                marginBottom: "15px",
                color: "#333",
                fontSize: "1rem",
              }}
            />

            <label
              style={{
                fontWeight: "bold",
                color: "#2a7371",
                marginBottom: "15px",
              }}
            >
              رفع فيديو:
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "1px solid #2a7371",
                marginBottom: "10px",
                cursor: "pointer",
              }}
            />

            {/* عرض الفيديو القديم أو الجديد */}
            {videoURL && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "250px",
                  height: "150px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  overflow: "hidden",
                  background: "#f5f5f5",
                  marginTop: "15px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveVideo();
                  }}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "26px",
                    height: "26px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    lineHeight: "24px",
                    textAlign: "center",
                    padding: 0,
                    zIndex: 10,
                  }}
                >
                  ×
                </button>

                <video
                  src={videoURL}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#2a7371",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "1rem",
                }}
              >
                إلغاء
              </button>

              <button
                onClick={editingItem ? handleUpdate : handleUpload}
                disabled={loading}
                style={{
                  backgroundColor: "#2a7371",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  fontSize: "1rem",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading
                  ? "جارٍ الرفع..."
                  : editingItem
                  ? "تحديث"
                  : "إضافة"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
