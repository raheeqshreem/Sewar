
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./ResetPassword.module.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // جلب التوكن والإيميل من الرابط
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    document.body.classList.add(styles.loginBody);
    return () => {
      document.body.classList.remove(styles.loginBody);
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const password = watch("Password");

  const onSubmit = async (data) => {
    if (!token || !email) {
      alert("الرابط غير صالح أو انتهت صلاحيته");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://sewarwellnessclinic1.runasp.net/api/ForgetPassword/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,           // الإيميل مأخوذ من الرابط
            token: token,           // التوكن من الرابط
            newpassword: data.Password,
            confirmpassword: data.ConfirmPass,
          }),
        }
      );

      if (response.ok) {
        alert("تم تغيير كلمة المرور بنجاح ✅");
        navigate("/signin"); // إعادة توجيه المستخدم لصفحة تسجيل الدخول
      } else {
        const errorData = await response.json();
        alert(errorData.message || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("مشكلة في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.formBoxH}>Create New Password</h1>

        {/* حقل كلمة المرور */}
        <div className="mb-4">
          <div className="form-floating position-relative">
            <input
              {...register("Password", {
                required: "Please Enter New Password",
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
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="floatingPassword">Enter New Password</label>
          </div>
          {errors.Password && (
            <p className={`${styles.textBeige}`}>{errors.Password.message}</p>
          )}
        </div>

        {/* حقل تأكيد كلمة المرور */}
        <div className="mb-4">
          <div className="form-floating position-relative">
            <input
              {...register("ConfirmPass", {
                required: "Please Confirm Password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              className={`form-control ${styles.customInput}`}
              id="ConfirmPassword"
              placeholder="ConfirmPassword"
            />
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className={styles.showPasswordButton}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="ConfirmPassword">Confirm Password</label>
          </div>
          {errors.ConfirmPass && (
            <p className={`${styles.textBeige}`}>
              {errors.ConfirmPass.message}
            </p>
          )}
        </div>

        {/* زر الإرسال */}
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

export default ResetPassword;































