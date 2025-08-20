import React,{ useEffect } from 'react';
import logoo from'./../../assets/logoo.jpeg'
import styles from"./Login.module.css";




export default function Login() {
  useEffect(() => {
    // نضيف class من الـ CSS Module للـ body
    document.body.classList.add(styles.loginBody);

    // ننظف بعد ما يخرج المستخدم من الصفحة
    return () => {
      document.body.classList.remove(styles.loginBody);
    };
  }, []);

  return (
    <div className={styles.loginBody}>  <img src={logoo} className="card-img" alt="..." style={{width:"700px",height:"auto"}} />
    </div>
  )
}
