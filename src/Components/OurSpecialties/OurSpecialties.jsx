import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Homee from "./../../assets/Homee.jpeg";
import Bone from "./../../assets/Bone.jpeg";
import Sport from "./../../assets/Sport.jpeg";
import Operations from "./../../assets/Operations.jpeg";
import Nerves from "./../../assets/Nerves.jpeg";
import Child from "./../../assets/Child.jpeg";
import Women from "./../../assets/Women.jpeg";
import Vertebral from "./../../assets/Vertebral.jpeg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Edit } from "lucide-react"; // أيقونات الحذف والتعديل

export default function OurSpecialties() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isSchedulerAdmin = user?.userType?.toLowerCase() === "scheduler_admin";

  // الكروت الثابتة
  const first8 = [
    {
      id: 1,
      titleAr: "حالات العظام والعضلات",
      image: Bone,
      description: `• الديسك والانزلاق الغضروفي\n• آلام الرقبة والظهر\n• خشونة المفاصل\n• التهاب أوتار الكتف والركبة والكوع\n• تمزقات العضلات\n• ألم الكعب والتهابات القدم`,
    },
    {
      id: 2,
      titleAr: "الإصابات الرياضية",
      image: Sport,
      description: `• إصابات الملاعب\n• قطع أو إصابة الأربطة\n• إصابات الغضاريف\n• التواء الكاحل وتمزق العضلات`,
    },
    {
      id: 3,
      titleAr: "ما بعد الكسور والعمليات",
      image: Operations,
      description: `• تأهيل ما بعد الكسور\n• ما بعد عمليات المفاصل\n• ما بعد إصابات الأربطة\n• استعادة المشي والقوة والتوازن`,
    },
    {
      id: 4,
      titleAr: "حالات الأعصاب",
      image: Nerves,
      description: `• الجلطات الدماغية \n• الشلل النصفي أو الرباعي \n• إصابات الحبل الشوكي \n• شلل العصب السابع \n• الاعتلال العصبي الطرفي`,
    },
    {
      id: 5,
      titleAr: "حالات الأطفال",
      image: Child,
      description: `• التأخر الحركي\n• الشلل الدماغي\n• خلع الورك الولادي\n• القدم المعوجة\n• المشي على أطراف الأصابع`,
    },
    {
      id: 6,
      titleAr: "حالات كبار السن",
      image: Women,
      description: `• صعوبة المشي\n• فقدان التوازن\n• ضعف العضلات\n• آلام المفاصل المزمنة`,
    },
    {
      id: 7,
      titleAr: "مشاكل القوام والعمود الفقري",
      image: Vertebral,
      description: `• تحدب الظهر\n• ميلان العمود الفقري\n• آلام الجلوس الطويل\n• آلام الرقبة بسبب الهاتف أو الكمبيوتر`,
    },
    {
      id: 8,
      titleAr: "العلاج الطبيعي لحد باب بيتك",
      image: Homee,
      description: `• جلسات علاج طبيعي مخصصة لك في منزلك\n• راحة تامة دون الحاجة لمغادرة المنزل\n• متابعة وتقييم مستمر للتقدم`,
    },
  ];

  const [restServices, setRestServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "https://sewarwellnessclinic1.runasp.net/api/Services/all"
        );
        setRestServices(res.data.rest || []);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting id:", id); // للتأكد من الـ id
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذه الخدمة؟")) return;

    try {
      // حذف التوكن لأنه غير مطلوب
      await axios.delete(
        `https://sewarwellnessclinic1.runasp.net/api/Services/delete/${id}`
      );

      // إزالة الخدمة من الحالة
      setRestServices((prev) => prev.filter((item) => item.id !== id));
      alert("تم حذف الخدمة بنجاح ✅");
    } catch (err) {
      console.error("حذف الخدمة فشل:", err.response || err);
      alert("حدث خطأ أثناء الحذف ❌");
    }
  };

  const _handleEdit = async (id, title, description, file) => {
    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    if (file) {
      formData.append("ImageFile", file);
    }

    try {
      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/Services/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("تم تعديل الخدمة بنجاح ✅");
    } catch (err) {
      console.error("تعديل الخدمة فشل:", err.response || err);
      alert("حدث خطأ أثناء التعديل ❌");
    }
  };

  // دمج الكروت الثابتة والمسترجعة
  const allServices = [
    ...first8.map((f) => ({
      ...f, // ⚡️ حافظ على كل الخصائص الأصلية
      isFromBackend: false, // علامة أنها ثابتة
    })),
    ...restServices.map((item) => ({
      ...item,
      titleAr: item.title || "بدون عنوان",
      description: item.description || "",
      image: item.picUrl
        ? `https://sewarwellnessclinic1.runasp.net${item.picUrl}`
        : "",
      isFromBackend: true,
    })),
  ];

  // تقسيم الكروت إلى صفوف كل 3 كروت وتوسيط آخر صف إذا كان أقل من 3
  const rows = [];
  for (let i = 0; i < allServices.length; i += 3) {
    const rowItems = allServices.slice(i, i + 3);
    const justify = rowItems.length < 3 ? "justify-content-center" : "";
    rows.push(
      <Row key={i} className={justify}>
        {rowItems.map((item, idx) => (
          <Col key={idx} lg={4} md={6} sm={12} className="mb-4">
            <Card
              className="h-100 rounded-4 text-center"
              style={{
                width: "100%",
                minHeight: "300px",
                border: "2px solid #2a7371",
                boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
                background: "linear-gradient(145deg, #ffffff, #e6f0f0)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 18px 40px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(0,0,0,0.35)";
              }}
            >
              {item.image && (
                <Card.Img
                  variant="top"
                  src={item.image}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "3px solid #ced1d1ff",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                  }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title
                  className="fw-bold mb-3 text-center"
                  style={{
                    fontSize: "1.25rem",
                    color: "#2a7371",
                    textShadow: "0 2px 6px rgba(0,0,0,0.15)",
                  }}
                >
                  {item.titleAr}
                </Card.Title>

                {item.description && (
                  <Card.Text
                    as="div"
                    className="text-muted flex-grow-1"
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: "1.6",
                      textAlign: "right",
                      direction: "rtl",
                      color: "#555",
                      whiteSpace: "pre-line",
                      paddingRight: "15px",
                    }}
                  >
                    {item.description.split("\n").map((line, idx) => (
                      <div key={idx} style={{ marginBottom: "6px" }}>
                        <span style={{ color: "#2a7371", marginRight: "5px" }}>
                          ✦
                        </span>
                        {line.replace("• ", "  ")}
                      </div>
                    ))}
                  </Card.Text>
                )}

                <div className="d-flex gap-2 mt-1">
                  <button
                    className="d-flex justify-content-center align-items-center gap-2 flex-fill"
                    style={{
                      backgroundColor: "#2a7371",
                      borderColor: "#2a7371",
                      color: "white",
                      fontSize: "0.85rem",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      transition: "transform 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      console.log("📌 الضغط على كرت مع id:", item.id);
                      navigate("/RatingToastCards", {
                        state: {
                          serviceId: item.id,
                          serviceTitle: item.titleAr, // 🔥 إرسال العنوان
                        },
                      });
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <i
                      className="bi bi-chat-dots"
                      style={{ fontSize: "1rem", marginRight: "6px" }}
                    ></i>
                    آراء المرضى
                  </button>

                  <button
                    className="d-flex justify-content-center align-items-center gap-1 flex-fill"
                    style={{
                      backgroundColor: "#2a7371",
                      borderColor: "#2a7371",
                      color: "white",
                      fontSize: "0.85rem",
                      padding: "0.5rem",
                      borderRadius: "8px",
                      transition: "transform 0.2s",
                      whiteSpace: "nowrap",
                    }}
                    onClick={() => {
                      navigate("/Content", {
                        state: {
                          id: item.id,
                          title: item.titleAr,
                          description: item.description,
                          image: item.image,
                        },
                      });
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-3px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <span>عرض التفاصيل</span>
                    <i
                      className="bi bi-arrow-right-short"
                      style={{ fontSize: "1rem" }}
                    ></i>
                  </button>
                </div>

                {item.isFromBackend && isSchedulerAdmin && (
                  <div className="d-flex justify-content-center gap-3 mt-3">
                    <Trash2
                      size={20}
                      color="#c0392b"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(item.id)}
                    />
                    <Edit
                      size={20}
                      color="#2980b9"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate("/Cards", {
                          state: {
                            id: item.id, // مهم: id من الباك
                            title: item.titleAr || item.title || "",
                            description: item.description || "",
                            image: item.image || item.picUrl || null,
                            isEdit: true,
                          },
                        })
                      }
                    />{" "}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <Container
      className="mt-5"
      style={{
        minHeight: "calc(100vh - 200px)",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      {/* عنوان تخصصاتنا */}
      <div className="text-center mb-3">
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: "bold",
            color: "#2a7371",
            textShadow: "2px 2px 6px rgba(0,0,0,0.25)",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "50px", // مسافة صغيرة أسفل العنوان
          }}
        >
          <span role="img" aria-label="specialty">
            🩺
          </span>{" "}
          تخصصاتنا
        </h2>
      </div>

      {rows}

      {isSchedulerAdmin && (
        <div className="text-center mb-4 w-100">
          <button
            style={{
              backgroundColor: "#2a7371",
              color: "white",
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              marginTop: "20px",
            }}
            onClick={() => navigate("/Cards")}
          >
            + إضافة تخصص جديد
          </button>
        </div>
      )}
    </Container>
  );
}
