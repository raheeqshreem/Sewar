import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./ForgetPassword.module.css";
import { Link } from "react-router-dom";

function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showToast, setShowToast] = useState(false); // للتحكم بظهور الاشعار

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
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch(
        "https://sewarwellnessclinic1.runasp.net/api/ForgetPassword/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Email: data.Email }),
        }
      );

      const result = await response.json();
      console.log("📩 استجابة السيرفر:", result); // 🔹 يطبع الرد في الكونسول

      if (response.ok) {
        setMessage("✅ Reset password link sent to your email.");
        setIsError(false);
        setShowToast(true);  // عرض الاشعار
        reset();
      } else {
        setMessage("⚠️ هذا البريد غير مسجل لدينا");
        setIsError(true);
        setShowToast(true);  // عرض الاشعار
      }

      // اخفاء الاشعار بعد 3 ثواني
      setTimeout(() => setShowToast(false), 120000);

    } catch (error) {
      console.error("❌ خطأ:", error);
      setMessage("⚠️ فشل الاتصال بالسيرفر");
      setIsError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 120000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      {/* اشعار فوق الصفحة */}
      {showToast && (
        <div
          className={`alert ${isError ? "alert-danger" : "alert-success"} text-center`}
          style={{
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            fontWeight:"bold",
            minWidth: "300px",
          }}
          role="alert"
        >
          {message}
        </div>
      )}

      <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.formBox}>Forgot Password</h1>

        <div className="mb-4">
          <div className="form-floating">
            <input
              {...register("Email", {
                required: "الرجاء إدخال بريدك الإلكتروني",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "البريد الإلكتروني غير صحيح",
                },
              })}
              type="Email"
              className={`form-control ${styles.customInput}`}
              id="floatingEmail"
              placeholder="name@gmail.com"
            />
            <label htmlFor="floatingEmail">Enter Your Email Address</label>
          </div>
          {errors.Email && (
            <p className={`${styles.textBeige}`}>{errors.Email.message}</p>
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