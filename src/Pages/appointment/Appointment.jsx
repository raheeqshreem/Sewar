import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

function App() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const DISPLAY_COUNT = 6; // السبت - الخميس (بدون جمعة)

  const getWeekDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setDate(start.getDate() + weekOffset * 7);

    const dayNames = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];

    const result = [];
    const cursor = new Date(start);

    while (result.length < DISPLAY_COUNT) {
      if (cursor.getDay() !== 5) {
        result.push({
          name: dayNames[cursor.getDay()],
          dateObj: new Date(cursor),
          date: cursor.toLocaleDateString("ar-EG", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
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
    times.push({ label: `${start} - ${end}`, hour: i });
  }

  const nextWeek = () => setWeekOffset((prev) => prev + 1);
  const prevWeek = () => {
    if (weekOffset > 0) setWeekOffset((prev) => prev - 1);
  };

  // 🔹 دالة الضغط على موعد
  const handleSelect = (day, time) => {
    if (time.disabled) return; // منع اختيار الأوقات المنتهية
    setSelectedSlot({ day, time: time.label });
  };

  // 🔹 دالة الضغط على الزر
  const handleBookClick = (e) => {
    if (!selectedSlot) {
      e.preventDefault();
      alert("الرجاء تحديد الوقت أولاً");
    }
  };

  const now = new Date();

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
        <button
          onClick={prevWeek}
          className="btn btn-outline-info rounded-circle"
          style={{
            borderColor: "#00b7b3",
            color: "#00b7b3",
            opacity: weekOffset === 0 ? 0.4 : 1,
            cursor: weekOffset === 0 ? "not-allowed" : "pointer",
          }}
          disabled={weekOffset === 0}
        >
          <ChevronRight />
        </button>

        <h5 className="fw-bold" style={{ color: "#2a7371" }}>
          مواعيد الأسبوع
        </h5>

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
        {days.map((day, idx) => (
          <div key={day.date + "-" + idx} className="col-6 col-md-2">
            <div
              className="p-2 rounded shadow-sm"
              style={{
                backgroundColor: "#2a7371",
                color: "beige",
              }}
            >
              <h6 className="mb-0 fw-bold">{day.name}</h6>
              <small className="d-block mb-2">{day.date}</small>

              {times.map((time, i) => {
                const slotDate = new Date(day.dateObj);
                slotDate.setHours(time.hour, 0, 0, 0);

                // 🔸 نحدد إن كان هذا الوقت ماضي
                const isPast = slotDate < now;

                const isSelected =
                  selectedSlot &&
                  selectedSlot.day === day.date &&
                  selectedSlot.time === time.label;

                return (
                  <div
                    key={i}
                    className="border rounded py-1 mb-2 small d-flex justify-content-center align-items-center gap-1"
                    style={{
                      backgroundColor: isSelected
                        ? "#f7c8e0"
                        : isPast
                        ? "#ddd"
                        : "#f5f5f5",
                      color: isPast ? "#888" : "#333",
                      cursor: isPast ? "not-allowed" : "pointer",
                      transition: "0.2s",
                    }}
                    onClick={() => handleSelect(day.date, { ...time, disabled: isPast })}
                    onMouseEnter={(e) => {
                      if (!isSelected && !isPast)
                        e.target.style.backgroundColor = "#e0f7f6";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !isPast)
                        e.target.style.backgroundColor = "#f5f5f5";
                    }}
                  >
                    {isSelected && (
                      <Check size={14} color="#2a7371" strokeWidth={3} />
                    )}
                    {time.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* الزر */}
      <div className="text-center mt-4">
        <Link
          to="/formappointment"
          onClick={handleBookClick}
          className="btn px-4 py-2 fw-bold"
          style={{
            backgroundColor: "#2a7371",
            color: "beige",
            border: "none",
            textDecoration: "none",
          }}
        >
          احجز موعدك
        </Link>
      </div>
    </div>
  );
}

export default App;