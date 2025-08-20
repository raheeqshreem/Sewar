import React from "react";
import styles from "./Footer.module.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={`container p-4 `}>
        <div className="row text-center text-md-start">

 <div className={`${styles.me} col-md-4 mb-3`}>
            <h5 className={`  ${styles.NameClinic} style={{fontWeight:'bold'}}`}>  مركز سوار للعلاج الطبيعي  <i className="fa-solid  fa-2x fa-hands-holding-child" style={{marginRight:'10px'}}></i>  </h5>
            <p style={{lineHeight: "2"}}>نسعى لتقديم العلاج الطبيعي بأعلى جودة 
            وبأحدث الأساليب , خدمات متكاملة لكل الأعمار بحب و احترافية  </p>
            <div className={`${styles.Clinicc} col-md-4 mb-3`} style={{ display: "flex", gap: "15px" }}>
  <a 
    href="https://www.facebook.com/share/1AxQqLCF2q/" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: "inherit" }}
  >
    <i className="fa-brands fa-2x fa-square-facebook"></i>
  </a>

  <a 
    href="https://www.instagram.com/sewarshrim?igsh=MWtmMWJkbHppcmU1Yw==" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: "inherit" }}
  >
    <i className="fa-brands fa-2x fa-square-instagram"></i>
  </a>

  <a 
    href="https://wa.me/970592245331" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{ color: "inherit" }}
  >
    <i className="fa-brands fa-2x fa-square-whatsapp"></i>
  </a>
</div>
          </div>

 <div className={`${styles.Clinic} col-md-4 mb-3`}>
            <p>
              0592-245-331 <i className="fa-solid fa-2x fa-phone-volume" style={{marginRight:'10px' , marginTop:'20px'}}></i><br />
               Sewarshrim@gmail.com <i className="fa-solid  fa-2x fa-envelope" style={{marginRight:'10px' , marginTop:'20px'}}></i><br />
               Qalqilya-Khillet Yaseen  <i className="fa-solid  fa-2x fa-location-dot" style={{marginRight:'10px' , marginTop:'20px'}} ></i>
            </p>
          </div>
         


         
        </div>
        <div className=" text-center mt-3">
          <small className={`${styles.NameClinic}`}>جميع الحقوق محفوظة   2025 © </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;