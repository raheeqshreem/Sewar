import React, { useState } from "react";
import { Link } from "react-router-dom";

const WriteFeedback = () => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);

  // دالة لتحديد اللون للمرحلة الأولى
  // دالة لتحديد اللون للمرحلة الأولى
const getColor = (index) => {
  // ألوان مثل كود ReviewsSummary
  if (hovered === index) {
    switch (index) {
      case 0:
        return "red";         // ⭐1
      case 1:
        return "orange";      // ⭐2
      case 2:
        return "gold";        // ⭐3
      case 3:
        return "limegreen";   // ⭐4
      case 4:
        return "green";       // ⭐5
      default:
        return "#f9f9f9";
    }
  }
  return "#f9f9f9"; // اللون الافتراضي
};

  // دالة لتحديد لون النجوم بالمرحلة الثانية
  const getFinalColor = (index) => {
    if (selected === null) return "gray";
    return index <= selected ? "gold" : "gray";
  };

  // عند إرسال التقييم
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("التقييم:", selected + 1);
    console.log("الملاحظات:", feedback);
    console.log("الملفات:", files);
    alert("✅ تم إرسال تقييمك بنجاح");
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      {selected === null ? (
        // المرحلة الأولى
        <div
          style={{
            width: "400px",
            padding: "30px",
            borderRadius: "15px",
            backgroundColor: "white",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            margin: "200px auto 0 auto",
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
      ) : (
        <>
          {/* المرحلة الثانية */}
          <div
            style={{
              marginTop: "100px",
              display: "flex",
              justifyContent: "center",
              gap: "12px",
            }}
          >
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                onClick={() => setSelected(index)}
                style={{
                  fontSize: "40px",
                  color: getFinalColor(index),
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                {index <= selected ? "★" : "☆"}
              </div>
            ))}
          </div>

          {/* المرحلة الثالثة */}
          <form
            onSubmit={handleSubmit}
            style={{
              width: "400px",
              margin: "40px auto",
              padding: "20px",
              borderRadius: "15px",
              backgroundColor: "white",
              boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.2)",
              fontFamily: "Arial, sans-serif",
              textAlign: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>شاركنا رأيك (اختياري)</h3>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder=" (اختياري) ... اكتب ملاحظاتك هنا "
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

            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) =>
                setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)])
              }
              style={{ marginBottom: "15px" }}
            />

            {/* معاينة الملفات */}
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
                        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
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

            <Link
              type="submit"
                to="/feedback"

              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: " #2a7371",
                color: " beige",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "20px",
              }}
            >
              إرسال التقييم
            </Link>
          </form>
        </>
      )}
    </div>
  );
};

export default WriteFeedback;