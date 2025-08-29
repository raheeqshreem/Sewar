

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./ResetPassword.module.css";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function ForgetPassword() {
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);






  useEffect(() => {
    document.body.classList.add(styles.loginBody);
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

  const password = watch("Password");
  

  return (
    <div className={styles.container}>
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      <form className={styles.formBox} >
        <h1 className={styles.formBoxH}>Create New Password</h1>

       <div className="mb-4">
          <div className="form-floating  position-relative">
            <input
              {...register("Password", {
                required: "Please Enter  New Password",
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
            <label htmlFor="floatingPassword"> Enter New Password</label>
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
          <button
            type="submit"
            className={`${styles.myBtn} btn w-100`}
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "Continue"}
          </button>
        </div>

        <p
          className="text-center mt-4"
          style={{ fontSize: 14, color: "beige" }}
        >
          Don't have an account ?{" "}
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

export default ForgetPassword;




































