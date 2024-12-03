import React, { useState } from "react";
import axios from "axios";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import styles from "./ForgetPasswordReset.module.css";
import PasswordInput from "../../../hooks/PasswordInput/PasswordInput";
import Button from "../../../components/button/Button";
import { useLocation, useNavigate } from "react-router-dom";

function ForgetPasswordReset() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleResetPassword = async () => {
    if (!email) {
      alert("ไม่พบอีเมลสำหรับการรีเซ็ตรหัสผ่าน");
      return;
    }
    if (password !== passwordNew) {
      alert("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password.length < 8) {
      alert("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/password-reset/reset-password", {
        email,
        newPassword: password,
      });
      alert("รีเซ็ตรหัสผ่านสำเร็จ");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถรีเซ็ตรหัสผ่านได้");
    } finally {
      setLoading(false);
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
              />
              <PasswordInput
                label="ยืนยันรหัสผ่านใหม่"
                id="passwordNew"
                name="passwordNew"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="กรุณายืนยันรหัสผ่านใหม่"
              />
              <Button
                text="ยืนยันการรีเซ็ตรหัสผ่าน"
                styleType="third"
                onClick={handleResetPassword}
                disabled={loading || !password || !passwordNew}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default ForgetPasswordReset;
