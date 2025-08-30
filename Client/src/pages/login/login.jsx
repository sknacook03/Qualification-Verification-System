import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/button/Button";
import Footer from "../../components/footer/footer";
import HeaderLogin from "../../components/headerLogin/headerLogin";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import styles from "./login.module.css";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    toast.dismiss();
    try {
      const loginResponse = await toast.promise(
        axios.post(
          API_BASE_URL + APIEndpoints.auth.login,
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
            axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
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
      const msg = loginError.response?.status;
      if (msg === 401) {
        toast.error(
          "อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบและลองใหม่อีกครั้ง"
        );
      } else if (msg === 500) {
        toast.error("เกิดข้อผิดพลาด: " + (msg || "ไม่สามารถเข้าสู่ระบบได้"));
      } else {
        toast.error(
          "ไม่สามารถเข้าสู่ระบบได้: " + loginError.response?.data?.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.boxLogin}>
        <div className={styles.login}>
          <HeaderLogin />
          <div className={styles.form}>
            <div className={styles.btnLeft}>
              <LoginForm onSubmit={handleSubmit} loading={loading} />
            </div>
            <div className={styles.btnRight}>
              <Link
                to="/Register"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <Button text="สมัครสมาชิก(หน่วยงานใหม่)" styleType="primary" />
              </Link>
              <Link
                to="/GeneralUser"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <Button text="เข้าชมเว็บไซต์" styleType="primary" />
              </Link>
              <div className={styles.btnSecondary}>
                <a href="https://drive.google.com/drive/folders/1lG75U75jG64fy5Rqg7oZRk3TfTzzx0z0?usp=sharing" target="_blank" rel="noreferrer" style={{ width: "100%", textDecoration: "none" }}>
                  <Button
                    text="ดาวน์โหลดฟอร์มหนังสือยินยอมให้เปิดเผยข้อมูล"
                    styleType="secondary"
                  />
                </a>
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
