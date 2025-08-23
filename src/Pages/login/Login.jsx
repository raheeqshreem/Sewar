import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Google from "./../../assets/Google.png";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  useEffect(() => {
    // هذا الكود يضيف خلفية خاصة للصفحة عند الدخول إليها
    document.body.classList.add(styles.loginBody);
    // ويزيلها عند الخروج
    return () => {
      document.body.classList.remove(styles.loginBody);
    };
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();

  const registerForm = (values) => {
    console.log(values);
    // هنا سترسل البيانات للسيرفر
    toast.success("  مركز سوار للعلاج الطبيعي يرحب بكم", {
      duration: 3000,
      style: {
        fontSize: "18px", // حجم الخط
        padding: "16px", // مسافة داخلية
        minWidth: "200px", // عرض أكبر
        direction: "rtl", // اتجاه النص من اليمين لليسار
      },
      position: "top-center", // موضع الرسالة
    });
    reset();
    navigate("/");
  };
  const [remember, setRemember] = useState(false);

  return (
    // العنصر الحاوي الرئيسي الذي يتحكم في التجاوب
    <div className={styles.container}>
      {/* العنصر الأول: الصورة */}
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      {/* العنصر الثاني: الفورم */}
      <form className={styles.formBox} onSubmit={handleSubmit(registerForm)}>
        <div className="form-floating mb-4 position-relative">
          <input
            {...register("Email", {
              required: "Please Enter Email",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // نص قبل @ و @gmail.com بالآخر
                message: "Email must be in the format yourname@gmail.com",
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
<div className="mb-4">
        <div className="form-floating  position-relative">
          <input
            {...register("Password", {
              required: "Please Enter Password",
              pattern: {
                value:
           /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,              message:
                  "Password must be 8-15 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character",
              },
            })}
            type={showPassword ? "text" : "password"} // <-- تغيير نوع الحقل بناءً على الحالة
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
        <div className="mb-3">
          <a
            href="#"
            className="text-decoration-none"
            style={{ fontSize: 14, color: "beige" }}
          >
            Forgot password?
          </a>
        </div>

        <div className="form-check form-switch mb-3 d-flex align-items-center">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberSwitch"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />
          <label
            className="form-check-label ms-2"
            htmlFor="rememberSwitch"
            style={{ fontSize: 14, color: "beige" }}
          >
            Remember sign in details
          </label>
        </div>

        <div>
          <button type="submit" className={`${styles.myBtn} btn w-100`}>
            Log in
          </button>
        </div>

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
        <button
          type="button"
          className="btn btn-light  border d-flex align-items-center justify-content-center gap-2"
          style={{
            borderRadius: "30px",
            width: "100%",
            height: "35px",
            fontSize: "14px",
          }}
        >
          <img
            src={Google}
            alt="Google"
            className="me-2"
            style={{ width: "25px", height: "25px" }}
          />
          Continue with Google
        </button>

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