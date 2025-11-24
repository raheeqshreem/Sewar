import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Sewar from "./../../assets/Sewar.jpeg";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState(null);
const [slides, setSlides] = useState([]);

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
      parsedUser.userType = "Doctor"; // للتجربة
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
      <div className={styles.longPage}>
        {/* Carousel Section (No changes here) */}
       <div
  id="carouselExampleInterval"
  className="carousel slide position-relative"
  data-bs-ride="carousel"
>
  {/* Carousel inner */}
  <div className="carousel-inner">
    {slides.map((item, index) => (
      <div
        key={item.id}
        className={`carousel-item ${index === 0 ? "active" : ""}`}
      >
        <img
          src={`https://sewarwellnessclinic1.runasp.net${item.imageUrl}`}
          className="d-block w-100"
          alt={`slide-${index + 1}`}
        />

        <div className={styles.overlay}></div>
       <div className={styles.carouselCaptionCustom}>
  {item.text1 && <h2>{item.text1}</h2>}
  {item.text2 && <h1>{item.text2}</h1>}
  {item.text3 && <p>{item.text3}</p>}

  {user && (
    <Link to="/admin" className="btn btn-primary mt-3">
      لوحة التحكم
    </Link>
  )}
</div>

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



        {/* Doctor Section - (Updated with floating animation and fixed background) */}
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
              {/* Main container for the doctor image and its backgrounds */}
              <div className={styles.doctorImageWrapper}>
                {/* Floating backgrounds */}
                <div className={styles.backgroundOne}></div>
                <div className={styles.backgroundTwo}></div>
                {/* Fixed background */}
                <div className={styles.mainBackground}>
                  {/* Doctor's image */}

                  <img
                    src={Sewar}
                    alt="Dr. Sewar Shreem"
                    className={styles.doctorImage}
                  />
                </div>
              </div>
            </div>

            {/* Text section with slide-in animation */}
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
                className="fw-bold display-5 mb-3"
                style={{ color: "#343a40" }}
              >
                الأخصائية سوار شريم
              </h2>
              <h3 className="fw-normal mb-4 fs-4" style={{ color: " #2a7371" }}>
              استشارية العلاج الطبيعي 
              </h3>
              <ul className="list-unstyled fs-5" style={{ paddingRight: 0 }}>
                <li className="mb-2 d-flex justify-content-end align-items-center">
                  <span>بكالوريوس العلاج الطبيعي والتأهيل جامعة النجاح الوطنية </span>
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
        </section>
      </div>
    </>
  );
}