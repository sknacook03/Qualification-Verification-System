import React, { useState } from "react";
import ArrowButton from "../../components/ArrowButton/ArrowButton";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import styles from "./Register.module.css";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [department, setDepartment] = useState("");
  const [orgaddress, setOrgaddress] = useState("");
  const [telphone, setTelphone] = useState("");

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.appContent}>
        <div className={styles.topBar}>
          {["#09FF3E", "#a2fbb5"].map((color, index) => (
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
        <form action="">
          <div className={styles.inputForm}>
            <div className={styles.inputRegister}>
              <Input
                label=" "
                id="emailregister"
                name="emailregister"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="อีเมล"
              />
            </div>
            <div className={styles.inputRegister}>
              <Input
                label=" "
                id="orgname"
                name="orgname"
                type="text"
                value={orgname}
                onChange={(e) => setOrgname(e.target.value)}
                placeholder="ชื่อหน่วยงาน"
              />
            </div>
            <div className={styles.inputRegister}>
              <Input
                label=" "
                id="department"
                name="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="แผนกงานที่รับผิดชอบตรวจสอบคุณวุฒิ "
              />
            </div>
            <div className={styles.inputRegister}>
              <Textfield
                label=" "
                id="orgaddress"
                name="orgaddress"
                type="text"
                value={orgaddress}
                onChange={(e) => setOrgaddress(e.target.value)}
                placeholder="ที่อยู่ของหน่วยงาน"
              />
            </div>
            <ThailandAddress />
            <div className={styles.inputRegister}>
              <Input
                label=" "
                id="telphone"
                name="telphone"
                type="text"
                value={telphone}
                onChange={(e) => setTelphone(e.target.value)}
                placeholder="เบอร์โทรศัพท์ของหน่วยงาน"
              />
            </div>
          </div>
        </form>
        <div className={styles.arrowButton}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <ArrowButton direction="left" color="grey" />
          </Link>
          <Link to="/RegisterNext" style={{ textDecoration: "none" }}>
            <ArrowButton direction="right" color="orange" />
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
