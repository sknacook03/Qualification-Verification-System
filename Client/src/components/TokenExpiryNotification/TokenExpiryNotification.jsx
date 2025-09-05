import React from 'react';
import styles from './TokenExpiryNotification.module.css';

const TokenExpiryNotification = ({ show, onExtend, onLogout }) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>⏰</div>
        <h2 className={styles.title}>เตือนการใช้งาน</h2>
        <p className={styles.message}>
          เซสชันของคุณกำลังจะหมดอายุ
          <br />
          คุณต้องการต่อเวลาการใช้งานหรือไม่?
        </p>
        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.button} ${styles.primaryButton}`}
            onClick={onExtend}
          >
            ต่อเวลา
          </button>
          <button 
            className={`${styles.button} ${styles.secondaryButton}`}
            onClick={onLogout}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenExpiryNotification;
