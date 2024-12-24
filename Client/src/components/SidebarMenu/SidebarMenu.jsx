import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './SidebarMenu.module.css';

const SidebarMenu = ({ menuItems }) => {
  return (
    <div className={styles.sidebar}>
      <ul className={styles.menuList}>
      {menuItems.map((item, index) => (
          <li key={index} className={styles.menuItem}>
            <NavLink
              to={item.route}
              className={({ isActive }) =>
                isActive ? `${styles.label} ${styles.active}` : styles.label
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarMenu;
