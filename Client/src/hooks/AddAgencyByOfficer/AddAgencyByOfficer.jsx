import React, { useState, useEffect } from "react";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import Button from "../../components/button/Button";
import Popup from "../../components/Popup/Popup";
import message from "../../assets/message.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddAgencyByOfficer.module.css"
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import axios from "axios";

const AddAgencyByOfficer = ({ officer }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const formData = location.state || {};
  const [errors, setErrors] = useState({});
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
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);

  const isPasswordStrong = (password) => password.length >= 8;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePhoneRegex = /^(0[89]{1}[0-9]{8})$/;
  const landlinePhoneRegex = /^(0[2-9]{1}[0-9]{7})$/;

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = "กรุณากรอกอีเมล*";
    if (!orgname) newErrors.orgname = "กรุณากรอกชื่อหน่วยงาน*";
    if (!department) newErrors.department = "กรุณากรอกแผนกงาน*";
    if (!telphone) newErrors.telphone = "กรุณากรอกเบอร์โทรศัพท์*";
    if (!orgType) newErrors.orgType = "กรุณาเลือกประเภทหน่วยงาน*";
    if (!orgaddress) newErrors.orgaddress = "กรุณากรอกที่อยู่ของหน่วยงาน*";
    if (!address.subdistrict) newErrors.subdistrict = "กรุณากรอกตำบล*";
    if (!address.district) newErrors.district = "กรุณากรอกอำเภอ*";
    if (!address.province) newErrors.province = "กรุณากรอกจังหวัด*";
    if (!address.postalCode) newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์*";
    if (!password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (!confirmPassword) newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    if (!file) newErrors.file = "กรุณาอัปโหลดไฟล์หนังสือรับรอง";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setEmail("");
    setOrgname("");
    setDepartment("");
    setOrgaddress("");
    setTelphone("");
    setOrgType("");
    setPassword("");
    setConfirmPassword("");
    setFile(null);
    setAddress({ subdistrict: "", district: "", province: "", postalCode: "" });
    setErrors({});
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    if (validateForm()) {
      setErrors({});
    }
  };

  const closePopup = (e) => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน!");
      return;
    }
    if (!isPasswordStrong(password)) {
      toast.error("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }
    if (!mobilePhoneRegex.test(telphone) &&!landlinePhoneRegex.test(telphone)) {
      toast.error("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เบอร์มือถือหรือเบอร์บ้าน/สำนักงาน)");
      return;
    }
    try {
      const checkEmailResponse = await axios.post(
        API_BASE_URL + APIEndpoints.agency.checkEmail,
        { email }
      );
      if (checkEmailResponse.data.exists) {
        toast.error("อีเมลนี้ถูกใช้ไปแล้ว");
        return;
      }

      const checkTelResponse = await axios.post(
        API_BASE_URL + APIEndpoints.agency.checkTelphone,
        { telephone_number: telphone }
      );
      if (checkTelResponse.data.exists) {
        toast.error("เบอร์โทรศัพท์นี้ถูกใช้ไปแล้ว");
        return;
      }

      const formData = new FormData();
      formData.append("email", email);
      formData.append("agency_name", orgname);
      formData.append("department", department);
      formData.append("telephone_number", telphone);
      formData.append("address", orgaddress);
      formData.append("subdistrict",address.subdistrict);
      formData.append("district",address.district);
      formData.append("province",address.province);
      formData.append("postal_code",address.postalCode);
      formData.append("type_id", orgType);
      formData.append("password", password);
      formData.append("certificate", file);

      Object.keys(formData).forEach((key) => {
        finalData.append(key, formData[key]);
      });

      await toast.promise(
        axios.post(API_BASE_URL + APIEndpoints.agency.createAgency, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
        {
          pending: "กำลังเพิ่มหน่วยงาน...",
          success: "เพิ่มหน่วยงานสำเร็จ!",
          error: "เกิดข้อผิดพลาดในการเพิ่มหน่วยงาน!",
        }
      );
      setShowPopup(true);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มหน่วยงาน");
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.appContent}>
        <h3>เพิ่มหน่วยงาน</h3>
        <form action="">
          <div className={styles.inputForm}>
            <div className={styles.inputRegister}>
              <Input label="อีเมล*" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
              <Input label="ชื่อหน่วยงาน*" type="text" value={orgname} onChange={(e) => setOrgname(e.target.value)} error={errors.orgname} />
              <Input label="แผนกงานที่รับผิดชอบ*" type="text" value={department} onChange={(e) => setDepartment(e.target.value)} error={errors.department} />
              <Input label="เบอร์โทรศัพท์*" type="text" value={telphone} onChange={(e) => setTelphone(e.target.value)} error={errors.telphone} />
              <Textfield label="ที่อยู่ของหน่วยงาน*" type="text" value={orgaddress} onChange={(e) => setOrgaddress(e.target.value)} error={errors.orgaddress} />
            </div>
            <div className={styles.inputRegister}>
              <ThailandAddress value={address} onAddressChange={handleAddressChange} error={errors} />
              <OptionTypeAgency label="ประเภทหน่วยงาน*" value={orgType} onChange={(e) => setOrgType(e.target.value)} error={errors.orgType} />
            </div>
              <PasswordInput label="รหัสผ่านใหม่" id="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
              <PasswordInput label="ยืนยันรหัสผ่าน" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} />        
              <div className={styles.infoInput}>
                <p>อัพโหลดหนังสือรับรองเพื่อเข้าใช้งานระบบ</p>
                <p>(รองรับไฟล์ .pdf .png .jpg ขนาดไม่เกิน 10 MB)</p>
              </div>
              <Input type="file" onChange={(e) => setFile(e.target.files[0])} error={errors.file}
          />
          </div>
          <div className={styles.buttonSubmit}>
            <Button text="เพิ่มข้อมูล" styleType="third" onClick={handleSubmit} disabled={Object.keys(errors).length > 0}/>
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button text="ย้อนกลับ" styleType="back" />
            </Link>
          </div>
          {showPopup && <Popup topic="สำเร็จ!" info="ข้อมูลของคุณถูกเพิ่มแล้ว" img={message} successPopup={closePopup} textButtonSuccess="ปิดหน้าต่าง" />}
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
  
}

export default AddAgencyByOfficer;
