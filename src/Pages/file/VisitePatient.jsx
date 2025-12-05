import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation, useNavigate } from "react-router-dom";

const VisitePatient = () => {
  const accentColor = "#2a7371";
  const location = useLocation();
  const navigate = useNavigate();

  const { childId, fullName, gender } = location.state || {};

  const [visites, setVisites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  // -------- fetch visites ----------
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
      console.log("DATA FROM BACK:", response.data);

      setVisites(response.data);

      // حساب مجموع التكاليف
      const sum = response.data
        .filter((v) => v.cost !== null)
        .reduce((acc, v) => acc + v.cost, 0);
      setTotalCost(sum);
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



const handleEditLocation = async (appointmentId, currentLocation) => {
  const newLocation = prompt("عدل مكان الزيارة:", currentLocation);

  if (newLocation !== null) {
    try {
      await axios.put(
        `https://sewarwellnessclinic1.runasp.net/api/FilesPage/appointments/update-address/${appointmentId}`,
        { appointmentlocation: newLocation }
      );

      // تحديث الواجهة فورياً
      setVisites(prev =>
        prev.map(v =>
          v.appointmentid === appointmentId
            ? { ...v, appointmentLocation: newLocation }
            : v
        )
      );

      alert("تم التحديث بنجاح!");
    } catch (err) {
      console.error("خطأ في تحديث المكان:", err);
      alert("فشل تحديث المكان على السيرفر.");
    }
  }
};





  return (
    <div
      className="container"
      dir="rtl"
      style={{
        paddingTop: "80px",
        paddingBottom: "50px",
        maxWidth: "100%",
      }}
    >
      <div
        className="card shadow-lg p-3 p-md-5 border-0 rounded-4"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h3
          className="text-center mb-3 mb-md-4"
          style={{
            color: accentColor,
            fontSize: "1.8rem",
            fontWeight: "700",
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
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
              style={{
                width: "100%",
                maxWidth: "200px",
                border: `2px solid ${accentColor}`,
              }}
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <button
              className="btn"
              style={{
                backgroundColor: accentColor,
                color: "#fff",
                width: "100%",
                maxWidth: "100px",
              }}
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
  style={{ width: "100%", tableLayout: "fixed" }} // ⬅️ المهم هنا
            >
              <thead
                style={{
                  backgroundColor: accentColor,
                  color: "#fff",
                  fontSize: "1rem",
                  fontWeight: "700",
                }}
              >
                <tr>
                  <th>التاريخ</th>
                  <th>الوقت</th>
                    <th>المكان</th>   {/* ⬅️ تمت الإضافة */}

                  <th>نوع الزيارة</th>
                  <th>اسم الجلسة</th>
                  <th>سعر الجلسة</th>
                </tr>
              </thead>

              <tbody
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                {visites.map((v) => (
                  <tr key={v.visiteId}>
                    <td>
                      {new Date(v.date).toLocaleDateString("ar-EG")}
                    </td>
                    <td>{formatTime(v.time)}</td>



<td style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
  <span>{v.appointmentLocation || "—"}</span>
  {/* أيقونة التعديل */}
<button
  onClick={() =>
    handleEditLocation(v.appointmentid, v.appointmentLocation)
  }
  style={{
    background: "none",
    border: "none",
    cursor: "pointer",
    color: accentColor,
  }}
  title="تعديل المكان"
>
  ✏️
</button>


</td>


                    <td>{v.type === 1 ? "جلسة جديدة" : "جلسة مراجعة"}</td>
                    <td>{v.sessionName || "—"}</td>
                    <td>{v.cost !== null ? `${v.cost} ₪` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* مجموع التكاليف */}
        {!loading && visites.length > 0 && (
          <h5 className="text-center mt-3" style={{ color: accentColor }}>
            مجموع التكاليف: {totalCost} ₪
          </h5>
        )}

        {/* رسالة لا يوجد بيانات */}
        {!loading && visites.length === 0 && (
          <p className="text-center mt-3">لا يوجد مواعيد.</p>
        )}

        {/* زر العودة */}
        <div className="text-center mt-4">
          <button
            className="btn"
            style={{
              backgroundColor: accentColor,
              color: "#fff",
              width: "100%",
              maxWidth: "300px",
            }}
            onClick={() => navigate("/FilesPagePatient")}
          >
            العودة للملفات
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisitePatient;
