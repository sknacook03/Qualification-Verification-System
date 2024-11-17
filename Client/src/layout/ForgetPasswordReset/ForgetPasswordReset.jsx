import React, { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import styles from "./ForgetPasswordReset.module.css";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import Button from "../../components/button/Button";
import { useNavigate } from "react-router-dom";

function ForgetPasswordReset() {
  const [password, setPassword] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const navigate = useNavigate();

  const isButtonDisabled = !password || !passwordNew;

  const handleResetPassword = () => {
    if (!isButtonDisabled) {
      navigate("/");
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
                label=" "
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="รหัสผ่านใหม่"
              />
              <PasswordInput
                label=" "
                id="passwordNew"
                name="passwordNew"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
                placeholder="ยืนยันรหัสผ่านใหม่"
              />
              <Button
                text="ยืนยันการรีเซตรหัสผ่าน"
                styleType="third"
                onClick={handleResetPassword}
                disabled={isButtonDisabled}
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
