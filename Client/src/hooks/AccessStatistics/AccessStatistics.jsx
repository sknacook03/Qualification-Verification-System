import React from "react";
import styles from "./AccessStatistics.module.css";

const AccessStatistics = () => {
  return (
    <>
      <div className={styles.containerStatistics}>
        <div className={styles.boxState}>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>จำนวนการเข้าดูทั้งหมด</p>
            <h2 className={styles.numberTotalPageView}>17,358</h2>
          </div>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>นักศึกษาที่เข้าดูไม่ซ้ำ</p>
            <h2 className={styles.numberTotalPageView}>1,354</h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessStatistics;
