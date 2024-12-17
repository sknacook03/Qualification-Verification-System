import React, { useState } from "react";
import axios from "axios";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import styles from "./ForgetPasswordReset.module.css";
import PasswordInput from "../../../hooks/PasswordInput/PasswordInput";
import Button from "../../../components/button/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../../../components/Popup/Popup";
import KeySuccess from "../../../assets/verify.png";
import { useLocation, useNavigate } from "react-router-dom";

function ForgetPasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    }
    if (!passwordNew) {
      newErrors.passwordNew = "กรุณากรอกยืนยันรหัสผ่าน";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const closePopup = (e) => {
    setShowPopup(false);
    navigate("/");
  };

  const handleResetPassword = async () => {
    toast.dismiss();
    setLoading(true);
    if (validateForm()) {
      if (!email) {
        toast.error("ไม่พบอีเมลสำหรับการรีเซ็ตรหัสผ่าน");
        return;
      }
      if (password !== passwordNew) {
        toast.error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
        return;
      }
      if (password.length < 8) {
        toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
        return;
      }
      try {
        await axios.post(
          "http://localhost:3000/password-reset/reset-password",
          {
            email,
            newPassword: password,
          }
        );
        toast.success("รีเซ็ตรหัสผ่านสำเร็จ");
        setShowPopup(true);
      } catch (error) {
        console.error(error);
        toast.error("ไม่สามารถรีเซ็ตรหัสผ่านได้");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.boxContact}>
          <div className={styles.boxIn}>
            <div className={styles.topBar}>
              {["#09FF3E", "#09FF3E", "#09FF3E"].map((color, index) => (
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
            <div className={styles.resetPassword}>
              <PasswordInput
                label="รหัสผ่านใหม่"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรุณาใส่รหัสผ่านใหม่"
                error={errors.password}
              />
              <PasswordInput
                label="ยืนยันรหัสผ่านใหม่"
                id="passwordNew"
                name="passwordNew"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="กรุณายืนยันรหัสผ่านใหม่"
                error={errors.passwordNew}
              />
              <Button
                text="ยืนยันการรีเซ็ตรหัสผ่าน"
                styleType="third"
                onClick={handleResetPassword}
                disabled={loading || !password || !passwordNew}
              />
              {showPopup && (
                <Popup
                  topic="รีเซ็ตรหัสผ่านสำเร็จ!"
                  info="คุณสามารถเข้าสู่ระบบโดยกรอกรหัสผ่านใหม่ได้แล้ว"
                  img={KeySuccess}
                  closePopup={closePopup}
                  textButton="กลับไปยังหน้าเข้าสู่ระบบ"
                />
              )}
            </div>
          </div>
        </div>

        <Footer />
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

export default ForgetPasswordReset;
