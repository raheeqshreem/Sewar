import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Trash2, Edit } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function Appointment() {

  const location = useLocation();
  const fromViewEdit = location.state?.fromViewEdit || false;
const bookButtonRef = useRef(null);

  const asPatient = location.state?.asPatient || false; // هنا تأكدنا إذا ما وصل أي state يكون false
const editMode = location.state?.editMode || false;

  console.log(asPatient); // true إذا ضغط السكرتير على "إضافة موعد"

 // 🟢 هذا الجزء الجديد: Scroll لفوق عند الدخول

useEffect(() => {
  if (editMode && fromViewEdit) {
    const appointmentId = localStorage.getItem("selectedAppointmentId");
    const childId = localStorage.getItem("selectedChildId");
    const email = localStorage.getItem("selectedEmail");

    if (appointmentId) {
  setEditTarget({ 
    appointmentId: parseInt(appointmentId), 
    childId: childId ? parseInt(childId) : null,
    email: email || null
  });
}




  }
}, [editMode, fromViewEdit]);


  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [tempSelectedSlot, setTempSelectedSlot] = useState(null); // الموعد الزهري المؤقت
  const [allAppointments, setAllAppointments] = useState([]);
  const [userAppointments, setUserAppointments] = useState([]);
  const [pendingChange, setPendingChange] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTempDeleteModal, setShowTempDeleteModal] = useState(false); // مودال حذف الموعد المؤقت
  const [editTarget, setEditTarget] = useState(null);
  const navigate = useNavigate();

const user = JSON.parse(localStorage.getItem("user"));
console.log(JSON.parse(localStorage.getItem("user")));
const isSecretary = user?.userType === "scheduler_admin"; // تحقق إذا المستخدم سكرتير
const showBookButton = isSecretary ? asPatient : true;

  const DISPLAY_COUNT = 6; // السبت - الخميس

  useEffect(() => {
    fetchAppointments();
  }, []);

 const fetchAppointments = async () => {
  try {
    // جلب كل المواعيد العامة
    const allRes = await axios.get("https://sewarwellnessclinic1.runasp.net/api/Child/booked");
    setAllAppointments(allRes.data);

    // التحقق إذا المستخدم مسجل
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return; // لو المستخدم غير مسجل، نتوقف هنا

    // لو المستخدم مسجل، جلب مواعيده الشخصية
    const token = localStorage.getItem("token") || user.token;
    const userRes = await axios.get("https://sewarwellnessclinic1.runasp.net/api/Child/get-user-appointments", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const userSlots = [];
    userRes.data.forEach(child => {
      child.appointments.forEach(app => {
        userSlots.push({ ...app, childId: child.childId });
      });
    });
    setUserAppointments(userSlots);

  } catch (err) {
    console.log("خطأ أثناء تحميل المواعيد:", err);
    // ❌ لم نعد نعرض toast هنا → فلا يظهر "فشل تحميل المواعيد"
  }
};


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
          date: cursor.toLocaleDateString("ar-EG",{ day:"2-digit", month:"2-digit", year:"numeric" }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return result;
  };

  const days = getWeekDates();
const times = [];
for (let i = 9; i < 17; i++) {
  // وقت البداية
  const start = i < 12 ? `${i}:00 ص` : `${i === 12 ? 12 : i - 12}:00 م`;

  // وقت النهاية
  const endHour = i + 1;
  const end = endHour < 12 ? `${endHour}:00 ص` : `${endHour === 12 ? 12 : endHour - 12}:00 م`;

  // نضيف الوقت بشكل صحيح: البداية - النهاية
  times.push({
    label: `${start} - ${end}`, // ✅ الآن يظهر 9:00 ص - 10:00 ص
    hour: i,
  });
}
  const nextWeek = () => setWeekOffset(prev => prev + 1);
  const prevWeek = () => { if(weekOffset>0) setWeekOffset(prev => prev-1); };

const handleSelect = (day, time) => {
  const slot = { day, time: time.label };

  // إذا نفس الموعد المؤقت، فتح مودال الحذف
  if(tempSelectedSlot && tempSelectedSlot.day === slot.day && tempSelectedSlot.time === slot.time){
    setShowTempDeleteModal(true);
    return;
  }

  setTempSelectedSlot(slot);
  setSelectedSlot(slot);


  // ✅ تمرير تلقائي للزر بعد التأكد أنه موجود
setTimeout(() => {
  if (bookButtonRef.current) {
    bookButtonRef.current.scrollIntoView({ 
      behavior: "smooth", 
      block: "center" 
    });
  }
}, 300); // زيادة الوقت عشان الصفحة تجهز على الجوال

  // عرض مودال التأكيد لأي حالة تعديل
  if(editMode || fromViewEdit || editTarget){
    setPendingChange(slot);
    setShowConfirmModal(true);
  }
};



  const confirmDeleteTemp = () => {
    setTempSelectedSlot(null);
    setSelectedSlot(null);
    setShowTempDeleteModal(false);
  };

const handleBookClick = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) {
    toast.error("للحجز، يرجى تسجيل الدخول");
    localStorage.setItem("redirectAfterLogin", "/appointment");
    navigate("/signin");
    return;
  }


  // لو السكرتير ضغط على زر "إضافة موعد" => treat as patient
  if (asPatient) {
    if (!selectedSlot) {
      toast.error("الرجاء تحديد الوقت أولاً");
      return;
    }
    navigate("/formappointment", { state: { selectedSlot } });
    return;
  }


 // ✅ استرجاع ID الطفل من localStorage
   /* const childId = localStorage.getItem("selectedChildId");

   const email = localStorage.getItem("selectedEmail");
navigate("/formappointment", {
  state: { selectedSlot, childId, email },
});*/

    
  if (isSecretary) {
    navigate("/viewappointments");
    return;
  }

  // حالة المريض العادي
if (!isSecretary && !asPatient) {
  if (!selectedSlot) {
    toast.error("الرجاء تحديد الوقت أولاً");
    return; // لا ينقل لصفحة الفورم
  }
// فقط إذا اختار موعد
    const childId = localStorage.getItem("selectedChildId");
    const email = localStorage.getItem("selectedEmail");
    navigate("/formappointment", { state: { selectedSlot, childId, email } });
    return;
}

// حالة السكرتير
if (isSecretary) {
  navigate("/viewappointments");
  return;
}

};




  const handleDelete = async (appointmentId) => {
    const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user"))?.token;
    try {
      const res = await axios.post("https://sewarwellnessclinic1.runasp.net/api/Child/delete-appointment", {
        appointmentId,
        confirmDelete:true
      }, { headers:{ Authorization:`Bearer ${token}` }});
      toast.success(res.data.message || "تم حذف الموعد بنجاح");
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchAppointments();
    } catch {
      toast.error("فشل حذف الموعد");
    }
  };

 const confirmUpdate = async () => {
  if(!editTarget || !pendingChange) return; // <-- هنا المشكلة
  const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user"))?.token;
  try {
    const res = await axios.post("https://sewarwellnessclinic1.runasp.net/api/Child/update-appointment", {
      oldAppointmentId: editTarget.appointmentId,
      newDay: pendingChange.day,
      newTime: pendingChange.time,
      confirmChange:true
    }, { headers:{ Authorization:`Bearer ${token}` }});
    toast.success(res.data.message || "تم تعديل الموعد بنجاح");
    setEditTarget(null);
    setPendingChange(null);
    setShowConfirmModal(false);
    fetchAppointments();
  } catch {
    toast.error("فشل تعديل الموعد");
  }
};

  const now = new Date();






  return (
    <div dir="rtl" className="container py-4" style={{ margin:"150px auto", minHeight:"100%", fontFamily:"Tahoma", backgroundColor:"#e6f9f8" }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button onClick={prevWeek} className="btn btn-outline-info rounded-circle" disabled={weekOffset===0} style={{ borderColor:"#00b7b3", color:"#00b7b3", opacity: weekOffset===0?0.4:1 }}><ChevronRight/></button>
        <h5 className="fw-bold" style={{ color:"#2a7371" }}>مواعيد الأسبوع</h5>
        <button onClick={nextWeek} className="btn btn-outline-info rounded-circle" style={{ borderColor:"#00b7b3", color:"#00b7b3" }}><ChevronLeft/></button>
      </div>

      <div className="row g-3 text-center">
        {days.map((day, idx) => (
          <div key={day.date+idx} className="col-6 col-md-2">
            <div className="p-2 rounded shadow-sm" style={{ backgroundColor:"#2a7371", color:"beige" }}>
              <h6 className="mb-0 fw-bold">{day.name}</h6>
              <small className="d-block mb-2">{day.date}</small>

              {times.map((time, i) => {
                const slotDate = new Date(day.dateObj);
                slotDate.setHours(time.hour, 0, 0, 0);
                const isPast = slotDate < now;

                const userBooked = userAppointments.find(a => a.day === day.date && a.time === time.label);
                const isBooked = allAppointments.some(a => a.day === day.date && a.time === time.label);

                let bgColor = "#f5f5f5";
                let color = "#333";
                if (isPast) { bgColor = "#ddd"; color = "#888"; }
                else if (userBooked) { bgColor = "#ff6b6b"; color = "white"; }
                else if (isBooked) { bgColor = "#ccc"; color = "#555"; }
                else if (tempSelectedSlot?.day === day.date && tempSelectedSlot?.time === time.label) { bgColor = "#f7c8e0"; color = "#2a7371"; }

               if (userBooked) {
  const isPastUserBooked = new Date(day.dateObj);
  isPastUserBooked.setHours(time.hour, 0, 0, 0);
  const isPast = isPastUserBooked < now;

  let bgColor = isPast ? "#ddd" : "#ff6b6b"; // رمادي إذا الماضي، أحمر إذا لا
  let color = isPast ? "#888" : "white";

  return (
    <div
      key={i}
      className="border rounded mb-2 small"
      style={{
        backgroundColor: bgColor,
        color,
        cursor: isPast ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        height: "30px",
        fontSize: "12px",
        padding: "0 5px",
      }}
      onClick={() => { if(isPast) return; handleSelect(day.date, time); }}
    >
      <span style={{ flexGrow: 1 }}>{time.label}</span>
      {!isPast && (
        <div style={{ display:"flex", gap:"3px", alignItems:"center" }}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setDeleteTarget(userBooked); setShowDeleteModal(true); }}
            style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding:0 }}
            title="حذف الموعد"
          >
            <Trash2 size={14} />
          </button>
          <button
            type="button"
            onClick={(e) => { 
              e.stopPropagation(); 
              setEditTarget(userBooked); 
toast("⚠️ اختر الموعد الجديد من الجدول ", {
  duration: 8000, // أطول مدة ليراه المستخدم
  style: {
    background: '#ffcccc', // لون أحمر فاتح لشد الانتباه
    color: '#900000',       // نص أحمر داكن
    fontWeight: '900',      // خط ثقيل جدًا
    fontSize: '22px',       // أكبر حجم للخط
    padding: '20px 30px',   // مساحة أكبر
    textAlign: 'center',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0,0,0,0.4)', // ظل لزيادة البروز
  },
});            }}
            style={{ background: "transparent", border: "none", color: "white", cursor: "pointer", padding:0 }}
            title="تعديل الموعد"
          >
            <Edit size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
                return (
                  <div
                    key={i}
                    className="border rounded py-1 mb-2 small d-flex justify-content-center align-items-center gap-1"
                    style={{
                      backgroundColor: bgColor,
                      color,
                      cursor: isPast || isBooked ? "not-allowed" : "pointer",
                    }}
                    onClick={() => { if(isPast || isBooked) return; handleSelect(day.date, time); }}
                    title={isPast || isBooked ? "لا يمكنك حجز هذا الموعد":""}
                  >
                    {tempSelectedSlot?.day === day.date && tempSelectedSlot?.time === time.label && <Check size={14} color="#2a7371" strokeWidth={3} />}
                    {time.label}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

   <div className="text-center mt-4 d-flex justify-content-center gap-3">
  {/* زر عرض جميع المواعيد / احجز موعدك */}
  <button
    ref={bookButtonRef}  // <-- هذا المرجع

    onClick={handleBookClick}
    className="btn px-4 py-2 fw-bold"
    style={{ backgroundColor:"#2a7371", color:"beige", border:"none" }}
      title="لتثبيت حجزك اضغط هنا" // <-- يظهر عند تمرير الماوس

  >
    {showBookButton ? "احجز موعدك" : "عرض جميع المواعيد"}
  </button>


</div>
      {/* مودال تعديل الموعد */}
     {showConfirmModal && pendingChange && (
  <div style={{ position:"fixed", top:0,left:0,width:"100%",height:"100%", backgroundColor:"rgba(0,0,0,0.6)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:9999 }}>
    <div style={{ background:"white", borderRadius:"15px", padding:"40px", textAlign:"center", width:"400px", boxShadow:"0 0 20px rgba(0,0,0,0.4)" }}>
      <div style={{ fontSize:"40px", color:"#ff4d4f", marginBottom:"15px" }}>⚠️</div>
      <h4 style={{ marginBottom:"20px", color:"#d9363e", fontWeight:"bold" }}>تعديل الموعد!</h4>
      <p style={{ fontSize:"16px", color:"#555" }}>
        أنت على وشك نقل الموعد إلى:<br/>
        <strong style={{ color:"#2a7371", fontSize:"16px" }}>{pendingChange.day} - {pendingChange.time}</strong>
      </p>
      <div className="d-flex justify-content-center gap-3 mt-4">
        <button 
          onClick={confirmUpdate} 
          className="btn" 
          style={{ backgroundColor:"#2a7371", color:"beige", border:"none", padding:"10px 25px", fontWeight:"bold", fontSize:"16px", borderRadius:"8px" }}
        >
          نعم
        </button>
        <button 
          onClick={()=>{ setShowConfirmModal(false); setEditTarget(null); setPendingChange(null); }} 
          className="btn btn-secondary" 
          style={{ backgroundColor:"#ccc", color:"#333", padding:"10px 25px", fontWeight:"bold", fontSize:"16px", borderRadius:"8px" }}
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
)}

      {/* مودال حذف الموعد المؤقت */}
      {showTempDeleteModal && tempSelectedSlot && (
        <div style={{ position:"fixed", top:0,left:0,width:"100%",height:"100%", backgroundColor:"rgba(0,0,0,0.4)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:9999 }}>
          <div style={{ background:"white", borderRadius:"12px", padding:"25px", textAlign:"center", width:"300px" }}>
            <h6 style={{ marginBottom:"15px", color:"#2a7371" }}>هل تريد إزالة هذا الموعد؟</h6>
            <p style={{ fontSize:"14px", color:"#555" }}>سيتم حذف الموعد المؤقت:<br/><strong style={{ color:"#2a7371" }}>{tempSelectedSlot.day} - {tempSelectedSlot.time}</strong></p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button onClick={confirmDeleteTemp} className="btn" style={{ backgroundColor:"#2a7371", color:"beige", border:"none", padding:"5px 15px" }}>نعم</button>
              <button onClick={()=>setShowTempDeleteModal(false)} className="btn btn-secondary" style={{ backgroundColor:"#ccc", color:"#333", padding:"5px 15px" }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* مودال حذف المواعيد الحقيقية */}
      {showDeleteModal && deleteTarget && (
        <div style={{ position:"fixed", top:0,left:0,width:"100%",height:"100%", backgroundColor:"rgba(0,0,0,0.4)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:9999 }}>
          <div style={{ background:"white", borderRadius:"12px", padding:"25px", textAlign:"center", width:"300px" }}>
            <h6 style={{ marginBottom:"15px", color:"#2a7371" }}>هل أنت متأكد من حذف الموعد؟</h6>
            <p style={{ fontSize:"14px", color:"#555" }}>سيتم حذف الموعد:<br/><strong style={{ color:"#2a7371" }}>{deleteTarget.day} - {deleteTarget.time}</strong></p>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <button onClick={()=>handleDelete(deleteTarget.appointmentId)} className="btn" style={{ backgroundColor:"#2a7371", color:"beige", border:"none", padding:"5px 15px" }}>نعم</button>
              <button onClick={()=>{ setShowDeleteModal(false); setDeleteTarget(null); }} className="btn btn-secondary" style={{ backgroundColor:"#ccc", color:"#333", padding:"5px 15px" }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Appointment;