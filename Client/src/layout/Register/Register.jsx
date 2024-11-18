import React ,{ useState } from "react";
import ArrowButton from "../../components/ArrowButton/ArrowButton";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import styles from "./Register.module.css";

function Register() {
  const [email, setEmail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [orgaddress, setOrgaddress] = useState("");

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.appContent}>
        <h3>สมัครสมาชิก</h3>
        <form action="">
          <div className={styles.inputForm}>
            <Input
              label=" "
              id="emailregister"
              name="emailregister"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="อีเมล"
            />

            <Input
              label=" "
              id="orgname"
              name="orgname"
              type="text"
              value={orgname}
              onChange={(e) => setOrgname(e.target.value)}
              placeholder="ชื่อหน่วยงาน"
            />

            <Textfield label=" "
              id="orgaddress"
              name="orgaddress"
              type="text"
              value={orgaddress}
              onChange={(e) => setOrgaddress(e.target.value)}
              placeholder="ที่อยู่ของหน่วยงาน"
              />
            
            <ThailandAddress />
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
