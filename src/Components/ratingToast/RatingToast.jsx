import React, { useState, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ReviewsWidget() {
  const navigate = useNavigate();

  // توزيع التقييمات
  const [counts, setCounts] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [selectedStar, setSelectedStar] = useState(null);

  // قراءة التوكن من localStorage
  const getUserToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token || null;
  };

  const userToken = getUserToken();

  // جلب summary عند التحميل
  useEffect(() => {
    axios
      .get("https://sewarwellnessclinic1.runasp.net/api/ranking/summary")
      .then((res) => {
        const summary = res.data;
        setCounts({
          1: summary.distribution.s1,
          2: summary.distribution.s2,
          3: summary.distribution.s3,
          4: summary.distribution.s4,
          5: summary.distribution.s5,
        });
      })
      .catch(() => {});
  }, []);

  // الحسابات
  const total = useMemo(() => Object.values(counts).reduce((a, b) => a + b, 0), [counts]);

  const average = useMemo(() => {
    if (total === 0) return 0;
    const sum = Object.entries(counts).reduce((acc, [r, c]) => acc + Number(r) * c, 0);
    return Math.round((sum / total) * 10) / 10;
  }, [counts, total]);

  const percent = (r) => (total === 0 ? 0 : Math.round((counts[r] / total) * 100));

  // إرسال تقييم
  const addReview = (starsNumber) => {
    const token = getUserToken();
    if (!token) {
      toast.error("يرجى تسجيل الدخول أولاً!");
      setTimeout(() => navigate("/signin"), 1000);
      return;
    }

    setSelectedStar(starsNumber);

    axios
      .post(
        "https://sewarwellnessclinic1.runasp.net/api/Ranking/set",
        { starsNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        toast.success("تم حفظ تقييمك بنجاح!");
        const summary = res.data.summary;
        setCounts({
          1: summary.distribution.s1,
          2: summary.distribution.s2,
          3: summary.distribution.s3,
          4: summary.distribution.s4,
          5: summary.distribution.s5,
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          toast.error("انتهت صلاحية الجلسة، سجل الدخول مرة أخرى.");
          navigate("/signin");
        } else {
          toast.error("حصل خطأ أثناء حفظ التقييم");
        }
      });
  };

  // لون الشريط حسب التقييم
  const getBarColor = (r) => {
    switch (r) {
      case 1:
      case 2:
        return "red";
      case 3:
        return "gold";
      case 4:
      case 5:
        return "green";
      default:
        return "#ccc";
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "sans-serif", marginTop: "100px" }}>
      <Toaster position="top-right" />
      <h2>متوسط التقييم: {average} ⭐</h2>
      <p>عدد التقييمات: {total}</p>

      {[5, 4, 3, 2, 1].map((r) => (
        <div key={r} style={{ display: "flex", alignItems: "center", margin: "5px 0" }}>
          <button
            onClick={() => addReview(r)}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              border: "1px solid black",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: selectedStar === r ? "#2a7371" : "white",
              color: selectedStar === r ? "beige" : "black",
              fontWeight: "bold",
              transition: "all 0.2s ease",
            }}
          >
            {r} ★
          </button>

          <div style={{ flex: 1, background: "#eee", height: "10px", borderRadius: "5px" }}>
            <div
              style={{
                width: `${percent(r)}%`,
                height: "100%",
                background: getBarColor(r),
                borderRadius: "5px",
                transition: "width 0.3s",
              }}
            />
          </div>

          <span style={{ marginLeft: "10px" }}>{percent(r)}%</span>
        </div>
      ))}
    </div>
  );
}