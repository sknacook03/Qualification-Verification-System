import axios from "axios";
import { useState } from "react";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import Header from "../../components/header/header";
import Input from "../../components/Input/Input";
import Footer from "../../components/footer/footer";
import Button from "../../components/button/Button";
import styles from "./RegisterNext.module.css";
import { useLocation, Link } from "react-router-dom";

function RegisterNext() {
  const location = useLocation();
  const formData = location.state || {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);

  console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = new FormData();
    finalData.append("password", password);
    finalData.append("confirmPassword", confirmPassword);
    finalData.append("certificate", file);
    finalData.append("agency_name", formData.orgname);
    finalData.append("telephone_number", formData.telphone);
    finalData.append("address", formData.orgaddress);
    finalData.append("postal_code", formData.postalCode);

    Object.keys(formData).forEach((key) => {
      finalData.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:3000/agency", finalData);
      
      if (response.status === 200) {
        alert("สมัครสมาชิกสำเร็จ!");
      } else {
        alert("เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.appContent}>
        <div className={styles.topBar}>
          {["#a2fbb5", "#09FF3E"].map((color, index) => (
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
        <div className="inputForm">
          <form onSubmit={handleSubmit}>
            <PasswordInput
              label=" "
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="รหัสผ่าน"
            />
            <PasswordInput
              label=" "
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="ยืนยันรหัสผ่าน"
            />
            <div className={styles.infoInput}>
              <p>อัพโหลดหนังสือรับรองเพื่อเข้าใช้งานระบบ</p>
              <p>(รองรับไฟล์ .pdf .png .jpg ขนาดไม่เกิน 10 MB)</p>
            </div>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className={styles.buttonSubmit}>
              <Button text="ยืนยันการสมัครสมาชิก" styleType="third" />
              <Link to="/Register" style={{ textDecoration: "none" }}>
                <Button text="ย้อนกลับ" styleType="back" />
              </Link>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterNext;
