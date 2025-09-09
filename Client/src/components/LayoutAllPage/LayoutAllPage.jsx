import React, { useState } from "react";
import HeaderHomePage from "../HeaderHomePage/HeaderHomePage";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import IconPage from "../IconPage/IconPage";
import Footer from "../footer/footer";
import styles from "./LayoutAllPage.module.css";
import GlobalTokenExpiryHandler from "../GlobalTokenExpiryHandler/GlobalTokenExpiryHandler.jsx";

const LayoutAllPage = ({
  user,
  generalUser,
  topMenuItems,
  bottomMenuItems,
  icon,
  label,
  guest,
  children,
  userRole
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      {!guest && <GlobalTokenExpiryHandler />}
      <div className={styles.appContainer}>
        <div className={styles.boxContainer}>
          <div className={styles.contentHeader}>
            {generalUser ? (
              <HeaderHomePage
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                userRole={userRole}
              />
            ) : (
              <HeaderHomePage
                user={user}
                toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                userRole={userRole}
              />
            )}
          </div>
          <div className={styles.dashboardLayout}>
            <div
              className={`${styles.sideBar} ${
                isSidebarOpen ? styles.sideBarOpen : ""
              }`}
            >
              <SidebarMenu
                topMenuItems={topMenuItems}
                bottomMenuItems={bottomMenuItems}
                isOpen={isSidebarOpen}
              />
            </div>
            <div className={styles.mainContent}>
              <div className={styles.menuShow}>
                <IconPage icon={icon} label={label} />
              </div>
              <div className={styles.info}>{children}</div>
            </div>
          </div>
        </div>
        <Footer color="#6D6D6D" disableMenu className={styles.footer} />
      </div>
    </>
  );
};

export default LayoutAllPage;
