import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import GoogleLoginButton from "../GoogleLoginButton";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { FaRegGrinStars } from "react-icons/fa"; // أيقونة ترحيب

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

  // عند التحميل: قراءة rememberedEmail و rememberMe
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const rememberFlag = localStorage.getItem("rememberMe"); // "1" أو "0" أو null
    if (rememberedEmail) {
      setValue("Email", rememberedEmail);
      setRemember(true);
    } else if (rememberFlag === "1") {
      // المستخدم فعّل الخيار سابقًا لكن لم نخزن الإيميل بعد
      setRemember(true);
    }
  }, [setValue]);

  // عند تغيير الcheckbox: نحفظ العلم فوراً، وإذا ألغاه المستخدم نمسح الايميل
  const onToggleRemember = (checked) => {
    setRemember(checked);
    if (!checked) {
      // لو ألغى: امسح الايميل المخزن فورًا (UX)
      localStorage.removeItem("rememberedEmail");
      localStorage.setItem("rememberMe", "0");
    } else {
      // لو فعّل: سجل العلم، لكن الايميل نفسه نحفظه عند نجاح الدخول
      localStorage.setItem("rememberMe", "1");
    }
  };

  // الدالة الرئيسية لتسجيل الدخول
  const registerForm = async (values) => {
    setLoading(true);
    try {
      const payload = {
        Email: values.Email,
        password: values.Password,
        rememberMe: remember, // ✅ صح كده
      };

      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/LoginPatient/login",
        payload
      );

      console.log("Response:", response.data);

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
              <FaRegGrinStars color="#FFD700" size={24} /> {/* أيقونة ترحيب */}
              أهلاً بك في مركز سوار
            </div>
            <div
              style={{ marginTop: "8px", fontSize: "14px", color: "#2a7371" }}
            >
              نتمنى لك تجربة علاجية مميزة معنا
            </div>
          </div>
        ),
        { duration: 10000 } // يظهر لمدة دقيقة
      );
      // ✅ بعد نجاح تسجيل الدخول
     // ✅ بعد نجاح تسجيل الدخول
// بعد تسجيل الدخول بنجاح
let redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
const userType = (sessionData.userType || "").toLowerCase();

// إذا كانت هناك صفحة محفوظة
if (redirectAfterLogin === "consultation") {
  redirectAfterLogin =
    userType === "doctor" || userType === "doctor_admin"
      ? "/consultation-doctor"
      : "/inquiry";
} else if (!redirectAfterLogin || redirectAfterLogin === "/signin" || redirectAfterLogin === "/signup") {
  // توجيه افتراضي حسب نوع المستخدم
  if (userType === "doctor" || userType === "doctor_admin") {
    redirectAfterLogin = "/consultation-doctor";
  } else if (userType === "patient") {
    redirectAfterLogin = "/inquiry";
  } else {
    redirectAfterLogin = "/";
  }
}

// حذف المفتاح بعد الاستخدام
localStorage.removeItem("redirectAfterLogin");

// التوجيه النهائي
navigate(redirectAfterLogin);
    } catch (error) {
      console.error("Login error full:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          "خطأ في تسجيل الدخول"
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
              required: "Please Enter Email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email must be valid",
              },
            })}
            type="email"
            className={`form-control ${styles.customInput}`}
            id="floatingEmail"
            placeholder="name@gmail.com"
          />
          <label htmlFor="floatingEmail">Email address</label>
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
                required: "Please Enter Password",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
                  message:
                    "Password must be 8-15 characters, contain a number, uppercase, lowercase and special char",
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
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="floatingPassword">Password</label>
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
            Forgot password?
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
            Remember sign in details
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
            {loading ? "جاري تسجيل الدخول..." : "Log in"}
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
          <span>OR</span>
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

        {/* Sign up link */}
        <p
          className="text-center mt-4"
          style={{ fontSize: 14, color: "beige" }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none"
            style={{ fontSize: 14, color: "beige" }}
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;