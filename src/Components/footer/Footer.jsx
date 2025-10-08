import React, { useState } from "react";
import toast from "react-hot-toast";
import styles from "./Footer.module.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaWhatsappSquare,
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = "0592-245-331";
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const ta = document.createElement("textarea");
        ta.value = textToCopy;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      toast.success("تم نسخ الرقم بنجاح!");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("فشل النسخ");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container p-4">
        <div className="row">
          {/* Section 1: About */}
          <div className={`${styles.aboutSection} col-md-4 mb-4`}
          style={{ alignItems: "center", display: "flex" ,gap: "2rem" }}>
            <h5 className={styles.NameClinic}>
              مركز سوار للعلاج الطبيعي
              <i className="fa-solid fa-hands-holding-child me-2"></i>
            </h5>
            <p className={styles.clinicDescription}>
              نسعى لتقديم العلاج الطبيعي بأعلى جودة وبأحدث الأساليب , خدمات
              متكاملة لكل الأعمار بحب واحترافية.
            </p>
          </div>

          {/* Section 2: Business Hours */}
          <div className={`${styles.hoursSection} col-md-4 mb-4`}
          style={{ alignItems: "center", display: "flex", flexDirection: "column" ,gap: "2rem"}}
          >
            <h3 className={styles.sectionTitle}>
              ساعات العمل
              <i className="fa-solid fa-clock ms-2"></i>
            </h3>
            <div className={styles.timeItem}>
              <span>
                من السبت إلى الخميس:
              </span>
              <span> AM 9:00 - PM 5:00</span>
            </div>
            <div className={styles.socialContainer}>
              {/* Facebook Icon */}{" "}
              <a
                href="https://www.facebook.com/share/1AxQqLCF2q/"
                target="_blank"
                rel="noopener noreferrer"
              >
               {" "}
                <div className={styles.iconWrapper}>
                   {/* الخلفية البيضاء */}
                  {" "}
                  <FaFacebook
                    className={`${styles.icon} ${styles.iconBackground}`}
                  />
                   {/* الأيقونة الملونة */} {" "}
                  <FaFacebookSquare
                    className={`${styles.icon} ${styles.iconForeground} ${styles.facebook}`}
                  />
                </div>
              </a>
              {/* Instagram Icon */}
              <a
                href="https://www.instagram.com/sewarshrim?igsh=MWtmMWJkbHppcmU1Yw=="
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.iconWrapper}>
                  <FaInstagram
                    className={`${styles.icon} ${styles.iconBackground}`}
                  />
                  <FaInstagramSquare
                    className={`${styles.icon} ${styles.iconForeground} ${styles.instagram}`}
                  />
                </div>
              </a>
              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/970592245331"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.iconWrapper}>
                  <FaWhatsapp
                    className={`${styles.icon} ${styles.iconBackground}`}
                  />
                  <FaWhatsappSquare
                    className={`${styles.icon} ${styles.iconForeground} ${styles.whatsapp}`}
                  />
                </div>
              </a>
            </div>
          </div>

          {/* Section 3: Contact Info */}
          <div className={`${styles.contactSection} col-md-4 mb-4`}
          style={{ alignItems: "end", display: "flex", flexDirection: "column" ,gap: "2rem"}} >
            <div className={styles.contactItem}>
              <button onClick={handleCopy} className={styles.copyButton}>
                {copied ? "تم النسخ ✅" : "0592-245-331"}
              </button>
              <i className="fa-solid fa-phone-volume ms-2"></i>
            </div>
            <div className={styles.contactItem}>
              <span>Qalqilya-Khillet Yaseen</span>
              <i className="fa-solid fa-location-dot ms-2"></i>
            </div>
            <div className={styles.contactItem}>
              <a
                href="mailto:Sewarshrim@gmail.com"
                className={styles.emailLink}
              >
                Sewarshrim@gmail.com
              </a>
              <i className="fa-solid fa-envelope ms-2"></i>
            </div>
          </div>
        </div>

        <div className="text-center mt-3 pt-3">
          <small className={styles.copyright}>جميع الحقوق محفوظة © 2025</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;