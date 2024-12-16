import React, { useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../../components/header/header.jsx";
import Footer from "../../../components/footer/footer.jsx";
import styles from "./ForgetPasswordEmail.module.css";
import Input from "../../../components/Input/Input.jsx";
import ArrowButton from "../../../components/ArrowButton/ArrowButton.jsx";
import { Link, useNavigate } from "react-router-dom";

function ForgetPassword() {
  const [emailForget, setEmailForget] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!emailForget) {
      newErrors.email = "กรุณากรอกอีเมล*";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendCode = async () => {
    if (loading) return; 
    toast.dismiss();
    setLoading(true);
    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/password-reset/request-reset",
          {
            email: emailForget,
          }
        );
  
        toast.success("รหัสรีเซ็ตได้ถูกส่งไปที่อีเมลของคุณแล้ว");
        setLoading(false); 
        navigate("/ForgetPasswordCode", { state: { email: emailForget } });
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("ไม่มีข้อมูลในระบบ");
        } else {
          toast.error("ไม่สามารถส่งรหัสได้ โปรดลองใหม่อีกครั้ง");
        }
        setLoading(false); 
      }
    } else {
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
              {["#09FF3E", "#a2fbb5", "#a2fbb5"].map((color, index) => (
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
            <Input
              label=" "
              id="emailForget"
              name="emailForget"
              type="email"
              value={emailForget}
              onChange={(e) => setEmailForget(e.target.value)}
              placeholder="กรุณากรอกอีเมล"
              error={errors.email}
            />
            <div className={styles.arrowButton}>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <ArrowButton direction="left" color="grey" />
              </Link>
              <div
                className={styles.arrowButtonWrapper}
                onClick={!loading ? handleSendCode : null}
                role="button"
                tabIndex="0"
                disabled={loading}
              >
                {loading ? (
                  <div className={styles.loader}>
                    <ClipLoader size={15} color={"#FF7100"} />
                  </div>
                ) : (
                  <ArrowButton direction="right" color="orange" />
                )}
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

export default ForgetPassword;
