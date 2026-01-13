import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const WriteFeedback = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([]); // ✅ الملفات القديمة
  const [user, setUser] = useState(null);
  const [showStarScreen, setShowStarScreen] = useState(false);
  const API_BASE = "https://sewarwellnessclinic1.runasp.net";

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.token) {
        setUser(storedUser);
        setShowStarScreen(storedUser.userType === "Patient" && !id);
      }
    } catch {
      setUser(null);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .get(`${API_BASE}/api/Ranking/${id}`)
        .then((res) => {
          const data = res.data;
          setFeedback(data.content || "");
          setSelected(data.stars ? data.stars - 1 : null);
          setShowStarScreen(false);

          // ✅ جلب الملفات القديمة
          const oldMedia = [];

          (data.images || []).forEach((img) =>
            oldMedia.push({ url: `${API_BASE}/${img.fileUrl.replace(/^\/+/, "")}`, type: "image", id: img.id })
          );
          (data.videos || []).forEach((vid) =>
            oldMedia.push({ url: `${API_BASE}/${vid.videoUrl.replace(/^\/+/, "")}`, type: "video", id: vid.id })
          );

          setOldFiles(oldMedia);
        })
        .catch((err) => console.error("❌ فشل بجلب بيانات التقييم:", err));
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const getColor = (index) => {
    if (hovered === index) {
      switch (index) {
        case 0: return "red";
        case 1: return "orange";
        case 2: return "gold";
        case 3: return "limegreen";
        case 4: return "green";
        default: return "#f9f9f9";
      }
    }
    return "#f9f9f9";
  };

  const getFinalColor = (index) => {
    if (selected === null) return "gray";
    return index <= selected ? "gold" : "gray";
  };

  const handleSelectStar = (index) => {
    setSelected(index);
    setShowStarScreen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert("يجب تسجيل الدخول لإرسال التقييم");
      return;
    }

    try {
      const formData = new FormData();

      if (selected !== null && user?.userType === "Patient") {
        formData.append("Stars", (selected + 1).toString());
      }

      if (feedback.trim() !== "") formData.append("Content", feedback);

      // ✅ الملفات القديمة التي لم يتم حذفها
      oldFiles.forEach((file) => {
        if (file.type === "image") formData.append("ImagesToKeep", file.id);
        else if (file.type === "video") formData.append("VideosToKeep", file.id);
      });

      // ✅ الملفات الجديدة
      if (user?.userType !== "Patient") {
        files.forEach((file) => {
          if (file.type.startsWith("image/")) formData.append("Images", file);
          else if (file.type.startsWith("video/")) formData.append("Videos", file);
        });
      }

      if (!formData.has("Stars") && !formData.has("Content") && files.length === 0 && oldFiles.length === 0) {
        alert("❌ لازم  تكتب تعليق أو ترفع ملفات");
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      };

    if (id) {
  await axios.put(`${API_BASE}/api/Ranking/${id}`, formData, { headers });
  alert("✅ تم تعديل تقييمك بنجاح");
  navigate("/feedback", { state: { scrollToId: id } }); // scroll إلى التقييم المعدل
} else {
  const res = await axios.post(`${API_BASE}/api/Ranking?ts=${Date.now()}`, formData, { headers });
  const newId = res.data.id; // <- تأكد أن API يرجع id
  alert("✅ تم إرسال تقييمك بنجاح");
  navigate("/feedback", { state: { scrollToId: newId } }); // scroll إلى التقييم الجديد
}
}catch (err) {
      console.error("❌ فشل الإرسال:", err);
      alert("❌ فشل الإرسال، حاول مرة أخرى");
    }
  };

  return (
    <div style={{ minHeight: "130vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {showStarScreen ? (
        <div style={{ width: "400px", padding: "30px", borderRadius: "15px", backgroundColor: "white", boxShadow: "0px 0px 15px rgba(0,0,0,0.2)", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
          <h3 style={{ marginBottom: "20px", fontWeight: "normal" }}>كيف تقيم تجربتك؟</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelectStar(index)}
                  style={{ width: "50px", height: "50px", borderRadius: "10px", display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", backgroundColor: getColor(index), transition: "0.3s", fontSize: "24px" }}
                >
                  ⭐
                </div>
                <p style={{ marginTop: "5px", fontSize: "14px" }}>{index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ width: "400px", padding: "20px", borderRadius: "15px", backgroundColor: "white", boxShadow: "0px 0px 15px rgba(0,0,0,0.2)", fontFamily: "Arial, sans-serif", textAlign: "center" }}>
          {user?.userType === "Patient" && (
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "30px", display: "flex", justifyContent: "center", gap: "5px" }}>
                {[0, 1, 2, 3, 4].map((index) => (
                  <span key={index} style={{ color: getFinalColor(index), cursor: "pointer" }} onClick={() => setSelected(index)} onMouseEnter={() => setHovered(index)} onMouseLeave={() => setHovered(null)}>★</span>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "5px" }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <span key={num} style={{ width: "30px", textAlign: "center", fontSize: "14px", color: "#555" }}>{num}</span>
                ))}
              </div>
            </div>
          )}

          <h3 style={{ marginBottom: "15px" }}>{id ? "تعديل تقييمك" : "شاركنا رأيك (اختياري)"}</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="اكتب ملاحظاتك هنا..."
            style={{ width: "100%", minHeight: "100px", padding: "10px", borderRadius: "10px", border: "1px solid #ccc", marginBottom: "10px", resize: "none" }}
          />

          {/* ✅ عرض الملفات القديمة */}
          {oldFiles.length > 0 && (
            <div style={{ marginBottom: "15px" }}>
              {oldFiles.map((file, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "10px", padding: "5px" }}>
                  {file.type === "image" ? (
                   <Zoom> <img src={file.url} alt="old preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", marginRight: "10px" }} /></Zoom>
                  ) : (
                    <video src={file.url} controls style={{ width: "120px", height: "80px", borderRadius: "5px", marginRight: "10px" }} />
                  )}
                  <button type="button" onClick={() => setOldFiles((prev) => prev.filter((_, i) => i !== index))} style={{ backgroundColor: "red", color: "white", border: "none", borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer" }}>✖</button>
                </div>
              ))}
            </div>
          )}

          {/* رفع الملفات الجديدة */}
          {user?.userType !== "Patient" && (
            <input
              type="file"
              accept="image/,video/"
              multiple
              onChange={(e) => setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)])}
              style={{ marginBottom: "15px" }}
            />
          )}

          <div style={{ marginBottom: "15px" }}>
            {files.map((file, index) => {
              const url = URL.createObjectURL(file);
              return (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px", border: "1px solid #ccc", borderRadius: "10px", padding: "5px" }}>
                  {file.type.startsWith("image/") && <img src={url} alt="preview" style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", marginRight: "10px" }} />}
                  {file.type.startsWith("video/") && <video src={url} controls style={{ width: "120px", height: "80px", borderRadius: "5px", marginRight: "10px" }} />}
                  <button type="button" onClick={() => setFiles((prev) => prev.filter((_, i) => i !== index))} style={{ backgroundColor: "red", color: "white", border: "none", borderRadius: "50%", width: "25px", height: "25px", cursor: "pointer" }}>✖</button>
                </div>
              );
            })}
          </div>

          <button type="submit" onClick={handleSubmit} style={{ width: "100%", padding: "12px", backgroundColor: "#2a7371", color: "beige", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "20px" }}>
            {id ? "تحديث التقييم" : "إرسال التقييم"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WriteFeedback;