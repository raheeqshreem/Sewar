import styles from "./Footer.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from "react";
const Footer = () => {


const [copied, setCopied] = useState(false);
  const textToCopy = "0592245331";
 const copyWithFallback = (text) => {
    // فالنشاط: نسخة قديمة باستخدام textarea + execCommand
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed"; // عشان ما يسببش scroll
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Fallback: copy failed", err);
    }
    document.body.removeChild(ta);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        // أفضل طريقة لو متاحة
        await navigator.clipboard.writeText(textToCopy);
      } else {
        // لو مش مدعوم استخدم fallback
        copyWithFallback(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // رجّع الحالة بعد 1.5 ثانية
    } catch (err) {
      console.error("Copy failed:", err);
      // تقدر تظهر رسالة خطأ للمستخدم هنا
    }
  };




  return (
  <footer className={styles.footer}>
  <div className="container pt-4">
<div className={`${styles.content}`}>
      {/* القسم الأول - يمين */}
      <div className={`${styles.me1} col-md-6 mb-3`}>
        <h5 className={styles.NameClinic} >
          مركز سوار للعلاج الطبيعي  
          <i className="fa-solid fa-2x fa-hands-holding-child" style={{ marginRight: "10px" }}></i>
        </h5>
        <p style={{ lineHeight: "2" }}>
          نسعى لتقديم العلاج الطبيعي بأعلى جودة 
          وبأحدث الأساليب , خدمات متكاملة لكل الأعمار بحب واحترافية
        </p>

        <div className={styles.Clinicc} style={{ display: "flex", gap: "15px" }}>
          <a href="https://www.facebook.com/share/1AxQqLCF2q/" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-2x fa-square-facebook"></i>
          </a>
          <a href="https://www.instagram.com/sewarshrim?igsh=MWtmMWJkbHppcmU1Yw==" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-2x fa-square-instagram"></i>
          </a>
          <a href="https://wa.me/970592245331" target="_blank" rel="noopener noreferrer">
            <i className="fa-brands fa-2x fa-square-whatsapp"></i>
          </a>
        </div>
      </div>
            {/*القسم الثاني - وسط */}

    <div className={`${styles.me2} `}>
      <h3 style={{ fontWeight: "bold", marginBottom: "15px" }}>ساعات العمل</h3>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span>الاثنين</span>
        <span>8:00-3:00</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span>الثلاثاء</span>
        <span></span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span>الأربعاء</span>
        <span>8:00-3:00</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontWeight: "bold", borderBottom: "1px solid #718096", paddingBottom: "8px" }}>
        <span>الخميس</span>
        <span>8:00-3:00</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "center" }}>
        <span>الجمعة</span>
        <span style={{ backgroundColor: "#718096", color: "#f7fafc", padding: "2px 8px", borderRadius: "4px", fontSize: "12px" }}>CLOSED</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span>السبت</span>
        <span>8:00-3:00</span>
      </div>
      <div style={{ }}>
        <span>الأحد</span>
        <span>8:00-3:00</span>
      </div>
    </div>
 


      {/* القسم الثالث - يسار */}
      <div className={`${styles.me3} col-md-6 mb-3`}>
        <div className={styles.contactItem}>
          <span>0592-245-331</span>
                    <i className="fa-solid   fa-phone-volume"></i>

        </div>
        <div className={styles.contactItem}>
          <span>Qalqilya-Khillet Yaseen</span>
                    <i className="fa-solid   fa-location-dot"></i>

        </div>
        <div className={styles.contactItem}>
          <a href="mailto:Sewarshrim@gmail.com">Sewarshrim@gmail.com</a>
                    <i className="fa-solid   fa-envelope"></i>

        </div>
      </div>
    
</div>
    <div className="text-center mt-3">
      <small className={styles.NameClinic}>جميع الحقوق محفوظة 2025 ©</small>
    </div>
  </div>
</footer>
  );
};

export default Footer;