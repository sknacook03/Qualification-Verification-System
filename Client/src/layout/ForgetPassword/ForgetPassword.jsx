import React, { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styles from "./ForgetPassword.module.css";
import Input from "../../components/Input/Input.jsx";
import ArrowButton from "../../components/ArrowButton/ArrowButton.jsx";
import { Link } from "react-router-dom";
function ForgetPassword() {
  const [emailForget, setEmailForget] = useState(" ");
  return (
    <>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.boxContact}>
          <div className={styles.boxIn}>
            <div className={styles.topBar}>
              {["#09FF3E", "#a2fbb5", "#a2fbb5"].map((color, index) => (
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
            <Input
              label=" "
              id="emailForget"
              name="emailForget"
              type="email"
              value={emailForget}
              onChange={(e) => setEmailForget(e.target.value)}
              placeholder="กรุณากรอกอีเมล"
            />
            <div className={styles.arrowButton}>
              <Link to="/" style={{ textDecoration: "none" }}>
                <ArrowButton direction="left" color="grey" />
              </Link>
              <Link to="/ForgetPasswordCode" style={{ textDecoration: "none" }}>
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

export default ForgetPassword;
