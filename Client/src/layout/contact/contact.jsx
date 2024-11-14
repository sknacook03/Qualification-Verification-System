import React from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styles from "./contact.module.css";
function Contact() {
  return (
    <>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.boxContact}>
          <div className={styles.boxIn}>
            <h3>ข้อตกลงและการยินยอมการใช้บริการ</h3>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default Contact;
