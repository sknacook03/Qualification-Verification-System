import { useState } from 'react'
import PasswordInput from '../../hooks/PasswordInput/PasswordInput'
import Header from '../../components/header/header'
import Input from '../../components/Input/Input'
import Footer from '../../components/footer/footer'
import Button from '../../components/button/Button'
import styles from './RegisterNext.module.css'

function RegisterNext() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");

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
        <div className='inputForm'>
          <form action="">
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
                type='file'
              />
            <div className={styles.buttonSubmit}>
              <Button 
                text="ยืนยันการสมัครสมาชิก"
                styleType="third"
                />
              <Button 
                text="ย้อนกลับ"
                styleType="back"
                />
              </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterNext