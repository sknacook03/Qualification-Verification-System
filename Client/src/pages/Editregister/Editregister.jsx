import React, { useState, useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import styles from "./Editregister.module.css";
import Button from "../../components/button/Button";
import Popup from "../../components/Popup/Popup";
import message from "../../assets/message.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import axios from "axios";

function Editregister() {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [errors, setErrors] = useState({});
  const [agencyId, setAgencyId] = useState(null);
  const [email, setEmail] = useState("");
  const [orgname, setOrgname] = useState("");
  const [department, setDepartment] = useState("");
  const [orgaddress, setOrgaddress] = useState("");
  const [telphone, setTelphone] = useState("");
  const [orgType, setOrgType] = useState("");
  const [orgTypeName, setOrgTypeName] = useState("");
  const [orgTypeList, setOrgTypeList] = useState([]);
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

  useEffect(() => {
    axios
      .get(API_BASE_URL + APIEndpoints.typeAgency.fetchAll)
      .then((response) => {
        if (response.data.success) {
          setOrgTypeList(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching type agency list:", error);
      });
  }, []);

  useEffect(() => {
    if (orgTypeList.length > 0 && orgType) {
      const type = orgTypeList.find(
        (item) => String(item.id) === String(orgType)
      );
      setOrgTypeName(type ? type.type_name : "ไม่พบข้อมูล");
    }
  }, [orgType, orgTypeList]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    console.log("Token:", token);
    if (!token) {
      toast.error("Session หมดอายุ กรุณาเข้าสู่ระบบใหม่");
      navigate("/");
      return;
    }

    if (token) {
      axios
        .post(API_BASE_URL + APIEndpoints.officer.verifyToken, { token })
        .then((response) => {
          if (response.data.success) {
            const data = response.data.data;
            setAgencyId(data.id);
            setEmail(data.email);
            setOrgname(data.agency_name);
            setDepartment(data.department);
            setOrgaddress(data.address);
            setTelphone(data.telephone_number);
            setOrgType(data.type_id);
            setAddress({
              subdistrict: data.subdistrict,
              district: data.district,
              province: data.province,
              postalCode: data.postal_code,
            });
          } else {
            toast.error("ไม่สามารถโหลดข้อมูลได้");
            navigate("/");
          }
        })
        .catch((error) => {
          console.error("Error fetching rejected data:", error);
          console.log(error.response);
          toast.error("เกิดข้อผิดพลาด");
          navigate("/");
        });
    }
  }, [navigate]);

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

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    if (validateForm()) {
      setErrors({});
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    navigate("/");
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

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("agency_name", orgname);
      formData.append("department", department);
      formData.append("address", orgaddress);
      formData.append("telephone_number", telphone);
      formData.append("type_id", orgType);
      formData.append("password", password);
      formData.append("certificate", file);
      formData.append("status_approve", "pending");
      Object.keys(address).forEach((key) => formData.append(key, address[key]));

      console.log("FormData Entries:", Object.fromEntries(formData.entries()));
      await toast.promise(
        axios.put(
          API_BASE_URL + APIEndpoints.agency.updateRejectAgency(agencyId),
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        ),
        {
          pending: "กำลังอัปเดตข้อมูล...",
          success: "อัปเดตข้อมูลสำเร็จ!",
          error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล!",
        }
      );

      setShowPopup(true);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error(
        "เกิดข้อผิดพลาด: " +
          (error.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้")
      );
    }
  };

  return (
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.appContent}>
        <div className={styles.topBar}>
          {["#09FF3E"].map((color, index) => (
            <div
              key={index}
              style={{
                flexGrow: 1,
                height: "100%",
                backgroundColor: color,
              }}
            ></div>
          ))}
        </div>
        <h3>แก้ไขข้อมูลการสมัครสมาชิค</h3>
        <form action="">
          <div className={styles.inputForm}>
            <div className={styles.inputRegister}>
              <Input
                label="อีเมล*"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Input
                label="ชื่อหน่วยงาน*"
                type="text"
                value={orgname}
                onChange={(e) => setOrgname(e.target.value)}
                error={errors.orgname}
              />
              <Input
                label="แผนกงานที่รับผิดชอบ*"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                error={errors.department}
              />
              <Input
                label="เบอร์โทรศัพท์*"
                type="text"
                value={telphone}
                onChange={(e) => setTelphone(e.target.value)}
                error={errors.telphone}
              />
              <Textfield
                label="ที่อยู่ของหน่วยงาน*"
                type="text"
                value={orgaddress}
                onChange={(e) => setOrgaddress(e.target.value)}
                error={errors.orgaddress}
              />
            </div>
            <div className={styles.inputRegister}>
              <ThailandAddress
                value={address}
                onAddressChange={handleAddressChange}
                error={errors}
              />
              <OptionTypeAgency
                label="ประเภทหน่วยงาน*"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value)}
                error={errors.orgType}
              />
            </div>
            <PasswordInput
              label="รหัสผ่านใหม่"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <PasswordInput
              label="ยืนยันรหัสผ่าน"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            <div className={styles.infoInput}>
              <p>อัปโหลดหนังสือรับรองเพื่อเข้าใช้งานระบบ</p>
              <p>(รองรับไฟล์ .pdf .png .jpg ขนาดไม่เกิน 10 MB)</p>
            </div>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              error={errors.file}
            />
          </div>
          <div className={styles.buttonSubmit}>
            <Button
              text="ยืนยันการแก้ไขข้อมูล"
              styleType="third"
              onClick={handleSubmit}
              disabled={Object.keys(errors).length > 0}
            />
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button text="ย้อนกลับ" styleType="back" />
            </Link>
          </div>
          {showPopup && (
            <Popup
              topic="แก้ไขข้อมูลสำเร็จ!"
              info="รอการตรวจสอบจากเจ้าหน้าที่ เมื่อตรวจสอบสำเร็จแล้ว
              จะส่งผลการตรวจสอบไปยังอีเมลของคุณ"
              img={message}
              successPopup={() => navigate("/")}
              textButtonSuccess="กลับสู่หน้าหลัก"
            />
          )}
        </form>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Editregister;
