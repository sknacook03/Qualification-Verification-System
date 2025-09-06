import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./LoginOfficer.module.css";
import { API_BASE_URL, APIEndpoints } from "../../services/api";

function LoginOfficerPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const ROLE = "officer";

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    toast.dismiss();
    try {
      const response = await toast.promise(
        axios.post(
          API_BASE_URL + APIEndpoints.auth.loginOfficer,
          { email, password },
          { withCredentials: true }
        ),
        { pending: "ระบบกำลังตรวจสอบข้อมูล..." }
      );

      if (response.status === 200) {
        localStorage.setItem("appRole", ROLE);

        toast.success("ล็อคอินสำเร็จ!");
        navigate("/HomepagesOfficer");
      } else {
        toast.error("เกิดข้อผิดพลาด: " + response.status);
      }
    } catch (error) {
      console.error("Login Error:", error);
      const msg = error.response?.status;
      if (msg === 401) {
        toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบและลองใหม่อีกครั้ง");
      } else if (msg === 500) {
        toast.error("เกิดข้อผิดพลาด: " + (msg || "ไม่สามารถเข้าสู่ระบบได้"));
      } else {
        toast.error("ไม่สามารถเข้าสู่ระบบได้: " + error.response?.data?.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.boxContent}>
          <div className={styles.boxIn}>
            <h2>เจ้าหน้าที่ทะเบียน</h2>
            <LoginForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

export default LoginOfficerPage;
