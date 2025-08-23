import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

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

  const registerForm = (values) => {
    console.log(values);
    toast.success("تم انشاء حسابك بنجاح.", {
      duration: 2000,
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
              id="lasttName"
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
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,                  message:
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

        <div className="mb-3">
          <select
            {...register("UserType", { required: "Please Enter UserType" })}
            id="inputState"
            className={`${styles.customInput} form-select text-secondary `}
          >
            <option value="">User Type...</option>
            <option value="Patient">Patient</option>
            <option value="Doctor">Doctor</option>
            <option value="Secretary">Secretary</option>
          </select>
          {errors.UserType && (
            <p className={`${styles.textBeige}`}>{errors.UserType.message}</p>
          )}
        </div>

        <div>
          <button type="submit" className={`${styles.myBtn} btn w-100`}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;