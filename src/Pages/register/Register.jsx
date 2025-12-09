import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./Register.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import GoogleLoginButton from "../GoogleLoginButton";

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showComfirmPassword, setShowComfirmPassword] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(JSON.parse(localStorage.getItem("user")));
  const isSecretary = user?.userType === "scheduler_admin";

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


// استعادة البيانات بعد فتح الصفحة
useEffect(() => {
  const saved = localStorage.getItem("registerForm");
  if (saved) {
    reset(JSON.parse(saved));
  }
}, [reset]);

// حفظ القيم أثناء الكتابة
useEffect(() => {
  const subscription = watch((value) => {
    localStorage.setItem("registerForm", JSON.stringify(value));
  });

  return () => subscription.unsubscribe();
}, [watch]);



  const navigate = useNavigate();
  const password = watch("Password");

  const registerForm = async (values) => {
    const payload = {
      Email: values.Email,
      Password: values.Password,
      Confirmpassword: values.ConfirmPass,
      FirstName: values.FirstName,
      LastName: values.LastName,
      UserName: values.UserName || values.Email,
    };

    try {
      const res = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/PatientRegister/register-patient",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data || "تم إنشاء حسابك بنجاح.");
      reset();
localStorage.removeItem("registerForm");

      if (isSecretary) {
        navigate("/users");
      } else {
        navigate("/signin");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.response?.data || err.message;
      toast.error(msg);
    }
  };

  return (
    <div className={styles.container}>
      {/* الصورة */}
      <img src={logoo} className={styles.loginImage} alt="شعار العيادة" />

      {/* الفورم */}
      <form className={styles.formBox} onSubmit={handleSubmit(registerForm)}>
        <div className="form-floating mb-4 position-relative">
          <div className="form-floating mb-4 position-relative">
            <input
              {...register("FirstName", {
                required: "يرجى إدخال الاسم الأول",
                pattern: {
                  value: /^[^\d]+$/,
                  message: "لا يمكن أن يحتوي الاسم الأول على أرقام",
                },
              })}
              type="text"
              className={`form-control ${styles.customInput}`}
              id="firstName"
              placeholder="الاسم الأول"
            />
            <label htmlFor="firstName">الاسم الأول</label>
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
                required: "يرجى إدخال اسم العائلة",
                pattern: {
                  value: /^[^\d]+$/,
                  message: "لا يمكن أن يحتوي اسم العائلة على أرقام",
                },
              })}
              type="text"
              className={`form-control ${styles.customInput}`}
              id="lastName"
              placeholder="اسم العائلة"
            />
            <label htmlFor="lastName">اسم العائلة</label>
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
                required: "يرجى إدخال البريد الإلكتروني",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "صيغة البريد الإلكتروني غير صحيحة",
                },
              })}
              type="email"
              className={`form-control ${styles.customInput}`}
              id="floatingEmail"
              placeholder="name@gmail.com"
            />

            <label htmlFor="floatingEmail">البريد الإلكتروني</label>
            {errors.Email && (
              <p className={`${styles.textBeige} position-absolute small`}>
                {errors.Email.message}
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="form-floating  position-relative">
            <input
              {...register("Password", {
                required: "يرجى إدخال كلمة المرور",
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,15}$/,
                  message:
                    "يجب أن تكون كلمة المرور من 8-15 حرفًا وتحتوي على حرف كبير وصغير ورقم بالانجليزي ورمز",
                },
              })}
              type={showPassword ? "text" : "password"}
              className={`form-control ${styles.customInput}`}
              id="floatingPassword"
              placeholder="كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordButton}
              aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="floatingPassword">كلمة المرور</label>
          </div>
          {errors.Password && (
            <p className={`${styles.textBeige}`}>{errors.Password.message}</p>
          )}
        </div>

        <div className="mb-4">
          <div className="form-floating position-relative">
            <input
              {...register("ConfirmPass", {
                required: "يرجى تأكيد كلمة المرور",
                validate: (value) =>
                  value === password || "كلمتا المرور غير متطابقتين",
              })}
              type={showComfirmPassword ? "text" : "password"}
              className={`form-control ${styles.customInput}`}
              id="ConfirmPassword"
              placeholder="تأكيد كلمة المرور"
            />
            <button
              type="button"
              onClick={() => setShowComfirmPassword(!showComfirmPassword)}
              className={styles.showPasswordButton}
              aria-label={showComfirmPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {showComfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            <label htmlFor="ConfirmPassword">تأكيد كلمة المرور</label>
          </div>
          {errors.ConfirmPass && (
            <p className={`${styles.textBeige}`}>
              {errors.ConfirmPass.message}
            </p>
          )}
        </div>

        <div>
          <button type="submit" className={`${styles.myBtn} btn w-100`}>
            إنشاء حساب
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
          <span>أو</span>
          <hr
            style={{
              flex: 1,
              border: "none",
              borderTop: "1px solid beige",
              marginLeft: 10,
            }}
          />
        </div>

        <GoogleLoginButton />

        <p
          className="text-center mt-2"
          style={{ fontSize: 14, color: "beige" }}
        >
          لديك حساب بالفعل؟{" "}
          <Link
            to="/signin"
            className="text-decoration-none"
            style={{ fontSize: 14, color: "beige" }}
          >
            تسجيل الدخول
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;