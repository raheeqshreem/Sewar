import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { useLocation } from "react-router-dom";

const WriteFeedbackCards = () => {
  const navigate = useNavigate();
  const { id } = useParams();
const location = useLocation();           // 👈 هذا السطر
  const serviceId = location.state?.serviceId; // 👈 هنا نحفظ الـ serviceId

  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);
  const [user, setUser] = useState(null);

const API_BASE = "https://sewarwellnessclinic1.runasp.net";
const CREATE_FEEDBACK_URL = `${API_BASE}/api/Services`;

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.token) {
        setUser(storedUser);
      }
    } catch {
      setUser(null);
    }
  }, [id]);

  // جلب بيانات الفيدباك القديم
  useEffect(() => {
    if (id) {
axios.get(`https://sewarwellnessclinic1.runasp.net/api/Services/${id}`)

        .then((res) => {
          const data = res.data;
          setFeedback(data.content || "");

          const oldMedia = [];

          (data.images || []).forEach((img) =>
            oldMedia.push({
              url: `${API_BASE}/${img.fileUrl.replace(/^\/+/, "")}`,
              type: "image",
              id: img.id,
            })
          );

          (data.videos || []).forEach((vid) =>
            oldMedia.push({
              url: `${API_BASE}/${vid.videoUrl.replace(/^\/+/, "")}`,
              type: "video",
              id: vid.id,
            })
          );

          setOldFiles(oldMedia);
        })
        .catch((err) => console.error("❌ فشل بجلب بيانات التقييم:", err));
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!user || !user.token) {
    alert("يجب تسجيل الدخول لإرسال التقييم");
    return;
  }

  try {
    const formData = new FormData();

    if (feedback.trim() !== "") formData.append("Content", feedback);

    oldFiles.forEach((file) => {
      if (file.type === "image") formData.append("ImagesToKeep", file.id);
      else if (file.type === "video") formData.append("VideosToKeep", file.id);
    });

    files.forEach((file) => {
      if (file.type.startsWith("image/")) formData.append("Images", file);
      else if (file.type.startsWith("video/")) formData.append("Videos", file);
    });

    // الانتباه هنا!!!
    // ServiceId هو رقم الخدمة، وليس id من useParams
  formData.append("ServiceId", serviceId);

    const headers = {
      Authorization: `Bearer ${user.token}`,
      "Content-Type": "multipart/form-data",
    };

    console.log("📌 إرسال البيانات للباك...");

for (let pair of formData.entries()) {
  console.log(pair[0] + ": ", pair[1]);
}

console.log("📌 id المرسل:", id);
console.log("📌 ServiceId داخل FormData:", formData.get("ServiceId"));
console.log("📌 الملفات القديمة:", oldFiles);
console.log("📌 الملفات الجديدة:", files);


    if (id) {
for (let pair of formData.entries()) {
  console.log(pair[0], ":", pair[1]);
}

      // تعديل
      await axios.put(`${API_BASE}/api/Services/${id}`, formData, { headers });
      alert("✅ تم تعديل تقييمك بنجاح");
    } else {
      // إنشاء جديد
      await axios.post(`${API_BASE}/api/Services`, formData, { headers });
      alert("✅ تم إرسال تقييمك بنجاح");
    }

navigate("/ratingtoastCards", { 
  state: { 
    serviceId,
    serviceTitle: location.state?.serviceTitle   // ⬅️ نرجّع الاسم أيضًا
  } 
});

  } catch (err) {
    console.error("❌ فشل الإرسال:", err);
    alert("❌ فشل الإرسال، حاول مرة أخرى");
  }
};






  return (
    <div
      style={{
        minHeight: "130vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "400px",
          padding: "20px",
          borderRadius: "15px",
          backgroundColor: "white",
          boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <h3 style={{ marginBottom: "15px" }}>
          {id ? "تعديل رأيك" : "شاركنا رأيك"}
        </h3>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="اكتب ملاحظاتك هنا..."
          style={{
            width: "100%",
            minHeight: "100px",
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            marginBottom: "10px",
            resize: "none",
          }}
        />

        {/* عرض الملفات القديمة */}
        {oldFiles.length > 0 && (
          <div style={{ marginBottom: "15px" }}>
            {oldFiles.map((file, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "5px",
                }}
              >
                {file.type === "image" ? (
                  <Zoom>
                    <img
                      src={file.url}
                      alt="old"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "5px",
                        marginRight: "10px",
                      }}
                    />
                  </Zoom>
                ) : (
                  <video
                    src={file.url}
                    controls
                    style={{
                      width: "120px",
                      height: "80px",
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    setOldFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        )}

       {/* رفع الملفات الجديدة - فقط للسكرتير */}
{(user?.role === "scheduler_admin" || user?.userType === "scheduler_admin") && (
  <>
    <input
      type="file"
      accept="image/,video/"
      multiple
      onChange={(e) =>
        setFiles((prevFiles) => [
          ...prevFiles,
          ...Array.from(e.target.files),
        ])
      }
      style={{ marginBottom: "15px" }}
    />

    {/* عرض الملفات الجديدة */}
    <div style={{ marginBottom: "15px" }}>
      {files.map((file, index) => {
        const url = URL.createObjectURL(file);
        return (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "5px",
            }}
          >
            {file.type.startsWith("image/") && (
              <img
                src={url}
                alt="preview"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              />
            )}
            {file.type.startsWith("video/") && (
              <video
                src={url}
                controls
                style={{
                  width: "120px",
                  height: "80px",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              />
            )}
            <button
              type="button"
              onClick={() =>
                setFiles((prev) => prev.filter((_, i) => i !== index))
              }
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
          </div>
        );
      })}
    </div>
  </>
)}


       <button
  type="submit"
  onClick={handleSubmit}
  style={{
    width: "100%",
    padding: "12px",
    backgroundColor: "#2a7371",
    color: "beige",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "20px",
  }}
>
  {id ? "تحديث" : "إرسال"}
</button>

      </div>
    </div>
  );
};

export default WriteFeedbackCards;
