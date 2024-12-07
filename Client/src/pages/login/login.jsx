import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/button/Button";
import Footer from "../../components/footer/footer";
import HeaderLogin from "../../components/headerLogin/headerLogin";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import styles from "./login.module.css";

function App() {
  const navigate = useNavigate();

  const handleSubmit = async ({ email, password }) => {
    try {
      // Step 1: ส่งคำขอ Login
      const loginResponse = await axios.post(
        "http://localhost:3000/auth/login",
        { email, password },
        { withCredentials: false }
      );
  
      console.log("Login Response:", loginResponse.data);
  
      if (loginResponse.status === 200) {
        const token = loginResponse.data.token;
  
        // Step 2: ตรวจสอบ status_approve
        try {
          const statusResponse = await axios.get(
            "http://localhost:3000/agency/logged-in",
            {
              headers: {
                Authorization: `Bearer ${token}`, // ส่ง Token ใน Header
              },
            }
          );
  
          console.log("Status Response:", statusResponse.data);
  
          const { status_approve } = statusResponse.data.data;
  
          if (status_approve === "approved") {
            // Step 3: เก็บ Token ลง Cookie
            document.cookie = `token=${token}; path=/; secure`;
            toast.success("ล็อกอินสำเร็จ!");
            navigate("/Homepages"); // ไปยังหน้า Homepages
          } else {
            toast.error(
              "บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อผู้ดูแลระบบ"
            );
          }
        } catch (statusError) {
          console.error("Status Check Error:", statusError);
          toast.error(
            "เกิดข้อผิดพลาดในการตรวจสอบสถานะ: " +
              (statusError.response?.data?.message || "ไม่สามารถตรวจสอบได้")
          );
        }
      } else {
        toast.error("เกิดข้อผิดพลาด: " + loginResponse.status);
      }
    } catch (loginError) {
      console.error("Login Error:", loginError);
      toast.error(
        "เกิดข้อผิดพลาด: " +
          (loginError.response?.data?.message || "ไม่สามารถเข้าสู่ระบบได้")
      );
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
              <Link
                to="/Register"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <Button text="สมัครสมาชิก(หน่วยงานใหม่)" styleType="primary" />
              </Link>
              <div className={styles.btnSecondary}>
                <Button
                  text="ดาวน์โหลดฟอร์มหนังสือรับรอง"
                  styleType="secondary"
                />
                <Button text="คู่มือการใช้งานระบบ" styleType="secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
    </div>
  );
}

export default App;
