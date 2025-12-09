                                                      
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, forwardRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Appointment.css";
import React, {  useEffect } from "react";

export default function FormAppointment() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
const [sessionPlace, setSessionPlace] = useState(""); 
const [homeAddress, setHomeAddress] = useState("");
const [checkingId, setCheckingId] = useState(false);

  const selectedSlotFromState = location.state?.selectedSlot || { day: "", time: "" };
const user = JSON.parse(localStorage.getItem("user"));
console.log(JSON.parse(localStorage.getItem("user")));
const email = user?.email;
console.log("email : " , email);
const isSecretary = user?.userType === "scheduler_admin"; // تحقق إذا المستخدم سكرتير
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
  if (uploadedImages.length > 0) {
    localStorage.setItem("uploadedImages", JSON.stringify(uploadedImages.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }))));
  }
}, [uploadedImages]);

  const [formData, setFormData] = useState({
    name: "",
    birthDate: null,
    phone: "",
    category: "",
    countryCode: "",
    job: "",
    medicalStatus: "",
    IDnumber: "",
  });
  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState({});





const [childId, setChildId] = useState();
const [email1, setEmail1] = useState();
const [hasPreviousAppointments, setHasPreviousAppointments] = useState(false);

const parentIdFromStorage = localStorage.getItem("parentId");

const parentId = location.state?.parentId || parentIdFromStorage || null;

console.log("📌 ParentID:", parentId);




// استرجاع formData و answers و sessionPlace و homeAddress و الصور من localStorage
useEffect(() => {
  const storedFormData = localStorage.getItem("formData");
  if (storedFormData) setFormData(JSON.parse(storedFormData));

  const storedAnswers = localStorage.getItem("answers");
  if (storedAnswers) setAnswers(JSON.parse(storedAnswers));

  const storedSessionPlace = localStorage.getItem("sessionPlace");
  if (storedSessionPlace) setSessionPlace(storedSessionPlace);

  const storedHomeAddress = localStorage.getItem("homeAddress");
  if (storedHomeAddress) setHomeAddress(storedHomeAddress);

  const storedUploadedImages = localStorage.getItem("uploadedImages");
  if (storedUploadedImages) {
    // الصور لازم نعمل تحويل من JSON لأبجكت File
    setUploadedImages(JSON.parse(storedUploadedImages));
  }
}, []);


useEffect(() => {
  window.scrollTo(0, 0); // يضع الصفحة دائمًا في الأعلى عند التحميل
}, []);


useEffect(() => {
  const id = localStorage.getItem("selectedChildId");
  if (id) setChildId(parseInt(id, 10));

  const storedEmail = localStorage.getItem("selectedEmail"); // أو استخدم البريد إذا خزنته عند اختيار المستخدم
  if (storedEmail) setEmail1(storedEmail);
}, []);




useEffect(() => {
  const storedIdNumber = localStorage.getItem("selectedIDNumber");
  console.log("📦 storedIdNumber:", storedIdNumber);
  if (!storedIdNumber) return;

  const token = getTokenFromStorage();
  console.log("🔑 token:", token);
  if (!token) return;

  axios
    .get(
      `https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/get-patient-data-by-idnumber/${storedIdNumber}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      console.log("✅ Response received:", res);
      const data = res.data;
      console.log("📄 Data from API:", data);

      // 👇 نتحقق من وجود موعد مسبق
      if (data && data.childId) {
        console.log("🎯 الحالة: عنده موعد مسبق ✅");
        let countryCode = "";
        let phone = "";

        if (data.phoneNumber) {
          const match = data.phoneNumber.match(/^(\+\d{2,3})(\d+)$/);
          if (match) {
            countryCode = match[1];
            phone = match[2];
          }
        }

        console.log("📋 تعبئة الفورم بالقيم التالية:", {
          name: data.fullname,
          birthDate: data.birthDate,
          phone,
          category: data.gender,
          countryCode,
          job: data.occupation,
          IDnumber: data.idNumber,
        });

        setFormData({
          name: data.fullname || "",
          birthDate: data.birthDate
            ? data.birthDate.split("T")[0]
            : null,
          phone: phone,
          category: data.gender === "kid" ? "أطفال" : "نساء",
          countryCode: countryCode || "",
          job: data.occupation || "",
          IDnumber: data.idNumber || "",
        });

        // 🧹 نحذف المفتاح بعد الاستخدام الناجح
        localStorage.removeItem("selectedIDNumber");
        console.log("🧹 تم حذف selectedIDNumber من localStorage بعد الاستخدام ✅");
      } else {
        console.log("🚫 الحالة: لا يوجد موعد مسبق (الفورم يظل فاضي).");
      }
    })
    .catch((err) => {
      console.error("❌ خطأ عند جلب بيانات المريض:", err);
    });
}, []);



useEffect(() => {
  if (!formData.IDnumber) return; // ما في رقم هوية → لا تستدعي API

  const token = getTokenFromStorage();
  if (!token) return;

  axios.get(
    `https://sewarwellnessclinic1.runasp.net/api/validation/ChildHasAppointments`,
    {
      params: { idnumber: formData.IDnumber },
      headers: { Authorization: `Bearer ${token}` }
    }
  )
  .then((res) => {
    console.log("✅ الرد من API ChildHasAppointments:", res.data);
    setHasPreviousAppointments(res.data.hasAppointments);
  })
  .catch((err) => {
    console.error("❌ خطأ عند جلب ChildHasAppointments:", err);
    setHasPreviousAppointments(false);
  });
}, [formData.IDnumber]);


const handleEditLocation = (visiteId, currentLocation) => {
  const newLocation = prompt("عدل مكان الزيارة:", currentLocation);
  if (newLocation !== null) {
    // هنا ممكن تعمل استدعاء API لتحديث المكان في السيرفر
    console.log("تحديث المكان للزيارة", visiteId, "إلى:", newLocation);
    
    // لتحديث الواجهة فورياً بدون إعادة تحميل
    setVisites(prev =>
      prev.map(v =>
        v.visiteId === visiteId ? { ...v, appointmentLocation: newLocation } : v
      )
    );
  }
};

  const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        style={{
          width: "100%",
          padding: "10px 40px 10px 12px",
          border: "2px solid #2a7371",
          borderRadius: "7px",
          color: "#2a7371",
          direction: "rtl",
          textAlign: "right",
          background: "white",
        }}
      />
      <Calendar
        size={20}
        color="#2a7371"
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
        }}
      />
    </div>
  ));

 const handleChange = (e) => {
  const { name, value } = e.target;

  // Regex لكشف الأرقام العربية (٠١٢٣٤٥٦٧٨٩)
  const arabicNumberRegex = /[\u0660-\u0669]/;

  if (step === 1) {
    setFormData({ ...formData, [name]: value });
    // بعد كل setFormData
localStorage.setItem("formData", JSON.stringify({
  ...formData,
  [name]: value
}));


    let errorMsg = "";

    // 🔹 تحقق من الاسم: حروف فقط
    if (name === "name" && !/^[\u0621-\u064Aa-zA-Z\s]+$/.test(value.trim())) {
      errorMsg = "يجب أن يحتوي الاسم على حروف فقط";
    }

   // 🔹 تحقق من رقم الهوية
// 🔹 تحقق من رقم الهوية
if (name === "IDnumber") {
  let errorMsg = "";

  // التحقق من الأرقام العربية
  if (arabicNumberRegex.test(value)) {
    errorMsg = "يرجى إدخال رقم الهوية بالأرقام الإنجليزية فقط (0-9)";
  } 
  // التحقق من أن كل الأحرف أرقام
  else if (value && !/^\d+$/.test(value)) {
    errorMsg = "يرجى إدخال أرقام فقط";
  } 
  // التحقق من طول رقم الهوية
  else if (value.length !== 9) {
    errorMsg = "رقم الهوية يجب أن يكون 9 أرقام";
  }

  // تحديث الأخطاء
  setErrors((prev) => ({ ...prev, IDnumber: errorMsg }));

  // إذا في خطأ → لا تفحص API
  if (errorMsg) return;

  // فحص API فقط إذا الرقم صحيح 9 digits
  if (value.length === 9) {
    const token = getTokenFromStorage();
    if (!token) return;

    setCheckingId(true);

    axios.get(
      `https://sewarwellnessclinic1.runasp.net/api/validation/CheckChildIdNumber`,
      {
        params: {
          idnumber: value,
          currentPatientId: parentId || "00000000-0000-0000-0000-000000000000",
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    )
    .then((res) => {
      if (res.data.existsForOtherPatient && !isSecretary) {
        setErrors((prev) => ({
          ...prev,
          IDnumber: `رقم الهوية مستخدم مسبقاً في حساب المستخدم: ${res.data.parentName}`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, IDnumber: "" }));
      }
    })
    .catch(() => {})
    .finally(() => setCheckingId(false));
  }

  return; // ⛔ مهم جداً حتى لا ينزل للأسفل ويلخبط errors
}




    // 🔹 تحقق من رقم الهاتف
   // 🔹 تحقق من رقم الهاتف
if (name === "phone") {
  if (arabicNumberRegex.test(value)) {
    errorMsg = "يرجى إدخال رقم الهاتف بالأرقام الإنجليزية فقط (0-9)";
  } else if (value && !/^\d+$/.test(value)) {
    errorMsg = "يرجى إدخال أرقام فقط";
  } else if (value.length < 7 || value.length > 10) {
    errorMsg = "رقم الهاتف يجب أن يكون بين 7 و 10 أرقام";
  }
}


    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  } else {
    setAnswers({ ...answers, [name]: value });
localStorage.setItem("answers", JSON.stringify({ ...answers, [name]: value }));

  }
};


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "يجب إدخال الاسم";
    if (!formData.IDnumber) newErrors.IDnumber = "يجب إدخال رقم الهوية";


    if (!formData.birthDate) newErrors.birthDate = "يجب إدخال تاريخ الميلاد";
    if (!formData.phone) newErrors.phone = "يجب إدخال رقم الهاتف";
    if (!formData.category) newErrors.category = "يجب اختيار الفئة";
    if ((formData.category === "نساء" || formData.category === "أطفال") && !formData.medicalStatus)
      newErrors.medicalStatus = "اختر الحالة المرضية";
   // ✅ الفاليديشن الصحيح للمكان
  if (!sessionPlace.trim()) newErrors.sessionPlace = "يرجى اختيار المكان";

  // ✅ الفاليديشن الصحيح للعنوان
  if (sessionPlace === "home" && !homeAddress.trim())
    newErrors.homeAddress = "يرجى إدخال عنوان المنزل";
     

// ✅ فقط للمريض: منع المتابعة إذا رقم الهوية مستخدم مسبقاً
  if (!isSecretary && errors.IDnumber?.includes("مستخدم مسبقاً")) {
    newErrors.IDnumber = errors.IDnumber;
  }


    return newErrors;
  };

  const getTokenFromStorage = () => {
    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const parsed = JSON.parse(rawUser);
        return parsed?.token || null;
      }
    } catch (err) {
      console.warn("Failed to parse user from localStorage", err);
    }
    return null;
  };


















  const handleSubmit1 = async (e) => {
    e.preventDefault();

   if (step === 1) {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // ✅ في حالة "مراجعة" نرسل الطلب مباشرة للباك
  if (isSecretary) {
    if (!selectedSlotFromState.day || !selectedSlotFromState.time) {
      toast.error("الرجاء اختيار موعد أولاً من صفحة المواعيد.");
      return;
    }

    const token = getTokenFromStorage();
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً لإتمام العملية.");
      return;
    }


    const payload = {
      fullname: formData.name,
      gender: formData.category === "نساء" ? "1" : "0",
      phoneNumber: `${formData.countryCode}${formData.phone}`,
      occupation: formData.job || "غير محدد",
      birthDate: formData.birthDate
        ? new Date(formData.birthDate).toISOString()
        : null,
      idNumber: formData.IDnumber,
      day: selectedSlotFromState.day,
      time: selectedSlotFromState.time,
        VisitTypee: formData.medicalStatus === "جديدة" ? "1" : "0",
childId:childId,
    };
    console.log("=== payload قبل الإرسال (handleSubmit1) ===");
console.log(payload);

    toast.loading("جاري تثبيت الموعد...");

Object.entries(payload).forEach(([key, value]) => {
  console.log(`${key}:`, value);
});

console.log("=== بيانات السكرتير قبل الإرسال ===");
console.log("childId:", childId);
console.log("selectedSlotFromState:", selectedSlotFromState);
console.log("payload:", {
  fullname: formData.name,
  gender: formData.category === "نساء" ? "1" : "0",
  phoneNumber: `${formData.countryCode}${formData.phone}`,
  occupation: formData.job || "غير محدد",
  birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
  idNumber: formData.IDnumber,
  day: selectedSlotFromState.day,
  time: selectedSlotFromState.time,
  VisitTypee: formData.medicalStatus === "جديدة" ? "1" : "0",
  childId: childId,
});



    try {
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/create-appointment-existing-child",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      console.log("✅ استجابة الباك:", res.data);
      toast.success("تم تثبيت موعد المراجعة بنجاح ✅", { duration: 3000 });
// ⬅️ هنا نضيف مسح البيانات من localStorage
  localStorage.removeItem("formData");
  localStorage.removeItem("answers");
  localStorage.removeItem("sessionPlace");
  localStorage.removeItem("homeAddress");
  localStorage.removeItem("uploadedImages");

      setFormData({
        name: "",
        birthDate: null,
        phone: "",
        category: "",
        countryCode: "",
        job: "",
        medicalStatus: "",
        IDnumber: "",
       
      });

      navigate("/viewappointments");
    } catch (err) {
      toast.dismiss();
      console.error("❌ خطأ أثناء الإرسال:", err.response?.data || err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        "حدث خطأ أثناء تثبيت الموعد.";
      toast.error(message);
    }

    return; // ⛔ نوقف هنا لأننا ما بننتقل للخطوة الثانية
  }

}
  };













  const handleSubmit2 = async (e) => {
    e.preventDefault();

   if (step === 1) {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // ✅ في حالة "مراجعة" نرسل الطلب مباشرة للباك
  if (isSecretary) {
    if (!selectedSlotFromState.day || !selectedSlotFromState.time) {
      toast.error("الرجاء اختيار موعد أولاً من صفحة المواعيد.");
      return;
    }

    const token = getTokenFromStorage();
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً لإتمام العملية.");
      return;
    }


    const payload = {
      fullname: formData.name,
      gender: formData.category === "نساء" ? "1" : "0",
      phoneNumber: `${formData.countryCode}${formData.phone}`,
      occupation: formData.job || "غير محدد",
      birthDate: formData.birthDate
        ? new Date(formData.birthDate).toISOString()
        : null,
      idNumber: formData.IDnumber,
      day: selectedSlotFromState.day,
      time: selectedSlotFromState.time,
        VisitTypee: formData.medicalStatus === "جديدة" ? "1" : "0",
email:email1,
    };
    console.log("=== payload قبل الإرسال (handleSubmit1) ===");
console.log(payload);

    toast.loading("جاري تثبيت الموعد...");


console.log("=== بيانات السكرتير قبل الإرسال ===");
console.log("childId:", childId);
console.log("selectedSlotFromState:", selectedSlotFromState);
console.log("payload:", {
  fullname: formData.name,
  gender: formData.category === "نساء" ? "1" : "0",
  phoneNumber: `${formData.countryCode}${formData.phone}`,
  occupation: formData.job || "غير محدد",
  birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
  idNumber: formData.IDnumber,
  day: selectedSlotFromState.day,
  time: selectedSlotFromState.time,
  VisitTypee: formData.medicalStatus === "جديدة" ? "1" : "0",
  email: email1,
});



    try {
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/create-patient-appointment-by-email",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      console.log("✅ استجابة الباك:", res.data);
      toast.success("تم تثبيت موعد المراجعة بنجاح ✅", { duration: 3000 });
// ⬅️ هنا نضيف مسح البيانات من localStorage
  localStorage.removeItem("formData");
  localStorage.removeItem("answers");
  localStorage.removeItem("sessionPlace");
  localStorage.removeItem("homeAddress");
  localStorage.removeItem("uploadedImages");

      setFormData({
        name: "",
        birthDate: null,
        phone: "",
        category: "",
        countryCode: "",
        job: "",
        medicalStatus: "",
        IDnumber: "",
       
      });

      navigate("/viewappointments");
    } catch (err) {
      toast.dismiss();
      console.error("❌ خطأ أثناء الإرسال:", err.response?.data || err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        "حدث خطأ أثناء تثبيت الموعد.";
      toast.error(message);
    }

    return; // ⛔ نوقف هنا لأننا ما بننتقل للخطوة الثانية
  }

}
  };












  const handleSubmit = async (e) => {
    e.preventDefault();

   if (step === 1) {
  const validationErrors = validate();
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // ✅ في حالة "مراجعة" نرسل الطلب مباشرة للباك
  if (formData.medicalStatus === "مراجعة") {
    if (!selectedSlotFromState.day || !selectedSlotFromState.time) {
      toast.error("الرجاء اختيار موعد أولاً من صفحة المواعيد.");
      return;
    }

    const token = getTokenFromStorage();
    if (!token) {
      toast.error("الرجاء تسجيل الدخول أولاً لإتمام العملية.");
      return;
    }

    const payload = {
      fullname: formData.name,
      gender: formData.category === "نساء" ? 1 : 0,
      phoneNumber: `${formData.countryCode}${formData.phone}`,
      occupation: formData.job || "غير محدد",
      birthDate: formData.birthDate
        ? new Date(formData.birthDate).toISOString()
        : null,
      idNumber: formData.IDnumber,
      day: selectedSlotFromState.day,
      time: selectedSlotFromState.time,
    };

    toast.loading("جاري تثبيت الموعد...");
    try {
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Child/save-basic-info",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.dismiss();
      console.log("✅ استجابة الباك:", res.data);
      toast.success("تم تثبيت موعد المراجعة بنجاح ✅", { duration: 3000 });
// ⬅️ هنا نضيف مسح البيانات من localStorage
  localStorage.removeItem("formData");
  localStorage.removeItem("answers");
  localStorage.removeItem("sessionPlace");
  localStorage.removeItem("homeAddress");
  localStorage.removeItem("uploadedImages");

      setFormData({
        name: "",
        birthDate: null,
        phone: "",
        category: "",
        countryCode: "",
        job: "",
        medicalStatus: "",
        IDnumber: "",
      });

      navigate("/appointment");
    } catch (err) {
      toast.dismiss();
      console.error("❌ خطأ أثناء الإرسال:", err.response?.data || err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        "حدث خطأ أثناء تثبيت الموعد.";
      toast.error(message);
    }

    return; // ⛔ نوقف هنا لأننا ما بننتقل للخطوة الثانية
  }

  // في باقي الحالات (جديدة) نكمل الخطوات العادية
  setStep(2);
  return;
}

    if (step === 2) {
      setStep(3);
      return;
    }

    // 🟢 داخل handleSubmit، استبدل الجزء من بعد if (step === 2) {...} بهذا 👇

if (step === 3) {
  // توزيع الأسئلة حسب المطلوب
  const Diagnose = answers["q2-4"] || ""; // تشخيص الطبيب إن وجد

  const PresentHistory = [
    answers["q2-0"], // ماذا حدث معك؟
    answers["q2-1"], // متى بدأت المشكلة؟
    answers["q2-2"], // كيف بدأت؟
    answers["q2-3"], // هل أخذت علاج أو فحوصات؟
  ]
    .filter(Boolean)
    .join("\n");

  const ChronicDisease = answers["q2-5"] || ""; // الأمراض المزمنة
  const Medication = answers["q2-6"] || ""; // الأدوية المستمرة
  const PreviousSurgeries = answers["q2-7"] || ""; // العمليات السابقة
  const SocialHistory = answers["q2-8"] || ""; // التأثير على الحياة اليومية
  const OtherInvestigationsText = answers["q2-9"] || ""; // الفحوصات والتحاليل (النص فقط)

  const PainAssessment = [
    answers["q3-0"], // طبيعة الألم
    answers["q3-1"], // الشدة من 0 إلى 10
    answers["q3-2"], // مستمر أم متقطع
    answers["q3-3"], // العوامل التي تزيد أو تخفف
    answers["q3-4"], // أعراض مصاحبة
    answers["q3-5"], // انتقال الألم
  ]
    .filter(Boolean)
    .join("\n");

  // 🧾 إنشاء الـ FormData بنفس شكل الباك
  const formPayload = new FormData();
  formPayload.append("Fullname", formData.name);
  formPayload.append("Gender", formData.category === "نساء" ? "1" : "0");
  formPayload.append("PhoneNumber", `${formData.countryCode}${formData.phone}`);
  formPayload.append("Occupation", formData.job || "غير محدد");
  formPayload.append("BirthDate", formData.birthDate ? new Date(formData.birthDate).toISOString() : null);
  formPayload.append("IdNumber", formData.IDnumber);
  formPayload.append("VisitTypee", formData.medicalStatus === "جديدة" ? "1" : "0");
  formPayload.append("Time", selectedSlotFromState.time);
  formPayload.append("Day", selectedSlotFromState.day);
  formPayload.append("placee", sessionPlace === "clinic" ? "0" : "1"); 
formPayload.append("address", sessionPlace === "home" ? homeAddress : "");


  // 🟢 الحقول الطبية حسب المطلوب
  formPayload.append("Diagnose", Diagnose);
  formPayload.append("PresentHistory", PresentHistory);
  formPayload.append("ChronicDisease", ChronicDisease);
  formPayload.append("Medication", Medication);
  formPayload.append("PreviousSurgeries", PreviousSurgeries);
  formPayload.append("SocialHistory", SocialHistory);
  formPayload.append("OtherInvestigationsText", OtherInvestigationsText);
  formPayload.append("PainAssessment", PainAssessment);

  // 🖼️ الملفات
  uploadedImages.forEach((file) => formPayload.append("OtherInvestigationsFiles", file));

  const token = getTokenFromStorage();
  if (!token) {
    toast.error("الرجاء تسجيل الدخول أولاً لإتمام العملية.");
    return;
  }

  toast.loading("جاري إرسال البيانات...");
  try {
    console.log("=== FormData قبل الإرسال ===");
    for (let [key, value] of formPayload.entries()) {
      console.log(key, ":", value);
    }

  const res = await axios.post(
  "https://sewarwellnessclinic1.runasp.net/api/Child/create-patient-appointment-report",
  formPayload,
  { headers: { Authorization: `Bearer ${token}` } }
);

console.log("✅ Res Data:", res.data); // تأكد من وجود muscleToneIds و milestoneIds هنا

const { reportId, muscleToneIds, milestoneIds } = res.data;

navigate("/ReportPreviewKids", {
  state: {
    reportId,
    muscleToneIds,
    milestoneIds,
  },
});


    toast.dismiss();
    toast.success("تم تثبيت موعدك بنجاح ✅", { duration: 3000 });
// ⬅️ هنا نضيف مسح البيانات من localStorage
  localStorage.removeItem("formData");
  localStorage.removeItem("answers");
  localStorage.removeItem("sessionPlace");
  localStorage.removeItem("homeAddress");
  localStorage.removeItem("uploadedImages");

    setAnswers({});
    setUploadedImages([]);
    setStep(1);
    navigate("/appointment");
  } catch (err) {
    toast.dismiss();
    console.error("=== Axios Error Response ===");
    console.error(err.response?.data || err);
    const message =
      err?.response?.data?.message || err?.response?.data?.Message || "حدث خطأ أثناء إرسال البيانات.";
    toast.error(message);
  }
}
  };
const handleFinalSubmit = (e) => {
      e.preventDefault();

  const fromPage = localStorage.getItem("fromPage");

  if (isSecretary) {
    // سكرتير: نختار حسب الصفحة
    if (fromPage === "viewAppointments") {
      handleSubmit1(e);
    } else if (fromPage === "usersList") {
      handleSubmit2(e);
    } else {
      toast.error("لم يتم تحديد مصدر الزر.");
    }
  } else {
    // مريض: نستخدم handleSubmit العادي
    handleSubmit(e);
  }
};
  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/appointment");
  };

  const renderQuestions = () => {
    const section1 = [
      "ماذا حدث معك؟",
      "متى بدأت المشكلة؟",
      "كيف بدأت؟ فجأة أم تدريجياً؟",
      "هل أخدت علاج أو عملت فحوصات؟",
            "تشخيص الطبيب أن وجد",
      "هل تعاني من أمراض مزمنة ؟",
      " هل يوجد أدوية تتناولها باستمرار ؟ " ,
      " هل قمت باجراء عمليات جراحية سابقة ؟",
      "كيف أثّرت حالتك المرضية على حياتك اليومية؟ مثل عملك، حياتك العائلية ، مكان سكنك أو تنقلك؟",
      "هل سبق لك أن أجريت فحوصات تصوير مثل الأشعة السينية أو الرنين المغناطيسي المتعلقة بهذه المشكلة؟ وإذا كان الجواب نعم، هل يمكنك تزويدي بنتائج هذه الفحوصات؟",
    ];

    const section2 = [
      "كيف تصف طبيعة الألم؟ (حارق، نابض، حاد، إلخ)",
      "ما هو مدى شدة الألم من 0 إلى 10؟",
      "هل الألم مستمر أم متقطع؟",
      "ما هي العوامل التي تزيد الألم أو تخففه؟",
      "هل هناك أي أعراض مصاحبة مثل التنميل أو ضعف الحركة أو تورم .. ",
      "هل الألم أو الإحساس بينتقل لمكان اخر ؟",
    ];

    const questions = step === 2 ? section1 : section2;

    return (
      <div className="container" style={{ maxWidth: "600px" }}>
        <div className="p-4 rounded shadow" style={{ backgroundColor: "rgba(255,255,255,0.9)" }}>
          <h4 className="mb-4" style={{ color: "#2a7371" }}>
            الأسئلة الطبية (اختياري)
          </h4>
          <Form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <Form.Group key={index} style={{ marginBottom: "25px" }}>
                <Form.Label style={{ color: "#2a7371", float: "right" }}>{q}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  name={`q${step}-${index}`}
                  value={answers[`q${step}-${index}`] || ""}
                  onChange={handleChange}
                  style={{
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
                    borderRadius: "7px",
                  }}
                />

               {index === section1.length - 1 && step === 2 && (
  <>
    {/* رفع الملفات */}
    <Form.Control
      type="file"
      multiple
      accept="image/*"
      onChange={(e) => {
        const files = Array.from(e.target.files);
        // دمج الصور الجديدة مع القديمة بدون تكرار
        setUploadedImages((prev) => [...prev, ...files]);
      }}
      style={{ marginTop: "10px" }}
    />

    {/* عرض الصور المرفوعة */}
    {uploadedImages.length > 0 && (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "15px",
        }}
      >
        {uploadedImages.map((img, i) => {
          const previewUrl = URL.createObjectURL(img);
          return (
            <div
              key={i}
              style={{
                position: "relative",
                width: "100px",
                height: "100px",
                border: "2px solid #2a7371",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              {/* زر الحذف */}
              <button
                type="button"
                onClick={() => {
                  setUploadedImages((prev) =>
                    prev.filter((_, index) => index !== i)
                  );
                }}
                style={{
                  position: "absolute",
                  top: "3px",
                  right: "3px",
                  background: "rgba(250, 67, 67, 0.8)",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "22px",
                  height: "22px",
                  fontSize: "14px",
                  lineHeight: "18px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              {/* عرض الصورة */}
              <img
                src={previewUrl}
                alt={`uploaded-${i}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          );
        })}
      </div>
    )}
  </>
)}
              </Form.Group>
            ))}

            <div className="d-flex" style={{ gap: "20px" }}>
              <button
                type="button"
                onClick={handlePrevious}
                style={{
                  flex: 1,
                  backgroundColor: "#2a7371",
                  border: "none",
                  fontSize: "20px",
                  padding: "12px 0",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                ⬅ السابق
              </button>
              <button
                type="submit"
                style={{
                  flex: 1,
                  backgroundColor: "#2a7371",
                  border: "none",
                  fontSize: "20px",
                  padding: "12px 0",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              >
                {step === 2 ? "التالي ➡" : "إرسال ✅"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        padding: "100px 20px 50px 20px",
        backgroundColor: "#f0f4f7",
        overflowY: "auto",
        color: "#2a7371",
        textAlign: "center",
      }}
    >
      {step === 1 ? (
        <div className="container" style={{ maxWidth: "500px" }}>
          <div
            className="p-4 rounded shadow"
            style={{ backgroundColor: "rgba(255,255,255,0.9)", position: "relative" }}
          >
           <button
  type="button"
  onClick={() => navigate("/appointment")}
  style={{
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#faa3a3", // الخلفية وردية
    border: "none",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#fff", // نص أبيض ليظهر فوق الخلفية
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "1",
  }}
>
  ✖
</button>


            <h3 className="mb-4" style={{ paddingBottom: "30px" }}>
              بيانات المريض
            </h3>

<Form onSubmit={(e) =>  handleFinalSubmit(e) }>

              <Form.Group style={{ marginBottom: "30px" }}>
                <Form.Control
                  type="text"
                  placeholder="أدخل اسم المريض"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  style={{
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
                  }}
                />
                {errors.name && <div className="text-danger text-end mt-2">{errors.name}</div>}
              </Form.Group>

              <Form.Group style={{ marginBottom: "30px" }}>
                <DatePicker
                  selected={formData.birthDate ? new Date(formData.birthDate) : null}
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      birthDate: date ? date.toISOString().split("T")[0] : "",
                    });
                    if (date) setErrors((prev) => ({ ...prev, birthDate: "" }));
                  }}
                  dateFormat="yyyy-MM-dd"
                  placeholderText="أدخل تاريخ ميلاد المريض"
                  customInput={<CustomDateInput />}
                />
                {errors.birthDate && (
                  <div className="text-danger text-end mt-2">{errors.birthDate}</div>
                )}
              </Form.Group>

             <Form.Group style={{ marginBottom: "30px" }} controlId="formID">
                <Form.Control
                  type="text"
                  placeholder="أدخل رقم هوية المريض"
                  name="IDnumber"
                  value={formData.IDnumber}
                  onChange={handleChange}
                  isInvalid={!!errors.IDnumber}
                  style={{
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
                  }}
                />
                {errors.IDnumber && (
                  <div className="text-danger text-end mt-2">{errors.IDnumber}</div>
                )}
              </Form.Group>


              {checkingId && (
  <p style={{ color: "blue", marginTop: "5px" }}>
    جاري التحقق...
  </p>
)}
              <Form.Group style={{ marginBottom: "30px" }} controlId="formPhone">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="أدخل رقم الهاتف"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    style={{
                      border: "2px solid #2a7371",
                      color: "#2a7371",
                      direction: "rtl",
                      textAlign: "right",
                      borderRadius: "7px",
                    }}
                  />
                  <Form.Select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    isInvalid={!!errors.countryCode}
                    style={{
                      maxWidth: "160px",
                      border: "2px solid #2a7371",
                      color: "#2a7371",
                      fontSize: "15px",
                      marginLeft: "10px",
                      borderRadius: "7px",
                    }}
                  >
                    <option value="">رمز الدولة</option>
                    <option value="+970">فلسطين +970</option>
                    <option value="+972">إسرائيل +972</option>
                    <option value="+962">الأردن +962</option>
                    <option value="+966">السعودية +966</option>
                    <option value="+971">الإمارات +971</option>
                    <option value="+20">مصر +20</option>
                  </Form.Select>
                </InputGroup>
                {( errors.phone) && (
                  <div className="text-danger text-end mt-2">
                    { errors.phone}
                  </div>
                )}
              </Form.Group>

              <Form.Group style={{ marginBottom: "30px" }}>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  isInvalid={!!errors.category}
                  style={{
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
                  }}
                >
                  <option value="">اختر الفئة...</option>
                  <option value="أطفال">أطفال</option>
                  <option value="نساء">نساء</option>
                </Form.Select>
                {errors.category && (
                  <div className="text-danger text-end mt-2">{errors.category}</div>
                )}
              </Form.Group>

              {(formData.category === "نساء" || formData.category === "أطفال") && (
                <>
                  {formData.category === "نساء" && (
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Form.Control
                        type="text"
                        placeholder="الوظيفة (اختياري)"
                        name="job"
                        value={formData.job}
                        onChange={handleChange}
                        style={{
                          border: "2px solid #2a7371",
                          color: "#2a7371",
                          direction: "rtl",
                          textAlign: "right",
                        }}
                      />
                    </Form.Group>
                  )}

                  <Form.Group style={{ marginBottom: "30px" }}>
                    <Form.Select
                      name="medicalStatus"
                      value={formData.medicalStatus}
                      onChange={handleChange}
                      isInvalid={!!errors.medicalStatus}
                      style={{
                        border: "2px solid #2a7371",
                        color: "#2a7371",
                        direction: "rtl",
                        textAlign: "right",
                      }}
                    >
                      <option value="">اختر الحالة المرضية...</option>
                      <option value="جديدة">حالة مرضية جديدة</option>
  {hasPreviousAppointments && <option value="مراجعة">مراجعة</option>}
                    </Form.Select>
                    {errors.medicalStatus && (
                      <div className="text-danger text-end mt-2">{errors.medicalStatus}</div>
                    )}
                  </Form.Group>




{/* اختيار المكان بنفس نمط اختيار الحالة المرضية */}
<Form.Group style={{ marginBottom: "30px" }}>
  <Form.Select
    name="sessionPlace"
    value={sessionPlace}
  onChange={(e) => {
    setSessionPlace(e.target.value);
    localStorage.setItem("sessionPlace", e.target.value);

    setErrors((prev) => ({ ...prev, sessionPlace: "" })); // ⬅️ يشيل الخطأ أول ما المستخدم يختار
  }}    isInvalid={!!errors.sessionPlace}
    style={{
      border: "2px solid #2a7371",
      color: "#2a7371",
      direction: "rtl",
      textAlign: "right",
    }}
  >
    <option value="">اختر مكان الجلسة...</option>
    <option value="clinic">في العيادة</option>
    <option value="home">في المنزل</option>
  </Form.Select>

  {errors.sessionPlace && (
    <div className="text-danger text-end mt-2">{errors.sessionPlace}</div>
  )}
</Form.Group>

{/* عنوان المنزل يظهر فقط إذا تم اختيار المنزل */}
{sessionPlace === "home" && (
  <Form.Group style={{ marginBottom: "30px" }}>
    <Form.Control
      as="textarea"
      rows={2}
      name="homeAddress"
      value={homeAddress}
    onChange={(e) => {
    setHomeAddress(e.target.value);
      localStorage.setItem("homeAddress", e.target.value);

    setErrors((prev) => ({ ...prev, homeAddress: "" })); // ⬅️ يشيل الخطأ عند الكتابة
  }}
      
      placeholder="اكتب عنوان المنزل بشكل مفصل..."
      isInvalid={!!errors.homeAddress}
      style={{
        border: "2px solid #2a7371",
        color: "#2a7371",
        direction: "rtl",
        textAlign: "right",
      }}
    />

    {errors.homeAddress && (
      <div className="text-danger text-end mt-2">{errors.homeAddress}</div>
    )}
  </Form.Group>
)}




                </>
              )}

             <button 
  type="submit"
  style={{
    backgroundColor: "#2a7371",
    border: "none",
    fontSize: "20px",
    padding: "12px 0",
    color: "#fff",
    width: "100%",
    borderRadius: "8px",
  }}
>
  {formData.medicalStatus === "مراجعة"|| isSecretary ? "تثبيت الموعد ✅" : "التالي ➡"}
</button>
            </Form>
          </div>
        </div>
      ) : (
        renderQuestions()
      )}
    </div>
  );
}