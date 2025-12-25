import RatingToast from "../../Components/ratingToast/RatingToast";
import {useEffect } from "react";

export default function Feedback() {
  useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // لو بدك بدون حركة احذفها
  });
}, []);

  return (
    <div>
      <RatingToast />
    </div>
  );
}