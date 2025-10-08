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

        {/* اللوجو */}
        <div className="logo">
          <a href="/">
            <img src={logoo} alt="Logo" />
          </a>
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
    alignItems: "center",      // يصطف النص والأيقونة عمودياً
    gap: "8px",                // مسافة بين الأيقونة والنص
    whiteSpace: "nowrap",      // يمنع النص من الانكسار لسطر جديد
    fontSize: "14px",          // حجم النص طبيعي
    textDecoration: "none",    // إزالة أي underline للـ link
    padding: "8px 16px",
    borderRadius: "6px",
  }}
>
  <i className="fa-solid fa-user" style={{ fontSize: "16px" }}></i>
  الصفحة الشخصية
</Link>
                  <button className="btn-custom"  onClick={handleLogout}>
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
                  <Link className="nav-link" aria-disabled="true" to={"/feedback"}>
                    قيم تجربتك العلاجية
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" aria-disabled="true" to={"/inquiry"}>
                    استشارة طبية
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" aria-disabled="true" to={"/file"}>
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