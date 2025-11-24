import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
  Form,
  Button,
  InputGroup,
} from "react-bootstrap";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  // جلب المستخدمين
  const fetchUsers = async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/all?search=${query}`
        : "https://sewarwellnessclinic1.runasp.net/api/appointmentscheduler/all";

      const response = await axios.get(url);
      setUsers(response.data);
    } catch (err) {
      setError("حدث خطأ أثناء تحميل المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    await fetchUsers(search.trim());
    setSearching(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f0e6",
        paddingTop: "40px",
        paddingBottom: "100px", // مساحة للزر أسفل الصفحة
      }}
    >
      <Container style={{ marginTop: "60px" }}>
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: "#008b8b", letterSpacing: "1px" }}
        >
          👥 جميع الحسابات
        </h2>

        {/* ====== مربع البحث ====== */}
        <Form
          onSubmit={handleSearch}
          className="d-flex justify-content-center mb-5"
        >
          <InputGroup style={{ width: "60%", maxWidth: "500px" }}>
            <Form.Control
              type="text"
              placeholder="ابحث عن مستخدم بالاسم أو الإيميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "10px 0 0 10px",
                borderColor: "#008b8b",
              }}
            />
            <Button
              type="submit"
              disabled={searching}
              style={{
                backgroundColor: "#008b8b",
                borderColor: "#008b8b",
                borderRadius: "0 10px 10px 0",
              }}
            >
              {searching ? "جاري البحث..." : "بحث"}
            </Button>
          </InputGroup>
        </Form>

        {/* ====== حالة التحميل ====== */}
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" variant="info" />
            <p className="mt-3 text-secondary">جاري تحميل المستخدمين...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="text-center shadow-sm">
            {error}
          </Alert>
        ) : users.length === 0 ? (
          <p className="text-center text-muted mt-5 fs-5">
            لا يوجد مستخدمين مطابقين لبحثك.
          </p>
        ) : (
          <Row className="justify-content-center">
            {users.map((user) => (
              <Col
                key={user.applicationUserId}
                md={4}
                sm={6}
                xs={12}
                className="mb-4"
              >
                <Card
                  className="shadow-sm border-0 rounded-4 h-100"
                  style={{
                    backgroundColor: "#006d6d",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 10px rgba(0,0,0,0.1)";
                  }}
                >
       <Card.Body className="text-center">
  <Card.Title
    className="fw-bold mb-3" // زيادة المسافة أسفل الاسم
    style={{ color: "beige" }}
  >
    {user.firstName} {user.lastName}
  </Card.Title>
  <Card.Text
    style={{ color: "#f5f0e6" }}
    className="mb-3" // زيادة المسافة أسفل الإيميل
  >
    {user.email}
  </Card.Text>

  {/* زر إضافة موعد في وسط الكارد */}
  <div className="d-flex justify-content-center mt-3"> {/* زيادة المسافة فوق الزر */}
    <button
     onClick={() => {
  localStorage.setItem("selectedEmail", user.email);
localStorage.setItem("fromPage", "usersList");

  navigate("/appointment", { state: { asPatient: true } });
}}

      style={{
        backgroundColor: "beige",
        color: "#006d6d",
        border: "1px solid #006d6d",
        borderRadius: "6px",
        padding: "6px 12px", // زيادة حجم الزر قليلًا
        fontWeight: "600",
        fontSize: "0.85rem",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f0e5d8";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "beige";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      ➕ إضافة موعد
    </button>
  </div>
</Card.Body>


                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* ====== زر إنشاء حساب أسفل الصفحة ====== */}
      <div className="d-flex justify-content-center mt-4">
        <button
          onClick={() => navigate("/signup")}
          style={{
            backgroundColor: "#006d6d",
            borderColor: "beige",
            color:"beige",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            fontWeight: "600",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#008b8b";
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#008b8b";
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
        >
          <PlusCircle size={20} />
          إنشاء حساب
        </button>
      </div>
    </div>
  );
}

export default UsersList;
