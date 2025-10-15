import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import logoo from "./../../assets/logoo.jpeg";

export default function Navbar() {
  const offcanvasRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // جلب حالة المستخدم من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // تنظيف الـ backdrop
  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;

    const handleOffcanvasClose = () => {
      const backdrop = document.querySelector(".offcanvas-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };

    offcanvasElement.addEventListener(
      "hidden.bs.offcanvas",
      handleOffcanvasClose
    );

    return () => {
      offcanvasElement.removeEventListener(
        "hidden.bs.offcanvas",
        handleOffcanvasClose
      );
    };
  }, []);

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        {/* زرار فتح offcanvas */}
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
<div className="d-flex align-items-center" style={{ gap: "12px" }}>
  <a href="/" className="d-flex align-items-center">
    <img
      src={logoo}
      alt="Logo"
      style={{
        height: "60px", // 🔸 نفس حجمك السابق (عدّل الرقم لو عندك حجم مخصص)
        width: "auto",
        objectFit: "contain",
      }}
    />
  </a>

  {/* 🔔 أيقونة الإشعارات (لون بيج وتظهر بكل الشاشات) */}
  <button
    className="btn position-relative"
    onClick={() => navigate("/notifications")}
    style={{
      background: "none",
      border: "none",
      color: "#f5deb3", // 🎨 بيج
      fontSize: "22px", // حجم مناسب بدون ما يصغّر اللوجو
    }}
  >
    <i className="fa-solid fa-bell"></i>
    {/* ✅ عدد الإشعارات (اختياري) */}
    <span
      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
      style={{ fontSize: "10px" }}
    >
      3
    </span>
  </button>
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
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="login d-flex gap-2 flex-column flex-lg-row">
              <div className="toggleLogo"></div>

              {/* شرط إظهار أزرار تسجيل الدخول / بروفايل */}
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
                    <i
                      className="fa-solid fa-user"
                      style={{ fontSize: "16px" }}
                    ></i>
                    الصفحة الشخصية
                  </Link>
                  <button className="btn-custom" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> تسجيل خروج
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn-custom" aria-label="التسجيل" to={"/signin"}>
                    <i className="fa-solid fa-user"></i> التسجيل
                  </Link>
                  <Link className="btn-custom" aria-label="انشاء حساب" to={"/signup"}>
                    <i className="fa-solid fa-user-plus"></i> انشاء حساب
                  </Link>
                </>
              )}

              {/* باقي روابط النافبار */}
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to={"/"}>
                    الرئيسية
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link btn"
                    style={{ background: "none", border: "none", padding: 0 }}
                    onClick={() => {
                      if (user) {
                        navigate("/appointment");
                      } else {
                        localStorage.setItem("redirectAfterLogin", "/appointment");
                        navigate("/signin");
                      }
                    }}
                  >
                    حجز موعد
                  </button>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/feedback"}>
                    قيم تجربتك العلاجية
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/inquiry"}>
                    استشارة طبية
                  </Link>
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