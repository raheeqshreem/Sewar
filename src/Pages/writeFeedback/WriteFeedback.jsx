/*import { height } from "@fortawesome/free-solid-svg-icons/fa0";
import React, { useState } from "react";

const RatingBox = () => {
  const [hovered, setHovered] = useState(null);

  // تحديد اللون حسب النجمة
  const getColor = (index) => {
    if (hovered === null) return "#f9f9f9"; // اللون الافتراضي للمستطيلات
    if (index === 0 || index === 1) return "red";
    if (index === 2) return "yellow";
    if (index === 3 || index === 4) return "green";
    return "#f9f9f9";
  };

  return (
    <div style={{minHeight:'70vh'}}>
    <div
      style={{
        width: "400px",
        padding: "30px",
        borderRadius: "15px",
        backgroundColor: "white",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.1)", // ظل خفيف
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        margin:"200px auto 0 auto",
      }}
    >
      <h3 style={{ marginBottom: "20px", fontWeight: "normal" }}>
        How would you rate your experience?
      </h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
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
        ))}
      </div>
    </div>
    </div>
  );
};

export default RatingBox;*/
import React, { useState } from "react";

const RatingBox = () => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(""); // حالة لرسالة الخطأ

  // دالة لتحديد اللون للمرحلة الأولى
  const getColor = (index) => {
    if (hovered === index) {
      if (index === 0 || index === 1) return "red";
      if (index === 2) return "yellow";
      if (index === 3 || index === 4) return "green";
    }
    return "#f9f9f9";
  };

  // دالة لتحديد لون النجوم بالمرحلة الثانية
  const getFinalColor = (index) => {
    if (selected === null) return "gray";
    return index <= selected ? "gold" : "gray";
  };

const handleFileChange = (e) => {
  // دمج الملفات الجديدة مع القديمة
  setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
};

  // عند إرسال التقييم
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("يرجى كتابة ملاحظاتك"); 
      return;
    }
    setError(""); 
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
              <div
                key={index}
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
  <h3 style={{ marginBottom: "15px" }}>شاركنا رأيك</h3>

  <textarea
    value={feedback}
    onChange={(e) => {
      setFeedback(e.target.value);
      if (e.target.value.trim() !== "") setError("");
    }}
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

  {error && (
    <p style={{ color: "red", marginBottom: "10px", fontSize: "14px" }}>
      {error}
    </p>
  )}

  <input
    type="file"
    accept="image/*,video/*"
    multiple
    onChange={(e) => {
      setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    }}
    style={{ marginBottom: "15px" }}
  />

  {/* معاينة الملفات تحت بعض مع زر حذف */}
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
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px", marginRight: "10px" }}
            />
          )}
          {file.type.startsWith("video/") && (
            <video
              src={url}
              controls
              style={{ width: "120px", height: "80px", borderRadius: "5px", marginRight: "10px" }}
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

  <button
    type="submit"
    style={{
      width: "100%",
      padding: "12px",
      backgroundColor: "green",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontSize: "16px",
    }}
  >
    إرسال التقييم
  </button>
</form>
        </>
      )}
    </div>
  );
};

export default RatingBox;