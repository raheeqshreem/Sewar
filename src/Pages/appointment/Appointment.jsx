import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react"; // أيقونات الأسهم
import { Link } from "react-router-dom";

function App() {
  const [weekOffset, setWeekOffset] = useState(0); // تحريك الأسابيع

  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // الأحد=0 ... السبت=6

    // نحسب بداية الأسبوع (السبت)
    const saturday = new Date(today);
    saturday.setDate(today.getDate() - ((currentDay + 1) % 7) + weekOffset * 7);

    // نرجع الأيام من السبت للخميس
    const days = ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
    return days.map((day, i) => {
      const d = new Date(saturday);
      d.setDate(saturday.getDate() + i);
      return {
        name: day,
        date: d.toLocaleDateString("ar-EG", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });
  };

  const days = getWeekDates();

  // المواعيد من 9 إلى 5
  const times = [];
  for (let i = 9; i < 17; i++) {
    const start = i < 12 ? `${i}:00 ص` : `${i === 12 ? 12 : i - 12}:00 م`;
    const end =
      i + 1 < 12
        ? `${i + 1}:00 ص`
        : `${i + 1 === 12 ? 12 : i + 1 - 12}:00 م`;
    times.push(`${start} - ${end}`);
  }

  const nextWeek = () => setWeekOffset(weekOffset + 1);
  const prevWeek = () => setWeekOffset(weekOffset - 1);

  return (
    <div
      className="container py-4"
      dir="rtl"
      style={{
        margin: "150px auto",
        minHeight: "100vh",
        fontFamily: "Tahoma",
        backgroundColor: "#e6f9f8",
      }}
    >
      {/* الأسهم */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* 🔹 السهم الأيمن صار للأسبوع السابق */}
        <button
          onClick={prevWeek}
          className="btn btn-outline-info rounded-circle"
          style={{ borderColor: "#00b7b3", color: "#00b7b3" }}
        >
          <ChevronRight />
        </button>

        <h5 className="fw-bold" style={{ color: "#2a7371" }}>
          مواعيد الأسبوع
        </h5>

        {/* 🔹 السهم الأيسر صار للأسبوع القادم */}
        <button
          onClick={nextWeek}
          className="btn btn-outline-info rounded-circle"
          style={{ borderColor: "#00b7b3", color: "#00b7b3" }}
        >
          <ChevronLeft />
        </button>
      </div>

      {/* الأيام والمواعيد */}
      <div className="row g-3 text-center">
        {days.map((day) => (
          <div key={day.name} className="col-6 col-md-2">
            <div
              className="p-2 rounded shadow-sm"
              style={{
                backgroundColor: "#2a7371", // تركوازي للخلفية
                color: "beige", // بيج للنص
              }}
            >
              <h6 className="mb-0 fw-bold">{day.name}</h6>
              <small className="d-block mb-2">{day.date}</small>

              {times.map((time, i) => (
                <div
                  key={i}
                  className="border rounded py-1 mb-2 small"
                  style={{
                    backgroundColor: "#f5f5f5",
                    color: "#333",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e0f7f6")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "#f5f5f5")
                  }
                >
                  {time}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* الزر */}
<div className="text-center mt-4">
  <Link
    to="/formappointment"
    className="btn px-4 py-2 fw-bold"
    style={{
      backgroundColor: "#2a7371",
      color: "beige",
      border: "none",
      textDecoration: "none", // علشان يشيل الخط تحت النص
    }}
  >
    احجز موعدك
  </Link>
</div>
    </div>
  );
}

export default App;