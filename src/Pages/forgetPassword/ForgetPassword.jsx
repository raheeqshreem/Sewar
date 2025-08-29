import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./ForgetPassword.module.css";
import { Link } from "react-router-dom";

function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

    try {
      // الرابط من الباك (انت بتعطيني إياه مثلاً)
      const response = await fetch("http://localhost:5000/api/forget-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.Email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("✅ تم إرسال رابط إعادة التعيين لبريدك الإلكتروني");
        reset();
      } else {
        setMessage(result.message || "حدث خطأ، حاول مرة أخرى");
      }
    } catch (error) {
      setMessage("⚠️ فشل الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
        <h1 className={styles.formBox}>Forgot Password</h1>

        <div className="mb-4">
          <div className="form-floating">
            <input
              {...register("Email", {
                required: "Please Enter Email",
                pattern: {
                  value: /^[^\s@]+@gmail\.com$/,
                  message: "Email must be in the format yourname@gmail.com",
                },
              })}
              type="email"
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

        {message && (
          <p className="text-center" style={{ color: "beige" }}>
            {message}
          </p>
        )}

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