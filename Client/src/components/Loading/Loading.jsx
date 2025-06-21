import React from "react";
import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div className={styles.containerLoading}>
      <div className={styles.boxLoading1}></div>
      <div className={styles.boxLoadingContainer}>
        <div className={styles.boxLoading2}></div>
        <div className={styles.boxLoading3}>
          <div className={styles.box1}></div>
          <div className={styles.box2}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
