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

export default function FormAppointment() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSlotFromState = location.state?.selectedSlot || { day: "", time: "" };

  const [uploadedImages, setUploadedImages] = useState([]);
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

  const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <div style={{ position: "relative" }}>
      <input
        ref={ref}
        onClick={onClick}
        value={value}
        placeholder={placeholder}
        readOnly
        className="custom-date-input form-control"
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
    if (step === 1) {
      setFormData({ ...formData, [name]: value });

      let errorMsg = "";
      if (name === "name" && !/^[\u0621-\u064Aa-zA-Z\s]+$/.test(value.trim()))
        errorMsg = "يجب أن يحتوي الاسم على حروف فقط";
      if (name === "IDnumber" && value && !/^\d+$/.test(value)) errorMsg = "يرجى إدخال رقم";
      if (name === "phone" && value && !/^\d+$/.test(value)) errorMsg = "يرجى إدخال رقم";
      setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    } else {
      setAnswers({ ...answers, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "يجب إدخال الاسم";
    if (!formData.IDnumber) newErrors.IDnumber = "يجب إدخال رقم الهوية";
    if (!formData.birthDate) newErrors.birthDate = "يجب إدخال تاريخ الميلاد";
    if (!formData.phone) newErrors.phone = "يجب إدخال رقم الهاتف";
    if (!formData.countryCode) newErrors.countryCode = "اختر رمز الدولة";
    if (!formData.category) newErrors.category = "يجب اختيار الفئة";
    if ((formData.category === "نساء" || formData.category === "أطفال") && !formData.medicalStatus)
      newErrors.medicalStatus = "اختر الحالة المرضية";
    return newErrors;
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

        // payload للباك
        const payload = {
          fullname: formData.name || "غير محدد",
          gender: 0,
          phoneNumber: `${formData.countryCode}${formData.phone}`,
          occupation: formData.job || "غير محدد",
          birthDate: formData.birthDate,
          idNumber: formData.IDnumber,
          parentId: "0dee67e9-e250-45da-944f-12ed14ec76ca",
          day: selectedSlotFromState.day,
          time: selectedSlotFromState.time,
          VisitTypee: 1, // مراجعة
        };

        toast.loading("جاري تثبيت الموعد...");
        try {
          const res = await axios.post(
            "https://sewarwellnessclinic1.runasp.net/api/Child/save-basic-info",
            payload
          );
          toast.dismiss();
          toast.success("تم تثبيت موعدك بنجاح ✅", { duration: 3000 });
          navigate("/appointment");
        } catch (err) {
          toast.dismiss();
          const message =
            err?.response?.data?.message ||
            err?.response?.data?.Message ||
            "حدث خطأ أثناء تثبيت الموعد.";
          toast.error(message);
        }
        return;
      }

      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      // إرسال البيانات النهائية مع الأسئلة + الصور
      const formPayload = new FormData();
      formPayload.append("Fullname", formData.name);
      formPayload.append("Gender", 0);
      formPayload.append("PhoneNumber", `${formData.countryCode}${formData.phone}`);
      formPayload.append("Occupation", formData.job || "غير محدد");
      formPayload.append("BirthDate", formData.birthDate);
      formPayload.append("IdNumber", formData.IDnumber);
      formPayload.append("ParentId", "0dee67e9-e250-45da-944f-12ed14ec76ca");
      formPayload.append("Day", selectedSlotFromState.day);
      formPayload.append("Time", selectedSlotFromState.time);
      formPayload.append("VisitTypee", 0); // جديدة

      // إجابات الأسئلة
      Object.keys(answers).forEach((key) => {
        formPayload.append(key, answers[key]);
      });

      // الصور
      uploadedImages.forEach((file, idx) => {
        formPayload.append("OtherInvestigationsFiles", file);
      });

      toast.loading("جاري إرسال البيانات...");
      try {
        const res = await axios.post(
          "https://sewarwellnessclinic1.runasp.net/api/Child/create-patient-appointment-report",
          formPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.dismiss();
        toast.success("تم تثبيت موعدك بنجاح ✅", { duration: 3000 });
        navigate("/appointment");
      } catch (err) {
        toast.dismiss();
        const message =
          err?.response?.data?.message ||
          err?.response?.data?.Message ||
          "حدث خطأ أثناء إرسال البيانات.";
        toast.error(message);
      }
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
      "هل تعاني من أمراض مزمنة ؟ هل يوجد أدوية تتناولها باستمرار ؟هل قمت باجراء عمليات جراحية سابقة ؟",
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

                {index === section1.length - 1 && (
                  <>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files);
                        setUploadedImages(files);
                      }}
                      style={{ marginTop: "10px" }}
                    />
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
                ⬅️ السابق
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
                {step === 2 ? "التالي ➡️" : "إرسال ✅"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", padding: "100px 20px 50px 20px", backgroundColor: "#f0f4f7", overflowY: "auto", color: "#2a7371", textAlign: "center" }}>
      {step === 1 ? (
        <div className="container" style={{ maxWidth: "500px" }}>
          <div className="p-4 rounded shadow" style={{ backgroundColor: "rgba(255,255,255,0.9)", position: "relative" }}>
            <button
              type="button"
              onClick={() => navigate("/appointment")}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#faa3a3ff",
                border: "none",
                fontSize: "22px",
                fontWeight: "bold",
                color: "#faa3a3ff",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <h3 className="mb-4" style={{ paddingBottom: "30px" }}>بيانات المريض</h3>
            <Form onSubmit={handleSubmit} noValidate>
              {/* الاسم */}
              <Form.Group style={{ marginBottom: "30px" }}>
                <Form.Control type="text" placeholder="أدخل اسم المريض" name="name" value={formData.name} onChange={handleChange} isInvalid={!!errors.name} style={{ border: "2px solid #2a7371", color: "#2a7371", direction: "rtl", textAlign: "right" }} />
                {errors.name && <div className="text-danger text-end mt-2">{errors.name}</div>}
              </Form.Group>

              {/* تاريخ الميلاد */}
              <Form.Group style={{ marginBottom: "30px" }}>
               <DatePicker
  selected={formData.birthDate ? new Date(formData.birthDate) : null}
  onChange={(date) => {
    setFormData({ ...formData, birthDate: date ? date.toISOString().split("T")[0] : "" });
    if (date) {
      setErrors((prev) => ({ ...prev, birthDate: "" })); // حذف رسالة الخطأ
    }
  }}
  dateFormat="yyyy-MM-dd"
  placeholderText="أدخل تاريخ ميلاد المريض"
  customInput={<CustomDateInput />}
/>
                {errors.birthDate && <div className="text-danger text-end mt-2">{errors.birthDate}</div>}
              </Form.Group>

              {/* رقم الهوية */}
              <Form.Group style={{ marginBottom: "30px" }}>
                <Form.Control
                  type="text"
                  placeholder="أدخل رقم هوية المريض"
                  name="IDnumber"
                  value={formData.IDnumber}
                  onChange={handleChange}
                  isInvalid={!!errors.IDnumber}
                  style={{ border: "2px solid #2a7371", color: "#2a7371", direction: "rtl", textAlign: "right" }}
                />
                {errors.IDnumber && <div className="text-danger text-end mt-2">{errors.IDnumber}</div>}
              </Form.Group>

              {/* الهاتف */}
              <Form.Group style={{ marginBottom: "30px" }} controlId="formPhone">
                <InputGroup>




 <Form.Control
                    type="text"
                    placeholder="أدخل رقم الهاتف"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    isInvalid={!!errors.phone}
                    style={{ border: "2px solid #2a7371", color: "#2a7371", direction: "rtl", textAlign: "right", borderRadius: "7px" }}
                  />



                  <Form.Select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    isInvalid={!!errors.countryCode}
                    style={{ maxWidth: "160px", border: "2px solid #2a7371", color: "#2a7371", fontSize: "15px", marginLeft: "10px", borderRadius: "7px" }}
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
                {(errors.countryCode || errors.phone) && <div className="text-danger text-end mt-2">{errors.countryCode || errors.phone}</div>}
              </Form.Group>

              {/* الفئة */}
              <Form.Group style={{ marginBottom: "30px" }}>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  isInvalid={!!errors.category}
                  style={{ border: "2px solid #2a7371", color: "#2a7371", direction: "rtl", textAlign: "right" }}
                >
                  <option value="">اختر الفئة...</option>
                  <option value="أطفال">أطفال</option>
                  <option value="نساء">نساء</option>
                </Form.Select>
                {errors.category && <div className="text-danger text-end mt-2">{errors.category}</div>}
              </Form.Group>

              {/* حالة المرض والوظيفة */}
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
                        style={{ border: "2px solid #2a7371", color: "#2a7371", direction: "rtl", textAlign: "right" }}
                      />
                    </Form.Group>
                  )}

                  <Form.Group style={{ marginBottom: "30px" }}>
                    <Form.Select
                      name="medicalStatus"
                      value={formData.medicalStatus}
                      onChange={handleChange}
                      isInvalid={!!errors.medicalStatus}
                      style={{ border: "2px solid #2a7371", color: "#2a7371", direction: "rtl", textAlign: "right" }}
                    >
                      <option value="">اختر الحالة المرضية...</option>
                      <option value="جديدة">حالة مرضية جديدة</option>
                      <option value="مراجعة">مراجعة</option>
                    </Form.Select>
                    {errors.medicalStatus && <div className="text-danger text-end mt-2">{errors.medicalStatus}</div>}
                  </Form.Group>
                </>
              )}

              <button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "#2a7371", border: "none", fontSize: "18px", padding: "10px", marginTop: "10px", color: "#fff", borderRadius: "8px" }}
              >
                {step === 1 && formData.medicalStatus === "مراجعة"
                  ? "تثبيت الحجز"
                  : step === 1
                  ? "التالي ➡️"
                  : step === 2
                  ? "التالي ➡️"
                  : "إرسال ✅"}
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