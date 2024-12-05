import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import LoginForm from '../../hooks/LoginForm/LoginForm';
import styles from "./LoginOfficer.module.css"


function LoginAdmin() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login-officer",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert("ล็อคอินสำเร็จ!");
        navigate("/HomepagesOfficer");
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
    <>
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.boxContact}>
        <div className={styles.boxIn}>
          <h2>เจ้าหน้าที่ทะเบียน</h2>
          <LoginForm onSubmit={handleSubmit} />
        </div>
      </div>
      <Footer />
    </div>
  </>
  )
}

export default LoginAdmin