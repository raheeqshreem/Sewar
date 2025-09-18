import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Google from "./../../assets/Google.png";
import { useGoogleLogin } from "@react-oauth/google";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
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
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const navigate = useNavigate();
  const password = watch("Password");

  const registerForm = async (values) => {
    const payload = {
      Email: values.Email,
      Password: values.Password,
      // في الفورم اسم الحقل ConfirmPass -> في الباك Confirmpassword
      Confirmpassword: values.ConfirmPass,
      FirstName: values.FirstName,
      LastName: values.LastName,
      // لو عندك UserName في الفورم استخدمه، ولو مش موجود خلي الايميل كـ username
      UserName: values.UserName || values.Email,
      // لو عايز تبعت UserType عشان الباك يختار role ممكن تبعته كحقل اضافي
    };

    try {
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/PatientRegister/register-patient",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data || "تم انشاء حسابك بنجاح.");
      reset();
      navigate("/signin");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data || err.message;
      toast.error(msg);
    }
  };



const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // إرسال التوكن للبك اند لإنشاء حساب جديد
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Auth/register-google-patient",
       {
          idToken: tokenResponse.credential, // <--- هذا بدل access_token
        }
      );

      toast.success(res.data || "تم إنشاء الحساب بنجاح عبر Google");
      navigate("/signin");
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data || err.message;
      toast.error(msg);
    }
  },
  onError: () => {
    toast.error("فشل إنشاء الحساب عبر Google");
  },
});






  return (
    // العنصر الحاوي الرئيسي الذي يتحكم في التجاوب
    <div className={styles.container}>
      {/* العنصر الأول: الصورة */}
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      {/* العنصر الثاني: الفورم */}
      <form className={styles.formBox} onSubmit={handleSubmit(registerForm)}>
        <div className="form-floating mb-4 position-relative">
          <div className="form-floating mb-4 position-relative">
            <input
              {...register("FirstName", {
                required: "Please Enter First Name",
                pattern: {
                  value: /^[^\d]+$/, // يقبل أي حرف أو رمز، ويمنع الأرقام
                  message: "First Name cannot contain numbers",
                },
              })}
              type="text"
              className={`form-control ${styles.customInput}`}
              id="firstName"
              placeholder="First Name"
            />
            <label htmlFor="firstName">First Name</label>
            {errors.FirstName && (
              <p className={`${styles.textBeige} position-absolute small`}>
                {errors.FirstName.message}
              </p>
            )}
          </div>
        </div>

        <div className="form-floating mb-4 position-relative">
          <div className="form-floating mb-4 position-relative">
            <input
              {...register("LastName", {
                required: "Please Enter Last Name",
                pattern: {
                  value: /^[^\d]+$/, // يقبل أي حرف أو رمز، ويمنع الأرقام
                  message: "Last Name cannot contain numbers",
                },
              })}
              type="text"
              className={`form-control ${styles.customInput}`}
              id="lastName"
              placeholder="Last Name"
            />
            <label htmlFor="lastName">Last Name</label>
            {errors.LastName && (
              <p className={`${styles.textBeige} position-absolute small`}>
                {errors.LastName.message}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <div className="form-floating mb-4 position-relative">
            <input
              {...register("Email", {
                required: "Please Enter Email",
                pattern: {
                  value: /^[^\s@]+@gmail\.com$/, // نص قبل @ و @gmail.com بالآخر
                  message: "Email must be in the format yourname@gmail.com",
                },
              })}
              type="email"
              className={`form-control ${styles.customInput}`}
              id="floatingEmail"
              placeholder="name@gmail.com"
            />

            <label htmlFor="floatingEmail">Email address</label>
          </div>
          {errors.Email && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.Email.message}
            </p>
          )}{" "}
        </div>
        <div className="mb-4">
          <div className="form-floating  position-relative">
            <input
              {...register("Password", {
                required: "Please Enter Password",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
                  message:
                    "Password must be 8-15 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character",
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
        <div className="mb-4">
          <div className="form-floating  position-relative">
            <input
              {...register("ConfirmPass", {
                required: "Please Confirm Password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showComfirmPassword ? "text" : "password"}
              className={`form-control ${styles.customInput}`}
              id="ConfirmPassword"
              placeholder="ConfirmPassword"
            />
            <button
              type="button"
              onClick={() => setShowComfirmPassword(!showComfirmPassword)}
              className={styles.showPasswordButton}
              aria-label={
                showComfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
              }
            >
              {showComfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="ConfirmPassword">Confirm Password</label>
          </div>
          {errors.ConfirmPass && (
            <p className={`${styles.textBeige} `}>
              {errors.ConfirmPass.message}
            </p>
          )}
        </div>

        <div>
          <button type="submit" className={`${styles.myBtn} btn w-100`}>
            Sign Up
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "beige",
            fontSize: 14,
          
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
       <button
  type="button"
  onClick={() => googleLogin()} // هذا الزر مفعل
  className="btn btn-light border d-flex align-items-center justify-content-center gap-2"
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
    style={{ width: "25px", height: "25px" }}
  />
  Continue with Google
</button>
         <p
          className="text-center mt-2"
          style={{ fontSize: 14, color: "beige" }}
        >
          Do have an account ?{" "}
          <Link
            to="/signin"
            className="text-decoration-none"
            style={{ fontSize: 14, color: "beige" }}
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
