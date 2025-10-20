import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Sewar from "./../../assets/Sewar.jpeg";

export default function Home() {
  const [user, setUser] = useState(null);

  const { ref: doctorSectionRef, inView: isDoctorSectionVisible } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      parsedUser.userType = "Doctor"; // للتجربة
      setUser(parsedUser);
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
          className="carousel slide"
          data-bs-ride="carousel"
        >
          {/* ... محتوى الكاروسيل كما هو ... */}
          <div className="carousel-inner">
            <div
              className={`carousel-item active ${styles.carouselItem}`}
              data-bs-interval="10000"
            >
              <div className={styles.imageWrapper}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbg2.02d5cb28.jpg&w=1200&q=75"
                  className="d-block w-100"
                  alt="Rehab Center Background"
                />
                <div className={styles.overlay}></div>
                <div className={styles.carouselCaptionCustom}>
                  <h2>مركز سوار للعلاج الطبيعي</h2>
                  <h1>أفضل حل للحياة المؤلمة</h1>
                  <p>نقدم لك أفضل رعاية صحية بأحدث الطرق العلاجية</p>
                  <Link
                    aria-label="احجز الأن"
                    className={`${styles.contactButton}`}
                    to="/appointment"
                  >
                    احجز الأن{" "}
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="Icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </Link>
                  {user?.userType === "Doctor" && (
                    <Link
                      aria-label="لوحة التحكم"
                      className={`${styles.contactButton} ms-3`}
                      to="/admin"
                    >
                      لوحة التحكم
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div
              className={`carousel-item ${styles.carouselItem}`}
              data-bs-interval="2000"
            >
              <div className={styles.imageWrapper}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbg1.819013bf.jpg&w=1200&q=75"
                  className="d-block w-100"
                  alt="Specialized Team"
                />
                <div className={styles.overlay}></div>
                <div className={styles.carouselCaptionCustom}>
                  <h2>مركز سوار للعلاج الطبيعي</h2>
                  <h1>فريق طبي متخصص</h1>
                  <p>أطباء متخصصون وخبرة كبيرة في العلاج الطبيعي</p>
                  <Link
                    aria-label="احجز الأن"
                    className={`${styles.contactButton}`}
                    to="/booking"
                  >
                    احجز الأن{" "}
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="Icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </Link>
                  {user?.userType === "Doctor" && (
                    <Link
                      aria-label="لوحة التحكم"
                      className={`${styles.contactButton} ms-3`}
                      to="/admin"
                    >
                      لوحة التحكم
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className={styles.imageWrapper}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbg4.8efbc61e.jpg&w=1200&q=75"
                  className="d-block w-100"
                  alt="Custom Therapy Programs"
                />
                <div className={styles.overlay}></div>
                <div
                  className={`${styles.carouselCaptionCustom} ${styles.noSelect}`}
                >
                  <h2>مركز سوار للعلاج الطبيعي</h2>
                  <h1>برامج علاجية مخصصة</h1>
                  <p>نقدم برامج علاجية تناسب كل حالة فردية</p>
                  <Link
                    aria-label="احجز الأن"
                    className={`${styles.contactButton}`}
                    to="/appointment"
                  >
                    احجز الأن{" "}
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="Icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </Link>
                  {user?.userType === "Doctor" && (
                    <Link
                      aria-label="لوحة التحكم"
                      className={`${styles.contactButton} ms-3`}
                      to="/admin"
                    >
                      لوحة التحكم
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
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