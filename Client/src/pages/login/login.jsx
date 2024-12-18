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
    toast.dismiss();
    try {
      const loginResponse = await toast.promise(
        axios.post(
          "http://localhost:3000/auth/login",
          { email, password },
          { withCredentials: true }
        ),
        {
          pending: "กำลังตรวจสอบข้อมูล...",
        }
      );

      if (loginResponse.status === 200) {
        try {
          const statusResponse = await toast.promise(
            axios.get("http://localhost:3000/agency/logged-in", {
              withCredentials: true,
            }),
            {
              pending: "กำลังตรวจสอบสถานะ...",
            }
          );
          const { status_approve } = statusResponse.data.data;

          if (status_approve === "approved") {
            toast.success("ล็อกอินสำเร็จ!");
            navigate("/Homepages");
          } else if (status_approve === "rejected") {
            toast.error(
              "บัญชีของคุณถูกปฎิเสธการเข้าใช้งาน โปรดติดต่อเจ้าหน้าที่"
            );
          } else {
            toast.error(
              "บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อเจ้าหน้าที่"
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
      <ToastContainer position="top-center" />
      <Footer />
    </div>
  );
}

export default App;
