// src/hooks/AgencyPrivacy/AgencyPrivacy.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./AgencyPrivacy.module.css";

export default function AgencyPrivacy({ agency, loading, onAgencyUpdated }) {
  const [phase, setPhase] = useState("view"); // view | verify | edit
  const [currentPass, setCurrentPass] = useState("");
  const [form, setForm] = useState({
    email: "",
    agencyName: "",
    department: "",
    telephoneNumber: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
    typeId: "",
    certificate: "",
    role: "",
    statusApprove: "",
  });
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (agency) {
      setForm({
        email: agency.email || "",
        agencyName: agency.agency_name || "",
        department: agency.department || "",
        telephoneNumber: agency.telephone_number || "",
        address: agency.address || "",
        subdistrict: agency.subdistrict || "",
        district: agency.district || "",
        province: agency.province || "",
        postalCode: agency.postal_code || "",
        typeId: agency.type_id || "",
        certificate: agency.certificate || "",
        role: agency.role || "",
        statusApprove: agency.status_approve || "",
      });
    }
  }, [agency]);

  const handleVerify = async e => {
    e.preventDefault();
    if (!currentPass.trim()) {
      setMessage("กรุณาใส่รหัสผ่านปัจจุบัน");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await axios.post(
        `${API_BASE_URL}${APIEndpoints.agency.verifyPassword(agency.id)}`,
        { password: currentPass },
        { withCredentials: true }
      );
      setPhase("edit");
    } catch (err) {
      setMessage(
        err.response?.status === 401
          ? "รหัสผ่านไม่ถูกต้อง หรือสิทธิ์หมดอายุ"
          : "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ ลองใหม่อีกครั้ง"
      );
    } finally {
      setBusy(false);
    }
  };

  const handleUpdate = async e => {
    e.preventDefault();
    if (!form.email.trim() || !form.agencyName.trim()) {
      setMessage("กรุณากรอกอีเมลและชื่อหน่วยงาน");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const payload = {
        email: form.email,
        agency_name: form.agencyName,
        department: form.department,
        telephone_number: form.telephoneNumber,
        address: form.address,
        subdistrict: form.subdistrict,
        district: form.district,
        province: form.province,
        postal_code: form.postalCode,
        type_id: form.typeId,
        certificate: form.certificate,
        role: form.role,
        status_approve: form.statusApprove,
        ...(newPass && { password: newPass }),
      };
      await axios.put(
        `${API_BASE_URL}${APIEndpoints.agency.updateAgency(agency.id)}`,
        payload,
        { withCredentials: true }
      );
      setMessage("อัพเดตข้อมูลสำเร็จ");
      await onAgencyUpdated();
      setPhase("view");
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.message ??
        "เกิดข้อผิดพลาดขณะอัพเดต ลองใหม่อีกครั้ง";
      setMessage(msg);
    } finally {
      setBusy(false);
    }
  };

  if (loading || !agency) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          {loading ? "กำลังโหลดข้อมูล..." : "ไม่พบข้อมูลหน่วยงาน"}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          {phase === "view" && "ข้อมูล Agency"}
          {phase === "verify" && "ยืนยันตัวตน"}
          {phase === "edit" && "แก้ไขข้อมูล Agency"}
        </h2>

        {phase === "view" && (
          <>
            <div className={styles.summary}>
              {[
                ["ID", agency.id],
                ["อีเมล", agency.email],
                ["ชื่อหน่วยงาน", agency.agency_name],
                ["แผนก", agency.department],
                ["โทรศัพท์", agency.telephone_number],
                ["ที่อยู่", agency.address],
                ["ตำบล", agency.subdistrict],
                ["อำเภอ", agency.district],
                ["จังหวัด", agency.province],
                ["รหัสไปรษณีย์", agency.postal_code],
                ["Type ID", agency.type_id],
                ["Certificate", agency.certificate],
                ["Role", agency.role],
                ["Approve Status", agency.status_approve],
              ].map(([label, value]) => (
                <div key={label} className={styles.item}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}
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
                  <label>อีเมล</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e =>
                      setForm({ ...form, email: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>ชื่อหน่วยงาน</label>
                  <input
                    type="text"
                    value={form.agencyName}
                    onChange={e =>
                      setForm({ ...form, agencyName: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>แผนก</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={e =>
                      setForm({ ...form, department: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>โทรศัพท์</label>
                  <input
                    type="text"
                    value={form.telephoneNumber}
                    onChange={e =>
                      setForm({ ...form, telephoneNumber: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>ที่อยู่</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={e =>
                      setForm({ ...form, address: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>ตำบล</label>
                  <input
                    type="text"
                    value={form.subdistrict}
                    onChange={e =>
                      setForm({ ...form, subdistrict: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>อำเภอ</label>
                  <input
                    type="text"
                    value={form.district}
                    onChange={e =>
                      setForm({ ...form, district: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>จังหวัด</label>
                  <input
                    type="text"
                    value={form.province}
                    onChange={e =>
                      setForm({ ...form, province: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={e =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Type ID</label>
                  <input
                    type="text"
                    value={form.typeId}
                    onChange={e =>
                      setForm({ ...form, typeId: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Certificate</label>
                  <input
                    type="text"
                    value={form.certificate}
                    onChange={e =>
                      setForm({ ...form, certificate: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Role</label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={e =>
                      setForm({ ...form, role: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Approve Status</label>
                  <input
                    type="text"
                    value={form.statusApprove}
                    onChange={e =>
                      setForm({ ...form, statusApprove: e.target.value })
                    }
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
