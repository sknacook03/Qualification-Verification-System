import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../components/button/Button";
import Footer from "../../components/footer/footer";
import HeaderLogin from "../../components/headerLogin/headerLogin";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import SEO from "../../components/SEO/SEO.jsx";
import styles from "./login.module.css";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const ROLE = "agency";

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    toast.dismiss();
    try {
      const response = await toast.promise(
        axios.post(
          API_BASE_URL + APIEndpoints.auth.login,
          { email, password },
          { withCredentials: true }
        ),
        { pending: "ระบบกำลังตรวจสอบข้อมูล..." }
      );

      if (response.status === 200) {
        localStorage.setItem("appRole", ROLE);
        toast.success("ล็อคอินสำเร็จ!");
        navigate("/Homepages");
      } else {
        toast.error("เกิดข้อผิดพลาด: " + response.status);
      }
    } catch (error) {
      const msg = error.response?.status;
      const errorMessage = error.response?.data?.error;
      
      if (msg === 401) {
        toast.error(
          "อีเมลหรือรหัสผ่านไม่ถูกต้อง โปรดตรวจสอบและลองใหม่อีกครั้ง"
        );
      } else if (msg === 403) {
        // แยกข้อความระหว่าง pending และ rejected
        if (errorMessage && errorMessage.includes("rejected")) {
          toast.error(
            "บัญชีของคุณถูกปฏิเสธ กรุณาตรวจสอบอีเมลของท่านสำหรับรายละเอียดเพิ่มเติม หรือติดต่อผู้ดูแลระบบ"
          );
        } else {
          toast.warning(
            "บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อผู้ดูแลระบบ"
          );
        }
        navigate("/");
        return;
      } else if (msg === 500) {
        toast.error("เกิดข้อผิดพลาด: " + (msg || "ไม่สามารถเข้าสู่ระบบได้"));
      } else {
        toast.error(
          "ไม่สามารถเข้าสู่ระบบได้: " + error.response?.data?.message
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="ระบบตรวจคุณวุฒินักศึกษา มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน - RMUTI"
        description="เข้าสู่ระบบตรวจสอบคุณวุฒิการศึกษา สำหรับหน่วยงานราชการและเอกชน ตรวจสอบใบประกาศนียบัตร ใบปริญญา อย่างรวดเร็วและปลอดภัย"
        keywords="ตรวจสอบคุณวุฒิ, ตรวจคุณวุฒิ, ยืนยันคุณวุฒิ, ตรวจสอบใบปริญญา, ราชมงคลโคราช, ราชมงคลนครราชสีมา, มทร.อีสาน, มทรอีสาน, โคราช, นครราชสีมา, ราชมงคลอีสาน, RMUTI, ข้อมูลบัณฑิต, ตรวจสอบบัณฑิต, สถานะการศึกษา, ตรวจคุณวุฒิราชมงคลโคราช, ตรวจสอบคุณวุฒิโคราช, ยืนยันใบปริญญาราชมงคล, ระบบตรวจสอบคุณวุฒิมทร, ตรวจสอบคุณวุฒิออนไลน์"
        url="https://cpermuti.com/eduverify/"
      />
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
                  <Button
                    text="สมัครสมาชิก ( หน่วยงานใหม่ )"
                    styleType="primary"
                  />
                </Link>
                <Link
                  to="/GeneralUser"
                  style={{ width: "100%", textDecoration: "none" }}
                >
                  <Button text="เข้าชมเว็บไซต์" styleType="primary" />
                </Link>
                <div className={styles.btnSecondary}>
                  <a
                    href="https://drive.google.com/drive/folders/13E1bwHoJzosSn-cef6YFPI5ZzPgrHNxk?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    <Button
                      text="ดาวน์โหลดฟอร์มหนังสือยินยอมให้เปิดเผยข้อมูล"
                      styleType="secondary"
                    />
                  </a>
                  <a
                    href="https://drive.google.com/drive/folders/1MXFcGKGdTpjhk0UtWXDS6ngVOL7bmmN5?usp=sharing"
                    target="_blank"
                    rel="noreferrer"
                    style={{ width: "100%", textDecoration: "none" }}
                  >
                    <Button
                      text="คู่มือการใช้งานสำหรับหน่วยงาน"
                      styleType="secondary"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.noteContainer}>
          <div className={styles.noteBox}>
            <h3 className={styles.noteTitle}>หมายเหตุ:</h3>
            <div className={styles.noteItem}>
              <span className={styles.noteNumber}>1.</span>
              <span className={styles.noteText}>สามารถตรวจสอบคุณวุฒิการศึกษาที่สำเร็จการศึกษาตั้งแต่ปีการศึกษา 2552 เป็นต้นไป</span>
            </div>
            <div className={styles.noteItem}>
              <span className={styles.noteNumber}>2.</span>
              <span className={styles.noteText}>หากท่านต้องการตรวจสอบผลการศึกษาหรือข้อมูลอื่นๆ นอกเหนือจากที่ปรากฏ ท่านจะต้องส่งหนังสือตรวจสอบคุณวุฒิอย่างเป็นทางการมายังมหาวิทยาลัย</span>
            </div>
          </div>
        </div>

        <ToastContainer position="top-center" />
        <Footer />
      </div>
    </>
  );
}

export default App;
