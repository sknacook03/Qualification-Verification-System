import React, { useState } from "react";
import axios from "axios";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import styles from "./ForgetPasswordReset.module.css";
import PasswordInput from "../../../hooks/PasswordInput/PasswordInput";
import PasswordStrengthIndicator from "../../../components/PasswordStrengthIndicator/PasswordStrengthIndicator.jsx";
import Button from "../../../components/button/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Popup from "../../../components/Popup/Popup";
import KeySuccess from "../../../assets/verify.png";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";

function ForgetPasswordReset() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});


   const isPasswordStrong = (password) => {
    const requirements = [
      { test: (pwd) => pwd.length >= 8 },
      { test: (pwd) => /[A-Z]/.test(pwd) },
      { test: (pwd) => /[a-z]/.test(pwd) },
      { test: (pwd) => /\d/.test(pwd) },
      { test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
    ];

    const satisfiedRequirements = requirements.filter((req) =>
      req.test(password)
    ).length;
    return satisfiedRequirements >= 3;
  };
  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (!isPasswordStrong(password)) {
      newErrors.password =
        "รหัสผ่านไม่แข็งแกร่ง กรุณาตรวจสอบความต้องการด้านล่าง";
      
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
        setLoading(false);
        return;
      }
      if (password !== passwordNew) {
        toast.error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
        setLoading(false);
        return;
      }
      if (password.length < 8) {
        toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
        setLoading(false);
        return;
      }
      try {
        await axios.post(
          API_BASE_URL + APIEndpoints.passwordReset.reset,
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
        <div className={styles.boxContent}>
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
              <PasswordStrengthIndicator password={password} />
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
                disabled={loading || !password || !passwordNew || !isPasswordStrong(passwordNew)}
              />
              {showPopup && (
                <Popup
                  topic="รีเซ็ตรหัสผ่านสำเร็จ!"
                  info="คุณสามารถเข้าสู่ระบบโดยกรอกรหัสผ่านใหม่ได้แล้ว"
                  img={KeySuccess}
                  successPopup={closePopup}
                  textButtonSuccess="กลับไปยังหน้าเข้าสู่ระบบ"
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
