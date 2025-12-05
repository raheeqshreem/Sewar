import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

export default function Cards() {
  const location = useLocation();
  const navigate = useNavigate();
  const editData = location.state || null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // لو الصفحة فتحت بحالة تعديل — اجلب البيانات من الـ API لضمان آخر نسخة
  useEffect(() => {
    const fillFromState = () => {
      if (editData) {
        // قيمة افتراضية من الحالة المرسلة (في حال الباك يرجع null)
        if (editData.title) setTitle(editData.title);
        if (editData.description) setDescription(editData.description);
        if (editData.image) setPreviewUrl(editData.image);
      }
    };

    const fetchFromApi = async () => {
      if (editData?.isEdit && editData.id) {
        try {
          const res = await axios.get(
            `https://sewarwellnessclinic1.runasp.net/api/Services/card/${editData.id}`
          );
          const data = res.data || {};
          // إذا الـ API رجع قيم، عبيها — وإلا خلي القيم اللي أرسلتها من الواجهة
          if (data.title) setTitle(data.title);
          if (data.description) setDescription(data.description);
          if (data.picUrl) setPreviewUrl(`https://sewarwellnessclinic1.runasp.net${data.picUrl}`);
          else if (!data.title && !data.description && !data.picUrl) {
            // لو الـ API رجع null لكل شي، استخدم ما تم إرساله من الواجهة (fallback)
            fillFromState();
          }
        } catch (err) {
          console.error("خطأ بجلب بيانات الكارت:", err);
          // في حال فشل الطلب، نملأ بالفالد من الواجهة لو موجودة
          fillFromState();
        }
      } else {
        // إذا ليست حالة تعديل، املأ من الحالة إذا نقلت (إذا ضغطت "تعديل" على كارت ثابت)
        fillFromState();
      }
    };

    fetchFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // تحقق بسيط: لو تعديل وكونت بدون صورة ممكن تكون مقبولة حسب الباك
    if (!title.trim() || !description.trim()) {
      alert("❌ الرجاء تعبئة العنوان والوصف");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Description", description);
    if (imageFile) {
      formData.append("ImageFile", imageFile);
    }

    try {
      if (editData?.isEdit && editData.id) {
        // تعديل (PUT)
        await axios.put(
          `https://sewarwellnessclinic1.runasp.net/api/Services/update/${editData.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✔️ تم تعديل الخدمة بنجاح");
      } else {
        // إضافة جديدة (POST)
        await axios.post(
          "https://sewarwellnessclinic1.runasp.net/api/Services/create",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✔️ تمت إضافة الخدمة بنجاح");
      }

      // بعد النجاح، عد للصفحة الرئيسية للكروت
      navigate("/OurSpecialties");
      

    } catch (err) {
      console.error("خطأ أثناء الإرسال:", err.response || err);
      alert("❌ حدث خطأ أثناء الإرسال، افحص الكونسول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        background: "linear-gradient(135deg, #f0f8f7, #dfeeea)",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      <Container style={{ direction: "rtl", textAlign: "right" }}>
        <Row className="justify-content-center">
          <Col md={7}>
            <Card className="shadow-lg p-5 rounded-5" style={{ border: "none", background: "white" }}>
              <h2 className="text-center mb-4" style={{ color: "#2a7371", fontWeight: "700" }}>
                {editData?.isEdit ? "تعديل الخدمة" : "إضافة خدمة جديدة"}
              </h2>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#2a7371" }}>العنوان</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="اكتب عنوان الخدمة..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ textAlign: "right", padding: "12px", borderRadius: "12px" }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label style={{ fontWeight: "600", color: "#2a7371" }}>الوصف</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="اكتب النقاط، كل نقطة بسطر..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ textAlign: "right", direction: "rtl", padding: "12px", borderRadius: "12px" }}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: "600", color: "#2a7371" }}>الصورة</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                    style={{ cursor: "pointer", padding: "10px", borderRadius: "12px" }}
                  />
                </Form.Group>

                {previewUrl && (
                  <div style={{ position: "relative", display: "inline-block", marginBottom: "20px" }}>
                    <img
                      src={previewUrl}
                      alt="Preview"
                      style={{
                        width: "100%",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                      }}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "28px",
                        height: "28px",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-100 py-3"
                  style={{
                    background: "#2a7371",
                    borderColor: "#2a7371",
                    fontSize: "18px",
                    borderRadius: "14px",
                    fontWeight: "600",
                  }}
                  disabled={loading}
                >
                  {loading ? "جاري الإرسال..." : editData?.isEdit ? "تعديل الخدمة" : "إضافة الخدمة"}
                </button>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
