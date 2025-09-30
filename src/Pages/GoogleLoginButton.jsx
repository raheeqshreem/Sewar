// src/components/CustomGoogleLoginButton.jsx
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react'; // هنحتاج useRef

import GoogleIcon from '../assets/Google.png';

export default function CustomGoogleLoginButton() {
  const navigate = useNavigate();
  const googleLoginButtonRef = useRef(null); // Ref للإشارة للزرار المخفي

  const handleGoogleSuccess = async (credentialResponse) => {
    const idToken = credentialResponse?.credential;
    if (!idToken) {
      toast.error("لم يتم استلام توكن من جوجل.");
      return;
    }
    try {
      const payload = { IdToken: idToken };
      const response = await axios.post(
        "https://sewarwellnessclinic1.runasp.net/api/Auth/register-google-patient",
        payload
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      toast.success("تم تسجيل الدخول بنجاح!");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message;
      toast.error(msg || "حدث خطأ من السيرفر");
    }
  };

  const handleGoogleError = () => {
    toast.error("فشل تسجيل الدخول عبر Google");
  };
  
  // دالة مخصصة عشان نضغط على الزرار المخفي
  const handleCustomButtonClick = () => {
    // الكود ده بيبحث جوه الـ div المخفي عن زرار جوجل الفعلي ويضغط عليه
    if (googleLoginButtonRef.current) {
        const googleButton = googleLoginButtonRef.current.querySelector('div[role="button"]');
        if (googleButton) {
            googleButton.click();
        }
    }
  };

  return (
    <>
      {/* ✅ الزرار المخصص اللي هيظهر للمستخدم */}
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
        <img
          src={GoogleIcon}
          alt="Google"
          style={{ width: "25px", height: "25px" }}
        />
        Continue with Google
      </button>

      {/* 🤫 الزرار الرسمي بتاع جوجل وهيكون مخفي */}
      <div ref={googleLoginButtonRef} style={{ display: 'none' }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          locale="en"
        />
      </div>
    </>
  );
}