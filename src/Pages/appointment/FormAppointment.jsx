// FormAppointment.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, forwardRef } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Appointment.css";

export default function FormAppointment() {
  const navigate = useNavigate();
  const location = useLocation();

  // ====== Lazy initializers: read from localStorage before first render ======
  const [step, setStep] = useState(() => {
    const s = localStorage.getItem("appointmentStep");
    return s ? Number(s) : 1;
  });

  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem("formData");
      return saved
        ? JSON.parse(saved)
        : {
            name: "",
            birthDate: null,
            phone: "",
            category: "",
            countryCode: "",
            job: "",
            medicalStatus: "",
            IDnumber: "",
          };
    } catch {
      return {
        name: "",
        birthDate: null,
        phone: "",
        category: "",
        countryCode: "",
        job: "",
        medicalStatus: "",
        IDnumber: "",
      };
    }
  });

  const [answers, setAnswers] = useState(() => {
    try {
      const saved = localStorage.getItem("answers");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [sessionPlace, setSessionPlace] = useState(
    () => localStorage.getItem("sessionPlace") || ""
  );
  const [homeAddress, setHomeAddress] = useState(
    () => localStorage.getItem("homeAddress") || ""
  );

  /**
   * uploadedImages will be an array of objects:
   * { id, name, size, type, dataUrl, file? }
   * - dataUrl is always present (persisted)
   * - file is present only for Files during the session
   *
   * On refresh we reconstruct uploadedImages from localStorage (dataUrl + metadata).
   */
  const [uploadedImages, setUploadedImages] = useState(() => {
    try {
      const saved = localStorage.getItem("uploadedImages");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      // ensure each item has an id
      return parsed.map((it, idx) => ({
        id: it.id || `${Date.now()}_${idx}`,
        name: it.name,
        size: it.size,
        type: it.type,
        dataUrl: it.dataUrl,
        // file cannot be reconstructed reliably — omitted
      }));
    } catch {
      return [];
    }
  });

  const [checkingId, setCheckingId] = useState(false);
  const [errors, setErrors] = useState({});
  const [childId, setChildId] = useState();
  const [email1, setEmail1] = useState();
  const [hasPreviousAppointments, setHasPreviousAppointments] = useState(false);

  const selectedSlotFromState = location.state?.selectedSlot || {
    day: "",
    time: "",
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const isSecretary = user?.userType === "scheduler_admin";
  const parentId =
    location.state?.parentId || localStorage.getItem("parentId") || null;

  // helper token
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

  // keep appointmentStep in localStorage
  useEffect(() => {
    localStorage.setItem("appointmentStep", String(step));
  }, [step]);

  // persist main states immediately
  useEffect(() => {
    try {
      localStorage.setItem("formData", JSON.stringify(formData));
    } catch (err) {
      console.warn("Failed to save formData to localStorage:", err);
    }
  }, [formData]);

  useEffect(() => {
    try {
      localStorage.setItem("answers", JSON.stringify(answers));
    } catch (err) {
      console.warn("Failed to save answers to localStorage:", err);
    }
  }, [answers]);

  useEffect(() => {
    localStorage.setItem("sessionPlace", sessionPlace || "");
  }, [sessionPlace]);

  useEffect(() => {
    localStorage.setItem("homeAddress", homeAddress || "");
  }, [homeAddress]);

  // Save uploadedImages metadata + dataUrl to localStorage whenever it changes
  useEffect(() => {
    try {
      const meta = uploadedImages.map((it) => ({
        id: it.id,
        name: it.name,
        size: it.size,
        type: it.type,
        dataUrl: it.dataUrl, // base64 preview (may be large)
      }));
      localStorage.setItem("uploadedImages", JSON.stringify(meta));
    } catch (err) {
      console.warn(
        "Failed to save uploadedImages to localStorage (maybe quota):",
        err
      );
    }
  }, [uploadedImages]);

  // restore some one-time items on mount
  useEffect(() => {
    const id = localStorage.getItem("selectedChildId");
    if (id) setChildId(parseInt(id, 10));
    const storedEmail = localStorage.getItem("selectedEmail");
    if (storedEmail) setEmail1(storedEmail);
    // scroll top
    window.scrollTo(0, 0);
  }, []);

  // if selectedIDNumber exists -> fetch and fill (as in original)
  useEffect(() => {
    const storedIdNumber = localStorage.getItem("selectedIDNumber");
    if (!storedIdNumber) return;
    const token = getTokenFromStorage();
    if (!token) return;

    axios
      .get(
        `https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/get-patient-data-by-idnumber/${storedIdNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const data = res.data;
        if (data && data.childId) {
          let countryCode = "";
          let phone = "";
          if (data.phoneNumber) {
            const match = data.phoneNumber.match(/^(\+\d{2,3})(\d+)$/);
            if (match) {
              countryCode = match[1];
              phone = match[2];
            }
          }
          const filled = {
            name: data.fullname || "",
            birthDate: data.birthDate ? data.birthDate.split("T")[0] : null,
            phone: phone,
            category: data.gender === "kid" ? "أطفال" : "نساء",
            countryCode: countryCode || "",
            job: data.occupation || "",
            IDnumber: data.idNumber || "",
          };
          setFormData(filled);
          localStorage.setItem("formData", JSON.stringify(filled));
          localStorage.removeItem("selectedIDNumber");
        }
      })
      .catch((err) => {
        console.error("❌ خطأ عند جلب بيانات المريض:", err);
      });
  }, []);

  // ChildHasAppointments check
  useEffect(() => {
    if (!formData.IDnumber) return;
    const token = getTokenFromStorage();
    if (!token) return;

    axios
      .get(
        `https://sewarwellnessclinic1.runasp.net/api/validation/ChildHasAppointments`,
        {
          params: { idnumber: formData.IDnumber },
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setHasPreviousAppointments(res.data.hasAppointments);
      })
      .catch((err) => {
        console.error("❌ خطأ عند جلب ChildHasAppointments:", err);
        setHasPreviousAppointments(false);
      });
  }, [formData.IDnumber]);

  // ---------- helper utilities for file <-> dataURL ----------
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const dataUrlToFile = (dataUrl, filename = "file") => {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    try {
      return new File([u8arr], filename, { type: mime });
    } catch {
      // fallback for older browsers
      const blob = new Blob([u8arr], { type: mime });
      blob.name = filename;
      return blob;
    }
  };

  // ---------- handlers that update state + localStorage immediately ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    const arabicNumberRegex = /[\u0660-\u0669]/;

    if (step === 1) {
      setFormData((prev) => {
        const next = { ...prev, [name]: value };
        try {
          localStorage.setItem("formData", JSON.stringify(next));
        } catch (err) {
          console.warn("Failed to save formData to localStorage:", err);
        }
        return next;
      });

      let errorMsg = "";
      if (name === "name" && !/^[\u0621-\u064Aa-zA-Z\s]+$/.test(value.trim())) {
        errorMsg = "يجب أن يحتوي الاسم على حروف فقط";
      }

      if (name === "IDnumber") {
        if (arabicNumberRegex.test(value)) {
          errorMsg = "يرجى إدخال رقم الهوية بالأرقام الإنجليزية فقط (0-9)";
        } else if (value && !/^\d+$/.test(value)) {
          errorMsg = "يرجى إدخال أرقام فقط";
        } else if (value.length !== 9) {
          errorMsg = "رقم الهوية يجب أن يكون 9 أرقام";
        }
        setErrors((prev) => ({ ...prev, IDnumber: errorMsg }));
        if (errorMsg) return;
        if (value.length === 9) {
          const token = getTokenFromStorage();
          if (!token) return;
          setCheckingId(true);
          axios
            .get(
              `https://sewarwellnessclinic1.runasp.net/api/validation/CheckChildIdNumber`,
              {
                params: {
                  idnumber: value,
                  currentPatientId:
                    parentId || "00000000-0000-0000-0000-000000000000",
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
        return;
      }

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
      setAnswers((prev) => {
        const next = { ...prev, [name]: value };
        try {
          localStorage.setItem("answers", JSON.stringify(next));
        } catch (err) {
          console.warn("Failed to save answers to localStorage:", err);
        }
        return next;
      });
    }
  };

  const handleBirthDateChange = (date) => {
    const value = date ? date.toISOString().split("T")[0] : "";
    setFormData((prev) => {
      const next = { ...prev, birthDate: value };
      try {
        localStorage.setItem("formData", JSON.stringify(next));
      } catch (err) {
        console.warn("Failed to save formData to localStorage:", err);
      }
      return next;
    });
    if (date) setErrors((prev) => ({ ...prev, birthDate: "" }));
  };

  const handleSessionPlaceChange = (val) => {
    setSessionPlace(val);
    localStorage.setItem("sessionPlace", val);
    setErrors((p) => ({ ...p, sessionPlace: "" }));
  };

  const handleHomeAddressChange = (val) => {
    setHomeAddress(val);
    localStorage.setItem("homeAddress", val);
    setErrors((p) => ({ ...p, homeAddress: "" }));
  };

  /**
   * Handle file selection:
   * - convert each File -> dataUrl (for preview + persistence)
   * - store objects { id, name, size, type, dataUrl, file } in state
   * - save metadata+dataUrl to localStorage (so refresh preserves preview)
   */
  const handleFilesChange = async (filesArray) => {
    if (!filesArray || filesArray.length === 0) return;

    // enforce reasonable max per-file size (2.5MB) to avoid blowing localStorage quickly
    const MAX_BYTES = 2.5 * 1024 * 1024;

    const newItems = [];
    for (let i = 0; i < filesArray.length; i++) {
      const f = filesArray[i];
      if (f.size > MAX_BYTES) {
        toast.error(`حجم الملف ${f.name} أكبر من 2.5MB — اختر صورة أصغر.`);
        continue;
      }
      try {
        const dataUrl = await fileToDataUrl(f);
        newItems.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          name: f.name,
          size: f.size,
          type: f.type,
          dataUrl,
          file: f, // keep File in memory during session
        });
      } catch (err) {
        console.warn("Failed to read file:", f.name, err);
      }
    }

    if (newItems.length === 0) return;

    setUploadedImages((prev) => {
      const next = [...prev, ...newItems];
      // localStorage update handled by effect
      return next;
    });
  };

  const removeUploadedImage = (id) => {
    setUploadedImages((prev) => {
      const next = prev.filter((it) => it.id !== id);
      try {
        const meta = next.map((it) => ({
          id: it.id,
          name: it.name,
          size: it.size,
          type: it.type,
          dataUrl: it.dataUrl,
        }));
        localStorage.setItem("uploadedImages", JSON.stringify(meta));
      } catch (err) {
        console.warn("Failed to update uploadedImages in localStorage:", err);
      }
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "يجب إدخال الاسم";
    if (!formData.IDnumber) newErrors.IDnumber = "يجب إدخال رقم الهوية";
    if (!formData.birthDate) newErrors.birthDate = "يجب إدخال تاريخ الميلاد";
    if (!formData.phone) newErrors.phone = "يجب إدخال رقم الهاتف";
    if (!formData.category) newErrors.category = "يجب اختيار الفئة";
    if (
      (formData.category === "نساء" || formData.category === "أطفال") &&
      !formData.medicalStatus
    )
      newErrors.medicalStatus = "اختر الحالة المرضية";
    if (!sessionPlace.trim()) newErrors.sessionPlace = "يرجى اختيار المكان";
    if (sessionPlace === "home" && !homeAddress.trim())
      newErrors.homeAddress = "يرجى إدخال عنوان المنزل";
    if (!isSecretary && errors.IDnumber?.includes("مستخدم مسبقاً"))
      newErrors.IDnumber = errors.IDnumber;
    return newErrors;
  };

  const clearAllLocalFormData = () => {
    localStorage.removeItem("formData");
    localStorage.removeItem("answers");
    localStorage.removeItem("sessionPlace");
    localStorage.removeItem("homeAddress");
    localStorage.removeItem("uploadedImages");
    localStorage.removeItem("appointmentStep");
  };

  // ---------- Submit handlers (full) ----------
  const handleSubmit1 = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
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
          childId: childId,
        };
        toast.loading("جاري تثبيت الموعد...");
        try {
          const _res = await axios.post(
            "https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/create-appointment-existing-child",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.dismiss();
          toast.success("تم تثبيت موعد المراجعة بنجاح ✅", { duration: 3000 });
          clearAllLocalFormData();
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
          setAnswers({});
          setUploadedImages([]);
          setStep(1);
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
        return;
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
          email: email1,
        };
        toast.loading("جاري تثبيت الموعد...");
        try {
          const _res = await axios.post(
            "https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/create-patient-appointment-by-email",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.dismiss();
          toast.success("تم تثبيت موعد المراجعة بنجاح ✅", { duration: 3000 });
          clearAllLocalFormData();
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
          setAnswers({});
          setUploadedImages([]);
          setStep(1);
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
        return;
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
          const _res = await axios.post(
            "https://sewarwellnessclinic1.runasp.net/api/Child/save-basic-info",
            payload,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.dismiss();
          toast.success("تم تثبيت موعد المراجعة بنجاح ✅", { duration: 3000 });
          clearAllLocalFormData();
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
          setAnswers({});
          setUploadedImages([]);
          setStep(1);
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
        return;
      }

      // otherwise move to step 2
      setStep(2);
      return;
    }

    if (step === 2) {
      // move to questions (step 3)
      setStep(3);
      return;
    }

    if (step === 3) {
      // prepare all data then submit final form (report)
      const Diagnose = answers["q2-4"] || "";
      const PresentHistory = [
        answers["q2-0"],
        answers["q2-1"],
        answers["q2-2"],
        answers["q2-3"],
      ]
        .filter(Boolean)
        .join("\n");

      const ChronicDisease = answers["q2-5"] || "";
      const Medication = answers["q2-6"] || "";
      const PreviousSurgeries = answers["q2-7"] || "";
      const SocialHistory = answers["q2-8"] || "";
      const OtherInvestigationsText = answers["q2-9"] || "";

      const PainAssessment = [
        answers["q3-0"],
        answers["q3-1"],
        answers["q3-2"],
        answers["q3-3"],
        answers["q3-4"],
        answers["q3-5"],
      ]
        .filter(Boolean)
        .join("\n");

      const formPayload = new FormData();
      formPayload.append("Fullname", formData.name);
      formPayload.append("Gender", formData.category === "نساء" ? "1" : "0");
      formPayload.append(
        "PhoneNumber",
        `${formData.countryCode}${formData.phone}`
      );
      formPayload.append("Occupation", formData.job || "غير محدد");
      formPayload.append(
        "BirthDate",
        formData.birthDate ? new Date(formData.birthDate).toISOString() : null
      );
      formPayload.append("IdNumber", formData.IDnumber);
      formPayload.append(
        "VisitTypee",
        formData.medicalStatus === "جديدة" ? "1" : "0"
      );
      formPayload.append("Time", selectedSlotFromState.time);
      formPayload.append("Day", selectedSlotFromState.day);
      formPayload.append("placee", sessionPlace === "clinic" ? "0" : "1");
      formPayload.append("address", sessionPlace === "home" ? homeAddress : "");

      formPayload.append("Diagnose", Diagnose);
      formPayload.append(
        "PresentHistory",
        ` ماذا حدث معك : ${answers["q2-0"] || ""}\n` +
          ` متى بدأت المشكلة : ${answers["q2-1"] || ""}\n` +
          ` كيف بدأت  : ${answers["q2-2"] || ""}\n` +
          ` هل أخدت علاج أو عملت فحوصات : ${answers["q2-3"] || ""}`
      );
      formPayload.append("ChronicDisease", ChronicDisease);
      formPayload.append("Medication", Medication);
      formPayload.append("PreviousSurgeries", PreviousSurgeries);
      formPayload.append("SocialHistory", SocialHistory);
      formPayload.append("OtherInvestigationsText", OtherInvestigationsText);
      formPayload.append(
        "PainAssessment",
        `كيف تصف طبيعة الألم : ${answers["q3-0"] || ""}\n` +
          `ما هو مدى شدة الألم من 0 إلى 10 : ${answers["q3-1"] || ""}\n` +
          `هل الألم مستمر أم متقطع : ${answers["q3-2"] || ""}\n` +
          `ما هي العوامل التي تزيد الألم أو تخففه : ${
            answers["q3-3"] || ""
          }\n` +
          `هل هناك أي أعراض مصاحبة مثل التنميل أو ضعف الحركة أو تورم : ${
            answers["q3-4"] || ""
          }\n` +
          `هل الألم أو الإحساس بينتقل لمكان آخر : ${answers["q3-5"] || ""}`
      );

      // append files: convert persisted dataUrl -> File if needed
      for (let i = 0; i < uploadedImages.length; i++) {
        const item = uploadedImages[i];
        try {
          if (item.file && item.file instanceof File) {
            formPayload.append(
              "OtherInvestigationsFiles",
              item.file,
              item.name
            );
          } else if (item.dataUrl) {
            // convert dataUrl to File/Blob and append with original name
            const fileLike = dataUrlToFile(
              item.dataUrl,
              item.name || `upload_${i}.jpg`
            );
            formPayload.append(
              "OtherInvestigationsFiles",
              fileLike,
              item.name || `upload_${i}.jpg`
            );
          }
        } catch (err) {
          console.warn("Failed to append uploaded file:", err);
        }
      }

      const token = getTokenFromStorage();
      if (!token) {
        toast.error("الرجاء تسجيل الدخول أولاً لإتمام العملية.");
        return;
      }

      toast.loading("جاري إرسال البيانات...");
      try {
        const res = await axios.post(
          "https://sewarwellnessclinic1.runasp.net/api/Child/create-patient-appointment-report",
          formPayload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const { reportId, muscleToneIds, milestoneIds } = res.data || {};
        toast.dismiss();
        toast.success("تم تثبيت موعدك بنجاح ✅", { duration: 3000 });

        clearAllLocalFormData();
        setAnswers({});
        setUploadedImages([]);
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
        setStep(1);

        navigate("/ReportPreviewKids", {
          state: { reportId, muscleToneIds, milestoneIds },
        });
      } catch (err) {
        toast.dismiss();
        console.error(
          "=== Axios Error Response ===",
          err.response?.data || err
        );
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "حدث خطأ أثناء إرسال البيانات.";
        toast.error(message);
      }
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const fromPage = localStorage.getItem("fromPage");
    if (isSecretary) {
      if (fromPage === "viewAppointments") {
        handleSubmit1(e);
      } else if (fromPage === "usersList") {
        handleSubmit2(e);
      } else {
        toast.error("لم يتم تحديد مصدر الزر.");
      }
    } else {
      handleSubmit(e);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/appointment");
    }
  };

  // Custom date input for DatePicker
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

  // ---------- Render questions helper (same structure as original) ----------
  const renderQuestions = () => {
    const section1 = [
      "ماذا حدث معك؟",
      "متى بدأت المشكلة؟",
      "كيف بدأت ؟",
      "هل أخدت علاج أو عملت فحوصات؟",
      "تشخيص الطبيب أن وجد",
      "هل تعاني من أمراض مزمنة ؟",
      " هل يوجد أدوية تتناولها باستمرار ؟ ",
      " هل قمت باجراء عمليات جراحية سابقة ؟",
      "كيف أثّرت حالتك المرضية على حياتك اليومية؟ مثل عملك، حياتك العائلية ، مكان سكنك أو تنقلك؟",
      "هل سبق لك أن أجريت فحوصات تصوير مثل الأشعة السينية أو الرنين المغناطيسي المتعلقة بهذه المشكلة؟ وإذا كان الجواب نعم، هل يمكنك تزويدي بنتائج هذه الفحوصات؟",
    ];

    const section2 = [
      "كيف تصف طبيعة الألم؟ (حارق، نابض، حاد، إلخ)",
      "ما هو مدى شدة الألم من 0 إلى 10 ؟",
      "هل الألم مستمر أم متقطع ؟",
      "ما هي العوامل التي تزيد الألم أو تخففه ؟",
      " هل هناك أي أعراض مصاحبة مثل التنميل أو ضعف الحركة أو تورم ؟.. ",
      "هل الألم أو الإحساس بينتقل لمكان اخر ؟",
    ];

    const questions = step === 2 ? section1 : section2;

    return (
      <div className="container" style={{ maxWidth: "600px" }}>
        <div
          className="p-4 rounded shadow"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <h4 className="mb-4" style={{ color: "#2a7371" }}>
            الأسئلة الطبية (اختياري)
          </h4>
          <Form onSubmit={handleSubmit}>
            {questions.map((q, index) => (
              <Form.Group key={index} style={{ marginBottom: "25px" }}>
                <Form.Label style={{ color: "#2a7371", float: "right" }}>
                  {q}
                </Form.Label>
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
                    <Form.Control
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        handleFilesChange(files);
                        // clear input so same file can be chosen again later
                        e.target.value = "";
                      }}
                      style={{ marginTop: "10px" }}
                    />

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
                          const previewUrl = img.dataUrl || null;
                          return (
                            <div
                              key={img.id}
                              style={{
                                position: "relative",
                                width: "100px",
                                height: "100px",
                                border: "2px solid #2a7371",
                                borderRadius: "10px",
                                overflow: "hidden",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(img.id)}
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
                                  zIndex: 5,
                                }}
                                title="حذف"
                              >
                                ×
                              </button>

                              {previewUrl ? (
                                <img
                                  src={previewUrl}
                                  alt={`uploaded-${i}`}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    padding: 8,
                                    textAlign: "center",
                                  }}
                                >
                                  <div>
                                    <div style={{ fontSize: 12 }}>
                                      {img.name || "ملف"}
                                    </div>
                                    <div
                                      style={{ fontSize: 11, color: "#666" }}
                                    >
                                      {Math.round((img.size || 0) / 1024)} KB
                                    </div>
                                  </div>
                                </div>
                              )}
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

  // ---------- main render ----------
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
            style={{
              backgroundColor: "rgba(255,255,255,0.9)",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/appointment")}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#faa3a3",
                border: "none",
                fontSize: "24px",
                fontWeight: "bold",
                color: "#fff",
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

            <Form onSubmit={(e) => handleFinalSubmit(e)}>
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
                {errors.name && (
                  <div className="text-danger text-end mt-2">{errors.name}</div>
                )}
              </Form.Group>

              <Form.Group style={{ marginBottom: "30px" }}>
                <DatePicker
                  selected={
                    formData.birthDate ? new Date(formData.birthDate) : null
                  }
                  onChange={handleBirthDateChange}
                  dateFormat="yyyy-MM-dd"
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  placeholderText="اختر تاريخ الميلاد"
                  customInput={<CustomDateInput />}
                />
                {errors.birthDate && (
                  <div className="text-danger text-end mt-2">
                    {errors.birthDate}
                  </div>
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
                  <div className="text-danger text-end mt-2">
                    {errors.IDnumber}
                  </div>
                )}
              </Form.Group>

              {checkingId && (
                <p style={{ color: "blue", marginTop: "5px" }}>
                  جاري التحقق...
                </p>
              )}

              <Form.Group
                style={{ marginBottom: "30px" }}
                controlId="formPhone"
              >
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
                      zIndex: "0",
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
                {errors.phone && (
                  <div className="text-danger text-end mt-2">
                    {errors.phone}
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
                  <div className="text-danger text-end mt-2">
                    {errors.category}
                  </div>
                )}
              </Form.Group>

              {(formData.category === "نساء" ||
                formData.category === "أطفال") && (
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
                      {hasPreviousAppointments && (
                        <option value="مراجعة">مراجعة</option>
                      )}
                    </Form.Select>
                    {errors.medicalStatus && (
                      <div className="text-danger text-end mt-2">
                        {errors.medicalStatus}
                      </div>
                    )}
                  </Form.Group>

                  <Form.Group style={{ marginBottom: "30px" }}>
                    <Form.Select
                      name="sessionPlace"
                      value={sessionPlace}
                      onChange={(e) => handleSessionPlaceChange(e.target.value)}
                      isInvalid={!!errors.sessionPlace}
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
                      <div className="text-danger text-end mt-2">
                        {errors.sessionPlace}
                      </div>
                    )}
                  </Form.Group>

                  {sessionPlace === "home" && (
                    <Form.Group style={{ marginBottom: "30px" }}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        name="homeAddress"
                        value={homeAddress}
                        onChange={(e) =>
                          handleHomeAddressChange(e.target.value)
                        }
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
                        <div className="text-danger text-end mt-2">
                          {errors.homeAddress}
                        </div>
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
                {formData.medicalStatus === "مراجعة" || isSecretary
                  ? "تثبيت الموعد ✅"
                  : "التالي ➡"}
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
