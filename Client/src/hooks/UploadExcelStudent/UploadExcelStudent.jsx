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
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleClick = () => fileInputRef.current.click();

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;
    if (!selectedFile.name.toLowerCase().endsWith(".xlsx")) {
      setErrorMsg("ไฟล์ต้องเป็นชนิด .xlsx เท่านั้น");
      setFile(null);
      return;
    }
    setErrorMsg("");
    setFile(selectedFile);
  };
  const handleCloseFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
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
      handleFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    toast.dismiss();
    if (!file) {
      toast.error("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await toast.promise(
        axios.post(
          API_BASE_URL + APIEndpoints.student.createStudent,
          formData,
          {
            withCredentials: true,
          }
        ),
        {
          pending: "กำลังอัปโหลด...",
        }
      );
      const { successCount, failedCount, failedData } = res.data;
      const duplicateRows = failedData.filter(
        (row) => row.error === "Student already exists"
      );

      toast.success(
        <div>
          <p>✅ อัปโหลดสำเร็จ: {successCount} รายการ</p>
          {failedCount > 0 && (
            <>
              <p>❌ อัปโหลดไม่สำเร็จ: {failedCount} รายการ</p>
              {duplicateRows.length > 0 && (
                <p>📌 พบรายชื่อซ้ำ: {duplicateRows.length} รายการ</p>
              )}
            </>
          )}
        </div>
      );
      console.log("Failed rows:", failedData);
      setFile(null);
      setErrorMsg("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      setUploading(false);
    } catch (err) {
      toast.error("อัปโหลดล้มเหลว");
      console.error(err);
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
          <p>รองรับไฟล์ .xlsx เท่านั้น</p>
        </div>
        <button className={styles.btnChooseFile}>เลือกไฟล์</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className={styles.inputUploadFile}
          accept=".xlsx"
        />
        {file && (
          <div className={styles.selectedFileContainer}>
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
                handleCloseFile();
              }}
              className={styles.closeIcon}
              alt=""
              width={15}
              height={15}
            />
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
          disabled={!file}
          title={!file ? "กรุณาเลือกไฟล์ก่อนอัปโหลด" : ""}
        >
          อัปโหลด
        </button>
      )}
    </div>
  );
};

export default UploadExcelStudent;
