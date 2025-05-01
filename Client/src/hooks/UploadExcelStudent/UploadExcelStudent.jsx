import React, { useState, useRef } from "react";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import axios from "axios";
import Icon from "../../assets/upload.png";
import styles from "./UploadExcelStudent.module.css";

const UploadExcelStudent = () => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const handleClick = () => fileInputRef.current.click();
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        API_BASE_URL + APIEndpoints.student.createStudent,
        formData,
        {
          withCredentials: true,
        }
      );
      alert(`อัปโหลดสำเร็จ: ${res.data.successCount} รายการ`);
      console.log("Failed rows:", res.data.failedData);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    }
  };

  return (
    <>
      <div className={styles.containerUploadExcel}>
        <h3>Upload Excel</h3>
        <div className={styles.UploadBox} onClick={handleClick}>
          <div className={styles.UploadIcon}>
            <img src={Icon} alt="" />
          </div>
          <div className={styles.UploadInfo}>
            <p>กรุณาเลือกไฟล์ Excel ที่ต้องการอัปโหลด</p>
            <p>รองรับไฟล์ .xlsx เท่านั้น</p>
          </div>
          <button className={styles.btnChooseFile}>เลือกไฟล์</button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0])}
            className={styles.inputUploadFile}
          />
        </div>
        <button onClick={handleUpload} className={styles.btnUpload}>Upload</button>
      </div>
    </>
  );
};

export default UploadExcelStudent;
