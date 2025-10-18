import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const ConsultationReplies = () => {
  const { consultationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [replyText, setReplyText] = useState("");
  const [replyImages, setReplyImages] = useState([]);
  const [replyToMessageId, setReplyToMessageId] = useState(location.state?.replyToMessageId || null); // ✅ الرد على استشارة أو رد آخر

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReplySend = async () => {
  if (!replyText.trim() && replyImages.length === 0) {
    return toast.error("⚠ الرجاء كتابة رد أو إضافة صورة");
  }

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    const formData = new FormData();
    formData.append("MessageText", replyText);
    formData.append("ParentMessageId", replyToMessageId ? replyToMessageId : "");
    replyImages.forEach((img) => formData.append("Images", img));

    const res = await axios.post(
      `https://sewarwellnessclinic1.runasp.net/api/Consultation/${consultationId}/reply`,
      formData,
      { headers: { Authorization: `Bearer ${user.token}` } }
    );

    toast.success("✅ تم إرسال الرد");
    setReplyText("");
    setReplyImages([]);
    setReplyToMessageId(null);

    // إعادة التوجيه حسب نوع المستخدم
    if (user.userType?.toLowerCase() === "doctor" || user.userType?.toLowerCase() === "doctor_admin") {
      navigate("/consultation-doctor");
    } else {
      navigate("/myinquiry");
    }
  } catch (err) {
    console.error(err);
    toast.error("❌ فشل إرسال الرد");
  }
};
  const handleReplyImageChange = (e) => {
    setReplyImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeReplyImage = (index) => {
    setReplyImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", marginTop: "150px", marginBottom: "150px" }}>
      <h3 style={{ color: "#2a7371", textAlign: "center", marginBottom: "20px" }}>
ارسال رد      </h3>

      <textarea
        className="form-control mb-2"
        placeholder="اكتب ردك هنا..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={4}
      />

      <input type="file" multiple className="form-control mb-2" onChange={handleReplyImageChange} />

      {replyImages.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
          {replyImages.map((img, idx) => (
            <div key={idx} style={{ position: "relative" }}>
            <Zoom> <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "5px" }}
              /></Zoom> 
              <button
                type="button"
                onClick={() => removeReplyImage(idx)}
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  background: "#c0392b",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "18px",
                  textAlign: "center",
                  padding: "0",
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

     <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
  {/* زر إرسال الرد */}
  <button className="btn btn-success w-100" onClick={handleReplySend}>
    إرسال الرد
  </button>

  {/* زر الرجوع */}
  <button
    onClick={() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) return navigate("/"); // لو ما فيه مستخدم يروح للصفحة الرئيسية

      if (user.userType?.toLowerCase() === "doctor" || user.userType?.toLowerCase() === "doctor_admin") {
        navigate("/consultation-doctor");
      } else {
        navigate("/myinquiry");
      }
    }}
    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
    style={{ borderRadius: "10px", gap: "6px", fontWeight: "500" }}
  >
    الرجوع للخلف
    <ArrowLeft size={20} />
  </button>
</div>
    </div>
  );
};

export default ConsultationReplies;