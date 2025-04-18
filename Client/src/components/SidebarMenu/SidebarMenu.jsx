import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SidebarMenu.module.css';

const SidebarMenu = ({ topMenuItems, bottomMenuItems, isOpen, onClose }) => {
  const handleClick = (onClick) => {
    if (onClick) onClick();
    if (onClose) onClose();
  };
  const sidebarClass = `${styles.sidebar} ${styles.open} ${isOpen ? styles.openVisible : ''}`;
  return (
    <div className={sidebarClass}>
      <ul className={styles.menuList}>
        {topMenuItems.map((item, index) => (
          <li key={index} className={styles.menuItem}>
            {item.onClick ? (
              <span
                onClick={() => handleClick(item.onClick)}
                className={styles.label}
              >
                {item.label}
              </span>
            ) : (
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  isActive ? `${styles.label} ${styles.active}` : styles.label
                }
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
      <div className={styles.separator}></div>
      <ul className={styles.menuList}>
        {bottomMenuItems.map((item, index) => (
          <li key={index} className={styles.menuItem}>
            {item.onClick ? (
              <span
                onClick={() => handleClick(item.onClick)}
                className={styles.label}
              >
                {item.label}
              </span>
            ) : (
              <NavLink
                to={item.route}
                className={({ isActive }) =>
                  isActive ? `${styles.label} ${styles.active}` : styles.label
                }
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
