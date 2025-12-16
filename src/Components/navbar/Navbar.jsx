import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import logoo from "./../../assets/logoo.jpeg";
import { Offcanvas } from "bootstrap";

export default function Navbar() {
    const offcanvasInstanceRef = useRef(null);
  const offcanvasRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // جلب حالة المستخدم من localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // جلب الإشعارات
  useEffect(() => {
  if (!user || !user.token) return; // منع الطلب لو مفيش توكن

  const source = axios.CancelToken.source();

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://sewarwellnessclinic1.runasp.net/api/Notifications/my",
        {
          headers: { Authorization: `Bearer ${user.token}` },
          cancelToken: source.token,
        }
      );
      const unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // توكن منتهي/غير صالح → نخرج المستخدم ونوجهه لتسجيل الدخول
        localStorage.removeItem("user");
        setUser(null);
        // optional: navigate('/signin');
      } else {
        console.error("حدث خطأ أثناء جلب الإشعارات:", err);
      }
    }
  };

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000);
  return () => {
    source.cancel("component unmounted");
    clearInterval(interval);
  };
}, [user]);


  // 📌 ***الحل النهائي لمشكلة الـ overlay — دمج كامل***
 useEffect(() => {
    const el = offcanvasRef.current;
    if (!el) return;

    // احصل على instance واحد فقط أو اصنعه إذا لازم
    offcanvasInstanceRef.current = Offcanvas.getOrCreateInstance(el);

    // دالة تنظيف: تترك backdrop واحد فقط (safety)
    const cleanBackdrops = () => {
      const backs = Array.from(
        document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
      );
      if (backs.length <= 1) return;
      // اترك أول واحد وامسح الباقي
      backs.slice(1).forEach((b) => b.remove());
    };

    // لو الـ offcanvas اختفى، تأكد إن ما فيش backdrops وارجع الـ overflow
    const onHidden = () => {
      document
        .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
        .forEach((b) => b.remove());
      document.body.classList.remove("modal-open", "offcanvas-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };

    // عند الظهور، نضمن وجود backdrop واحد فقط
    const onShown = () => {
      cleanBackdrops();
    };

    el.addEventListener("shown.bs.offcanvas", onShown);
    el.addEventListener("hidden.bs.offcanvas", onHidden);

    // كمان إضافة مستمع للنقر على أي مكان في الـ document:
    // لو النقر على الـ backdrop و الـ offcanvas مفتوح، نغلقه بأمان.
    const onDocClick = (e) => {
      const target = e.target;
      const isBackdrop =
        target.classList && (target.classList.contains("offcanvas-backdrop") || target.classList.contains("modal-backdrop"));
      const isOpen = el.classList && el.classList.contains("show");
      if (isBackdrop && isOpen && offcanvasInstanceRef.current) {
        try {
          offcanvasInstanceRef.current.hide();
        } catch {
          // fallback: لو hide فشل - ننضّف ونزيل الكلاسات
          document
            .querySelectorAll(".offcanvas-backdrop, .modal-backdrop")
            .forEach((b) => b.remove());
          el.classList.remove("show");
          document.body.classList.remove("modal-open", "offcanvas-open");
          document.body.style.overflow = "";
        }
      }
    };

    document.addEventListener("click", onDocClick);




    

    return () => {
      el.removeEventListener("shown.bs.offcanvas", onShown);
      el.removeEventListener("hidden.bs.offcanvas", onHidden);
      document.removeEventListener("click", onDocClick);
      // نضمن إن نعمل destroy للـ instance (لو Bootstrap يدعمه)
      try {
        const inst = Offcanvas.getInstance(el);
        if (inst && typeof inst.dispose === "function") inst.dispose();
      } catch (err) {
        // ignore
        console.error(err);
      }
    };
  }, []);

  // ======= handleLinkClick مبسّط لا ينشئ instance جديد ولا يلمس DOM يدوياً =======
  const handleLinkClick = () => {
    const inst = offcanvasInstanceRef.current || Offcanvas.getOrCreateInstance(offcanvasRef.current);
    if (inst) {
      inst.hide();
    } else {
      // كحل احتياطي - نزيل أي backdrop ونعيد overflow
      document
        .querySelectorAll(".modal-backdrop, .offcanvas-backdrop")
        .forEach((el) => el.remove());
      document.body.classList.remove("modal-open", "offcanvas-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  };


const goToTopAndNavigate = (path) => {
  handleLinkClick(); // يسكر offcanvas

  if (window.location.pathname === path) {
    // نفس الصفحة → بس scroll
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    // صفحة ثانية → navigate + scroll
    navigate(path);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }, 50);
  }
};





  // تحديث فوري لعدد الإشعارات
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

        {/* اللوجو + الإشعارات */}
        <div
          className="d-flex align-items-center"
          style={{ direction: "ltr", flexDirection: "row", gap: "16px" }}
        >
          <a href="/">
            <img src={logoo} alt="Logo" className="main-logo" />
          </a>

          {user && (
            <button
              className="btn position-relative"
              onClick={() => navigate("/notifications")}
              style={{
                background: "none",
                border: "none",
                fontSize: "22px",
                color: "#f5deb3",
              }}
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

              {/* تسجيل الدخول / بروفايل */}
              {user ? (
                <>
                  <Link
  className="btn-custom"
  to="/user"
  onClick={(e) => {
    e.preventDefault();
    handleLinkClick();

    if (window.location.pathname === "/user") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/user");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  }}
>
  <i className="fa-solid fa-user"></i> الصفحة الشخصية
</Link>

                  <button
                    className="btn-custom"
                    onClick={() => {
                      handleLogout();
                      handleLinkClick();
                    }}
                  >
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
                        localStorage.setItem(
                          "redirectAfterLogin",
                          window.location.pathname
                        );
                      }
                      handleLinkClick();
                    }}
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    className="btn-custom"
                    to={"/signup"}
                    onClick={handleLinkClick}
                  >
                    <i className="fa-solid fa-user-plus"></i> انشاء حساب
                  </Link>
                </>
              )}

              {/* باقي الروابط */}
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 flex-column flex-lg-row">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/"
                 onClick={() => {
    handleLinkClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
                  >
                    الرئيسية
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/appointment"
                   onClick={(e) => {
    e.preventDefault();
    goToTopAndNavigate("/appointment");
  }}
                  >
                    حجز موعد
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/feedback"
                    onClick={(e) => {
    e.preventDefault();
    goToTopAndNavigate("/feedback");
  }}
                  >
                    قيم تجربتك العلاجية
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    to="#"
                    className="nav-link btn"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick();

                      if (!user) {
                        localStorage.setItem(
                          "redirectAfterLogin",
                          "consultation"
                        );
                        navigate("/signin");
                        return;
                      }

goToTopAndNavigate("/inquiry");
                    }}
                  >
                    الاستشارة الطبية
                  </Link>
                </li>

                <li className="nav-item">
                <Link
  to="/"
  className="nav-link btn"
  onClick={(e) => {
    e.preventDefault();
    handleLinkClick();

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "files");
      navigate("/signin");
      return;
    }

    const type = (user.userType || "").toLowerCase();
    const path =
      type === "patient" ? "/FilesPagePatient" : "/FilesPage";

    if (window.location.pathname === path) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate(path);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 50);
    }
  }}
>
  الملفات
</Link>

                </li>

                <li className="nav-item">
                  <Link
                    to="/"
                    className="nav-link btn"
                    state={{ scrollTo: "our-specialties" }}
                    onClick={() => {
                      handleLinkClick();
                      setTimeout(
                        () =>
                          window.scrollTo({ top: 0, behavior: "smooth" }),
                        50
                      );
                    }}
                  >
                    خدماتنا
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
