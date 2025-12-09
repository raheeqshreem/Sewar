import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import GoogleLoginButton from "../GoogleLoginButton";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { FaRegGrinStars } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const toastShown = useRef(false);

  useEffect(() => {
    if (toastShown.current) return;

    const redirect = localStorage.getItem("redirectAfterLogin");

    if (redirect === "consultation") {
      toast.error("لتكتب استشارتك يرجى تسجيل الدخول أولاً");
    }
    if (redirect === "files") {
      toast.error("لمشاهدة ملفاتك يرجى تسجيل الدخول أولاً");
    }

    toastShown.current = true;
  }, []);

useEffect(() => {
  const rememberedEmail = localStorage.getItem("rememberedEmail");
  const rememberFlag = localStorage.getItem("rememberMe") === "1";

  setRemember(rememberFlag);

  if (rememberedEmail && rememberFlag) {
    setValue("Email", rememberedEmail);
  }
}, [setValue]);


  const onToggleRemember = (checked) => {
    setRemember(checked);
    if (!checked) {
      localStorage.removeItem("rememberedEmail");
      localStorage.setItem("rememberMe", "0");
    } else {
      localStorage.setItem("rememberMe", "1");
    }
  };

  const registerForm = async (values) => {
    setLoading(true);
    try {
      const check = await axios.get(
        "https://sewarwellnessclinic1.runasp.net/api/validation/CheckEmail",
        { params: { email: values.Email } }
      );

      if (!check.data.exists) {
        toast.custom(
          (t) => (
            <div
              style={{
                background: "#FAF1F4",
                padding: "16px 20px",
                borderRadius: "12px",
                color: "white",
                direction: "rtl",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                width: "280px",
                textAlign: "center",
                border: "2px solid #E4A6A6",
              }}
            >
              <strong style={{ fontSize: "16px", color: "#D28C8C" }}>
                البريد غير مسجّل
              </strong>

              <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#D28C8C" }}>
                لا يوجد حساب مرتبط بهذا البريد الإلكتروني.
              </span>

              <span
                onClick={() => {
                  toast.dismiss(t.id);
                  navigate("/signup");
                }}
                style={{
                  marginTop: "4px",
                  color: "#FFF",
                  background: "#E4A6A6",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                إنشاء حساب جديد
              </span>
            </div>
          ),
          { duration: 4000 }
        );

        setLoading(false);
        return;
      }

      const payload = {
        Email: values.Email,
        password: values.Password,
        rememberMe: remember,
      };

      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/LoginPatient/login",
        payload
      );

      const sessionData = {
        token: response.data.token,
        expiration: response.data.expiration,
        userId: response.data.userId,
        userType: response.data.userType,
        roles: response.data.roles,
        fullName: response.data.fullName,
        email: response.data.email,
      };

      localStorage.setItem("user", JSON.stringify(sessionData));
      localStorage.setItem("parentId", response.data.userId);

      if (remember) {
        localStorage.setItem("rememberedEmail", values.Email);
        localStorage.setItem("rememberMe", "1");
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.setItem("rememberMe", "0");
      }

      toast.custom(
        () => (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "16px 24px",
              background: "beige",
              color: "#333",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              fontFamily: "Arial, sans-serif",
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "18px",
                fontWeight: "600",
                color: "#2a7371",
              }}
            >
              <FaRegGrinStars color="#FFD700" size={24} />
              أهلاً بك في مركز سوار
            </div>
            <div style={{ marginTop: "8px", fontSize: "14px", color: "#2a7371" }}>
              نتمنى لك تجربة علاجية مميزة معنا
            </div>
          </div>
        ),
        { duration: 2000 }
      );

      let redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
      const userType = (sessionData.userType || "").toLowerCase();

      if (redirectAfterLogin === "files") {
        redirectAfterLogin =
          userType === "patient" ? "/FilesPagePatient" : "/FilesPage";
      } else if (redirectAfterLogin === "consultation") {
        redirectAfterLogin =
          userType === "doctor" || userType === "doctor_admin"
            ? "/consultation-doctor"
            : "/inquiry";
      } else if (
        !redirectAfterLogin ||
        redirectAfterLogin === "/signin" ||
        redirectAfterLogin === "/signup"
      ) {
        redirectAfterLogin =
          userType === "doctor" || userType === "doctor_admin"
            ? "/FilesPage"
            : "/";
      }

      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectAfterLogin);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "حدث خطأ أثناء تسجيل الدخول"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      <form className={styles.formBox} onSubmit={handleSubmit(registerForm)}>
        {/* Email */}
        <div className="form-floating mb-4 position-relative">
        <input
  {...register("Email", {
    required: "يرجى إدخال البريد الإلكتروني",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "صيغة البريد الإلكتروني غير صحيحة",
    },
  })}
  type="email"
  className={`form-control ${styles.customInput}`}
  id="floatingEmail"
  placeholder="name@gmail.com"
  onChange={(e) => {
    setValue("Email", e.target.value);

    if (remember) {
      localStorage.setItem("rememberedEmail", e.target.value);
    }
  }}
/>

          <label htmlFor="floatingEmail">البريد الإلكتروني</label>
          {errors.Email && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.Email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="form-floating position-relative">
            <input
              {...register("Password", {
                required: "يرجى إدخال كلمة المرور",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
                  message:
                    "يجب أن تكون كلمة المرور 8-15 حرفًا وتشمل حرف كبير وصغير ورقم ورمز",
                },
              })}
              type={showPassword ? "text" : "password"}
              className={`form-control ${styles.customInput}`}
              id="floatingPassword"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordButton}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="floatingPassword">كلمة المرور</label>
          </div>
          {errors.Password && (
            <p className={`${styles.textBeige}`}>{errors.Password.message}</p>
          )}
        </div>

        {/* Forgot */}
        <div className="mb-3">
          <Link
            to="/forgetPassword"
            className="text-decoration-none"
            style={{ fontSize: 14, color: "beige" }}
          >
            نسيت كلمة المرور؟
          </Link>
        </div>

        {/* Remember me */}
        <div
          className="form-check form-switch mb-3 d-flex align-items-center"
          style={{ padding: "0px", justifyContent: "space-between" }}
        >
          <label
            className="form-check-label me-2"
            htmlFor="rememberSwitch"
            style={{ fontSize: 14, color: "beige", padding: "0px" }}
          >
            تذكّر بيانات تسجيل الدخول
          </label>
          <input
            style={{ marginLeft: "0" }}
            className="form-check-input"
            type="checkbox"
            id="rememberSwitch"
            checked={remember}
            onChange={(e) => onToggleRemember(e.target.checked)}
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            className={`${styles.myBtn} btn w-100`}
            disabled={loading}
          >
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "beige",
            fontSize: 14,
            marginTop: 8,
            marginBottom: 8,
          }}
        >
          <hr
            style={{
              flex: 1,
              border: "none",
              borderTop: "1px solid beige",
              marginRight: 10,
            }}
          />
          <span>أو</span>
          <hr
            style={{
              flex: 1,
              border: "none",
              borderTop: "1px solid beige",
              marginLeft: 10,
            }}
          />
        </div>

        {/* Google */}
        <GoogleLoginButton setLoading={setLoading} />

        {/* Sign up */}
        <p
          className="text-center mt-4"
          style={{ fontSize: 14, color: "beige" }}
        >
          ليس لديك حساب؟{" "}
          <Link
            to="/signup"
            className="text-decoration-none"
            style={{ fontSize: 14, color: "beige" }}
          >
            إنشاء حساب
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;