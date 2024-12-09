import React, { useState } from "react";
import ArrowButton from "../../components/ArrowButton/ArrowButton";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";
import styles from "./Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [department, setDepartment] = useState("");
  const [orgaddress, setOrgaddress] = useState("");
  const [telphone, setTelphone] = useState("");
  const [orgType, setOrgType] = useState("");
  const [address, setAddress] = useState({
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
  });

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleNext = async () => {
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("รูปแบบอีเมลไม่ถูกต้อง");
        return;
      }

      const mobilePhoneRegex = /^(0[89]{1}[0-9]{8})$/;
      const landlinePhoneRegex = /^(0[2-9]{1}[0-9]{7})$/;

      if (!mobilePhoneRegex.test(telphone) && !landlinePhoneRegex.test(telphone)) {
        toast.error("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เบอร์มือถือหรือเบอร์บ้าน/สำนักงาน)");
        return;
      }


      const checkEmailResponse = await axios.post(
        "http://localhost:3000/agency/check-email",
        { email }
      );
      if (checkEmailResponse.data.exists) {
        toast.error("อีเมลนี้ถูกใช้ไปแล้ว");
        return;
      }

      const checkTelResponse = await axios.post(
        "http://localhost:3000/agency/check-telphone",
        { telephone_number: telphone  }
      );
      if (checkTelResponse.data.exists) {
        toast.error("เบอร์โทรศัพท์นี้ถูกใช้ไปแล้ว");
        return;
      }

      if (orgType === "other") {
        const otherTypeInput = document.getElementById("otherType");
        if (otherTypeInput && otherTypeInput.value.trim()) {
          const otherValue = otherTypeInput.value.trim();

          const response = await axios.post(
            "http://localhost:3000/typeagency/create-type",
            {
              type_name: otherValue,
            }
          );

          if (response.status === 201) {
            const newType = response.data.data;
            if (newType && newType.id) {
              setOrgType(newType.id);
            } else {
              throw new Error("Failed to save new agency type");
            }
          }
        } else {
          toast.error("กรุณาระบุประเภทหน่วยงานในช่อง 'อื่นๆ'");
          return;
        }
      }

      navigate("/RegisterNext", {
        state: {
          email,
          orgname,
          department,
          orgaddress,
          telphone,
          ...address,
          orgType,
        },
      });
    } catch (error) {
      console.error("Error handling next:", error);
      toast.error(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

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
                label="อีเมล*"
                id="emailregister"
                name="emailregister"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=""
              />
              <Input
                label="ชื่อหน่วยงาน*"
                id="orgname"
                name="orgname"
                type="text"
                value={orgname}
                onChange={(e) => setOrgname(e.target.value)}
                placeholder=""
              />
              <Input
                label="แผนกงานที่รับผิดชอบตรวจสอบคุณวุฒิ*"
                id="department"
                name="department"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder=""
              />
              <Input
                label="เบอร์โทรศัพท์ของหน่วยงาน*"
                id="telphone"
                name="telphone"
                type="text"
                value={telphone}
                onChange={(e) => setTelphone(e.target.value)}
                placeholder=""
              />
              <Textfield
                label="ที่อยู่ของหน่วยงาน*"
                id="orgaddress"
                name="orgaddress"
                type="text"
                value={orgaddress}
                onChange={(e) => setOrgaddress(e.target.value)}
                placeholder=""
              />
            </div>
            <div className={styles.inputRegister}>
              <ThailandAddress onAddressChange={handleAddressChange} />
              <OptionTypeAgency
                label="ประเภทหน่วยงาน*"
                name="optionTypeAgency"
                id="optionTypeAgency"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                placeholder="กรุณาเลือกประเภทหน่วยงาน"
              />
            </div>
          </div>
        </form>
        <div className={styles.arrowButton}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <ArrowButton direction="left" color="grey" />
          </Link>
          <button type="button" onClick={handleNext} style={{ border: "none" }}>
            <ArrowButton direction="right" color="orange" />
          </button>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Register;
