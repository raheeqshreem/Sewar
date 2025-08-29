import React, { useEffect } from "react";
import  styles from"./Home.module.css";
import { Link } from "react-router-dom";

export default function Home() {
    useEffect(() => {
    const carousel = document.querySelector("#carouselExampleInterval");
    let startX = 0;
    let endX = 0;

    if (carousel) {
      carousel.addEventListener("mousedown", (e) => {
        startX = e.clientX;
      });

      carousel.addEventListener("mouseup", (e) => {
        endX = e.clientX;
        if (startX - endX > 50) {
          // سحب لليسار → صورة جديدة
          carousel.querySelector(".carousel-control-next").click();
        } else if (endX - startX > 50) {
          // سحب لليمين → صورة سابقة
          carousel.querySelector(".carousel-control-prev").click();
        }
      });
    }
  }, []);

  return (
    <>
      <div className={styles.longPage}>
        <div
          id="carouselExampleInterval"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {/* Slide 1 */}
            <div className={`carousel-item active ${styles.carouselItem}`} data-bs-interval="10000">
              <div className={styles.imageWrapper}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbg2.02d5cb28.jpg&w=1200&q=75"
                  className="d-block w-100"
                  alt="..."
                />
                <div className={styles.overlay}></div>
                <div className={styles.carouselCaptionCustom}>
                  <h2>مركز سوار للعلاج الطبيعي</h2>
                  <h1>أفضل حل للحياة المؤلمة</h1>
                  <p>نقدم لك أفضل رعاية صحية بأحدث الطرق العلاجية</p>
                  <Link to={"/communication"} aria-label="احجز الأن" className={`${styles.contactButton}`}>احجز الأن <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="Icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></Link>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className={`carousel-item ${styles.carouselItem}`} data-bs-interval="2000">
              <div className={styles.imageWrapper}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbg1.819013bf.jpg&w=1200&q=75"
                  className="d-block w-100"
                  alt="..."
                />
                <div className={styles.overlay}></div>
                <div className={styles.carouselCaptionCustom}>
                  <h2>مركز سوار للعلاج الطبيعي</h2>
                  <h1>فريق طبي متخصص</h1>
                  <p>أطباء متخصصون وخبرة كبيرة في العلاج الطبيعي</p>
                                    <Link to={"/communication"} aria-label="احجز الأن" className={`${styles.contactButton}`}>احجز الأن <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="Icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></Link>

                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className={`carousel-item ${styles.carouselItem}`}>
              <div className={styles.imageWrapper}>
                <img
                  src="https://www.rehabeg.clinic/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fbg4.8efbc61e.jpg&w=1200&q=75"
                  className="d-block w-100"
                  alt="..."
                />
                <div className={styles.overlay}></div>
                <div className={`${styles.carouselCaptionCustom} ${styles.noSelect}`}>
                  <h2>مركز سوار للعلاج الطبيعي</h2>
                  <h1>برامج علاجية مخصصة</h1>
                  <p>نقدم برامج علاجية تناسب كل حالة فردية</p>
                                    <Link to={"/communication"} aria-label="احجز الأن" className={`${styles.contactButton}`}>احجز الأن <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="Icon" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></Link>

                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
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
      </div>



      
    </>
  );
}

