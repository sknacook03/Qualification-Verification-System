import React, { useState } from "react";
import axios from "axios";
import PasswordInput from "../../hooks/PasswordInput/PasswordInput.jsx";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./AddOfficerByOfficer.module.css";

function AddOfficerByOfficer() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
    setMessage("");
  };

  const checkEmailExists = async (email) => {
    try {
      const res = await axios.post(
        API_BASE_URL + APIEndpoints.officer.checkOfficerEmail,
        { email },
        { withCredentials: true }
      );
      return res.data.exists;
    } catch (e) {
      return false;
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    if (!form.first_name.trim() || form.first_name.includes(" ")) {
      newErrors.first_name = "ชื่อห้ามเว้นวรรคหรือเว้นว่าง";
    }
    if (!form.last_name.trim() || form.last_name.includes(" ")) {
      newErrors.last_name = "นามสกุลห้ามเว้นวรรคหรือเว้นว่าง";
    }
    if (!form.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (form.password.length < 8) {
      newErrors.password = "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร";
    } else if (!isPasswordStrong(form.password)) {
      newErrors.password = "รหัสผ่านไม่แข็งแกร่ง กรุณาตรวจสอบความต้องการด้านล่าง";
    }
    if (!form.confirm_password) {
      newErrors.confirm_password = "กรุณากรอกยืนยันรหัสผ่าน";
    } else if (form.password !== form.confirm_password) {
      newErrors.confirm_password = "รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบ";
    }
    if (!form.email) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else {
      const emailExists = await checkEmailExists(form.email);
      if (emailExists) {
        newErrors.email = "อีเมลนี้มีอยู่ในระบบแล้ว กรุณาใช้อีเมลอื่น";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      const { confirm_password, ...sendData } = form;
      await axios.post(
        API_BASE_URL + APIEndpoints.officer.createOfficer,
        sendData,
        { withCredentials: true }
      );
      setMessage("เพิ่มเจ้าหน้าที่สำเร็จ!");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setErrors({});
    } catch {
      setErrors({
        form: "เพิ่มเจ้าหน้าที่ไม่สำเร็จ กรุณาลองใหม่"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.addOfficerContainer}>
      <div className={styles.addOfficerContent}>
        <h2 className={styles.addOfficerTitle}>เพิ่มเจ้าหน้าที่</h2>
        <form
          className={styles.addOfficerForm}
          onSubmit={handleSubmit}
          noValidate
        >
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="first_name">
              ชื่อ*
            </label>
            <input
              id="first_name"
              type="text"
              name="first_name"
              className={styles.formInput}
              value={form.first_name}
              onChange={handleChange}
              required
              autoComplete="given-name"
            />
            {errors.first_name && (
              <p className={styles.formError}>{errors.first_name}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="last_name">
              นามสกุล:
            </label>
            <input
              id="last_name"
              type="text"
              name="last_name"
              className={styles.formInput}
              value={form.last_name}
              onChange={handleChange}
              required
              autoComplete="family-name"
            />
            {errors.last_name && (
              <p className={styles.formError}>{errors.last_name}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel} htmlFor="email">
              อีเมล:
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={styles.formInput}
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            {errors.email && (
              <p className={styles.formError}>{errors.email}</p>
            )}
          </div>
          <div className={styles.formGroup}>
            <PasswordInput
              label="รหัสผ่าน*"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
            />
            {form.password && <PasswordStrengthIndicator password={form.password} />}
            <PasswordInput
              label="ยืนยันรหัสผ่าน*"
              id="confirm_password"
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              error={errors.confirm_password}
            />
          </div>
          {errors.form && <p className={styles.formError}>{errors.form}</p>}
          {message && <p className={styles.formMessage}>{message}</p>}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "กำลังบันทึก..." : "เพิ่มเจ้าหน้าที่"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddOfficerByOfficer;
