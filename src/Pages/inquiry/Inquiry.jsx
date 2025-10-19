import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Inquiry = () => {
  const [showModal, setShowModal] = useState(false);
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [ishasConsultation, setHasConsultation] = useState(false); // حالة ظهور الزر
  const whatsappNumber = "970592245331";
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) return;

    // جلب نتيجة وجود استشارات سابقة
    axios.get("https://sewarwellnessclinic1.runasp.net/api/Consultation/has-consultation", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
    .then(res => {
      setHasConsultation(res.data.hasConsultation); // API يرجع true أو false
    })
    .catch(err => {
      console.error(err);
      toast.error("حدث خطأ أثناء التحقق من وجود استشارات سابقة");
    });

    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath && redirectPath === window.location.pathname) {
      setShowModal(true);
      localStorage.removeItem("redirectAfterLogin");
    }
  }, []);

  const handleWriteInquiry = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
      toast.custom(
        () => (
          <div
            style={{
              padding: "16px 24px",
              background: "white",
              color: "black",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "20px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            👋 لتكتب استشارتك يرجى تسجيل الدخول
          </div>
        ),
        { duration: 3000 }
      );
      localStorage.setItem("redirectAfterLogin", "/inquiry");
      navigate("/signin");
      return;
    }
    setShowModal(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!message.trim() && images.length === 0) {
      alert("يرجى كتابة الاستشارة أو إضافة صورة على الأقل");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("QuestionText", message);

      images.forEach((img) => formData.append("Images", img));

      const token = JSON.parse(localStorage.getItem("user"))?.token;
      if (!token) {
        alert("❌ لم يتم العثور على توكن تسجيل الدخول. يرجى تسجيل الدخول أولاً.");
        return;
      }

      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Consultation/create",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("تم إرسال الاستشارة:", response.data);
      alert("تم إرسال استشارتك بنجاح!");
      setHasConsultation(true); // ✅ بعد إرسال أول استشارة نعرض الزر مباشرة
      navigate("/myinquiry");
      setMessage("");
      setImages([]);
      setShowModal(false);
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      alert("❌ حدث خطأ أثناء إرسال الاستشارة، حاول مرة أخرى.");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundColor: "#f0f4f7",
    backgroundImage: `
  radial-gradient(circle at 5% 10%, rgba(42,115,113,0.10) 25px, transparent 26px),
  radial-gradient(circle at 20% 25%, rgba(42,115,113,0.08) 20px, transparent 21px),
  radial-gradient(circle at 35% 40%, rgba(42,115,113,0.12) 30px, transparent 31px),
  radial-gradient(circle at 50% 15%, rgba(42,115,113,0.10) 28px, transparent 29px),
  radial-gradient(circle at 65% 35%, rgba(42,115,113,0.08) 35px, transparent 36px),
  radial-gradient(circle at 80% 20%, rgba(42,115,113,0.09) 25px, transparent 26px),
  radial-gradient(circle at 10% 60%, rgba(42,115,113,0.12) 30px, transparent 31px),
  radial-gradient(circle at 25% 75%, rgba(42,115,113,0.07) 20px, transparent 21px),
  radial-gradient(circle at 55% 80%, rgba(42,115,113,0.09) 30px, transparent 31px),
  radial-gradient(circle at 70% 65%, rgba(42,115,113,0.11) 22px, transparent 23px)
`,
backgroundRepeat: "no-repeat",
color: "#2a7371",
display: "flex",
flexDirection: "column",
justifyContent: "center",
alignItems: "center",
textAlign: "center",
padding: "0 20px",
      }}
    >
      <h2 style={{ fontWeight: "bold", marginBottom: "30px" }}>
        خطوتك الأولى نحو العافية تبدأ من هنا
      </h2>
      <h4 style={{ fontWeight: "normal", marginBottom: "50px" }}>
        استشر وتلقى العلاج مع أفضل أخصائية
      </h4>

      {/* أزرار تواصل واستشارات */}
      <div style={{ display: "flex", gap: "15px" }}>
        <button
          className="btn"
          style={{
            border: "1px solid #2a7371",
            color: "#2a7371",
            backgroundColor: "transparent",
            padding: "10px 25px",
            fontWeight: "bold",
          }}
          onClick={handleWriteInquiry}
        >
          تواصل معنا الآن
        </button>

        {ishasConsultation && (
          <button
            className="btn"
            style={{
              border: "1px solid #2a7371",
              color: "#2a7371",
              backgroundColor: "transparent",
              padding: "10px 25px",
              fontWeight: "bold",
            }}
            onClick={() => navigate("/myinquiry")}
          >
            استشاراتي السابقة
          </button>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            zIndex: 1000,
            paddingTop: "100px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "500px",
              padding: "20px",
              position: "relative",
              textAlign: "right",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "5px",
                right: "5px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "18px",
                zIndex: 10,
              }}
              onClick={() => setShowModal(false)}
            >
              ✖
            </span>

            <span
              style={{
                fontSize: "14px",
                color: "#555",
                display: "block",
                marginTop: "20px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              اضغط على الزر للتواصل مباشرة عبر واتساب
            </span>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#25D366",
                color: "#fff",
                padding: "10px",
                borderRadius: "5px",
                fontWeight: "bold",
                textDecoration: "none",
                marginBottom: "40px",
                cursor: "pointer",
              }}
            >
              📲 تواصل معي عبر الواتساب
            </a>

            <textarea
              placeholder="أو اكتب استشارتك هنا وأضف صور إن أحببت"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                border: "1px solid #2a7371",
                borderRadius: "5px",
                marginBottom: "10px",
                resize: "none",
              }}
            />

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              style={{ marginBottom: "15px", width: "100%" }}
            />

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              {images.map((img, index) => {
                const url = URL.createObjectURL(img);
                return (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={url}
                      alt="preview"
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "5px",
                      }}
                    />
                    <span
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        backgroundColor: "#ff4d4d",
                        color: "#fff",
                        borderRadius: "50%",
                        padding: "2px 6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      ✖
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              style={{
                backgroundColor: "#2a7371",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%",
              }}
              onClick={handleSubmit}
            >
              أرسل استشارتك
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inquiry;