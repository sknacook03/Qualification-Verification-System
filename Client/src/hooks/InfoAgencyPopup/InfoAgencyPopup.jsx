import React, {useState, useEffect} from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./InfoAgencyPopup.module.css"; 

const InfoAgencyPopup = ({
  show,
  agency,
  onClose,
}) => {
  if (!show || !agency ) return null;
  const [typeAgencies, setTypeAgencies] = useState([]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${APIEndpoints.typeAgency.fetchAll}`, {
        withCredential: true,
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
        console.error("โหลดประเภทหน่วยงานล้มเหลว", err);
        setTypeAgencies([]);
      });
  }, []);

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        <h2 className={styles.titleInfoAgency}>ข้อมูลหน่วยงาน</h2>
        <div className={styles.infoList}>
          <div className={styles.formGroup}>
            <label>ชื่อหน่วยงาน</label>
            <span>{agency.agency_name || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>อีเมล</label>
            <span>{agency.email || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>แผนก</label>
            <span>{agency.department || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>เบอร์โทรศัพท์</label>
            <span>{agency.telephone_number || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>ประเภทหน่วยงาน</label>
            <span>
              {typeAgencies.find(t => t.id === agency.type_id)?.type_name || agency.type_id || "-"}
            </span>
          </div>
          <div className={styles.formGroup}>
            <label>ที่อยู่</label>
            <span>{agency.address || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>ตำบล</label>
            <span>{agency.subdistrict || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>อำเภอ</label>
            <span>{agency.district || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>จังหวัด</label>
            <span>{agency.province || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>รหัสไปรษณีย์</label>
            <span>{agency.postal_code || "-"}</span>
          </div>
          <div className={styles.formGroup}>
            <label>สถานะ</label>
            <span>{agency.status_approve || "-"}</span>
          </div>
        </div>
        <button
          className={styles.confirmBtn}
          onClick={onClose}
        >
          ปิด
        </button>
      </div>
    </div>
  );
};

export default InfoAgencyPopup;
