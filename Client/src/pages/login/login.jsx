import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../../components/button/Button";
import Footer from "../../components/footer/footer";
import HeaderLogin from "../../components/headerLogin/headerLogin";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import styles from "./login.module.css";

function App() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("ล็อคอินสำเร็จ!");
        navigate("/Homepages");
      } else {
        alert("เกิดข้อผิดพลาด: " + response.status);
      }
    } catch (error) {
      if (error.response) {
        alert("เกิดข้อผิดพลาด: " + (error.response.data.message || "ไม่สามารถเข้าสู่ระบบได้"));
      } else {
        alert("เกิดข้อผิดพลาด: ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
      }
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.boxLogin}>
        <div className={styles.login}>
          <HeaderLogin />
          <div className={styles.form}>
            <div className={styles.btnLeft}>
              <LoginForm onSubmit={handleSubmit} />
            </div>
            <div className={styles.btnRight}>
              <Link to="/Register" style={{ width: "100%", textDecoration: "none" }}>
                <Button text="สมัครสมาชิก(หน่วยงานใหม่)" styleType="primary" />
              </Link>
              <div className={styles.btnSecondary}>
                <Button text="ดาวน์โหลดฟอร์มหนังสือรับรอง" styleType="secondary" />
                <Button text="คู่มือการใช้งานระบบ" styleType="secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
