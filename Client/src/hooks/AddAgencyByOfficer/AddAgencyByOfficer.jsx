import React, { useState, useEffect } from "react";
import ThailandAddress from "../../libs/ThailandAddress";
import Input from "../../components/Input/Input";
import Textfield from "../../components/Textfield/Textfield";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput";
import Button from "../../components/button/Button";
import Popup from "../../components/Popup/Popup";
import message from "../../assets/message.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AddAgencyByOfficer.module.css";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import axios from "axios";

const AddAgencyByOfficer = ({ officer, onDataChange }) => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobilePhoneRegex = /^(0[6-9][0-9]{8})$/;
  const landlinePhoneRegex = /^(0[2-7][0-9]{7,8})$/;

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

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "กรุณากรอกอีเมล*";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }
    if (!orgname) newErrors.orgname = "กรุณากรอกชื่อหน่วยงาน*";
    if (!department) newErrors.department = "กรุณากรอกแผนกงาน*";
    if (!telphone) {
      newErrors.telphone = "กรุณากรอกเบอร์โทรศัพท์*";
    } else if (
      !mobilePhoneRegex.test(telphone) &&
      !landlinePhoneRegex.test(telphone)
    ) {
      newErrors.telphone =
        "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (เบอร์มือถือหรือเบอร์บ้าน/สำนักงาน)";
    }
    if (!orgType) newErrors.orgType = "กรุณาเลือกประเภทหน่วยงาน*";
    if (!orgaddress) newErrors.orgaddress = "กรุณากรอกที่อยู่ของหน่วยงาน*";
    if (!address.subdistrict) newErrors.subdistrict = "กรุณากรอกตำบล*";
    if (!address.district) newErrors.district = "กรุณากรอกอำเภอ*";
    if (!address.province) newErrors.province = "กรุณากรอกจังหวัด*";
    if (!address.postalCode) newErrors.postalCode = "กรุณากรอกรหัสไปรษณีย์*";
    if (!password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    } else if (!isPasswordStrong(password)) {
      newErrors.password =
        "รหัสผ่านไม่แข็งแกร่ง กรุณาตรวจสอบความต้องการด้านล่าง";
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
    if (
      errors.subdistrict ||
      errors.district ||
      errors.province ||
      errors.postalCode
    ) {
      setErrors((prev) => ({
        ...prev,
        subdistrict: undefined,
        district: undefined,
        province: undefined,
        postalCode: undefined,
      }));
    }
  };

  const closePopup = (e) => {
    setShowPopup(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
      formData.append("subdistrict", address.subdistrict);
      formData.append("district", address.district);
      formData.append("province", address.province);
      formData.append("postal_code", address.postalCode);
      formData.append("type_id", orgType);
      formData.append("password", password);
      formData.append("certificate", file);

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
      
      // อัปเดต counts แบบเรียลไทม์
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "เกิดข้อผิดพลาดในการเพิ่มหน่วยงาน"
      );
    }
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.appContent}>
        <h2>เพิ่มหน่วยงาน</h2>
        <form action="">
          <div className={styles.inputForm}>
            <div className={styles.inputRegister}>
              <Input
                label="อีเมล*"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) {
                    setErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                error={errors.email}
              />
              <Input
                label="ชื่อหน่วยงาน*"
                type="text"
                value={orgname}
                onChange={(e) => {
                  setOrgname(e.target.value);
                  if (errors.orgname) {
                    setErrors((prev) => ({ ...prev, orgname: undefined }));
                  }
                }}
                error={errors.orgname}
              />
              <Input
                label="แผนกงานที่รับผิดชอบ*"
                type="text"
                value={department}
                onChange={(e) => {
                  setDepartment(e.target.value);
                  if (errors.department) {
                    setErrors((prev) => ({ ...prev, department: undefined }));
                  }
                }}
                error={errors.department}
              />
              <Input
                label="เบอร์โทรศัพท์*"
                type="text"
                value={telphone}
                onChange={(e) => {
                  setTelphone(e.target.value);
                  if (errors.telphone) {
                    setErrors((prev) => ({ ...prev, telphone: undefined }));
                  }
                }}
                error={errors.telphone}
              />
              <Textfield
                label="ที่อยู่ของหน่วยงาน*"
                type="text"
                value={orgaddress}
                onChange={(e) => {
                  setOrgaddress(e.target.value);
                  if (errors.orgaddress) {
                    setErrors((prev) => ({ ...prev, orgaddress: undefined }));
                  }
                }}
                error={errors.orgaddress}
              />
            </div>
            <div className={styles.inputRegister}>
              <div className={styles.inputAddress}>
                <ThailandAddress
                  value={address}
                  onAddressChange={handleAddressChange}
                  error={errors}
                />
              </div>
              <OptionTypeAgency
                label="ประเภทหน่วยงาน*"
                value={orgType}
                onChange={(e) => {
                  setOrgType(e.target.value);
                  if (errors.orgType) {
                    setErrors((prev) => ({ ...prev, orgType: undefined }));
                  }
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
                if (errors.password) {
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }
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
                if (errors.confirmPassword) {
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }
              }}
              error={errors.confirmPassword}
            />
            <div className={styles.infoInput}>
              <p>อัพโหลดหนังสือรับรองเพื่อเข้าใช้งานระบบ</p>
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
                    if (errors.file) {
                      setErrors((prev) => ({ ...prev, file: undefined }));
                    }
                  } else {
                    setFile(null);
                    e.target.value = "";
                    toast.error(fileValidation.error);
                  }
                } else {
                  setFile(null);
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
              text="เพิ่มข้อมูล"
              styleType="third"
              onClick={handleSubmit}
            />
          </div>
          {showPopup && (
            <Popup
              topic="สำเร็จ!"
              info="ข้อมูลของคุณถูกเพิ่มแล้ว"
              img={message}
              successPopup={closePopup}
              textButtonSuccess="ปิดหน้าต่าง"
            />
          )}
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AddAgencyByOfficer;
