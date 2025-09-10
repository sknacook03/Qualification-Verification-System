import React, { useState, useEffect } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
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

  const isPasswordStrong = (password) => {
    const requirements = [
      { test: (pwd) => pwd.length >= 8 },
      { test: (pwd) => /[A-Z]/.test(pwd) },
      { test: (pwd) => /[a-z]/.test(pwd) },
      { test: (pwd) => /\d/.test(pwd) },
      { test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
    ];

    const satisfiedRequirements = requirements.filter((req) =>
      req.test(password)
    ).length;
    return satisfiedRequirements >= 3;
  };

  const validateFile = (file) => {
    if (!file)
      return { isValid: false, error: "กรุณาอัปโหลดไฟล์หนังสือรับรอง" };

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];

    const fileExtension = file.name
      .toLowerCase()
      .substring(file.name.lastIndexOf("."));
    const isValidType =
      allowedTypes.includes(file.type) ||
      allowedExtensions.includes(fileExtension);

    if (!isValidType) {
      return {
        isValid: false,
        error: "ไฟล์ที่อัปโหลดต้องเป็น .pdf, .png หรือ .jpg เท่านั้น",
      };
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "ขนาดไฟล์ต้องไม่เกิน 10 MB",
      };
    }

    return { isValid: true, error: null };
  };

  useEffect(() => {
    axios.get(API_BASE_URL + APIEndpoints.typeAgency.fetchAll)
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
      const type = orgTypeList.find((item) => String(item.id) === String(orgType)); 
      setOrgTypeName(type ? type.type_name : "ไม่พบข้อมูล");
    }
  }, [orgType, orgTypeList]);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

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
    
    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (!isPasswordStrong(password)) {
      newErrors.password =
        "รหัสผ่านไม่แข็งแกร่ง กรุณาตรวจสอบความต้องการด้านล่าง";
    } else if (password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน";
    }

  
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      newErrors.file = fileValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormReady = () => {
    return (
      email && 
      orgname && 
      department && 
      telphone && 
      orgType && 
      orgaddress && 
      address.subdistrict && 
      address.district && 
      address.province && 
      address.postalCode && 
      password && 
      confirmPassword && 
      isPasswordStrong(password) && 
      file && 
      validateFile(file).isValid
    );
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
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
  
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("agency_name", orgname);
      formData.append("department", department);
      formData.append("address", orgaddress);
      formData.append("telephone_number", telphone);
      formData.append("type_id", orgType);
      formData.append("subdistrict",address.subdistrict);
      formData.append("district",address.district);
      formData.append("province",address.province);
      formData.append("postal_code",address.postalCode);
      formData.append("password", password);
      formData.append("certificate", file);
      formData.append("status_approve", "pending")
      Object.keys(address).forEach((key) => formData.append(key, address[key]));
  
      await toast.promise(
        axios.put( API_BASE_URL + APIEndpoints.agency.updateRejectAgency(agencyId), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }),
        {
          pending: "กำลังอัปเดตข้อมูล...",
          success: "อัปเดตข้อมูลสำเร็จ!",
          error: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล!",
        }
      );
  
      setShowPopup(true);
    } catch (error) {
      console.error("Error updating data:", error);
      toast.error("เกิดข้อผิดพลาด: " + (error.response?.data?.message || "ไม่สามารถอัปเดตข้อมูลได้"));
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
        <h3>แก้ไขข้อมูลการสมัครสมาชิก</h3>
        <form action="">
          <div className={styles.inputForm}>
            <div className={styles.inputRegister}>
              <Input 
                label="อีเมล*" 
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
                type="text" 
                value={orgname} 
                onChange={(e) => {
                  setOrgname(e.target.value);
                  setErrors((prev) => ({ ...prev, orgname: undefined }));
                }} 
                error={errors.orgname} 
              />
              <Input 
                label="แผนกงานที่รับผิดชอบ*" 
                type="text" 
                value={department} 
                onChange={(e) => {
                  setDepartment(e.target.value);
                  setErrors((prev) => ({ ...prev, department: undefined }));
                }} 
                error={errors.department} 
              />
              <Input 
                label="เบอร์โทรศัพท์*" 
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
                onAddressChange={(newAddress) => {
                  handleAddressChange(newAddress);
                  // ล้าง error ของ address fields
                  setErrors((prev) => ({ 
                    ...prev, 
                    subdistrict: undefined,
                    district: undefined,
                    province: undefined,
                    postalCode: undefined
                  }));
                }} 
                error={errors} 
              />
              <OptionTypeAgency 
                label="ประเภทหน่วยงาน*" 
                value={orgType} 
                onChange={(e) => {
                  setOrgType(e.target.value);
                  setErrors((prev) => ({ ...prev, orgType: undefined }));
                }} 
                error={errors.orgType} 
              />
            </div>
              <PasswordInput 
                label="รหัสผ่านใหม่" 
                id="password" 
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }} 
                error={errors.password} 
              />
              <PasswordStrengthIndicator password={password} />
              <PasswordInput 
                label="ยืนยันรหัสผ่าน" 
                id="confirmPassword" 
                value={confirmPassword} 
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }} 
                error={errors.confirmPassword} 
              />
            <div className={styles.infoInput}>
              <p>อัปโหลดหนังสือรับรองเพื่อเข้าใช้งานระบบ</p>
              <p>(รองรับไฟล์ .pdf .png .jpg ขนาดไม่เกิน 10 MB)</p>
            </div>
              <Input 
                type="file" 
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => {
                  const selectedFile = e.target.files[0];
                  if (selectedFile) {
                    const fileValidation = validateFile(selectedFile);
                    if (fileValidation.isValid) {
                      setFile(selectedFile);
                      setErrors((prev) => ({ ...prev, file: undefined }));
                    } else {
                      setFile(null);
                      setErrors((prev) => ({
                        ...prev,
                        file: fileValidation.error,
                      }));
                      e.target.value = "";
                    }
                  } else {
                    setFile(null);
                    setErrors((prev) => ({ ...prev, file: undefined }));
                  }
                }} 
                error={errors.file} 
              />
              {file && (
                <div className={styles.fileInfo}>
                  <p className={styles.fileSelected}>
                    <span className={styles.fileIcon}>📄</span>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </p>
                </div>
              )}  
          </div>
          <div className={styles.buttonSubmit}>
            <Button 
              text="ยืนยันการแก้ไขข้อมูล" 
              styleType="third" 
              onClick={handleSubmit} 
              disabled={!isFormReady()}
            />
            <Link to="/" style={{ textDecoration: "none" }}>
              <Button text="ย้อนกลับ" styleType="back" />
            </Link>
          </div>
          {showPopup && <Popup topic="สำเร็จ!" info="ข้อมูลของคุณถูกอัปเดตแล้ว" img={message} successPopup={() => navigate("/")} textButtonSuccess="กลับสู่หน้าหลัก" />}
        </form>
      </div>
      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
}

export default Editregister;