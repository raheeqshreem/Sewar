import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";

function Login() {
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
      <form
        className={styles.formBox}
        onSubmit={handleSubmit(registerForm)}
      >

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
            type="password"
            className={`form-control ${styles.customInput}`}
            id="floatingPassword"
            placeholder="Password"
          />
          <label htmlFor="floatingPassword">Password</label>
          {errors.Password && (
            <p className={`${styles.textBeige} position-absolute small`}>
              {errors.Password.message}
            </p>
          )}
        </div>

        

        

        <div>
          <button type="submit" className={`${styles.myBtn} btn w-100`}>
            Log in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;