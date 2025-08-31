import React, { useState, useEffect } from "react";
import axios from "axios";
import PasswordStrengthIndicator from "../../components/PasswordStrengthIndicator/PasswordStrengthIndicator";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./AgencyPrivacy.module.css";

export default function AgencyPrivacy({ agency, loading, onAgencyUpdated }) {
  const [typeAgencies, setTypeAgencies] = useState([]);
  const [phase, setPhase] = useState("view");
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
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

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

  const normalizeImagePath = (path) => {
    if (!path) return null;
    return path.replace(/\\/g, "/");
  };

  const baseURL = "http://localhost:3000/";

  const certificateURL = agency.certificate
    ? baseURL + normalizeImagePath(agency.certificate)
    : null;

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

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${APIEndpoints.typeAgency.fetchAll}`, {
        withCredentials: true,
      })
      .then((res) => {
        const list = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setTypeAgencies(list);
      })
      .catch((err) => {
        console.error("โหลดประเภทหน่วยงานล้มเหลว:", err);
        setTypeAgencies([]);
      });
  }, []);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.email.trim() || !form.agencyName.trim()) {
      setMessage("กรุณากรอกอีเมลและชื่อหน่วยงาน");
      return;
    }
    if (newPass && newPass.length < 8) {
      setMessage("รหัสผ่านใหม่ต้องอย่างน้อย 8 ตัวอักษร");
      return;
    }
    if (newPass && !isPasswordStrong(newPass)) {
      setMessage("รหัสผ่านไม่แข็งแกร่ง กรุณาตรวจสอบความต้องการด้านล่าง");
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
                ["ชื่อหน่วยงาน", agency.agency_name],
                ["อีเมล", agency.email],
                ["แผนก", agency.department],
                [
                  "ประเภทหน่วยงาน",
                  typeAgencies.find((t) => t.id === agency.type_id)
                    ?.type_name || agency.type_id,
                ],
                ["โทรศัพท์", agency.telephone_number],
                ["ที่อยู่", agency.address],
                ["ตำบล", agency.subdistrict],
                ["อำเภอ", agency.district],
                ["จังหวัด", agency.province],
                ["รหัสไปรษณีย์", agency.postal_code],
                ["Role", agency.role],
                ["Approve Status", agency.status_approve],
              ].map(([label, value]) => (
                <div key={label} className={styles.item}>
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
              ))}

              <div key="Certificate" className={styles.item}>
                <span>Certificate</span>
                <span>
                  {certificateURL ? (
                    <img
                      src={certificateURL}
                      alt="Certificate"
                      className={styles.certificateImage}
                      onClick={() => window.open(certificateURL, "_blank")}
                    />
                  ) : (
                    "ไม่มีข้อมูล"
                  )}
                </span>
              </div>
            </div>

            <button
              className={`${styles.button} ${styles.primaryBtn}`}
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
                <label className={styles.label}>รหัสผ่านปัจจุบัน</label>
                <input
                  className={styles.input}
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  disabled={busy}
                />
              </div>
            )}

            {phase === "edit" && (
              <>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>อีเมล</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ชื่อหน่วยงาน</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={form.agencyName}
                    onChange={(e) =>
                      setForm({ ...form, agencyName: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>แผนก</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>โทรศัพท์</label>
                  <input
                  className={styles.input}
                    type="text"
                    value={form.telephoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, telephoneNumber: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ที่อยู่</label>
                  <input
                  className={styles.input}
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ตำบล</label>
                  <input
                  className={styles.input}
                    type="text"
                    value={form.subdistrict}
                    onChange={(e) =>
                      setForm({ ...form, subdistrict: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>อำเภอ</label>
                  <input
                  className={styles.input}
                    type="text"
                    value={form.district}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>จังหวัด</label>
                  <input
                  className={styles.input}
                    type="text"
                    value={form.province}
                    onChange={(e) =>
                      setForm({ ...form, province: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>รหัสไปรษณีย์</label>
                  <input
                  className={styles.input}
                    type="text"
                    value={form.postalCode}
                    onChange={(e) =>
                      setForm({ ...form, postalCode: e.target.value })
                    }
                    disabled={busy}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ประเภทหน่วยงาน</label>
                  <select
                    className={styles.input}
                    value={form.typeId}
                    onChange={(e) =>
                      setForm({ ...form, typeId: e.target.value })
                    }
                    disabled={busy}
                  >
                    <option value="">-- เลือกประเภทหน่วยงาน --</option>
                    {typeAgencies.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.type_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>รหัสผ่านใหม่ (ถ้าต้องการ)</label>
                  <input
                    className={styles.input}
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    disabled={busy}
                  />
                  {newPass && <PasswordStrengthIndicator password={newPass} />}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>ยืนยันรหัสผ่านใหม่</label>
                  <input
                  className={styles.input}
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    disabled={busy}
                  />
                </div>
              </>
            )}

            {message && <p className={styles.message}>{message}</p>}

            <div className={styles.buttonRow}>
              <button
                type="submit"
                className={`${styles.button} ${styles.primaryBtn}`}
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
                className={`${styles.button} ${styles.secondaryBtn}`}
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
