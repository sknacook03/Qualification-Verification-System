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
          <span className={styles.tabLabel}>{tab.label}</span>
          {tab.count !== null && tab.count !== undefined && (
            <span className={styles.tabCount}>{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
