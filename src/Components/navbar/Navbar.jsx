import "./Navbar.css";
import { Link } from "react-router-dom";
import logoo from './../../assets/logoo.jpeg'

export default function App() {
  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* اللوجو ثابت خارج الـ collapse */}

        <div className="logo">
          <a href="/">
            <img src={logoo} alt="Logo" />
          </a>
        </div>

        <div
          className="collapse navbar-collapse mt-3 mt-lg-0"
          id="navbarSupportedContent"
        >
          <div className="login d-flex gap-2 flex-column flex-lg-row">
            <Link className="btn-custom" aria-label="التسجيل" to={"/signin"}>
              التسجيل
              <svg
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="Icon"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx={12} cy={7} r={4} />
              </svg>
            </Link>
            <Link className="btn-custom" aria-label="انشاء حساب" to={"/signup"}>
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
    </nav>
  );
}