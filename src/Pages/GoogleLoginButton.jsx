// src/components/CustomGoogleLoginButton.jsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useRef } from "react"; 
import GoogleIcon from "../assets/Google.png";

export default function CustomGoogleLoginButton() {
  const navigate = useNavigate();
  const googleLoginButtonRef = useRef(null);

  // ✅ حفظ المسار الحالي قبل تسجيل الدخول

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("لم يتم استلام توكن من جوجل.");
      return;
    }

    try {
      const registerPayload = { IdToken: idToken };
      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Auth/register-google-patient",
        registerPayload
      );

      console.log("✅ Google login response:", response.data);

      const loginPayload = { Token: idToken };

      if (response.data?.message === "User already exists.") {
        const loginResponse = await axios.post(
          "https://sewarwellnessclinic1.runasp.net/api/Auth/google-login",
          loginPayload
        );
        localStorage.setItem("user", JSON.stringify(loginResponse.data));
      } else {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      toast.success("تم تسجيل الدخول بنجاح!");

      // 🔹 استرجاع المسار
      // استرجاع المسار الحالي بعد # فقط
let redirectPath = "/";
const hash = localStorage.getItem("redirectAfterLogin");
if (hash) {
  redirectPath = hash.startsWith("#") ? hash.slice(1) : hash;
}

// لو المسار هو صفحة تسجيل الدخول أو التسجيل نفسه، نرجع للرئيسية
if (redirectPath === "/signin" || redirectPath === "/signup") {
  redirectPath = "/";
}

localStorage.removeItem("redirectAfterLogin");

// استخدم navigate بالمسار بعد #
navigate(redirectPath);

    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg || "حدث خطأ من السيرفر");
    }
  };

  const handleGoogleError = () => {
    toast.error("فشل تسجيل الدخول عبر Google");
  };

  const handleCustomButtonClick = () => {
    // قبل فتح نافذة Google نسجل المسار


    if (googleLoginButtonRef.current) {
      const googleButton =
        googleLoginButtonRef.current.querySelector('div[role="button"]');
      if (googleButton) googleButton.click();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleCustomButtonClick}
        className="btn btn-light border d-flex align-items-center justify-content-center gap-2"
        style={{
          borderRadius: "30px",
          width: "100%",
          height: "35px",
          fontSize: "14px",
        }}
      >
        <img src={GoogleIcon} alt="Google" style={{ width: "25px", height: "25px" }} />
        Continue with Google
      </button>

      <div ref={googleLoginButtonRef} style={{ display: "none" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          locale="en"
        />
      </div>
    </>
  );
}