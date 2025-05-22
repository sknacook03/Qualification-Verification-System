import React, { useState } from "react";
import axios from "axios";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // เคลียร์ข้อความ error และ message เมื่อแก้ไขข้อมูล
    setError("");
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
      // ถ้าเช็คไม่สำเร็จถือว่าไม่มีซ้ำ (ป้องกันการบล็อก)
      return false;
    }
  };

  const validateForm = async () => {
    if (!form.first_name.trim() || form.first_name.includes(" ")) {
      setError("ชื่อห้ามเว้นวรรคหรือเว้นว่าง");
      return false;
    }
    if (!form.last_name.trim() || form.last_name.includes(" ")) {
      setError("นามสกุลห้ามเว้นวรรคหรือเว้นว่าง");
      return false;
    }
    if (form.password.length < 8) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return false;
    }
    if (form.password !== form.confirm_password) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบ");
      return false;
    }
    if (!form.email) {
      setError("กรุณากรอกอีเมล");
      return false;
    }
    const emailExists = await checkEmailExists(form.email);
    if (emailExists) {
      setError("อีเมลนี้มีอยู่ในระบบแล้ว กรุณาใช้อีเมลอื่น");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
    } catch {
      setError("เพิ่มเจ้าหน้าที่ไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["add-officer-container"]}>
      <h2 className={styles["add-officer-title"]}>เพิ่มเจ้าหน้าที่ (Officer)</h2>
      <form className={styles["add-officer-form"]} onSubmit={handleSubmit} noValidate>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="first_name">
            ชื่อ:
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            className={styles["form-input"]}
            value={form.first_name}
            onChange={handleChange}
            required
            autoComplete="given-name"
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="last_name">
            นามสกุล:
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            className={styles["form-input"]}
            value={form.last_name}
            onChange={handleChange}
            required
            autoComplete="family-name"
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="email">
            อีเมล:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className={styles["form-input"]}
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="password">
            รหัสผ่าน:
          </label>
          <input
            id="password"
            type="password"
            name="password"
            className={styles["form-input"]}
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>
        <div className={styles["form-group"]}>
          <label className={styles["form-label"]} htmlFor="confirm_password">
            ยืนยันรหัสผ่าน:
          </label>
          <input
            id="confirm_password"
            type="password"
            name="confirm_password"
            className={styles["form-input"]}
            value={form.confirm_password}
            onChange={handleChange}
            required
            autoComplete="new-password"
          />
        </div>

        {error && <p className={styles["form-error"]}>{error}</p>}
        {message && <p className={styles["form-message"]}>{message}</p>}

        <button
          type="submit"
          className={styles["submit-button"]}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? "กำลังบันทึก..." : "เพิ่มเจ้าหน้าที่"}
        </button>
      </form>
    </div>
  );
}

export default AddOfficerByOfficer;
