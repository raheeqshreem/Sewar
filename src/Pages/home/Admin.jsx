import React, { useState } from "react";
import axios from "axios";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // لعرض المعاينة
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!image) return;

  setLoading(true);

  const formData = new FormData();
  formData.append("Image", image);
  formData.append("Text1", text1);
  formData.append("Text2", text2);
  formData.append("Text3", text3);

  try {
    await axios.post(
      "https://sewarwellnessclinic1.runasp.net/api/Images/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    alert("تم رفع الصورة بنجاح!");
    // مسح كل القيم
    setImage(null);
    setPreview(null);
    setText1("");
    setText2("");
    setText3("");

    // الانتقال للصفحة الرئيسية
    navigate("/");
  } catch (error) {
    console.log(error);
    alert("حدث خطأ أثناء رفع الصورة");
  }

  setLoading(false);
};


  return (
    <div className={`container py-5 ${styles.adminContainer}`}>
      <h2 className={`text-center mb-5 ${styles.heading}`}>
        لوحة التحكم - إضافة صورة للكاروسيل
      </h2>

      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        <div className="mb-3">
          <label className={`form-label ${styles.label}`}>الصورة</label>
          <input
            type="file"
            className={`form-control ${styles.input}`}
            onChange={handleImageChange}
            required={!image} // يلزم اختيار صورة
          />

          {preview && (
            <div className={styles.previewWrapper}>
              <img src={preview} alt="preview" className={styles.previewImage} />
              <button type="button" className={styles.removeBtn} onClick={removeImage}>
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className={`form-label ${styles.label}`}>Text1</label>
          <input
            type="text"
            className={`form-control ${styles.input}`}
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className={`form-label ${styles.label}`}>Text2</label>
          <input
            type="text"
            className={`form-control ${styles.input}`}
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className={`form-label ${styles.label}`}>Text3</label>
          <input
            type="text"
            className={`form-control ${styles.input}`}
            value={text3}
            onChange={(e) => setText3(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`btn w-100 ${styles.submitButton}`}
          disabled={loading}
        >
          {loading ? "جاري الرفع..." : "رفع الصورة"}
        </button>
      </form>
    </div>
  );
}
