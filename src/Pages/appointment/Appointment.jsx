import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Appointment() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  const DISPLAY_COUNT = 6; // السبت - الخميس

  const getWeekDates = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setDate(start.getDate() + weekOffset * 7);

    const dayNames = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
    const result = [];
    const cursor = new Date(start);

    while (result.length < DISPLAY_COUNT) {
      if (cursor.getDay() !== 5) {
        result.push({
          name: dayNames[cursor.getDay()],
          dateObj: new Date(cursor),
          date: cursor.toLocaleDateString("ar-EG", { day: "2-digit", month: "2-digit", year: "numeric" }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return result;
  };

  const days = getWeekDates();
  const times = [];
  for (let i = 9; i < 17; i++) {
    const start = i < 12 ? `${i}:00 ص` : `${i===12?12:i-12}:00 م`;
    const end = i+1 < 12 ? `${i+1}:00 ص` : `${i+1===12?12:i+1-12}:00 م`;
    times.push({ label: `${start} - ${end}`, hour: i });
  }

  const nextWeek = () => setWeekOffset(prev => prev+1);
  const prevWeek = () => { if (weekOffset>0) setWeekOffset(prev=>prev-1); };

  const handleSelect = (day, time) => {
    setSelectedSlot({ day, time: time.label });
  };

  const handleBookClick = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("للحجز، يرجى تسجيل الدخول");
      localStorage.setItem("redirectAfterLogin","/appointment");
      navigate("/signin");
      return;
    }
    if (!selectedSlot) {
      toast.error("الرجاء تحديد الوقت أولاً");
      return;
    }
    navigate("/formappointment", { state: { selectedSlot } });
  };

  const now = new Date();

  return (
    <div dir="rtl" className="container py-4" style={{ margin:"150px auto", minHeight:"100vh", fontFamily:"Tahoma", backgroundColor:"#e6f9f8" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={prevWeek} className="btn btn-outline-info rounded-circle" disabled={weekOffset===0} style={{ borderColor:"#00b7b3", color:"#00b7b3", opacity:weekOffset===0?0.4:1 }}> <ChevronRight/> </button>
        <h5 className="fw-bold" style={{ color:"#2a7371" }}>مواعيد الأسبوع</h5>
        <button onClick={nextWeek} className="btn btn-outline-info rounded-circle" style={{ borderColor:"#00b7b3", color:"#00b7b3" }}> <ChevronLeft/> </button>
      </div>

      <div className="row g-3 text-center">
        {days.map((day, idx) => (
          <div key={day.date+idx} className="col-6 col-md-2">
            <div className="p-2 rounded shadow-sm" style={{ backgroundColor:"#2a7371", color:"beige" }}>
              <h6 className="mb-0 fw-bold">{day.name}</h6>
              <small className="d-block mb-2">{day.date}</small>

              {times.map((time,i)=>{
                const slotDate = new Date(day.dateObj);
                slotDate.setHours(time.hour,0,0,0);
                const isPast = slotDate<now;
                const isSelected = selectedSlot?.day===day.date && selectedSlot?.time===time.label;

                return (
                  <div key={i} className="border rounded py-1 mb-2 small d-flex justify-content-center align-items-center gap-1"
                    style={{
                      backgroundColor: isSelected?"#f7c8e0":isPast?"#ddd":"#f5f5f5",
                      color: isPast?"#888":"#333",
                      cursor: isPast?"not-allowed":"pointer"
                    }}
                    onClick={()=>!isPast && handleSelect(day.date,time)}
                  >
                    {isSelected && <Check size={14} color="#2a7371" strokeWidth={3} />}
                    {time.label}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button onClick={handleBookClick} className="btn px-4 py-2 fw-bold" style={{ backgroundColor:"#2a7371", color:"beige", border:"none" }}>احجز موعدك</button>
      </div>
    </div>
  )
}

export default Appointment;