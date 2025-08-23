import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const[showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    reset();
    navigate("/signin");
  };

  return (
    // العنصر الحاوي الرئيسي الذي يتحكم في التجاوب
    <div className={styles.container}>
      {/* العنصر الأول: الصورة */}
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      {/* العنصر الثاني: الفورم */}
      <form className={styles.formBox} onSubmit={handleSubmit(registerForm)}>
        <div className="form-floating mb-4 position-relative">
          <input
            {...register("FirstName", { required: "Please Enter First Name" })}
            type="text"
            className={`form-control ${styles.customInput}`}
            id="firstName"
            placeholder="firstName"
          />
          <label htmlFor="firstName">First Name</label>
          {errors.FirstName && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.FirstName.message}
            </p>
          )}
        </div>

        <div className="form-floating mb-4 position-relative">
          <input
            {...register("LastName", { required: "Please Enter Last Name" })}
            type="text"
            className={`form-control ${styles.customInput}`}
            id="lastName"
            placeholder="lastName"
          />
          <label htmlFor="lastName">Last Name</label>
          {errors.LastName && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.LastName.message}
            </p>
          )}
        </div>

        <div className="form-floating mb-4 position-relative">
          <input
            {...register("Email", { required: "Please Enter Email" })}
            type="email"
            className={`form-control ${styles.customInput}`}
            id="floatingEmail"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingEmail">Email address</label>
          {errors.Email && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.Email.message}
            </p>
          )}
        </div>

        <div className="form-floating mb-4 position-relative">
          <input
            {...register("Password", {
              required: "Please Enter Password",
              minLength: { value: 3, message: "Minimum 3 Characters" },
              maxLength: { value: 8, message: "Maximum 8 Characters" },
            })}
            type={showPassword ? "text" : "password"} // <-- تغيير نوع الحقل بناءً على الحالة
            className={`form-control ${styles.customInput}`}
            id="floatingPassword"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)} // <-- تبديل حالة الإظهار
            className="showPasswordButton"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              paddingRight: "0.75rem",
              display: "flex",
              alignItems: "center",
              color: "#94a3b8",
              backgroundColor: "white",
              border: "none",
              fontSize: "1rem",
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <label htmlFor="floatingPassword">Password</label>
          {errors.Password && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.Password.message}
            </p>
          )}
        </div>

        <div className="form-floating mb-4 position-relative">
          <input
            {...register("ConfirmPass", {
              required: "Please Confirm Password",
            })}
            type={showConfirmPassword ? "text" : "password"} // <-- تغيير نوع الحقل بناءً على الحالة
            className={`form-control ${styles.customInput}`}
            id="ConfirmPassword"
            placeholder="ConfirmPassword"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} // <-- تبديل حالة الإظهار
            className="showPasswordButton"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 0,
              paddingRight: "0.75rem",
              display: "flex",
              alignItems: "center",
              color: "#94a3b8",
              backgroundColor: "white",
              border: "none",
              fontSize: "1rem",
            }}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <label htmlFor="ConfirmPassword">Confirm Password</label>
          {errors.ConfirmPass && (
            <p className={`${styles.textBeige} position-absolute small`}>
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
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.UserType.message}
            </p>
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