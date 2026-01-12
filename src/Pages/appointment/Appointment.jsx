import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Check, Trash2, Edit } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";



const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999,
};

const modalBox = {
  background: "white",
  borderRadius: "12px",
  padding: "30px",
  width: "320px",
  textAlign: "center",
};

const confirmBtn = {
  backgroundColor: "#2a7371",
  color: "beige",
  border: "none",
};
function Appointment() {

  const location = useLocation();
  const fromViewEdit = location.state?.fromViewEdit || false;
const bookButtonRef = useRef(null);

  const asPatient = location.state?.asPatient || false; // هنا تأكدنا إذا ما وصل أي state يكون false
const editMode = location.state?.editMode || false;

  console.log(asPatient); // true إذا ضغط السكرتير على "إضافة موعد"

 // 🟢 هذا الجزء الجديد: Scroll لفوق عند الدخول
useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // لو بدك بدون حركة احذفها
  });
}, []);


useEffect(() => {
  const savedData = localStorage.getItem("cancelCheckResult");
  if (savedData) {
    const data = JSON.parse(savedData);
    if (data && Object.keys(data).length > 0) {
      setCancelCheckResult(data); // خزّن البيانات لاستخدامها لاحقًا
    }
  }
}, []);


const [restoreSlot, setRestoreSlot] = useState(null);


useEffect(() => {
  // ✅ تحقق من وجود restoreSlot أولاً
  if (editMode && fromViewEdit && restoreSlot !== null) {
    const appointmentId = restoreSlot.appointmentId;
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
}, [editMode, fromViewEdit, restoreSlot]);


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
const [cancelMode, setCancelMode] = useState(false); 
const [cancelCheckResult, setCancelCheckResult] = useState(null);
const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
const [showPatientModal, setShowPatientModal] = useState(false);
const [editCompleted, setEditCompleted] = useState(false);
const [showRestoreModal, setShowRestoreModal] = useState(false);
const user = JSON.parse(localStorage.getItem("user"));
console.log(JSON.parse(localStorage.getItem("user")));
const isSecretary = user?.userType === "scheduler_admin"; // تحقق إذا المستخدم سكرتير
const showBookButton = isSecretary ? asPatient : true;
const userType = user?.userType?.toLowerCase(); // doctor / patient / doctor_admin
const isDoctor = userType === "doctor" || userType === "doctor_admin";
const isCancelMode =
  (isDoctor) ||
  (isSecretary && !showBookButton);
const disableTableClick =
  editCompleted || (isCancelMode && !editMode);

  const DISPLAY_COUNT = 6; // السبت - الخميس

  useEffect(() => {
    fetchAppointments();
  }, []);



useEffect(() => {
  // ✅ شغّل السكروول عند أي حالة دخول من صفحة المواعيد
  if (editMode && fromViewEdit || asPatient) {
    // رفع الصفحة للأعلى
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}, [editMode, fromViewEdit, asPatient]);




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
  if (!cancelMode && disableTableClick) return;

  const slot = { day, time: time.label };

  if (cancelMode) {
    // ❌ لا نرسل للباك بعد، فقط نحدد الموعد
    setSelectedSlot(slot);
    setShowCancelConfirmModal(true); // عرض مودال التأكيد
    return; // خروج
  }

  // إذا نفس الموعد المؤقت، فتح مودال الحذف
  if (tempSelectedSlot && tempSelectedSlot.day === slot.day && tempSelectedSlot.time === slot.time) {
    setShowTempDeleteModal(true);
    return;
  }

  setTempSelectedSlot(slot);
  setSelectedSlot(slot);

  // تمرير تلقائي للزر بعد التأكد أنه موجود
  setTimeout(() => {
    if (bookButtonRef.current) {
      bookButtonRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, 300);

  // عرض مودال التأكيد لأي حالة تعديل
  if (editMode || fromViewEdit || editTarget){
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

const handleCancelClick = () => {
  setCancelMode(true);
  setSelectedSlot(null);
  setTempSelectedSlot(null);

  toast("لإلغاء موعد من قبل الأخصائية، يرجى اختيار موعد من الجدول", {
    duration: 6000,
    style: {
      background: "#fff3cd",
      color: "#856404",
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "center",
    },
  });
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
  if (!editTarget || !pendingChange) return;
  const token = localStorage.getItem("token") || JSON.parse(localStorage.getItem("user"))?.token;

  try {
    const res = await axios.post(
      "https://sewarwellnessclinic1.runasp.net/api/Child/update-appointment",
      {
        oldAppointmentId: editTarget.appointmentId,
        newDay: pendingChange.day,
        newTime: pendingChange.time,
        confirmChange: true
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("تم تعديل الموعد بنجاح");

    // تنظيف المتغيرات
    setEditTarget(null);
    setPendingChange(null);
    setShowConfirmModal(false);

    if (isSecretary) {
      // السكرتير يروح للصفحة ViewAppointments
      navigate("/viewappointments", { state: { highlightAppointmentId: res.data.updatedAppointmentId || editTarget.appointmentId } });
    } else {
      // المريض يبقى في نفس الصفحة ويحدث الجدول مباشرة
      setAllAppointments(prev => {
        return prev.map(app =>
          app.id === editTarget.appointmentId
            ? { ...app, day: pendingChange.day, time: pendingChange.time }
            : app
        );
      });

      setUserAppointments(prev => {
        return prev.map(app =>
          app.appointmentId === editTarget.appointmentId
            ? { ...app, day: pendingChange.day, time: pendingChange.time }
            : app
        );
      });
    }

  } catch {
    toast.error("فشل تعديل الموعد");
  }
};



  const now = new Date();





useEffect(() => {
  if (editMode && fromViewEdit) {
    const appointmentId = localStorage.getItem("selectedAppointmentId");
    const childId = localStorage.getItem("selectedChildId");

    if (!appointmentId || !childId) {
      toast.error("لم يتم العثور على بيانات الموعد القديم");
      return;
    }

    // 👇 خزّني الموعد القديم
    setEditTarget({
      appointmentId: appointmentId,
      childId: childId,
    });
  }
}, [editMode, fromViewEdit]);




const fixPhoneNumber = (phone) => {
  if (!phone) return "";

  // إذا الزائد موجودة بالآخر
  if (phone.endsWith("+")) {
    return "+" + phone.slice(0, -1);
  }

  // إذا ما في +
  if (!phone.startsWith("+")) {
    return "+" + phone;
  }

  return phone;
};


const handleRestoreAppointment = async () => {
  try {
   const token = localStorage.getItem("token");

// 1️⃣ اقرأ كل المواعيد الملغية
const canceledAppointments =
  JSON.parse(localStorage.getItem("canceledAppointments")) || {};

// 2️⃣ هات بيانات الموعد اللي بدنا نرجعه
const storedResetResponse =
  canceledAppointments[restoreSlot.appointmentId];

// 3️⃣ حماية
if (!storedResetResponse) {
  toast.error("بيانات الموعد غير موجودة");
  return;
}



const params = {
  parentId: storedResetResponse?.data?.applicationUserId?.toString() || "1",
  childId: storedResetResponse?.data?.childId || 1,
  visitTypee: storedResetResponse?.data?.visitTypee?.toString() || "1",
  day: storedResetResponse?.data?.date || "1",
  time: storedResetResponse?.data?.timee?.toString() || "1",
  placee: storedResetResponse?.data?.placee || 0,
  address: storedResetResponse?.data?.address?.toString() || "1",
  dateTime: storedResetResponse?.data?.dateTime,
  timeSpan: storedResetResponse?.data?.timeSlott?.toString() || "1",
  isbooked: storedResetResponse?.data?.isbookes ?? true,
  appointmentid: restoreSlot.appointmentId,
  exsist: storedResetResponse?.exists ?? false
};

    console.log("🔹 البيانات المرسلة للباك:", params);

    await axios.post(
      "https://sewarwellnessclinic1.runasp.net/api/Child/restore-appointment",
      null,
      {
        params,
        headers: { Authorization: `Bearer ${token}` },
      }
    );
delete canceledAppointments[restoreSlot.appointmentId];

localStorage.setItem(
  "canceledAppointments",
  JSON.stringify(canceledAppointments)
);

    toast.success("تمت إزالة إلغاء الحجز بنجاح ✅");
    setShowRestoreModal(false);
    setRestoreSlot(null);
    setCancelMode(false);
    fetchAppointments();
  } catch (err) {
    console.error("❌ خطأ أثناء restore:", err);
    toast.error("فشل إعادة الموعد");
  }
};

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
const canceledAppointment = allAppointments.find(
  a =>
    a.day === day.date &&
    a.time === time.label &&
    a.iscanceled === true
);
                let bgColor = "#f5f5f5";
                let color = "#333";
             if (isPast) {
  bgColor = "#ddd";
  color = "#888";
}
else if (userBooked) {
  bgColor = "#ff6b6b";
  color = "white";
}
else if (canceledAppointment) {
  bgColor = "#bdbdbd";   // رمادي غامق
  color = "#444";
}
else if (isBooked) {
  bgColor = "#ccc";
  color = "#555";
}
else if (
  tempSelectedSlot?.day === day.date &&
  tempSelectedSlot?.time === time.label
) {
  bgColor = "#f7c8e0";
  color = "#2a7371";
}
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
cursor: isPast || (isBooked && !cancelMode) ? "not-allowed" : "pointer",                    }}
onClick={() => {
  if (isPast) return;

// 🔴 موعد ملغي (رمادي) → إزالة الإلغاء
// 🔵 موعد ملغى مسبقاً → إزالة الإلغاء
if (canceledAppointment && cancelMode) {
  setRestoreSlot({
    day: day.date,
    time: time.label,
    appointmentId: canceledAppointment.id
  });
  setShowRestoreModal(true);
  return;
}

  // 🔥 اسمحي بالضغط إذا كنا بوضع الإلغاء
  if (isBooked && !cancelMode) return;

  handleSelect(day.date, time);
}}                    title={isPast || isBooked ? "لا يمكنك حجز هذا الموعد":""}
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

  {/* الزر الأساسي */}
  <button
  ref={bookButtonRef}
  onClick={isDoctor ? handleCancelClick : handleBookClick}
  className="btn px-4 py-2 fw-bold"
  style={{ backgroundColor:"#2a7371", color:"beige", border:"none" }}
>
  {isDoctor
    ? "إلغاء موعد من قبل الأخصائية"
    : showBookButton
      ? "احجز موعدك"
      : "عرض جميع المواعيد"}
</button>

  {/* 🔴 زر إلغاء موعد من قبل الأخصائية — للسكرتير فقط */}
  {isSecretary && !showBookButton && (
    <button
      onClick={handleCancelClick}
      className="btn px-4 py-2 fw-bold"
      style={{ backgroundColor:"#2a7371", color:"beige", border:"none" }}
    >
      إلغاء موعد من قبل الأخصائية
    </button>
  )}

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
          onClick={()=>{ setShowConfirmModal(false);  setPendingChange(null); }} 
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



{showCancelConfirmModal && selectedSlot && (
  <div style={modalOverlay}>
    <div
      style={{
        background: "white",
        borderRadius: "18px",
        padding: "35px 30px",
        width: "360px",
        textAlign: "center",
        boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
      }}
    >
      {/* أيقونة */}
      <div
        style={{
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "#fff3cd",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 15px",
          fontSize: "32px",
        }}
      >
        ⚠️
      </div>

      {/* العنوان */}
      <h5 style={{ color: "#2a7371", fontWeight: "bold", marginBottom: "10px" }}>
        إلغاء موعد من قبل الأخصائية
      </h5>

      {/* الوصف */}
      <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7" }}>
        هل أنتِ متأكدة من رغبتك في إلغاء الموعد التالي؟
      </p>

      {/* تفاصيل الموعد */}
      <div
        style={{
          background: "#f1fafa",
          borderRadius: "10px",
          padding: "10px",
          margin: "15px 0",
          fontWeight: "bold",
          color: "#2a7371",
        }}
      >
        {selectedSlot.day} <br /> {selectedSlot.time}
      </div>

      {/* الأزرار */}
      <div className="d-flex justify-content-center gap-3 mt-3">
        <button
          className="btn"
          style={{
            backgroundColor: "#2a7371",
            color: "beige",
            border: "none",
            padding: "8px 22px",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
   onClick={() => {
  console.log("🟢 المودال الأول: بدأ الإلغاء", selectedSlot);

  // 1️⃣ اغلق المودال الأول مباشرة
  setShowCancelConfirmModal(false);
  console.log("🟢 المودال الأول: تم إغلاقه");
  const params = {
    day: selectedSlot.day,
    time: selectedSlot.time,
  };
  console.log("📤 البيانات المرسلة لـ create-or-reset-appointment:", params);

  // 2️⃣ أرسل الطلب
  axios.post(
    "https://sewarwellnessclinic1.runasp.net/api/Child/create-or-reset-appointment",
    null,
    {
      params: { day: selectedSlot.day, time: selectedSlot.time },
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }
  )
  .then(res => {
  console.log("🟢 استلمنا الرد من الباك:", res.data);
// 1️⃣ اقرأ المواعيد الملغية المخزنة مسبقًا
const canceledAppointments =
  JSON.parse(localStorage.getItem("canceledAppointments")) || {};

// 2️⃣ خزّن الموعد الحالي باستخدام appointmentId
canceledAppointments[res.data.newAppointmentId] = res.data;

// 3️⃣ احفظ الكل في localStorage
localStorage.setItem(
  "canceledAppointments",
  JSON.stringify(canceledAppointments)
);

// 4️⃣ (اختياري) احتفظ ببيانات المريض للمودال فقط
// خزني في state مباشرة
setCancelCheckResult(res.data.data);

// (اختياري) خزني في localStorage إذا بدك احتفاظ مؤقت
localStorage.setItem(
  "cancelCheckResult",
  JSON.stringify(res.data.data)
);


          // ⬅️ الرد الكامل
if (res.data?.exists) {
  toast.success("تم إلغاء الموعد بنجاح ✅"); // الإشعار قبل فتح المودال
  setTimeout(() => setShowPatientModal(true), 50);
} else {
  setCancelMode(false);
  fetchAppointments();
  toast.success("تم إلغاء الموعد بنجاح ✅"); 
}

})

  .catch(err => {
    console.error("❌ خطأ أثناء الإلغاء:", err);
    toast.error("فشل إلغاء الموعد");
  });
}}




        >
          نعم، إلغاء الموعد
        </button>

        <button
          className="btn btn-light"
          style={{
            padding: "8px 22px",
            fontWeight: "bold",
            borderRadius: "8px",
          }}
          onClick={() => {
            setShowCancelConfirmModal(false);
          }}
        >
          تراجع
        </button>
      </div>
    </div>
  </div>
)}

{showPatientModal && cancelCheckResult && (
  <div style={modalOverlay}>
    <div style={modalBox}>
      <h5>👤 بيانات المريض</h5>
      <p><strong>الاسم:</strong> {cancelCheckResult.fullname}</p>
      <p style={{ margin: 0 }}>
        <strong>رقم الهاتف: </strong>
        <span dir="ltr" style={{ unicodeBidi: "isolate" }}>
          {fixPhoneNumber(cancelCheckResult.phoneNumber)}
        </span>
      </p>
      <a
        href={`https://wa.me/${cancelCheckResult.phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-success mt-3"
      >
        💬 تواصل عبر واتساب
      </a>

      <div className="mt-3">
        <button
          className="btn btn-secondary"
          onClick={() => {
            setShowPatientModal(false);
            setCancelMode(false);
            fetchAppointments();
          }}
        >
          إغلاق
        </button>
      </div>
    </div>
  </div>
)}



{showRestoreModal && restoreSlot && (
  <div style={modalOverlay}>
    <div style={modalBox}>
      <h6 style={{ color:"#2a7371", fontWeight:"bold" }}>
        هل تريد إزالة إلغاء حجز هذا الموعد؟
      </h6>

      <p className="mt-2">
        {restoreSlot.day}<br/>
        {restoreSlot.time}
      </p>

      <div className="d-flex justify-content-center gap-3 mt-3">
        <button
          style={confirmBtn}
          className="btn"
          onClick={handleRestoreAppointment}
        >
          نعم
        </button>

        <button
          className="btn btn-secondary"
          onClick={() => setShowRestoreModal(false)}
        >
          إلغاء
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Appointment;