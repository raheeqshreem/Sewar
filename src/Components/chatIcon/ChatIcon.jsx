import React, { useState } from 'react';
import styles from "./ChatIcon.module.css";

import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaWhatsappSquare,
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";

export default function ChatIcon() {
  const [showIcons, setShowIcons] = useState(false);

  return (
    <>
      <div
        id="main-icon"
        onClick={() => setShowIcons(!showIcons)}
        style={{
          background: ' #2a7371',
          width: 50,
          height: 50,
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
      >
 <a><i className="fa-regular fa-2x fa-message" style={{color:'beige'}}></i> </a> 
 </div>

      {showIcons && (
        <div
          id="social-icons"
          style={{
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            bottom: 80,
            right: 20,
            zIndex: 1000,
          }}
        >
 <div className={styles.socialContainer}>
              {/* Facebook Icon */}
              <a
                href="https://www.facebook.com/share/1AxQqLCF2q/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.iconWrapper}>
                  {/* الخلفية البيضاء */}
                  <FaFacebook
                    className={`${styles.icon} ${styles.iconBackground}`}
                  />
                  {/* الأيقونة الملونة */}
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
      )}
    </>
  );
}