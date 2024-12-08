import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./LoginOfficer.module.css";

function LoginAdmin() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    toast.dismiss();
    try {
      const response = await toast.promise(
        axios.post(
          "http://localhost:3000/auth/login-officer",
          { email, password },
          { withCredentials: true }
        ),
        {
          pending: "ระบบกำลังตรวจสอบข้อมูล..."
        }
      );

      if (response.status === 200) {
        toast.success("ล็อคอินสำเร็จ!");
        navigate("/HomepagesOfficer");
      } else {
        toast.error("เกิดข้อผิดพลาด: " + response.status);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          "เกิดข้อผิดพลาด: " +
            (error.response.data.message || "ไม่สามารถเข้าสู่ระบบได้")
        );
      } else {
        toast.error("เกิดข้อผิดพลาด: ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
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
      <ToastContainer position="top-center" />
    </>
  );
}

export default LoginAdmin;
