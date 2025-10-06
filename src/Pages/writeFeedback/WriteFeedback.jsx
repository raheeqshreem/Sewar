import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const WriteFeedback = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 🔹 لو المستخدم داخل على صفحة تعديل، بنجيب الـ id
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.token) setUser(storedUser);
    } catch {
      setUser(null);
    }
  }, []);

  // 🔹 إذا دخل المستخدم على صفحة تعديل، نجلب بيانات التعليق القديم
  useEffect(() => {
    if (id) {
      axios
        .get(`https://sewarwellnessclinic1.runasp.net/api/Ranking/${id}`)
        .then((res) => {
          const data = res.data;
          setFeedback(data.content || "");
          setSelected(data.stars ? data.stars - 1 : null);
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
        case 0:
          return "red";
        case 1:
          return "orange";
        case 2:
          return "gold";
        case 3:
          return "limegreen";
        case 4:
          return "green";
        default:
          return "#f9f9f9";
      }
    }
    return "#f9f9f9";
  };

  const getFinalColor = (index) => {
    if (selected === null) return "gray";
    return index <= selected ? "gold" : "gray";
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

      if (user?.userType !== "Patient") {
        files.forEach((file) => formData.append("Image", file));
      }

      if (
        !formData.has("Stars") &&
        !formData.has("Content") &&
        files.length === 0
      ) {
        alert("❌ لازم تحط نجمة أو تكتب تعليق  ");
        return;
      }

      const headers = {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data",
      };

      if (id) {
        // 🔹 تعديل
        await axios.put(
          `https://sewarwellnessclinic1.runasp.net/api/Ranking/${id}`,
          formData,
          { headers }
        );
        alert("✅ تم تعديل تقييمك بنجاح");
      } else {
        // 🔹 إضافة جديدة
        await axios.post(
          `https://sewarwellnessclinic1.runasp.net/api/Ranking?ts=${Date.now()}`,
          formData,
          { headers }
        );
        alert("✅ تم إرسال تقييمك بنجاح");
      }

      navigate("/feedback");
    } catch (err) {
      console.error("❌ فشل الإرسال:", err);
      alert("❌ فشل الإرسال، حاول مرة أخرى");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {user?.userType === "Patient" && selected === null && !id && (
        // ✅ صندوق تقييم النجوم للمريض فقط عند التقييم الجديد
        <div
          style={{
            width: "400px",
            padding: "30px",
            borderRadius: "15px",
            backgroundColor: "white",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h3 style={{ marginBottom: "20px", fontWeight: "normal" }}>
            كيف تقيم تجربتك؟
          </h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
            {[0, 1, 2, 3, 4].map((index) => (
              <div key={index} style={{ textAlign: "center" }}>
                <div
                  onMouseEnter={() => setHovered(index)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(index)}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    backgroundColor: getColor(index),
                    transition: "0.3s",
                    fontSize: "24px",
                  }}
                >
                  ⭐
                </div>
                <p style={{ marginTop: "5px", fontSize: "14px" }}>{index + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ صندوق الفيدباك (للجديد أو للتعديل) */}
      {(selected !== null || user?.userType !== "Patient" || id) && (
        

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
         {user?.userType === "Patient" && (
  <div style={{ marginBottom: "20px", textAlign: "center" }}>
    <div style={{ fontSize: "30px", display: "flex", justifyContent: "center", gap: "5px" }}>
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          style={{ color: getFinalColor(index), cursor: "pointer" }}
          onClick={() => setSelected(index)}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
        >
          ★
        </span>
      ))}
    </div>
    {/* الأرقام تحت النجوم */}
    <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "5px" }}>
      {[1, 2, 3, 4, 5].map((num) => (
        <span key={num} style={{ width: "30px", textAlign: "center", fontSize: "14px", color: "#555" }}>
          {num}
        </span>
      ))}
    </div>
  </div>
)}

          <h3 style={{ marginBottom: "15px" }}>
            {id ? "تعديل تقييمك" : "شاركنا رأيك (اختياري)"}
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

          {user?.userType !== "Patient" && (
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) =>
                setFiles((prevFiles) => [
                  ...prevFiles,
                  ...Array.from(e.target.files),
                ])
              }
              style={{ marginBottom: "15px" }}
            />
          )}

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
            {id ? "تحديث التقييم" : "إرسال التقييم"}
          </button>
        </div>
      )}
    </div>
  );
};

export default WriteFeedback;