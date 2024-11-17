import React, { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styles from "./ForgetPasswordCode.module.css";
import Input from "../../components/Input/Input.jsx";
import ArrowButton from "../../components/ArrowButton/ArrowButton.jsx";
import { Link } from "react-router-dom";

function ForgetPasswordCode() {
  const [CodeReset, setCodeReset] = useState(" ");
  return (
    <>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.boxContact}>
          <div className={styles.boxIn}>
            <div className={styles.topBar}>
              {["#09FF3E", "#09FF3E", "#a2fbb5"].map((color, index) => (
                <div
                  key={index}
                  style={{
                    flexGrow: 2,
                    height: "100%",
                    backgroundColor: color,
                  }}
                ></div>
              ))}
            </div>

            <h3>ลืมรหัสผ่านหรือไม่?</h3>
            <div className={styles.inputForm}>
              <Input
                label="โค้ดจะส่งไปทางอีเมลของท่าน"
                id="CodeReset"
                name="CodeReset"
                type="number"
                value={CodeReset}
                onChange={(e) => setCodeReset(e.target.value)}
                placeholder="กรุณากรอกโค้ด"
              />
              <div className={styles.codeAllow}>
                <p>โค้ดจะหมดอายุใน 00.00</p>
                <p>ส่งโค้ดอีกรอบ</p>
              </div>
            </div>
            <div className={styles.arrowButton}>
              <Link to="/ForgetPassword" style={{ textDecoration: "none" }}>
                <ArrowButton direction="left" color="grey" />
              </Link>
              <Link to="/ForgetPasswordReset" style={{ textDecoration: "none" }}>
                <ArrowButton direction="right" color="orange" />
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ForgetPasswordCode;
