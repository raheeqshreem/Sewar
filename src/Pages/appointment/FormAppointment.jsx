import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";

export default function FormAppointment() {
  const [step, setStep] = useState(1); // المرحلة: 1 بيانات، 2-3 أسئلة
    const navigate = useNavigate();
const [uploadedImages, setUploadedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    category: "",
    countryCode: "",
    job: "",
    pregnancyAge: "",
    medicalStatus: "",
  });

  const [errors, setErrors] = useState({});
  const [answers, setAnswers] = useState({}); // إجابات الأسئلة

  // 🔹 عند تغيير أي حقل
  const handleChange = (e) => {
  const { name, value } = e.target;
  if (step === 1) {
    setFormData({ ...formData, [name]: value });

    let errorMsg = "";

    if (name === "name") {
      if (!value.trim()) errorMsg = "يجب إدخال الاسم";
      else if (!/^[\u0621-\u064Aa-zA-Z\s]+$/.test(value.trim()))
        errorMsg = "يجب أن يحتوي الاسم على حروف فقط";
    }

    if (name === "age" && value && !/^\d+$/.test(value)) errorMsg = "يرجى إدخال رقم";
    if (name === "phone" && value && !/^\d+$/.test(value)) errorMsg = "يرجى إدخال رقم";

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  } else {
    setAnswers({ ...answers, [name]: value });
  }
};

  // 🔸 التحقق من صحة البيانات
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "يجب إدخال الاسم";
    else if (!/^[\u0621-\u064Aa-zA-Z\s]+$/.test(formData.name.trim()))
      newErrors.name = "يجب أن يحتوي الاسم على حروف فقط";

    if (!formData.age) 
      newErrors.age = "يجب إدخال العمر ";
    if (!formData.phone) 
      newErrors.phone = "يجب إدخال رقم الهاتف";
    

    if (!formData.countryCode) newErrors.countryCode = "اختر رمز الدولة";
    if (!formData.category) newErrors.category = "يجب اختيار الفئة";

    if (formData.category === "نساء" || formData.category === "أطفال") {
      if (!formData.medicalStatus.trim()) {
        newErrors.medicalStatus = "يرجى اختيار حالتك المرضية";
      }
    }

    return newErrors;
  };

  // 🔸 عند الضغط على زر التالي / تثبيت الحجز / إرسال
  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      if (formData.medicalStatus === "مراجعة") {
        console.log("✅ تم تثبيت الحجز:", { formData });
        alert("تم تثبيت موعدك بنجاح ✅");
        return;
      }

      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else {
      console.log("✅ تم إرسال البيانات:", { formData, answers });
      alert("تم إرسال جميع البيانات بنجاح ✅");
    }
  };

  // 🔹 زر السابق
  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  // 🔹 مكوّن الأسئلة (الجزء الأول والثاني)
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
            {step === 2 ? "الأسئلة الطبية (اختياري)" : "الأسئلة الطبية (اختياري)"}
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

  {/* 🖼️ رفع الصور + زر حذف */}
  {index === section1.length - 1 && (
    <>
      <Form.Control
        type="file"
        multiple
        onChange={(e) => {
          const files = Array.from(e.target.files);
          const urls = files.map((file) => URL.createObjectURL(file));
          setUploadedImages((prev) => [...prev, ...urls]);
        }}
        style={{ marginTop: "10px" }}
      />

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "10px" }}>
        {uploadedImages.map((img, idx) => (
          <div key={idx} style={{ position: "relative", width: "80px", height: "80px" }}>
            <img
              src={img}
              alt={`upload-${idx}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
            />
           <button
  type="button"
  onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
  style={{
    position: "absolute",
    top: "2px",
    right: "2px",
    background: "red",
    border: "none",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "12px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "0",
    cursor: "pointer",
  }}
>
  ✖
</button>
          </div>
        ))}
      </div>
    </>
  )}
</Form.Group>
            ))}
           <div className="d-flex " style={{ gap: "20px" }}>
  {step > 1 && (
   <button
    type="button"
    onClick={() => {
      if (step === 1) {
        // ارجع لصفحة appointment
        window.location.href = "/appointment"; // أو استخدم useNavigate إذا React Router
      } else {
        handlePrevious();
      }
    }}
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
)}
  
  <button
    type="submit"
    style={{
      flex:1,
      backgroundColor: "#2a7371",
      border: "none",
      fontSize: "20px",
      padding: "12px 24px",
      color: "#fff",
      borderRadius: "8px",
    }}
  >
{step === 1 && formData.medicalStatus === "مراجعة"
      ? "تثبيت الحجز"
      : step === 1
      ? "التالي ➡️"
      : step === 2
      ? "التالي ➡️"
      : "إرسال ✅"}     
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
        minHeight: "100dvh",
        width: "100%",
        padding: "100px 20px 50px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#f0f4f7",
        overflowY: "auto",
        color: "#2a7371",
        textAlign: "center",
        backgroundImage: `
          radial-gradient(circle at 5% 10%, rgba(42,115,113,0.10) 25px, transparent 26px),
          radial-gradient(circle at 20% 25%, rgba(42,115,113,0.08) 20px, transparent 21px),
          radial-gradient(circle at 50% 75%, rgba(42,115,113,0.07) 20px, transparent 21px),
          radial-gradient(circle at 90% 80%, rgba(42,115,113,0.09) 30px, transparent 25px),
          radial-gradient(circle at 35% 40%, rgba(42,115,113,0.12) 30px, transparent 30px),
          radial-gradient(circle at 50% 15%, rgba(42,115,113,0.10) 28px, transparent 29px),
          radial-gradient(circle at 65% 35%, rgba(42,115,113,0.08) 35px, transparent 36px),
          radial-gradient(circle at 40% 75%, rgba(42,115,113,0.07) 20px, transparent 21px),
          radial-gradient(circle at 60% 80%, rgba(42,115,113,0.09) 30px, transparent 36px),
          radial-gradient(circle at 80% 20%, rgba(42,115,113,0.09) 25px, transparent 26px),
          radial-gradient(circle at 10% 60%, rgba(42,115,113,0.12) 30px, transparent 31px),
          radial-gradient(circle at 25% 75%, rgba(42,115,113,0.07) 20px, transparent 21px),
          radial-gradient(circle at 55% 90%, rgba(42,115,113,0.09) 30px, transparent 22px),
          radial-gradient(circle at 75% 65%, rgba(42,115,113,0.11) 22px, transparent 23px)
        `,
        backgroundRepeat: "no-repeat",
      }}
    >
      {step === 1 ? (
        <div className="container" style={{ maxWidth: "500px" }}>
          <div className="p-4 rounded shadow" style={{ backgroundColor: "rgba(255,255,255,0.9)", position : "relative" }}>


<button
    type="button"
    onClick={() =>navigate( "/appointment")} // يرجع لصفحة المواعيد
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
              <Form.Group style={{ marginBottom: "30px" }} controlId="formName">
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

              {/* العمر */}
              <Form.Group style={{ marginBottom: "30px" }} controlId="formAge">
                <Form.Control
                  type="text"
                  placeholder="أدخل عمر المريض"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  isInvalid={!!errors.age}
                  style={{
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
                  }}
                />
                {errors.age && <div className="text-danger text-end mt-2">{errors.age}</div>}
              </Form.Group>

              {/* الهاتف */}
              <Form.Group style={{ marginBottom: "30px", direction: "rtl", textAlign: "right" }} controlId="formPhone">
                <InputGroup>
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
                </InputGroup>
                {(errors.countryCode || errors.phone) && (
                  <div className="text-danger text-end mt-2">{errors.countryCode || errors.phone}</div>
                )}
              </Form.Group>

              {/* الفئة */}
              <Form.Group style={{ marginBottom: "30px" }} controlId="formCategory">
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
{errors.category && <div className="text-danger text-end mt-2">{errors.category}</div>}
              </Form.Group>

              {(formData.category === "نساء" || formData.category === "أطفال") && (
                <>
                  {formData.category === "نساء" && (
                    <Form.Group style={{ marginBottom: "30px" }} controlId="formJob">
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

                  <Form.Group style={{ marginBottom: "30px" }} controlId="formMedicalStatus">
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
                      <option value="مراجعة">مراجعة</option>
                    </Form.Select>
                    {errors.medicalStatus && (
                      <div className="text-danger text-end mt-2">{errors.medicalStatus}</div>
                    )}
                  </Form.Group>
                </>
              )}

              <button
                type="submit"
                className="w-100"
                style={{
                  backgroundColor: "#2a7371",
                  border: "none",
                  fontSize: "18px",
                  padding: "10px",
                  marginTop: "10px",
                  color: "#fff",
                  borderRadius: "8px",
                }}
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