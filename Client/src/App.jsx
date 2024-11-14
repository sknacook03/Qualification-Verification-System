import Button from "./components/button/Button";
import Footer from "./components/footer/footer";
import HeaderLogin from "./components/headerLogin/headerLogin";
import LoginForm from "./components/LoginForm/LoginForm";
import "./App.css";

function App() {
  return (
    <>
      <div className="-app-contrainer">
        <div className="-box-login">
          <div className="-login"></div>
        </div>
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
        <Footer />
      </div>
    </>
  );
}

export default App;
