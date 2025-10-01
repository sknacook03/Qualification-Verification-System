import React from "react";
import styles from "./TermsOfServicePopup.module.css";
import termsIcon from "../../assets/message.png";

const TermsOfServicePopup = ({ onAccept, onReject, showPopup }) => {
  if (!showPopup) return null;

  return (
    <div className={styles.overlayPopup}>
      <div className={styles.contentPopup}>
        <div className={styles.header}>
          <img src={termsIcon} alt="Terms" width={60} height={60} />
          <h2>ข้อกำหนดและเงื่อนไขการใช้งาน</h2>
        </div>
        
        <div className={styles.content}>
          <div className={styles.termsText}>
            <p>
              <strong>ข้อกำหนดการใช้งานระบบตรวจสอบคุณวุฒิ</strong>
            </p>
            <ul>
              <li>ท่านสามารถใช้ระบบนี้เพื่อตรวจสอบคุณวุฒิของผู้สำเร็จการศึกษาเท่านั้น</li>
              <li>ข้อมูลที่ได้รับจากระบบมีความถูกต้องตามฐานข้อมูลของมหาวิทยาลัย</li>
              <li>ท่านต้องรักษาความปลอดภัยของบัญชีผู้ใช้และรหัสผ่าน</li>
              <li>ห้ามนำข้อมูลไปใช้เพื่อวัตถุประสงค์อื่นนอกเหนือจากการตรวจสอบคุณวุฒิ</li>
              <li>การใช้งานระบบแสดงถึงการยอมรับข้อกำหนดและเงื่อนไขทั้งหมด</li>
            </ul>
            
            <p className={styles.warning}>
              <strong>หมายเหตุ:</strong> การปฏิเสธข้อกำหนดจะทำให้ท่านไม่สามารถใช้งานระบบได้
            </p>
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button 
            onClick={onReject}
            className={`${styles.button} ${styles.rejectButton}`}
          >
            ไม่ยอมรับ (ออกจากระบบ)
          </button>
          <button 
            onClick={onAccept}
            className={`${styles.button} ${styles.acceptButton}`}
          >
            ยอมรับข้อกำหนด
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePopup;