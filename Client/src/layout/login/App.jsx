import Button from "../../components/button/Button";
import Footer from "../../components/footer/footer";
import HeaderLogin from "../../components/headerLogin/headerLogin";
import LoginForm from "../../hooks/LoginForm/LoginForm";
import styles from "./App.module.css";

function App() {
  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.boxLogin}>
          <div className={styles.login}>
            <div>
              <Button
                text="สมัครสมาชิก"
                onClick={() => alert("สมัครสมาชิก")}
                styleType="primary"
              />
              <Button
                text="ดาวน์โหลดฟอร์มหนังสือรับรอง"
                onClick={() => alert("ดาวน์โหลดฟอร์มหนังสือรับรอง")}
                styleType="button-secondary"
              />
            </div>
            <HeaderLogin />
            <LoginForm />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
