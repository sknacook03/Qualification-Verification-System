import React, { useState, useEffect } from "react";
import ArrowButton from "../../components/ArrowButton/ArrowButton";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import SEO from "../../components/SEO/SEO.jsx";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";
import styles from "./Register.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import axios from "axios";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // รับข้อมูลจาก navigation state หรือ localStorage
  const getInitialData = () => {
    const navigationData = location.state || {};
    const localStorageData = localStorage.getItem('registerFormData');
    
    if (Object.keys(navigationData).length > 0) {
      // ถ้ามีข้อมูลจาก navigation ให้บันทึกลง localStorage ด้วย
      localStorage.setItem('registerFormData', JSON.stringify(navigationData));
      return navigationData;
    } else if (localStorageData) {
      // ถ้าไม่มีข้อมูลจาก navigation ให้ใช้จาก localStorage
      try {
        return JSON.parse(localStorageData);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        return {};
      }
    }
    return {};
  };
  
  const savedFormData = getInitialData();
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState(savedFormData.email || "");
  const [orgname, setOrgname] = useState(savedFormData.orgname || "");
  const [department, setDepartment] = useState(savedFormData.department || "");
  const [orgaddress, setOrgaddress] = useState(savedFormData.orgaddress || "");
  const [telphone, setTelphone] = useState(savedFormData.telphone || "");
  const [orgType, setOrgType] = useState(savedFormData.orgType || "");
  const [address, setAddress] = useState({
    subdistrict: savedFormData.subdistrict || "",
    district: savedFormData.district || "",
    province: savedFormData.province || "",
    postalCode: savedFormData.postalCode || "",
  });

  // บันทึกข้อมูลลง localStorage เมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    const formData = {
      email,
      orgname,
      department,
      orgaddress,
      telphone,
      orgType,
      ...address
    };
    
    // บันทึกเฉพาะเมื่อมีข้อมูลบางส่วน
    const hasData = Object.values(formData).some(value => value && value.trim() !== '');
    if (hasData) {
      localStorage.setItem('registerFormData', JSON.stringify(formData));
    }
  }, [email, orgname, department, orgaddress, telphone, orgType, address]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "กรุณากรอกอีเมล*";
    }
    if (!orgname) {
      newErrors.orgname = "กรุณากรอกชื่อหน่วยงาน*";
    }
    if (!department) {
      newErrors.department = "กรุณากรอกแผนกงานที่รับผิดชอบตรวจสอบคุณวุฒิ*";
    }
    if (!telphone) {
      newErrors.telphone = "กรุณากรอกเบอร์โทรศัพท์ของหน่วยงาน*";
    }
    if (!orgType) {
      newErrors.orgType = "กรุณากรอกประเภทหน่วยงาน*";
    }
    if (!orgaddress) {
      newErrors.orgaddress = "กรุณากรอกอีเมลที่อยู่ของหน่วยงาน*";
    }
    if (!address.subdistrict) {
      newErrors.subdistrict = "กรุณากรอกตำบล / แขวง*";
    }
    if (!address.district) {
      newErrors.district = "กรุณากรอกอำเภอ / เขต*";
    }
    if (!address.province) {
      newErrors.province = "กรุณากรอกจังหวัด*";
    }
    if (!address.postalCode) {
      newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์*";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
    setErrors((prev) => ({
      ...prev,
      subdistrict: undefined,
      district: undefined,
      province: undefined,
      postalCode: undefined,
    }));
  };

  const handleNext = async () => {
    setLoading(true);
    toast.dismiss();

    if (validateForm()) {
      try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error("รูปแบบอีเมลไม่ถูกต้อง");
          setLoading(false);
          return;
        }

        const mobilePhoneRegex = /^(0[89]{1}[0-9]{8})$/;
        const landlinePhoneRegex = /^(0[2-9]{1}[0-9]{7})$/;

        if (
          !mobilePhoneRegex.test(telphone) &&
          !landlinePhoneRegex.test(telphone)
        ) {
          toast.error(
            "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เบอร์มือถือหรือเบอร์บ้าน/สำนักงาน)"
          );
          setLoading(false);
          return;
        }

        const checkEmailResponse = await toast.promise(
          axios.post(API_BASE_URL + APIEndpoints.agency.checkEmail, { email }),
          { pending: "กำลังตรวจสอบข้อมูล..." }
        );
        if (checkEmailResponse.data.exists) {
          toast.error("อีเมลนี้ถูกใช้ไปแล้ว");
          setLoading(false);
          return;
        }

        const checkTelResponse = await toast.promise(
          axios.post(API_BASE_URL + APIEndpoints.agency.checkTelphone, {
            telephone_number: telphone,
          }),
          { pending: "กำลังตรวจสอบข้อมูล..." }
        );
        if (checkTelResponse.data.exists) {
          toast.error("เบอร์โทรศัพท์นี้ถูกใช้ไปแล้ว");
          setLoading(false);
          return;
        }

        navigate("/RegisterNext", {
          state: {
            ...savedFormData, // รวมข้อมูลที่บันทึกไว้
            email,
            orgname,
            department,
            orgaddress,
            telphone,
            ...address,
            orgType,
          },
        });
        
        // ล้าง localStorage เมื่อไปหน้าถัดไปสำเร็จ
        localStorage.removeItem('registerFormData');
      } catch (error) {
        console.error("Error handling next:", error);
        toast.error(error.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="สมัครสมาชิก - ระบบตรวจคุณวุฒิมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน | มทร.อีสาน"
        description="สมัครสมาชิกเพื่อใช้งานระบบตรวจสอบคุณวุฒิมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา สำหรับหน่วยงานราชการและเอกชน ลงทะเบียนง่าย รวดเร็ว ปลอดภัย"
        keywords="สมัครสมาชิก, ลงทะเบียนหน่วยงาน, ระบบตรวจสอบคุณวุฒิ, หน่วยงานราชการ, สมัครใช้งาน"
        url="https://cpermuti.com/eduverify/register"
      />
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
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
              />
              <Input
                label="ชื่อหน่วยงาน*"
                id="orgname"
                name="orgname"
                type="text"
                value={orgname}
                onChange={(e) => {
                  setOrgname(e.target.value);
                  setErrors((prev) => ({ ...prev, orgname: undefined }));
                }}
                error={errors.orgname}
              />
              <Input
                label="แผนกงานที่รับผิดชอบตรวจสอบคุณวุฒิ*"
                id="department"
                name="department"
                type="text"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setErrors((prev) => ({ ...prev, department: undefined }));
                }}
                error={errors.department}
              />
              <Input
                label="เบอร์โทรศัพท์ของหน่วยงาน*"
                id="telphone"
                name="telphone"
                type="text"
                value={telphone}
                onChange={(e) => {
                  setTelphone(e.target.value);
                  setErrors((prev) => ({ ...prev, telphone: undefined }));
                }}
                error={errors.telphone}
              />
              <Textfield
                label="ที่อยู่ของหน่วยงาน*"
                id="orgaddress"
                name="orgaddress"
                type="text"
                value={orgaddress}
                onChange={(e) => {
                  setOrgaddress(e.target.value);
                  setErrors((prev) => ({ ...prev, orgaddress: undefined }));
                }}
                error={errors.orgaddress}
              />
            </div>
            <div className={styles.inputRegister}>
              <ThailandAddress
                value={address}
                onAddressChange={handleAddressChange}
                onClearError={handleClearError}
                error={{
                  subdistrict: errors.subdistrict,
                  district: errors.district,
                  province: errors.province,
                  postalCode: errors.postalCode,
                }}
              />
              <OptionTypeAgency
                label="ประเภทหน่วยงาน*"
                name="optionTypeAgency"
                id="optionTypeAgency"
                value={orgType}
                onChange={(e) => {
                  setOrgType(e.target.value);
                  setErrors((prev) => ({ ...prev, orgType: undefined }));
                }}
                placeholder="กรุณาเลือกประเภทหน่วยงาน"
                error={errors.orgType}
              />
            </div>
          </div>
        </form>
        <div className={styles.arrowButton}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <ArrowButton direction="left" color="grey" />
          </Link>
          <ArrowButton 
            direction="right" 
            color="orange" 
            onClick={handleNext}
            disabled={loading}
            style={{ border: "none", position: "relative" }}
          />
          {loading && (
            <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)" }}>
              <ClipLoader color="#FF9900" size={20} />
            </div>
          )}
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </div>
    </>
  );
}

export default Register;
