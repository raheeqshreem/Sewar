import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Home.module.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Admin() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const fileInputRef = useRef(null);

  const [oldImageUrl, setOldImageUrl] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // -----------------------------
  //        Editing Mode
  // -----------------------------
  useEffect(() => {
    if (location.state?.slide) {
      const slide = location.state.slide;
      setIsEdit(true);

      setText1(slide.text1 || "");
      setText2(slide.text2 || "");
      setText3(slide.text3 || "");

      setOldImageUrl(
        `https://sewarwellnessclinic1.runasp.net${slide.imageUrl}`
      );
    }
  }, [location.state]);

  // -----------------------------
  //       Handle Image Select
  // -----------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Delete Image (From UI)
 


  // Delete Image (From UI)
const removeImage = () => {
  setImage(null);
  setPreview(null);
  setOldImageUrl(null);

  // إزالة اسم الصورة من input file
  if (fileInputRef.current) {
    fileInputRef.current.value = null;
  }
};


  // -----------------------------
  //         Handle Submit
  // -----------------------------
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const slide = location.state?.slide;

  // التحقق إذا كل شيء فارغ
  const isAllEmpty =
    !text1.trim() &&
    !text2.trim() &&
    !text3.trim() &&
    !image &&
    !oldImageUrl;

  const formData = new FormData();

  // -----------------------------
  // TEXT 1
  // -----------------------------
  if (!text1.trim()) {
    formData.append("RemoveText1", "true");
  } else {
    formData.append("RemoveText1", "false");
    formData.append("Text1", text1);
  }

  // -----------------------------
  // TEXT 2
  // -----------------------------
  if (!text2.trim()) {
    formData.append("RemoveText2", "true");
  } else {
    formData.append("RemoveText2", "false");
    formData.append("Text2", text2);
  }

  // -----------------------------
  // TEXT 3
  // -----------------------------
  if (!text3.trim()) {
    formData.append("RemoveText3", "true");
  } else {
    formData.append("RemoveText3", "false");
    formData.append("Text3", text3);
  }

  // -----------------------------
  // IMAGE HANDLING
  // -----------------------------
  if (image) {
    formData.append("Image", image);
    formData.append("RemoveImage", "false");
  } else if (!oldImageUrl) {
    formData.append("RemoveImage", "true");
  } else {
    formData.append("RemoveImage", "false");
  }

  try {
    if (isEdit) {
      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Images/${slide.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (isAllEmpty) {
        alert("تم الحذف بنجاح!");
      } else {
        alert("تم تعديل البيانات بنجاح!");
      }
    } else {
      if (!image) {
        alert("الرجاء اختيار صورة");
        setLoading(false);
        return;
      }
      await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Images/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("تم رفع الصورة بنجاح!");
    }

    navigate("/");
  } catch (error) {
    console.log(error);
    alert("حدث خطأ أثناء العملية");
  }

  setLoading(false);
};



  return (
    <div className={`container py-5 ${styles.adminContainer}`}  dir="rtl">
      <h2 className={`text-center mb-5 ${styles.heading}`}>
        {isEdit ? "تعديل بيانات الصورة" : "إضافة صورة جديدة للكاروسيل"}
      </h2>

      <form onSubmit={handleSubmit} className={styles.formWrapper}>
        {/* Image Upload */}
        <div className="mb-3 text-end">
          <label className={`form-label ${styles.label}`}>الصورة</label>
        <input
  type="file"
  ref={fileInputRef}
  className={`form-control ${styles.input}`}
  onChange={handleImageChange}
  required={!isEdit && !image}
/>


        {/* Image Preview */}
<div
  className={styles.previewWrapper}
  style={{ display: "flex", justifyContent: "flex-start" }}
>
  {(preview || oldImageUrl) && (
    <div style={{ position: "relative", display: "inline-block" }}>
      <img
        src={preview || oldImageUrl}
        alt="preview"
        className={styles.previewImage}
        style={{ display: "block" }}
      />
      <button
        type="button"
        className={styles.removeBtn}
        onClick={removeImage}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        ✕
      </button>
    </div>
  )}
</div>

        </div>

        {/* Text Inputs */}
        <div className="mb-3 text-end">
          <label className={`form-label ${styles.label}`}>العنوان الرئيسي</label>
          <input
            type="text"
            className={`form-control ${styles.input} text-end`}
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
        </div>

        <div className="mb-3 text-end">
          <label className={`form-label ${styles.label}`}>العنوان الفرعي</label>
          <input
            type="text"
            className={`form-control ${styles.input} text-end`}
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>

        <div className="mb-3 text-end">
          <label className={`form-label ${styles.label}`}>وصف مختصر</label>
          <input
            type="text"
            className={`form-control ${styles.input} text-end`}
            value={text3}
            onChange={(e) => setText3(e.target.value)}
          />
        </div>

       <div className="d-flex gap-3 mt-4">
  {/* زر الحفظ أو رفع الصورة */}
  <button
    type="submit"
    className={`btn ${styles.submitButton}`}
    style={{ flex: 1, padding: "12px 0", fontSize: "1.1rem" }}
    disabled={loading}
  >
    {loading
      ? "جاري الحفظ..."
      : isEdit
      ? "حفظ التعديلات"
      : "رفع الصورة"}
  </button>

  {/* زر الإلغاء */}
  <button
    type="button"
    className={`btn ${styles.submitButton}`}
    style={{
      flex: 1,
      padding: "12px 0",
      fontSize: "1.1rem",
      backgroundColor: "#6c757d", // لون رمادي مشابه bootstrap
      borderColor: "#6c757d",
    }}
    onClick={() => navigate("/")}
  >
    إلغاء
  </button>
</div>


      </form>
    </div>
  );
}
