import React, { useState } from "react";
import styles from "./TabNavigation.module.css";

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className={styles.tabContainer}>
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`${styles.tabButton} ${activeTab === index ? styles.active : ""}`}
          onClick={() => onTabChange(index)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
