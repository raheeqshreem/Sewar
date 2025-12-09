import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Sewar from "./../../assets/Sewar.jpeg";
import axios from "axios";
import { FaCalendarCheck } from "react-icons/fa";
import OurSpecialties from './../../Components/OurSpecialties/OurSpecialties';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // ← مهم جدًا
import { useLocation } from "react-router-dom";

export default function Home() {
  const [user, setUser] = useState(null);
  const [slides, setSlides] = useState([]);
  console.log(user);
const location = useLocation();

useEffect(() => {
  if (location.state?.scrollTo === "our-specialties") {
    // ننتظر قليلًا حتى يتم بناء DOM
    const timeout = setTimeout(() => {
      const el = document.getElementById("our-specialties");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState({}, document.title); // لمسح الـ state
      }
    }, 300); // 100ms غالبًا كافي

    return () => clearTimeout(timeout);
  }
}, [location]);

  const { ref: doctorSectionRef, inView: isDoctorSectionVisible } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    axios
      .get("https://sewarwellnessclinic1.runasp.net/api/Images")
      .then((res) => setSlides(res.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // ❌ حذفنا السطر التخريبي
      // parsedUser.userType = "Doctor";
      setUser(parsedUser);
      console.log("Loaded user:", parsedUser);
    }

    const carousel = document.querySelector("#carouselExampleInterval");

    const handleMouseDown = (e) => {
      startX = e.clientX;
    };

    const handleMouseUp = (e) => {
      endX = e.clientX;
      if (startX - endX > 50) {
        carousel.querySelector(".carousel-control-next").click();
      } else if (endX - startX > 50) {
        carousel.querySelector(".carousel-control-prev").click();
      }
    };

    let startX = 0;
    let endX = 0;

    if (carousel) {
      carousel.addEventListener("mousedown", handleMouseDown);
      carousel.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("mousedown", handleMouseDown);
        carousel.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, []);

  return (
    <>
<div className={styles.longPage} >
        {/* Carousel Section (No changes here) */}
        <div
          id="carouselExampleInterval"
  className={`carousel slide position-relative ${styles.carouselWrapper}`}
          data-bs-ride="carousel"
        >
          {/* Carousel inner */}
        <div className="carousel-inner">
  {/* لو ما رجعت صور من الباك → سلايد واحدة فاضية */}
  {slides.length === 0 && (
    <div className="carousel-item active">
      <div
        style={{
          width: "100%",
          height: "200px",
          background: "#e7f3f3",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <p style={{ color: "#2a7371", fontSize: "22px", fontWeight: "bold" }}>
          لا يوجد صور بعد — يمكنك إضافة صورة جديدة
        </p>

        {/* أزرار السكرتير */}
        {user?.userType?.toLowerCase() === "scheduler_admin" && (
          <div style={{ display: "flex", marginTop: "15px" }}>
            <button
              className={styles.actionButton}

              style={{
                backgroundColor: "#fff",
                borderRadius: "5px",
                padding: "10px 20px",
                border: "2px solid #2a7371",
                color: "#2a7371",
                fontWeight: "bold",
                textAlign: "center",
                cursor: "pointer",
                marginRight: "10px",
                transition: "0.3s",
              }}
            >
              <Link to="/admin" style={{ color: "inherit", textDecoration: "none" }}>
          إضافة +
              </Link>
            </button>

           
          </div>
        )}
{/* زر احجز الآن للمريض أو الدكتور */}
{(!user || user.userType?.toLowerCase() === "patient" || user.userType?.toLowerCase() === "doctor") && (

    <button
      className={styles.actionButton}

      style={{
        backgroundColor: "#fff",
        borderRadius: "5px",
        padding: "10px 20px",
        border: "2px solid #2a7371",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
        cursor: "pointer",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#2a7371";
        e.currentTarget.querySelector("a").style.color = "#fff";
        e.currentTarget.querySelector("svg").style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#fff";
        e.currentTarget.querySelector("a").style.color = "#2a7371";
        e.currentTarget.querySelector("svg").style.color = "#2a7371";
      }}
    >
      <FaCalendarCheck style={{ color: "#2a7371", fontSize: "18px" }} />
      <Link
        to="/appointment"
        style={{
          color: "#2a7371",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        احجز الآن
      </Link>
    </button>
)}

        
      </div>
      
    </div>
  )}

  {/* السلايد العادية */}
  {slides.length > 0 &&
    slides.map((item, index) => (
      <div
        key={item.id}
        className={`carousel-item ${index === 0 ? "active" : ""} ` }
      >
                <div className={styles.imageWrapper}>


        <img
          src={`https://sewarwellnessclinic1.runasp.net${item.imageUrl}`}
          className="d-block w-100"
          alt={`slide-${index + 1}`}
        />

        <div className={styles.overlay}></div>
      <div
  className={styles.carouselCaptionCustom}
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%", // ليأخذ كامل مساحة الـ div
    textAlign: "center",
  }}
>
  {item.text1 && <h2>{item.text1}</h2>}
  {item.text2 && <h1>{item.text2}</h1>}
  {item.text3 && <p>{item.text3}</p>}

  {/* زر احجز الآن للمريض أو الطبيب */}
 {/* زر احجز الآن للمريض أو الطبيب */}
  {/* زر احجز الآن للمريض أو الطبيب */}
  {(!user || user.userType?.toLowerCase() === "patient" || user.userType?.toLowerCase() === "doctor") && (

      <button
        className={styles.actionButton}

        style={{
          marginTop: "20px",
          backgroundColor: "#fff", // افتراضي أبيض
          borderRadius: "5px",
          padding: "12px 25px",
          border: "2px solid #2a7371",
          color: "#2a7371", // نص افتراضي
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#2a7371";
          e.currentTarget.style.color = "#fff";
          e.currentTarget.querySelector("a").style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#fff";
          e.currentTarget.style.color = "#2a7371";
          e.currentTarget.querySelector("a").style.color = "#2a7371";
        }}
      >
        <FaCalendarCheck style={{ fontSize: "18px" }} />
        <Link
          to="/appointment"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          احجز الآن
        </Link>
      </button>
    )}


  {/* أزرار السكرتير */}
  {user?.userType?.toLowerCase() === "scheduler_admin" && (
 <div
 className={styles.schedulerButtons}
  style={{
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  }}
>
  <button
    className={styles.actionButton}

    style={{
      backgroundColor: "#fff",
      borderRadius: "5px",
      padding: "10px 20px",
      border: "2px solid #2a7371",
      color: "#2a7371",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#2a7371";
      e.currentTarget.querySelector("a").style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.querySelector("a").style.color = "#2a7371";
    }}
  >
    <Link
      to="/admin"
      style={{ color: "inherit", textDecoration: "none" }}
    >
      إضافة +
    </Link>
  </button>

  <button
    style={{
      backgroundColor: "#fff",
      borderRadius: "5px",
      padding: "10px 20px",
      border: "2px solid #2a7371",
      color: "#2a7371",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "0.3s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#2a7371";
      e.currentTarget.querySelector("a").style.color = "#fff";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#fff";
      e.currentTarget.querySelector("a").style.color = "#2a7371";
    }}
  >
    <Link
      to="/admin"
      state={{ slide: item }}
      style={{ color: "inherit", textDecoration: "none" }}
    >
      تعديل أو حذف
    </Link>
  </button>
</div>

  )}
</div></div>
      </div>
    ))}
</div>

          {/* Carousel controls */}
          <button
            className={`carousel-control-prev ${styles.carouselControlPrev}`}
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide="prev"
          >
            <span
              className={`carousel-control-prev-icon ${styles.carouselControlPrevIcon}`}
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className={`carousel-control-next ${styles.carouselControlNext}`}
            type="button"
            data-bs-target="#carouselExampleInterval"
            data-bs-slide="next"
          >
            <span
              className={`carousel-control-next-icon ${styles.carouselControlNextIcon}`}
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        {/* Doctor Section */}
        <section
          ref={doctorSectionRef}
          className="container my-5 py-5 position-relative"
        >
          <div className="row align-items-center" style={{ zIndex: 1 }}>
            <div
              className={`col-lg-5 ${
                isDoctorSectionVisible ? styles.visible : styles.hidden
              }`}
            >
              <div className={styles.doctorImageWrapper}>
                <div className={styles.backgroundOne}></div>
                <div className={styles.backgroundTwo}></div>
                <div className={styles.mainBackground}>
                  <img
                    src={Sewar}
                    alt="Dr. Sewar Shreem"
                    className={styles.doctorImage}
                  />
                </div>
              </div>
            </div>

            <div
              className={`col-lg-7 text-end mb-4 mb-lg-0 ${
                styles.textSectionWithBg
              } ${
                isDoctorSectionVisible ? styles.slideInFromRight : styles.hidden
              } `}
            >
              <div className={`${styles.stethoscopeBackground}`}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftool.505cdf52.png&w=1200&q=75"
                  alt="stethoscope background"
                />
              </div>
              <h2
                className="fw-bold display-5 m-3 "
                style={{ color: "#343a40" }}
              >
                الأخصائية سوار شريم
              </h2>
              <h3 className="fw-normal mb-4 fs-4" style={{ color: " #2a7371" }}>
                استشارية العلاج الطبيعي
              </h3>
              <ul className="list-unstyled fs-5" style={{ paddingRight: 0 }}>
                <li className="mb-2 d-flex justify-content-end align-items-center">
                  <span>
                    بكالوريوس العلاج الطبيعي والتأهيل جامعة النجاح الوطنية{" "}
                  </span>
                  <span
                    className="ms-2"
                    style={{ color: "#fd7e14", fontSize: "1.5rem" }}
                  >
                    •
                  </span>
                </li>
                <li className="mb-2 d-flex justify-content-end align-items-center">
                  <span>
                    مدرس بكلية العلاج الطبيعي جامعة أكتوبر للعلوم الحديثة
                    والآداب (MSA)
                  </span>
                  <span
                    className="ms-2"
                    style={{ color: "#fd7e14", fontSize: "1.5rem" }}
                  >
                    •
                  </span>
                </li>
                <li className="d-flex justify-content-end align-items-center">
                  <span>
                    دبلومة التغذية العلاجية المعهد القومي للتغذية جامعة القاهرة
                  </span>
                  <span
                    className="ms-2"
                    style={{ color: "#fd7e14", fontSize: "1.5rem" }}
                  >
                    •
                  </span>
                </li>
              </ul>
            </div>
          </div>
{/* بعد قسم الدكتور */}

        </section>
      <section className="container my-5" id="our-specialties">
  <div className="mt-4">
    <OurSpecialties />
  </div>
</section>


      </div>

    </>

  );
}
