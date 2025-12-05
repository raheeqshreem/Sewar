import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import FeedbackList from "./FeedbackList";
import { ChevronLeft, ChevronRight } from "lucide-react";



export default function RatingToast() {

  
  const navigate = useNavigate();
  const feedbackRef = useRef(null);

  
  const [summary, setSummary] = useState({
    totalRatings: 0,
    average: 0,
    percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
const [userFeedbackId, setUserFeedbackId] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [userFeedback, setUserFeedback] = useState(null);
const [services, setServices] = useState([]);
            






const [startIndex, setStartIndex] = useState(0);

  const itemsPerPage = 3;

  const handleNext = () => {
    if (startIndex + itemsPerPage < services.length) {
      setStartIndex(startIndex + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex(startIndex - itemsPerPage);
    }
  };

  const visibleServices = services.slice(startIndex, startIndex + itemsPerPage);
  




useEffect(() => {
  axios
    .get("https://sewarwellnessclinic1.runasp.net/api/Services/services/simple")
    .then((res) => setServices(res.data))
    .catch((err) => console.error("Error fetching services:", err));
}, []);

  useEffect(() => {
    axios
      .get("https://sewarwellnessclinic1.runasp.net/api/Ranking/summary")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error(err));
  }, []);

  const { totalRatings, average, percentages } = summary;

  const getLabel = () => {
    if (totalRatings === 0) return "لا يوجد تقييمات بعد";
    if (average < 2) return "ضعيف";
    if (average < 3) return "متوسط";
    if (average < 4) return "جيد";
    return "ممتاز";
  };

  const handleWriteFeedback = async () => {
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
            👋 لتكتب رأيك يرجى تسجيل الدخول
          </div>
        ),
        { duration: 3000 }
      );
      localStorage.setItem("redirectAfterLogin", "/feedback");
      navigate("/signin");
      return;
    }

    try {
      const res = await axios.get(
        "https://sewarwellnessclinic1.runasp.net/api/Ranking/check",
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      const role = user.roles?.[0]; // أو حسب كيف خزنت الرولات في localStorage

      if (role === "patient" && res.data.exists) {
  toast.custom(
    () => (
      <div
        style={{
          padding: "16px 24px",
          background: "#fee2e2",
          color: "#991b1b",
          borderRadius: "12px",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        ❌ لقد قمت بكتابة تقييم من قبل
      </div>
    ),
    { duration: 3000 }
  );

  // ✅ خزّن id التعليق لو بيرجع من API (أو من بيانات user)
  setUserFeedbackId(res.data.feedbackId);

  // لو مش متوفر feedbackId في الـ API، ممكن تجيبه لاحقاً من FeedbackList نفسها

  // أرسل event مخصص لFeedbackList
  window.dispatchEvent(new CustomEvent("scrollToFeedback", { detail: { id: res.data.feedbackId } }));

  return;
}

      if (role === "scheduler_admin") {
        // المجدول دايمًا يسمح له بالكتابة
        navigate("/writefeedback");
        return;
      }

      if (!["patient", "scheduler_admin"].includes(role)) {
        toast.custom(
          () => (
            <div
              style={{
                padding: "16px 24px",
                background: "#fee2e2",
                color: "#991b1b",
                borderRadius: "12px",
                fontWeight: "bold",
                fontSize: "18px",
                textAlign: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              ❌ هذا الدور لا يمكنه كتابة تقييم
            </div>
          ),
          { duration: 3000 }
        );
        return;
      }

      // لو المريض ولم يكتب فيدباك سابق → يمكن توجيهه
      navigate("/writefeedback");
    } catch (err) {
      console.error("خطأ التحقق من الفيدباك:", err.response || err);
      toast.custom(
        () => (
          <div
            style={{
              padding: "16px 24px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "12px",
              fontWeight: "bold",
              fontSize: "18px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            ❌ حدث خطأ أثناء التحقق
          </div>
        ),
        { duration: 3000 }
      );
    }
  };

  return (
    <>
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          maxWidth: "600px",
          margin: "150px auto",
          minHeight: "100vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        {alertMessage && (
          <div
            style={{
              position: "sticky",
              top: 0,
              backgroundColor: "#fef3c7",
              color: "#92400e",
              padding: "12px 16px",
              borderRadius: "8px",
              fontWeight: "bold",
              textAlign: "center",
              marginBottom: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            {alertMessage}
          </div>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <span style={{ fontSize: "16px" }}>
            Reviews {totalRatings.toLocaleString()}
          </span>
          <div>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  color: average >= star ? "orange" : "#ccc",
                  fontSize: "18px",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span style={{ fontWeight: "bold" }}>{average}</span>
        </div>

        <div
          onClick={handleWriteFeedback}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "5px 5px",
            backgroundColor: "#2a7371",
            color: "beige",
            borderRadius: "8px",
            fontSize: "28px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px",
            gap: "10px",
          }}
        >
          ✍ شاركنا رأيك
        </div>






        <div
          style={{
            border: "1px solid #eee",
            borderRadius: "10px",
            padding: "20px",
            backgroundColor: "white",
            display: "flex",
            gap: "20px",
            flexDirection: "column",
          }}
        >



          
          {userFeedback && (
            <div
              ref={feedbackRef}
              style={{
                border: "2px solid #2a7371",
                borderRadius: "10px",
                padding: "15px",
                background: "#f8fdfd",
              }}
            >
              <h3 style={{ margin: "0 0 10px" }}>
                تعليقك السابق ⭐ ({userFeedback.rating}/5)
              </h3>
              <p style={{ margin: "0", color: "gray" }}>
                {userFeedback.comment || "لم تكتب تعليقًا نصيًا"}
              </p>
            </div>
          )}

          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: "1", textAlign: "center" }}>
              <h1 style={{ margin: "0", fontSize: "40px" }}>{average}</h1>
              <p style={{ margin: "0", color: "gray", fontSize: "18px" }}>
                {getLabel()}
              </p>
              <div style={{ fontSize: "20px", margin: "10px 0" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    style={{
                      color: average >= star ? "orange" : "#ccc",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p style={{ color: "gray" }}>
                {totalRatings.toLocaleString()} reviews
              </p>
            </div>




            <div style={{ flex: "2" }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const percent = percentages[star] || 0;
                const color =
                  star === 5
                    ? "green"
                    : star === 4
                    ? "limegreen"
                    : star === 3
                    ? "gold"
                    : star === 2
                    ? "orange"
                    : "red";

                return (
                  <div
                    key={star}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ width: "50px" }}>{star}-star</span>
                    <div
                      style={{
                        flex: 1,
                        height: "10px",
                        background: "#eee",
                        borderRadius: "5px",
                        marginRight: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: color,
                        }}
                      ></div>
                    </div>
                    <span>{percent}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>








<div
  style={{
    position: "relative",
    maxWidth: "600px",
    margin: "0 auto",
    marginTop: "150px",
    marginBottom: "150px",
    overflow: "visible",
        overflowX: "hidden",   // ← هذا يلغي السكروول الأفقي

    zIndex: 50,
  }}
>
  <h2
    style={{
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "24px",
      textShadow: "2px 2px 6px rgba(0,0,0,0.3)",
      color: "#2a7371",
      marginBottom: "60px",
    }}
  >
    اختر الخدمة لعرض تقييمها
  </h2>

  <div
    style={{
      position: "relative",
      maxWidth: "600px",
      margin: "0 auto",
      overflow: "visible",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
      zIndex: 50,
    }}
  >
    {/* السهم الأيسر */}
    <div
      onClick={handlePrev}
      style={{
        position: "absolute",
        left: "-10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: startIndex === 0 ? "not-allowed" : "pointer",
        zIndex: 100,
      }}
    >
      <ChevronLeft size={40} color="#2a7371" />
    </div>

    {/* المستطيلات */}
   <div style={{ display: "flex", gap: "15px" }}>
  {visibleServices.map((srv) => (
    <div
      key={srv.id}
      onClick={() =>
navigate("/ratingtoastCards", { 
  state: { 
    serviceId: srv.id, 
    serviceTitle: srv.title // ⭐ أرسل اسم الخدمة أيضًا
  } 
})
      }
      style={{
        minWidth: "140px",
        height: "80px",
        borderRadius: "25px", // حواف منحنية
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #2a7371, #4db6ac)", // تدرج جذاب
        color: "#fff",
        fontWeight: "bold",
        fontSize: "18px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.25)",
        cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
        padding: "0 20px", // ⭐ إضافة padding أفقي لتوسيع المسافة
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.25)";
      }}
    >
      {srv.title}
    </div>
  ))}
</div>


    {/* السهم الأيمن */}
    <div
      onClick={handleNext}
      style={{
        position: "absolute",
        right: "-10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor:
          startIndex + itemsPerPage >= services.length
            ? "not-allowed"
            : "pointer",
        zIndex: 100,
      }}
    >
      <ChevronRight size={40} color="#2a7371" />
    </div>
  </div>
</div>




        <FeedbackList />
      </div>
    </>
  );
}