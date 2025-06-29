import React, { useState, useEffect } from "react";
import styles from "./EditAgencyPopup.module.css";
import OptionTypeAgency from "../../components/OptionTypeAgency/OptionTypeAgency";

export default function EditAgencyPopup({
  isOpen,
  agency,
  typeList,       
  onCancel,
  onSave,       
}) {
  const [form, setForm] = useState({
    email: "",
    agency_name: "",
    department: "",
    telephone_number: "",
    address: "",
    subdistrict: "",
    district: "",
    province: "",
    postal_code: "",
    type_id: "",
  });

  useEffect(() => {
    if (isOpen && agency) {
      setForm({
        email: agency.email || "",
        agency_name: agency.agency_name || "",
        department: agency.department || "",
        telephone_number: agency.telephone_number || "",
        address: agency.address || "",
        subdistrict: agency.subdistrict || "",
        district: agency.district || "",
        province: agency.province || "",
        postal_code: agency.postal_code || "",
        type_id:agency.type_id || "",
      });
    }
  }, [isOpen, agency]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(agency.id, form);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.titleEditAgency}>แก้ไขข้อมูลหน่วยงาน</h2>
        <div className={styles.formGroup}>
          <label>อีเมล*</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>ชื่อหน่วยงาน*</label>
          <input
            name="agency_name"
            type="text"
            value={form.agency_name}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>แผนกงานที่รับผิดชอบ*</label>
          <input
            name="department"
            type="text"
            value={form.department}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>เบอร์โทรศัพท์*</label>
          <input
            name="telephone_number"
            type="text"
            value={form.telephone_number}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>ที่อยู่*</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>ตำบล/แขวง*</label>
          <input
            name="subdistrict"
            type="text"
            value={form.subdistrict}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>อำเภอ/เขต*</label>
          <input
            name="district"
            type="text"
            value={form.district}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>จังหวัด*</label>
          <input
            name="province"
            type="text"
            value={form.province}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label>รหัสไปรษณีย์*</label>
          <input
            name="postal_code"
            type="text"
            value={form.postal_code}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <OptionTypeAgency
            label="ประเภทหน่วยงาน*"
            name="type_id"
            value={form.type_id}
            onChange={handleChange}
            options={typeList}
          />
        </div>

        <div className={styles.modalActions}>
          <button onClick={onCancel}>ยกเลิก</button>
          <button onClick={handleSubmit}>บันทึก</button>
        </div>
      </div>
    </div>
  );
}
