import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import RatingToast from "../../Components/ratingToast/RatingToast"; // صحح المسار حسب مكان الملف
export default function Feedback() {
  const location = useLocation();
  const scrollRef = useRef(null);

useEffect(() => {
  if (location.state?.scrollToId) {
    setTimeout(() => {
      const el = document.getElementById(`feedback-${location.state.scrollToId}`);
      console.log("Scroll target element after delay:", el);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 300); // 300ms انتظار لتحميل العناصر
  }
}, [location]);

  return (
    <div>
      <RatingToast scrollRef={scrollRef} />
    </div>
  );
}