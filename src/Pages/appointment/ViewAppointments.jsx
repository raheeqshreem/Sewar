import axios from "axios";
import { Spinner, Card, Container, Badge, Form, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef, useLayoutEffect } from "react";

export default function ViewAppointments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

const location = useLocation();
const highlightAppointmentId =
  location.state?.highlightAppointmentId || localStorage.getItem("highlightAppointmentId");

const highlightRef = useRef(null);

useEffect(() => {
  console.log("HighlightAppointmentId:", highlightAppointmentId);
  console.log("highlightRef.current:", highlightRef.current);

  if (highlightAppointmentId && highlightRef.current) {
    const timer = setTimeout(() => {
      console.log("Scrolling to appointment:", highlightRef.current);
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      window.history.replaceState({}, document.title);
      localStorage.removeItem("highlightAppointmentId");
    }, 500);
    return () => clearTimeout(timer);
  }
}, [data, highlightAppointmentId]);



  const fetchAppointments = async (searchValue = "") => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      if (!token) {
        alert("لم يتم العثور على التوكن ❌ الرجاء تسجيل الدخول من جديد");
        setLoading(false);
        return;
      }

      const url = `https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/children-with-appointments${
        searchValue ? `?search=${encodeURIComponent(searchValue)}` : ""
      }`;

      const response = await axios.get(url, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      setData(response.data);
    } catch (error) {
      console.error(error.response || error);
      alert(error.response?.status === 401 ? "انتهت الجلسة 🔒" : "حدث خطأ أثناء تحميل المواعيد ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchAppointments(search);
  };

  useEffect(() => {
  console.log("data appointments:", data.map(c => c.upcomingAppointments.map(a => a.id)));
}, [data]);
useLayoutEffect(() => {
  if (!data || !highlightAppointmentId) return;

  // حاول إيجاد العنصر بالـ ID
  const element = document.getElementById(`appointment-${highlightAppointmentId}`);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    localStorage.removeItem("highlightAppointmentId");
  }
}, [data, highlightAppointmentId]);


  const handleDeleteAppointment = async (childId, appointmentId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الموعد؟")) return;
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/delete-appointment",
        { appointmentId, confirmDelete: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) =>
        prev.map((child) =>
          child.id === childId
            ? { ...child, upcomingAppointments: child.upcomingAppointments.filter((a) => a.id !== appointmentId) }
            : child
        )
      );
      alert(res.data.message || "تم حذف الموعد بنجاح ✅");
    } catch (err) {
      console.error(err.response || err);
      alert("حدث خطأ أثناء حذف الموعد ❌");
    }
  };
  

  const colors = ["#ffe6e6", "#e6f7ff", "#fff0e6", "#e6ffe6", "#fff7e6", "#f0e6ff"];

  return (
    <>
      <Container className="py-5" style={{ marginTop: "100px" }}>
        <h2 className="text-center mb-5 fw-bold" style={{ color: "#2a7371", marginBottom: "80px" }}>
          👶 جميع المواعيد المحجوزة
        </h2>

        {/* حقل البحث */}
        <Form onSubmit={handleSearch} className="mb-5">
          <div className="shadow-lg rounded-5 overflow-hidden d-flex" style={{ border: "3px solid #2a7371", backgroundColor: "#e6f9f8", maxWidth: "600px", margin: "0 auto", height: "60px" }}>
            <Form.Control
              type="text"
              placeholder="ابحث بالاسم أو رقم الهوية..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: "none", padding: "0 25px", fontWeight: "bold", fontSize: "17px", backgroundColor: "transparent", color: "#000", borderRadius: "0", height: "100%" }}
            />
            <Button type="submit" variant="info" style={{ fontWeight: "bold", border: "none", backgroundColor: "#2a7371", color: "beige", height: "100%", width: "130px", borderRadius: "0", fontSize: "16px" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e5654"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2a7371"}>
              بحث
            </Button>
          </div>
        </Form>

        {/* عرض المواعيد */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
            <Spinner animation="border" variant="info" />
          </div>
        ) : data.length === 0 ? (
          <p className="text-center text-muted fw-bold">لا توجد مواعيد حالياً.</p>
        ) : (
          <div className="d-flex flex-column gap-5">
            {data.map((child, index) => (
              <Card key={child.id} className="border-0 rounded-4 p-4" style={{ boxShadow: "0 15px 35px rgba(0,0,0,0.25)", borderRadius: "25px", background: `linear-gradient(135deg, ${colors[index % colors.length]}, #ffffff)`, transition: "transform 0.2s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "55px", height: "55px", backgroundColor: "#2a7371", fontWeight: "bold", fontSize: "20px" }}>
                        {child.fullname?.charAt(0) || "👶"}
                      </div>
                      <div className="ms-3">
                        <h5 className="mb-1 fw-bold text-dark">{child.fullname}</h5>
                        <p className="text-muted mb-0">رقم الهوية: {child.idnumber}</p>
                      </div>
                    </div>

                    {/* زر إضافة موعد */}
                    <Button variant="outline-info" style={{ border: "2px solid #2a7371", color: "#2a7371", fontWeight: "bold", borderRadius: "10px", backgroundColor: "#e6f9f8", display: "flex", alignItems: "center", gap: "6px", transition: "0.3s" }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#2a7371"; e.currentTarget.style.color = "white"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#e6f9f8"; e.currentTarget.style.color = "#2a7371"; }}
                      onClick={() => {
                        localStorage.setItem("selectedChildId", child.id);
                        localStorage.setItem("fromPage", "viewAppointments");
                        localStorage.setItem("selectedIDNumber", child.idnumber);
                        navigate("/appointment", { state: { asPatient: true } });
                      }}>
                      <PlusCircle size={18} /> إضافة موعد  
                    </Button>
                  </div>

                  {/* المواعيد */}
                 {/* المواعيد */}
<div className="border-top pt-3 d-flex flex-column gap-3">
  {child.upcomingAppointments.map((app) => {
  const isHighlighted = Number(app.id) === Number(highlightAppointmentId); // ✅
  console.log("Checking appointment:", app.id, "isHighlighted?", isHighlighted);

    return (
<div
  id={`appointment-${app.id}`}  // ← هنا
  className="p-3 rounded d-flex justify-content-between align-items-center"
  style={{
    backgroundColor: Number(app.id) === Number(highlightAppointmentId) ? "#d1f7d6" : "white",
    border: Number(app.id) === Number(highlightAppointmentId) ? "3px solid #2a7371" : "none",
  }}
>




        <span className="fw-bold text-dark">{app.day}</span>
        <Badge bg="info" text="dark">{app.time}</Badge>
        <small className="fw-bold text-dark ms-3">
          <span style={{ color: "#070707ff" }}>نوع الزيارة:</span> {app.visitTypee === 0 ? "مراجعة" : " جديدة"}
        </small>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {/* أيقونة الحذف */}
          <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-${app.id}`}>حذف الموعد</Tooltip>}>
            <Button
              variant="link"
              size="lg"
              onClick={() => handleDeleteAppointment(child.id, app.id)}
              style={{ color: "red", fontSize: "1.6rem", padding: "0" }}
            >
              <Trash2 size={28} />
            </Button>
          </OverlayTrigger>

          {/* أيقونة التعديل */}
          <OverlayTrigger placement="top" overlay={<Tooltip id={`tooltip-edit-${app.id}`}>تعديل الموعد</Tooltip>}>
            <Button
              variant="link"
              size="lg"
              onClick={() => {
                localStorage.setItem("selectedChildId", child.id);
                localStorage.setItem("selectedAppointmentId", app.id);
                toast("⚠️ اختر موعدًا يناسبك من الجدول لتعديله", {
                  duration: 5000,
                  style: { background: "#fff0e0", color: "#8b4500", fontWeight: "bold", fontSize: "20px", border: "2px solid #ffb84d", textAlign: "center" },
                });
                navigate("/appointment", { state: { editMode: true, fromViewEdit: true , highlightAppointmentId: app.id } });
              }}
              style={{ color: "#2a7371", fontSize: "1.6rem", padding: "0" }}
            >
              <Edit size={28} />
            </Button>
          </OverlayTrigger>
        </div>
      </div>
    );
  })}
</div>

                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* ====== زر إنشاء موعد أسفل الصفحة ====== */}
        <div className="d-flex justify-content-center mt-4">

          <button onClick={() => navigate("/users")}
            style={{ backgroundColor: "#006d6d", borderColor: "beige", color: "beige", borderRadius: "10px", display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", fontWeight: "600", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#008b8b"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "#008b8b"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"; }}>
            <PlusCircle size={20} /> إضافة موعد لمريض جديد
          </button>
        </div>
      </Container>
    </>
  );
}
