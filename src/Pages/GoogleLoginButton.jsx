// src/components/GoogleLoginButton.jsx
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        console.log("Google response:", credentialResponse);

        const idToken = credentialResponse?.credential;
        if (!idToken) {
          toast.error("ما في idToken");
          return;
        }

        axios.post("https://sewarwellnessclinic1.runasp.net/api/Auth/register-google-patient", {
          idToken,
        })
        .then((res) => {
          toast.success( "   تم تسجيل الدخول بنجاح عبر ");
          navigate("/signin");
        })
        .catch((err) => {
          const msg = err?.response?.data?.message || err?.response?.data || err.message;
          toast.error(msg);
          console.error("Server error:", msg);
        });
      }}
      onError={() => {
        toast.error("فشل تسجيل الدخول عبر Google");
      }}
    />
  );
}