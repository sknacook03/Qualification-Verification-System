import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import Footer from "../../components/footer/footer";
import HeaderLogin from "../../components/headerLogin/headerLogin";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import styles from "./login.module.css";

function App() {
  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.boxLogin}>
          <div className={styles.login}>
            <HeaderLogin />
            <div className={styles.form}>
              <div className={styles.btnLeft}>
                <LoginForm />
              </div>
              <div className={styles.btnRight}>
                <Link
                  to="/Register"
                  style={{ width: "100%", textDecoration: "none" }}
                >
                  <Button
                    text="สมัครสมาชิก(หน่วยงานใหม่)"
                    styleType="primary"
                  />
                </Link>
                <div className={styles.btnSecondary}>
                  <Button
                    text="ดาวน์โหลดฟอร์มหนังสือรับรอง"
                    styleType="secondary"
                  />
                  <Button text="คู่มือการใช้งานระบบ" styleType="secondary" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
