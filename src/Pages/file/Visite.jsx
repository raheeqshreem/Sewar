import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

const Visite = () => {
  const accentColor = "#2a7371";
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const isSchedulerAdmin = user?.userType?.toLowerCase() === "scheduler_admin";

  const { childId, fullName ,gender } = location.state || {};
  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
const [totalCost, setTotalCost] = useState(0);

const fetchTotalCost = async () => {
  if (!childId) return;
  try {
    const response = await axios.get(
      `https://sewarwellnessclinic1.runasp.net/api/FilesPage/child-visites-cost?childId=${childId}`
    );
    setTotalCost(response.data.totalCost);
  } catch (err) {
    console.error("خطأ في جلب مجموع الأسعار:", err);
  }
};

// نعمل useEffect لتحديث المجموع عند تحميل البيانات
useEffect(() => {
  fetchTotalCost();
}, [childId, visites]); // نحدثه كلما تغيرت الزيارات

  const fetchVisites = async (date = null) => {
    if (!childId) {
      setError("رقم تعريف المريض غير موجود.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const url =
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/child-visites?childId=${childId}` +
        (date ? `&date=${encodeURIComponent(date)}` : "");
      const response = await axios.get(url);
      setVisites(response.data);
    } catch (err) {
      console.error(err);
      setError("فشل جلب المواعيد من السيرفر.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!childId) return;
    if (dateFilter === "") {
      fetchVisites();
    } else if (dateFilter.length === 10) {
      fetchVisites(dateFilter);
    }
  }, [dateFilter, childId]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "غير محدد";
    const [hours, minutes] = timeStr.split(":");
    return `${parseInt(hours)}:${minutes}`;
  };

  const handleDateSearch = () => {
    if (!dateFilter) return;
    fetchVisites(dateFilter);
  };

  const updateVisiteInstant = async (visiteId, cost, session_name) => {
    try {
      await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/FilesPage/update-visite-cost",
        {
          childId,
          visiteId,
          cost: cost ? Number(cost) : 0,
          session_name: session_name || "",
        }
      );
      console.log(`✅ تم تحديث الزيارة ${visiteId}`);
    } catch (error) {
      console.error("❌ خطأ في التحديث:", error);
    }
  };

  const handleChange = (id, field, value) => {
    setVisites((prev) =>
      prev.map((v) => (v.visiteId === id ? { ...v, [field]: value } : v))
    );

    const current = visites.find((v) => v.visiteId === id);
    const newSession = field === "sessionName" ? value : current?.sessionName;
    const newCost = field === "cost" ? value : current?.cost;

    updateVisiteInstant(id, newCost, newSession);
  };

  // دالة لضبط عرض input حسب المحتوى
  const adjustWidth = (e) => {
    e.target.style.width = "auto";
    e.target.style.width = e.target.scrollWidth + "px";
  };

  return (
   <div
  className="container"
  dir="rtl"
  style={{
    paddingTop: "80px",
    paddingBottom: "50px",
    maxWidth: "100%", // يأخذ كامل عرض الشاشة
  }}
>
  <div className="card shadow-lg p-4 p-md-5 border-0 rounded-4" style={{ width: "80%", margin: "0 auto" }}>

<h3
  className="text-center mb-3 mb-md-4"
  style={{
    color: accentColor,
    fontSize: "1.8rem",       // حجم مناسب للجوال
    fontWeight: "700",        // غامق
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // خط جميل
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)", // ظل خفيف
    padding: "50px 0",
  }}
>
  📅 مواعيد {gender === 1 ? "المريضة" : "المريض"} {fullName}
</h3>

    {/* البحث بالتاريخ */}
    <div className="mb-3 text-center">
      <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
        <input
          type="text"
          className="form-control text-center mb-2 mb-sm-0"
          placeholder="ادخل التاريخ dd/mm/yyyy"
          style={{ width: "100%", maxWidth: "200px", border: `2px solid ${accentColor}` }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button
          className="btn"
          style={{ backgroundColor: accentColor, color: "#fff", width: "100%", maxWidth: "100px" }}
          onClick={handleDateSearch}
        >
          بحث
        </button>
      </div>
    </div>

    {/* الجدول */}
    {!loading && visites.length > 0 && (
      <div className="table-responsive" style={{ overflowX: "auto" }}>
<table 
  className="table table-hover table-bordered text-center align-middle"
  style={{ width: "100%", tableLayout: "fixed" }}
>
  <thead style={{ 
      backgroundColor: accentColor, 
      color: "#fff", 
      fontSize: "1rem",   // حجم أكبر للخط
      fontWeight: "700",  // غامق
      textShadow: "1px 1px 2px rgba(0,0,0,0.2)" // ظل خفيف اختياري
  }}>
    <tr>
      <th>التاريخ</th>
      <th>الوقت</th>
      <th>النوع</th>
      <th>مكان الجلسة</th>

      <th>اسم الجلسة</th>
      <th>التكلفة</th>
    </tr>
  </thead>
<tbody
  style={{
    fontSize: "0.95rem",
    fontWeight: "600",
    textAlign: "center",       // يجعل النصوص بالوسط أفقيًا
    verticalAlign: "middle",   // يجعلها بالوسط عموديًا
  }}
>
  {visites.map((v) => (
  <tr key={v.visiteId}>

    {console.log("VISIT FROM BACKEND:", v)}



<td
  style={{
    textAlign: "center",
    verticalAlign: "middle",
    width: "80px",
    whiteSpace: "nowrap",
  }}
>        {new Date(v.date).toLocaleDateString("ar-EG")}
      </td>
      <td style={{ textAlign: "center", verticalAlign: "middle" }}>
        {formatTime(v.time)}
      </td>
<td style={{ textAlign: "center", verticalAlign: "middle" }}>
<select
  value={v.type}
  onChange={async (e) => {
    const newType = Number(e.target.value);
    setVisites((prev) =>
      prev.map((item) =>
        item.visiteId === v.visiteId ? { ...item, type: newType } : item
      )
    );

    try {
      await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/FilesPage/change-visit-type",
        { visitId: v.visiteId, newType: newType }
      );
    } catch (err) {
      alert("فشل تحديث نوع الزيارة");
    }
  }}
  style={{
    fontSize: "0.95rem",
    fontWeight: "600",
    width: "100%",
    textAlign: "center",
    // اللون الافتراضي يبقى أبيض
    backgroundColor: "white",
    color: "#333",
  }}
>
  <option value={1} style={{ backgroundColor: "#d1f2eb" }}>جلسة جديدة</option>
  <option value={0} style={{ backgroundColor: "#ffe5d9" }}>جلسة مراجعة</option>
</select>

</td>








<td
  style={{
    textAlign: "center",
    verticalAlign: "middle",
    width: "180px",
    whiteSpace: "normal",
    wordWrap: "break-word",
    padding: "0", // مهم جداً ليأخذ نفس طول الأعمدة
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "5px",
      height: "100%",        // 🔥 هذا هو اللي يخليه بنفس طول الصف
      padding: "10px",       // يرجع حشوة الجدول
      boxSizing: "border-box",
    }}
  >
<span>{v.appointmentLocation || "غير محدد"}</span>
  {isSchedulerAdmin && (

<button
  onClick={async () => {
    const newAddress = prompt(
      "أدخل عنوان الجلسة الجديد:",
      v.appointmentLocation || ""
    );

    if (newAddress !== null) {
      try {
        console.log("📌 Sending update-address request...");
        console.log(
          "URL:",
          `https://sewarwellnessclinic1.runasp.net/api/FilesPage/appointments/update-address/${v.appointmentId}`
        );
console.log("Sending PUT:", v.appointmentid, newAddress);
const appointmentId = v.appointmentid || v.appointmentId || v.visiteId;

     const res = await axios.put(
  `https://sewarwellnessclinic1.runasp.net/api/FilesPage/appointments/update-address/${appointmentId}`,
  { appointmentlocation: newAddress }
);


        console.log("✅ Server Response:", res.data);

        // تحديث الواجهة مباشرة
        setVisites((prev) =>
          prev.map((item) =>
            item.visiteId === v.visiteId
              ? { ...item, appointmentLocation: newAddress }
              : item
          )
        );
      } catch (err) {
        console.error("❌ UPDATE ADDRESS ERROR:", err.response?.data || err);
        alert("فشل تحديث عنوان الجلسة.");
      }
    }
  }}
  style={{
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: accentColor,
    fontSize: "1.2rem",
  }}
  title="تعديل العنوان"
>
  ✏️
</button>
  )}

  </div>
</td>










      <td>
        <textarea
          className="form-control text-center"
          value={v.sessionName || ""}
          onChange={(e) =>
            setVisites((prev) =>
              prev.map((item) =>
                item.visiteId === v.visiteId
                  ? { ...item, sessionName: e.target.value }
                  : item
              )
            )
          }
        onKeyDown={async (e) => {
  if (e.key === "Enter") {
    await updateVisiteInstant(v.visiteId, v.cost, v.sessionName);
    fetchVisites(); // 🔥 هذا يعيد تحميل البيانات ويحدث totalCost
    e.target.blur();
  }
}}

          style={{
            width: "100%",
            minHeight: "40px",
            resize: "vertical",
            overflow: "auto",
            border: "none",
            outline: "none",
            background: "transparent",
            fontWeight: "600",
            fontSize: "0.95rem",
          }}
        />
      </td>





      
      <td>
        <input
          type="text"
          className="form-control text-center"
          value={v.cost || ""}
          onChange={(e) =>
            setVisites((prev) =>
              prev.map((item) =>
                item.visiteId === v.visiteId
                  ? { ...item, cost: e.target.value }
                  : item
              )
            )
          }
        onKeyDown={async (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    await updateVisiteInstant(v.visiteId, v.cost, v.sessionName);
    fetchVisites(); // 🔥
    e.preventDefault();
    e.target.blur();
  }
}}

          style={{
            fontSize: "0.95rem",
            fontWeight: "600",
            width: "100%",
            textAlign: "center",
          }}
        />
      </td>
    </tr>
  ))}
</tbody>
</table>
      </div>
    )}

    {/* أزرار المجموع والعودة */}
    <div className="text-center mt-3 d-flex flex-column align-items-center gap-2">
      <button
        className="btn"
        style={{ backgroundColor: accentColor, color: "#fff", width: "100%", maxWidth: "300px" }}
      >
        مجموع أسعار الجلسات: {totalCost} ₪
      </button>
      <button
        className="btn"
        style={{ backgroundColor: accentColor, color: "#fff", width: "100%", maxWidth: "300px" }}
        onClick={() => navigate("/FilesPage")}
      >
        العودة للملفات
      </button>
    </div>
  </div>
</div>
  );
};

export default Visite;