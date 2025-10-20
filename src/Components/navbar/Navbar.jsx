import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import logoo from "./../../assets/logoo.jpeg";

export default function Navbar() {
  const offcanvasRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // جلب حالة المستخدم من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // جلب الإشعارات وعدد غير المقروءة
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          "https://sewarwellnessclinic1.runasp.net/api/Notifications/my",
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("حدث خطأ أثناء جلب الإشعارات:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // تحديث كل 30 ثانية
    return () => clearInterval(interval);
  }, [user]);

  // تنظيف الـ backdrop عند إغلاق offcanvas
  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;
    const handleOffcanvasClose = () => {
      const backdrop = document.querySelector(".offcanvas-backdrop");
      if (backdrop) backdrop.remove();
    };

    offcanvasElement.addEventListener("hidden.bs.offcanvas", handleOffcanvasClose);
    return () => offcanvasElement.removeEventListener("hidden.bs.offcanvas", handleOffcanvasClose);
  }, []);




// تحديث فوري لعدد الإشعارات عند تغيّر localStorage
useEffect(() => {
  const handleStorageChange = () => {
    const savedUnread = localStorage.getItem("unreadCount");
    if (savedUnread !== null) {
      setUnreadCount(parseInt(savedUnread));
    }
  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);




  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        {/* زر offcanvas */}
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* اللوجو + أيقونة الإشعارات */}
        <div className="d-flex align-items-center" style={{ flexDirection: "row", gap: "16px" }}>
          <a href="/">
            <img src={logoo} alt="Logo" style={{ height: "60px", width: "auto" }} />
          </a>

          {user && (
            <button
              className="btn position-relative"
              onClick={() => navigate("/notifications")}
              style={{ background: "none", border: "none", fontSize: "22px", color: "#f5deb3" }}
            >
              <i className="fa-solid fa-bell"></i>
              {unreadCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "10px" }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* قائمة offcanvas */}
        <div
          ref={offcanvasRef}
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>

          <div className="offcanvas-body">
            <div className="login d-flex gap-2 flex-column flex-lg-row">
              <div className="toggleLogo"></div>

              {/* أزرار تسجيل الدخول / بروفايل */}
              {user ? (
                <>
                  <Link
                    className="btn-custom"
                    to={"/profile"}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      whiteSpace: "nowrap",
                      fontSize: "14px",
                      textDecoration: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                    }}
                  >
                    <i className="fa-solid fa-user" style={{ fontSize: "16px" }}></i>
                    الصفحة الشخصية
                  </Link>
                  <button className="btn-custom" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> تسجيل خروج
                  </button>
                </>
              ) : (
                <>
                  <Link
  className="btn-custom"
  to="/signin"
  onClick={() => {
    if (!user) {
      // حفظ الصفحة الحالية قبل الذهاب لتسجيل الدخول
      localStorage.setItem(
        "redirectAfterLogin",
        window.location.pathname
      );
    }
  }}
>
  تسجيل الدخول
</Link>
                  <Link className="btn-custom" to={"/signup"}>
                    <i className="fa-solid fa-user-plus"></i> انشاء حساب
                  </Link>
                </>
              )}

              {/* باقي روابط النافبار */}
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link className="nav-link" to={"/"}>
                    الرئيسية
                  </Link>
                </li>
              <li className="nav-item">
  <Link className="nav-link" to="/appointment">
    حجز موعد
  </Link>
</li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/feedback"}>
                    قيم تجربتك العلاجية
                  </Link>
                </li>
              <li className="nav-item">
  <button
    className="nav-link btn"
    style={{ background: "none", border: "none", padding: 0 }}
    onClick={() => {
      if (!user) {
        // لو غير مسجل دخول → احفظ الصفحة المطلوبة
        localStorage.setItem("redirectAfterLogin", "consultation");
        navigate("/signin");
      } else {
        // مسجل دخول → توجيه حسب نوع المستخدم
        const userType = (user.userType || "").toLowerCase();
        if (userType === "doctor" || userType === "doctor_admin") {
          navigate("/consultation-doctor");
        } else {
          navigate("/inquiry");
        }
      }
    }}
  >
    استشارة طبية
  </button>
</li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/file"}>
                    الملفات
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}