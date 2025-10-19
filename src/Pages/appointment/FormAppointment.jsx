import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";

export default function FormAppointment() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    category: "",
    countryCode: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone || !formData.category) {
      alert("يرجى تعبئة جميع الحقول المطلوبة");
      return;
    }
    alert("تم حفظ بيانات المريض بنجاح ✅");
  };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
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
      <div className="container" style={{ maxWidth: "500px" }}>
        <div
          className="p-4 rounded shadow"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <h3 className="mb-4" style={{ paddingBottom: "30px" }}>
            بيانات المريض
          </h3>

          <Form onSubmit={handleSubmit}>
            <Form.Group style={{ marginBottom: "40px" }} controlId="formName">
              <Form.Control
                type="text"
                placeholder="أدخل اسم المريض"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  border: "2px solid #2a7371",
                  color: "#2a7371",
                  direction: "rtl",
                  textAlign: "right",
                }}
              />
            </Form.Group>

            <Form.Group style={{ marginBottom: "40px" }} controlId="formAge">
              <Form.Control
                type="number"
                placeholder="أدخل عمر المريض"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="0"
                style={{
                  border: "2px solid #2a7371",
                  color: "#2a7371",
                  direction: "rtl",
                  textAlign: "right",
                }}
              />
            </Form.Group>

            <Form.Group
              style={{ marginBottom: "40px", direction: "rtl", textAlign: "right" }}
              controlId="formPhone"
            >
              <InputGroup>
                <Form.Select
                  name="countryCode"
                  value={formData.countryCode || ""}
                  onChange={handleChange}
                  required
                  style={{
                    maxWidth: "160px",
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
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
                  type="tel"
                  placeholder="أدخل رقم الهاتف"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  style={{
                    border: "2px solid #2a7371",
                    color: "#2a7371",
                    direction: "rtl",
                    textAlign: "right",
                    borderRadius: "7px",
                  }}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group style={{ marginBottom: "40px" }} controlId="formCategory">
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
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
            </Form.Group>
          </Form>
        </div>
      </div>

      {/* زر التالي خارج الصندوق الأبيض */}
      <Button
        type="submit"
        onClick={handleSubmit}
        style={{
          backgroundColor: "#2a7371",
          border: "none",
          fontSize: "18px",
          padding: "10px 40px",
          color: "#fff",
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "10px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        التالي ➡️
      </Button>
    </div>
  );
}