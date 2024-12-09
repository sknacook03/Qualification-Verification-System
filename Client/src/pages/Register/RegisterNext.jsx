import axios from "axios";
import { useState } from "react";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import Header from "../../components/header/header";
import Input from "../../components/Input/Input";
import Footer from "../../components/footer/footer";
import Button from "../../components/button/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./RegisterNext.module.css";
import { useLocation, Link } from "react-router-dom";

function RegisterNext() {
  const location = useLocation();
  const formData = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  const isPasswordStrong = (password) => {
    const minLength = 8;
    return password.length >= minLength;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!");
      return;
    }

    if (!isPasswordStrong(password)) {
      toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (!file) {
      toast.error("กรุณาอัปโหลดไฟล์หนังสือรับรอง");
      return;
    }

    const finalData = new FormData();
    finalData.append("password", password);
    finalData.append("confirmPassword", confirmPassword);
    finalData.append("certificate", file);
    finalData.append("agency_name", formData.orgname);
    finalData.append("telephone_number", formData.telphone);
    finalData.append("address", formData.orgaddress);
    finalData.append("postal_code", formData.postalCode);
    finalData.append("type_id", formData.orgType);

    Object.keys(formData).forEach((key) => {
      finalData.append(key, formData[key]);
    });

    if (validateForm()) {
      try {
        const response = await axios.post(
          "http://localhost:3000/agency",
          finalData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.status === 200 || response.status === 201) {
          toast.success("สมัครสมาชิกสำเร็จ!");
        } else {
          toast.error("เกิดข้อผิดพลาดในการสมัครสมาชิก: " + response.status);
        }
      } catch (error) {
        if (error.response) {
          console.error("Error response:", error.response.data);
          toast.error(
            "เกิดข้อผิดพลาด: " +
              (error.response.data.message || "ไม่สามารถสมัครสมาชิกได้")
          );
        } else if (error.request) {
          console.error("Error request:", error.request);
          toast.error("เกิดข้อผิดพลาด: ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
        } else {
          console.error("Error:", error.message);
          toast.error("เกิดข้อผิดพลาด: " + error.message);
        }
      }
    }
  };

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.appContent}>
        <div className={styles.topBar}>
          {["#09FF3E", "#09FF3E"].map((color, index) => (
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
        <h3>สมัครสมาชิก</h3>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputForm}>
            <PasswordInput
              label=" "
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
              error={errors.password}
            />
            <PasswordInput
              label=" "
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่าน"
              error={errors.confirmPassword}
            />
          </div>
          <div className={styles.infoInput}>
            <p>อัพโหลดหนังสือรับรองเพื่อเข้าใช้งานระบบ</p>
            <p>(รองรับไฟล์ .pdf .png .jpg ขนาดไม่เกิน 10 MB)</p>
          </div>
          <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <div className={styles.buttonSubmit}>
            <Button text="ยืนยันการสมัครสมาชิก" styleType="third" />
            <Link to="/Register" style={{ textDecoration: "none" }}>
              <Button text="ย้อนกลับ" styleType="back" />
            </Link>
          </div>
        </form>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
}

export default RegisterNext;
