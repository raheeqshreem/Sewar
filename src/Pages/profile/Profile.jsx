import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const accentColor = "#2a7371";
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
const user = JSON.parse(localStorage.getItem("user"));
const userType = user?.userType?.toLowerCase();  // doctor / patient / doctor_admin
const isDoctor = userType === "doctor" || userType === "doctor_admin";

  // -------------------- إضافة ستايت التعديل --------------------
  const [showEdit, setShowEdit] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [updateMsg, setUpdateMsg] = useState("");
  const [saving, setSaving] = useState(false);
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [showOld, setShowOld] = useState(false);
const { register, handleSubmit, formState: { errors }, setValue } = useForm({
  mode: "onChange",
});
const [showNew, setShowNew] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);

  const openEditModal = () => {
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");
    setEmail(data.email || "");
      setUpdateMsg(""); // ✨ إعادة تعيين الرسالة القديمة

    setShowEdit(true);
  };
const handleUpdate = async (values) => {
  setSaving(true);
  setUpdateMsg(""); // إعادة تعيين الرسالة

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    // ---------------- تعديل الاسم والإيميل ----------------
    if (values.firstName || values.lastName || values.email) {
      const response = await axios.put(
        "https://sewarwellnessclinic1.runasp.net/api/personalpage/me",
        {
          firstName: values.firstName || firstName,
          lastName: values.lastName || lastName,
          email: values.email || email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // تحديث البيانات في localStorage وstate
      const updatedUser = {
        ...user,
        firstName: values.firstName || firstName,
        lastName: values.lastName || lastName,
        email: values.email || email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setData(updatedUser);
    }

    // ---------------- تغيير الباسورد ----------------
    if (values.oldPassword && values.newPassword) {
      await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/personalpage/change-password",
        {
          currentPassword: values.oldPassword,
          newPassword: values.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    }

    setUpdateMsg("تم تحديث بياناتك بنجاح ✅");

    // إغلاق المودال بعد 1.5 ثانية
    setTimeout(() => {
      setShowEdit(false);
      navigate("/user");
    }, 1500);

  } catch (err) {
    console.error(err);
    setUpdateMsg("حدث خطأ أثناء تحديث البيانات أو كلمة المرور");
  } finally {
    setSaving(false);
  }
};






  // ------------------------------------------------------------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const token = user?.token;

        if (!token) {
          setError("لا يوجد تسجيل دخول");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://sewarwellnessclinic1.runasp.net/api/personalpage/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#e6f4f3",
        position: "relative",
        overflow: "hidden",
        paddingTop: "120px",
        paddingBottom: "80px",
      }}
    >
      {Array.from({ length: 35 }).map((_, i) => {
        const size = Math.random() * 80 + 20;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 6;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.15 + 0.05;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-120px",
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: "50%",
              background: `rgba(42,115,113,${opacity})`,
              animation: `fallDown ${duration}s linear ${delay}s infinite`,
            }}
          />
        );
      })}

      <style>
        {`
          @keyframes fallDown {
            0% {
              transform: translateY(-100px); 
              opacity: 0.9;
            }
            100% {
              transform: translateY(220vh);
              opacity: 0.3;
            }
          }
        `}
      </style>

      <div
        className="container"
        style={{
          maxWidth: "700px",
          marginTop: "20px",
          marginBottom: "80px",
        }}
      >
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-success"></div>
            <p className="mt-2">جاري تحميل البيانات...</p>
          </div>
        )}

        {error && <div className="alert alert-danger text-center">{error}</div>}

        {data && (
          <div className="card shadow-lg p-4 rounded-4">
            {/* صورة الدائرة */}
            <div className="text-center mb-3">
              <div
                style={{
                  width: "90px",
                  height: "90px",
                  margin: "auto",
                  borderRadius: "50%",
                  background: accentColor,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "32px",
                  fontWeight: "bold",
                }}
              >
                {data.firstName?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* الاسم */}
            <h5 className="text-center" style={{ color: accentColor }}>
              {data.firstName} {data.lastName}
            </h5>

            {/* الإيميل */}
            <p className="text-center text-muted">{data.email}</p>

            {/* جملة ترحيبية */}
            <div
              className="mt-4 text-center p-4 rounded-4"
              style={{
                background: "#e6f4f3",
                position: "relative",
                overflow: "hidden",
                color: accentColor,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  left: "-20px",
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.12)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  bottom: "-40px",
                  right: "-10px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.10)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "-25px",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.06)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "-25px",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.08)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "40%",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.05)",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  top: "-15px",
                  right: "30%",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.09)",
                }}
              ></div>

              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  left: "50%",
                  width: "75px",
                  height: "75px",
                  borderRadius: "50%",
                  background: "rgba(42,115,113,0.07)",
                  transform: "translateX(-50%)",
                }}
              ></div>

              <h4 style={{ position: "relative", zIndex: 2 }}>
                 أهلاً بك يا  {data.firstName}
              </h4>
              <p style={{ position: "relative", zIndex: 2 }}>
                💚 نتمنى لك يوماً صحياً مليئاً بالطاقة
              </p>
            </div>

            <hr />

          {/* البطاقات حسب نوع المستخدم */}
<div className="row g-3 mt-3">

  {/* === إذا كان المستخدم مريض (patient) → تظهر 3 أزرار === */}
  {!isDoctor && (
    <>
      <div className="col-12">
        <div
          className="p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
          style={{ background: "#f7faf9", cursor: "pointer" }}
          onClick={() => navigate("/inquiry")}
        >
          <span style={{ color: accentColor, fontWeight: "500" }}>
            ✍️ كتابة استشارة
          </span>
          <span className="text-muted">→</span>
        </div>
      </div>

      <div className="col-12">
        <div
          className="p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
          style={{ background: "#f7faf9", cursor: "pointer" }}
          onClick={() => navigate("/feedback")}
        >
          <span style={{ color: accentColor, fontWeight: "500" }}>
            ⭐ إرسال تقييم / Feedback
          </span>
          <span className="text-muted">→</span>
        </div>
      </div>

      <div className="col-12">
        <div
          className="p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
          style={{ background: "#f7faf9", cursor: "pointer" }}
          onClick={() => navigate("/appointment")}
        >
          <span style={{ color: accentColor, fontWeight: "500" }}>
            📅 حجز موعد
          </span>
          <span className="text-muted">→</span>
        </div>
      </div>
      {/* ==== بطاقة جديدة لعرض تخصصات المركز ==== */}
    <div className="col-12">
      <div
        className="p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
        style={{ background: "#f7faf9", cursor: "pointer" }}
        onClick={() => navigate("/OurSpecialties")} // الرابط لصفحة التخصصات
      >
        <span style={{ color: accentColor, fontWeight: "500" }}>
          🩺 عرض تخصصات المركز
        </span>
        <span className="text-muted">→</span>
      </div>
    </div>
    </>
  )}

  {/* === إذا كان المستخدم دكتور → يظهر زر واحد فقط === */}
  {isDoctor && (
    <>
    <div className="col-12">
      <div
        className="p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
        style={{ background: "#f7faf9", cursor: "pointer" }}
        onClick={() => navigate("/FilesPage")}
      >
        <span style={{ color: accentColor, fontWeight: "500" }}>
          📁 مواعيدي اليوم
        </span>
        <span className="text-muted">→</span>
      </div>
    </div>

    <div className="col-12">
      <div
        className="p-3 rounded-3 shadow-sm d-flex justify-content-between align-items-center"
        style={{ background: "#f7faf9", cursor: "pointer" }}
        onClick={() => navigate("/OurSpecialties")} // الرابط لصفحة التخصصات
      >
        <span style={{ color: accentColor, fontWeight: "500" }}>
          🩺 عرض تخصصات المركز
        </span>
        <span className="text-muted">→</span>
      </div>
    </div>
</>
  )}

</div>


          


            {/* زر تعديل البيانات */}
            <button
              className="btn w-100 mt-4"
              style={{ background: accentColor, color: "white" }}
              onClick={openEditModal}
            >
  هل تريد تعديل كلمة المرور ؟            </button>
          </div>
        )}
      </div>

      {/* -------------------- مودال التعديل -------------------- */}
   {/* -------------------- مودال التعديل -------------------- */}
{showEdit && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      className="p-4 rounded-4 shadow-lg"
      style={{ background: "white", width: "90%", maxWidth: "400px" }}
    >
      <h5 className="text-center mb-3" style={{ color: accentColor }}>
   تعديل كلمة المرور 
      </h5>

      <form onSubmit={handleSubmit(handleUpdate)}>
    

{/* ------------------ حقول تغيير كلمة المرور ------------------ */}
<div className="mb-3">



  <div className="input-group mb-3">
    <input
      {...register("oldPassword", {
        required: "الرجاء إدخال كلمة المرور القديمة",
      })}
      type={showOld ? "text" : "password"}
      className="form-control"
      placeholder="كلمة المرور القديمة"
      autoComplete="new-password"
    />

    <span
      className="input-group-text"
      style={{ cursor: "pointer" }}
      onClick={() => setShowOld(!showOld)}
    >
      {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
    </span>
  </div>

  {errors.oldPassword && (
    <p className="text-danger small text-center">
      {errors.oldPassword.message}
    </p>
  )}




{/* كلمة المرور الجديدة */}
<div className="input-group mb-3">
  <input
    {...register("newPassword", {
      pattern: {
        value:
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
        message:
          "كلمة المرور يجب أن تكون بين 8-15 حرفًا، وتحتوي على رقم، وحرف كبير، وحرف صغير ورمز خاص",
      },
    })}
    type={showNew ? "text" : "password"}
    className="form-control"
    placeholder="كلمة المرور الجديدة"
  />
  <span
    className="input-group-text"
    style={{ cursor: "pointer" }}
    onClick={() => setShowNew(!showNew)}
  >
    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
  </span>
</div>
{errors.newPassword && (
  <p className="text-danger small">{errors.newPassword.message}</p>
)}

</div>

        {/* ----------------------------------------------------------- */}

        {updateMsg && (
          <p className="text-center text-success">{updateMsg}</p>
        )}

        <button
          className="btn w-100 mb-2"
          style={{ background: accentColor, color: "white" }}
          disabled={saving}
        >
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>

        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={() => setShowEdit(false)}
        >
          إلغاء
        </button>
      </form>
    </div>
  </div>
)}


    </div>
  );
}
