import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../components/header/header";
import Footer from "../../../components/footer/footer";
import styles from "./ForgetPasswordCode.module.css";
import Input from "../../../components/Input/Input.jsx";
import ArrowButton from "../../../components/ArrowButton/ArrowButton.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, Link, useNavigate } from "react-router-dom";

function ForgetPasswordCode() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email ?? "");
  const [CodeReset, setCodeReset] = useState("");
  const [message, setMessage] = useState("");
  const [timeout, setTimeoutState] = useState(5 * 60);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!CodeReset) {
      newErrors.code = "กรุณากรอกโค้ด*";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleVerifyCode = async () => {
    toast.dismiss();
    setLoading(true);
    if (validateForm()) {
      try {
        await toast.promise(
          axios.post("http://localhost:3000/password-reset/verify-code", {
            email,
            code: CodeReset,
          }),
          {
            pending: "กำลังตรวจสอบโค้ด...",
          }
        );
        toast.success("โค้ดยืนยันสำเร็จ!");
        navigate("/ForgetPasswordReset", { state: { email } });
        setLoading(false);
      } catch (error) {
        toast.error("โค้ดไม่ถูกต้องหรือหมดอายุ");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleResendCode = async () => {
    toast.dismiss();
    setLoading(true);
    try {
      await toast.promise(
        axios.post("http://localhost:3000/password-reset/request-reset", {
          email,
        }),
        {
          pending: "ระบบกำลังส่งรหัสให้คุณ...",
        }
      );
      toast.success("รหัสใหม่ถูกส่งไปที่อีเมลของคุณแล้ว");
      setTimeoutState(5 * 60);
    } catch (error) {
      toast.error("ไม่สามารถส่งโค้ดใหม่ได้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeoutState((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <div className={styles.appContainer}>
        <Header />
        <div className={styles.boxContact}>
          <div className={styles.boxIn}>
            <div className={styles.topBar}>
              {["#09FF3E", "#09FF3E", "#a2fbb5"].map((color, index) => (
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
            <div className={styles.inputForm}>
              <Input
                label="โค้ดจะส่งไปทางอีเมลของท่าน"
                id="CodeReset"
                name="CodeReset"
                type="number"
                value={CodeReset}
                onChange={(e) => setCodeReset(e.target.value)}
                placeholder="กรุณากรอกโค้ด"
                error={errors.code}
              />
              <div className={styles.codeAllow}>
                <p>โค้ดจะหมดอายุใน {formatTime(timeout)}</p>
                <button
                  onClick={handleResendCode}
                  disabled={loading || timeout > 0}
                  className={
                    timeout === 0 ? styles.resendCodeTimeout : styles.resendCode
                  }
                >
                  ส่งโค้ดอีกรอบ
                </button>
              </div>
            </div>
            <div className={styles.arrowButton}>
              <Link to="/ForgetPassword" style={{ textDecoration: "none" }}>
                <ArrowButton direction="left" color="grey" />
              </Link>
              <div
                onClick={handleVerifyCode}
                role="button"
                tabIndex="0"
                disabled={loading}
                style={{ background: "none", border: "none" }}
              >
                <ArrowButton direction="right" color="orange" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer position="top-center" />
    </>
  );
}

export default ForgetPasswordCode;
