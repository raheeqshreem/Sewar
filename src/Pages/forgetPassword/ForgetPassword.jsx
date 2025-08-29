import { useEffect } from "react";
import { useForm } from "react-hook-form";
import logoo from "./../../assets/logoo.jpeg";
import styles from "./ForgetPassword.module.css";
import { Link } from "react-router-dom";

function ForgetPassword() {
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

  const onSubmit = (data) => {
    console.log("Email Submitted:", data);
    reset();
  };

  return (
    <div className={styles.container}>
      <img src={logoo} className={styles.loginImage} alt="Clinic Logo" />

      <form className={styles.formBox} onSubmit={handleSubmit(onSubmit)}>
                    <h1 className={styles.formBox}>Forgot Password</h1>

        <div className=" mb-4">
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
            <label htmlFor="floatingEmail"> Enter Your Email Address</label>
          </div>
          {errors.Email && (
            <p className={`${styles.textBeige}  `}>
              {errors.Email.message}
            </p>
          )}
        </div>

        <div>
          <button type="submit" className={`${styles.myBtn} btn w-100`}>
            Continue
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