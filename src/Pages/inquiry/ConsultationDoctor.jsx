import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../../Components/loader/Loader";
import { CornerUpRight } from "lucide-react";

const ConsultationDoctor = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
  try {
    setLoading(true);

    const user = JSON.parse(localStorage.getItem("user"));
    console.log("✅ بيانات المستخدم:", user); // ← اطبع معلومات المستخدم كاملة

    if (!user || !user.token) {
      toast.error("يجب تسجيل الدخول أولا");
      setLoading(false);
      return;
    }

    // اطبع نوع المستخدم تحديداً
    console.log("👤 نوع المستخدم:", user.userType);

    if (user.userType?.toLowerCase() !== "doctor" && user.userType?.toLowerCase() !== "doctor_admin") {
      toast.error("ليس لديك صلاحية للوصول لهذه الصفحة");
      setLoading(false);
      return;
    }

    const response = await axios.get(
      "https://sewarwellnessclinic1.runasp.net/api/Consultation/doctor/all",
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    console.log("📦 بيانات الاستشارات:", response.data); // ← اطبع الرد من السيرفر

    setConsultations(response.data);
  } catch (error) {
    console.error("❌ خطأ أثناء الجلب:", error);
    toast.error(error.response?.data?.message || "حدث خطأ أثناء جلب الاستشارات");
  } finally {
    setLoading(false);
  }
};
  const renderMessages = (messages) => {
    return messages.map((msg) => (
      <div
        key={msg.id}
        className="p-2 mb-2 border rounded"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div>
          <strong>{msg.senderName}</strong>:
        </div>
        <div>{msg.messageText}</div>
        {msg.images && msg.images.length > 0 && (
          <div className="mt-2">
            {msg.images.map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt="message"
                style={{ maxWidth: "100px", marginRight: "5px" }}
              />
            ))}
          </div>
        )}
        {msg.replies && msg.replies.length > 0 && (
          <div className="ms-3 mt-2">{renderMessages(msg.replies)}</div>
        )}
      </div>
    ));
  };

  if (loading) return <Loader />;
return (
    <div
      className="container text-end"
      style={{ marginTop: "100px", direction: "rtl" }}
    >
      <h3 className="mb-4"  style={{
          color: "#2a7371"   }}>استشارات المرضى</h3>
      {consultations.length === 0 && <p>لا توجد استشارات حالياً</p>}
      {consultations.map((c) => (
        <div key={c.id} className="mb-4 p-3 border rounded">
          <div className="mb-2">
            <strong>المريض:</strong> {c.patientName || "غير معروف"}
          </div>
          <div className="mb-2">
            <strong>الاستشارة:</strong> {c.questionText}
          </div>
          {c.images && c.images.length > 0 && (
            <div className="mb-2 d-flex justify-content-end flex-wrap">
              {c.images.map((img) => (
                <img
                  key={img.id}
                  src={img.imageUrl}
                  alt="consultation"
                  style={{ maxWidth: "100px", marginLeft: "5px" }}
                />
              ))}
            </div>
          )}
          {c.messages && c.messages.length > 0 && (
            <div className="mt-2">{renderMessages(c.messages)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConsultationDoctor;