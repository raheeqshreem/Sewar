import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import logoo from './../../assets/logoo.jpeg'



export default function App() {
  const offcanvasRef = useRef(null);

  // 3. هذا هو الكود الجديد الذي يحل المشكلة
  useEffect(() => {
    const offcanvasElement = offcanvasRef.current;

    // دالة لتنظيف الخلفية العالقة
    const handleOffcanvasClose = () => {
      const backdrop = document.querySelector(".offcanvas-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
    };

    // إضافة المستمع لحدث الإغلاق الخاص بـ Bootstrap
    offcanvasElement.addEventListener(
      "hidden.bs.offcanvas",
      handleOffcanvasClose
    );

    // تنظيف المستمع عند إزالة المكون من الشاشة
    return () => {
      offcanvasElement.removeEventListener(
        "hidden.bs.offcanvas",
        handleOffcanvasClose
      );
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        {/* اللوجو ثابت خارج الـ collapse */}
        <button
          className="btn btn-primary"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
        >
          <span className="navbar-toggler-icon" />
        </button>
        
        <div className="logo">
          <a href="/">
            <img src={logoo} alt="Logo" />
          </a>
        </div>

        <div
          ref={offcanvasRef}
          className="offcanvas offcanvas-end "
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <button
              type="button"
              class="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body">
            <div className="login d-flex gap-2 flex-column flex-lg-row">
              <div className="toggleLogo">
              </div>
              <Link className="btn-custom" aria-label="التسجيل" to={"/signin"}>
              <i className="fa-solid fa-user"></i>

                التسجيل
                
              </Link>
              <Link
                className="btn-custom"
                aria-label="انشاء حساب"
                to={"/signup"}
              >
            <i className="fa-solid fa-user-plus"></i>

                انشاء حساب
              </Link>

              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to={"/"}>

                    الرئيسية
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/appointment"}>
                    حجز موعد
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    aria-disabled="true"
                    to={"/communication"}
                  >
                    تواصل معنا
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    aria-disabled="true"
                    to={"/feedback"}
                  >
                    قيم تجربتك العلاجية
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    aria-disabled="true"
                    to={"/inquiry"}
                  >
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