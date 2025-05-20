import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./OfficerPrivacy.module.css";

export default function OfficerPrivacy({ officer, loading, onOfficerUpdated }) {
  const [phase, setPhase] = useState("view");
  const [currentPass, setCurrentPass] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (officer) {
      setForm({
        firstName: officer.first_name || "",
        lastName: officer.last_name || "",
        email: officer.email || "",
      });
    }
  }, [officer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!currentPass.trim()) {
      setMessage("กรุณาใส่รหัสผ่านปัจจุบัน");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await axios.post(
        `${API_BASE_URL}${APIEndpoints.officer.verifyPassword(officer.id)}`,
        { password: currentPass },
        { withCredentials: true }
      );
      setPhase("edit");
    } catch (err) {
      if (err.response?.status === 401) {
        setMessage("รหัสผ่านไม่ถูกต้อง หรือสิทธิ์หมดอายุ");
      } else {
        setMessage("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setMessage("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }
    if (newPass && newPass.length < 8) {
      setMessage("รหัสผ่านใหม่ต้องอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (newPass && newPass !== confirmPass) {
      setMessage("รหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        ...(newPass && { password: newPass }),
      };

      await axios.put(
        `${API_BASE_URL}${APIEndpoints.officer.updateOfficer(officer.id)}`,
        payload,
        { withCredentials: true }
      );

      setMessage("อัพเดตข้อมูลสำเร็จ");
      await onOfficerUpdated();
      setPhase("view");
    } catch (err) {
      console.error("Update failed (full error):", err);
      const msg =
        err.response?.data?.message ??
        err.message ??
        "เกิดข้อผิดพลาดขณะอัพเดต ลองใหม่อีกครั้ง";
      setMessage(msg);
    } finally {
      setBusy(false);
    }
  };

  if (loading || !officer) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          {loading ? "กำลังโหลดข้อมูล..." : "ไม่พบข้อมูลเจ้าหน้าที่"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {phase === "view" && "ข้อมูลเจ้าหน้าที่"}
          {phase === "verify" && "ยืนยันตัวตน"}
          {phase === "edit" && "แก้ไขข้อมูล"}
        </h2>

        {phase === "view" && (
          <>
            <div className={styles.summary}>
              <div className={styles.item}>
                <span>รหัสเจ้าหน้าที่</span>
                <span>{officer.id}</span>
              </div>
              <div className={styles.item}>
                <span>ชื่อ</span>
                <span>{officer.first_name} {officer.last_name}</span>
              </div>
              <div className={styles.item}>
                <span>อีเมล</span>
                <span>{officer.email}</span>
              </div>
            </div>
            <button
              className={styles.primaryBtn}
              onClick={() => setPhase("verify")}
            >
              แก้ไขข้อมูล
            </button>
          </>
        )}

        {(phase === "verify" || phase === "edit") && (
          <form
            onSubmit={phase === "verify" ? handleVerify : handleUpdate}
            className={styles.form}
          >
            {phase === "verify" && (
              <div className={styles.inputGroup}>
                <label>รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={e => setCurrentPass(e.target.value)}
                  disabled={busy}
                />
              </div>
            )}

            {phase === "edit" && (
              <>
                <div className={styles.inputGroup}>
                  <label>ชื่อ</label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={e => setForm({ ...form, firstName: e.target.value })}
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>นามสกุล</label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={e => setForm({ ...form, lastName: e.target.value })}
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>อีเมล</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>รหัสผ่านใหม่ (ถ้าต้องการ)</label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={e => setNewPass(e.target.value)}
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    value={confirmPass}
                    onChange={e => setConfirmPass(e.target.value)}
                    disabled={busy}
                  />
                </div>
              </>
            )}

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.buttonRow}>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={busy}
              >
                {busy
                  ? phase === "verify"
                    ? "กำลังตรวจสอบ..."
                    : "กำลังบันทึก..."
                  : phase === "verify"
                  ? "ยืนยัน"
                  : "บันทึก"}
              </button>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => {
                  setPhase("view");
                  setMessage("");
                }}
                disabled={busy}
              >
                ยกเลิก
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}