import React, { useState, useRef } from "react";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Icon from "../../assets/upload.png";
import IconClose from "../../assets/close.png";
import IconExcel from "../../assets/excel.png";
import ClipLoader from "react-spinners/ClipLoader";
import { filesize } from "filesize";
import styles from "./UploadExcelStudent.module.css";

const UploadExcelStudent = () => {
  const [files, setFiles] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current.click();

  const handleFiles = (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    
    const validFiles = [];
    const invalidFiles = [];
    
    Array.from(selectedFiles).forEach(file => {
      if (file.name.toLowerCase().endsWith(".xlsx")) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });
    
    if (invalidFiles.length > 0) {
      setErrorMsg(`ไฟล์ต้องเป็นชนิด .xlsx เท่านั้น: ${invalidFiles.join(", ")}`);
    } else {
      setErrorMsg("");
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleClearAllFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    toast.dismiss();
    if (!files || files.length === 0) {
      toast.error("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    setUploading(true);
    let totalSuccessCount = 0;
    let totalFailedCount = 0;
    let totalDuplicateCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await toast.promise(
          axios.post(
            API_BASE_URL + APIEndpoints.student.createStudent,
            formData,
            {
              withCredentials: true,
            }
          ),
          {
            pending: `กำลังอัปโหลดไฟล์ ${i + 1}/${files.length}: ${file.name}`,
          }
        );

        const { successCount, failedCount, failedData } = res.data;
        const duplicateRows = failedData.filter(
          (row) => row.error === "Student already exists"
        );

        totalSuccessCount += successCount;
        totalFailedCount += failedCount;
        totalDuplicateCount += duplicateRows.length;
      }

      toast.success(
        <div>
          <p>✅ อัปโหลดสำเร็จ: {totalSuccessCount} รายการ</p>
          <p>📁 จำนวนไฟล์: {files.length} ไฟล์</p>
          {totalFailedCount > 0 && (
            <>
              <p>❌ อัปโหลดไม่สำเร็จ: {totalFailedCount} รายการ</p>
              {totalDuplicateCount > 0 && (
                <p>📌 พบรายชื่อซ้ำ: {totalDuplicateCount} รายการ</p>
              )}
            </>
          )}
        </div>
      );

      setFiles([]);
      setErrorMsg("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (err) {
      toast.error("อัปโหลดล้มเหลว");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.containerUploadExcel}>
      <h3>Upload Excel</h3>
      <div
        className={`${styles.UploadBox} ${isDragging ? styles.dragActive : ""}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className={styles.UploadIcon}>
          <img src={Icon} alt="" />
        </div>
        <div className={styles.UploadInfo}>
          <p>กรุณาเลือกไฟล์ Excel ที่ต้องการอัปโหลด</p>
          <p>รองรับไฟล์ .xlsx เท่านั้น (สามารถเลือกหลายไฟล์)</p>
        </div>
        <button className={styles.btnChooseFile}>เลือกไฟล์</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className={styles.inputUploadFile}
          accept=".xlsx"
          multiple
        />
        {files.length > 0 && (
          <div className={styles.selectedFilesContainer}>
            <div className={styles.filesHeader}>
              <span>ไฟล์ที่เลือก ({files.length} ไฟล์)</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearAllFiles();
                }}
                className={styles.clearAllBtn}
              >
                ลบทั้งหมด
              </button>
            </div>
            {files.map((file, index) => (
              <div key={index} className={styles.selectedFileContainer}>
                <div className={styles.selectedFile}>
                  <img src={IconExcel} alt="" width={40} height={40} />
                  <div className={styles.infoFile}>
                    <p className={styles.fileName}>{file.name}</p>
                    <p className={styles.fileSize}>{filesize(file.size)}</p>
                  </div>
                </div>
                <img
                  src={IconClose}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  className={styles.closeIcon}
                  alt=""
                  width={15}
                  height={15}
                />
              </div>
            ))}
          </div>
        )}
        {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
      </div>
      {uploading && (
        <div className={styles.loader}>
          <ClipLoader size={15} color={"#FF7100"} />
        </div>
      )}
      {!uploading && (
        <button
          onClick={handleUpload}
          className={styles.btnUpload}
          disabled={files.length === 0}
          title={files.length === 0 ? "กรุณาเลือกไฟล์ก่อนอัปโหลด" : ""}
        >
          อัปโหลด
        </button>
      )}
    </div>
  );
};

export default UploadExcelStudent;
