import React from "react";
import HeaderHomePage from "../HeaderHomePage/HeaderHomePage";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import IconPage from "../IconPage/IconPage";
import Footer from "../footer/footer";
import styles from "./LayoutAllPage.module.css";

const LayoutAllPage = ({ user, topMenuItems, bottomMenuItems, icon, label, children }) => {
  return (
    <>
      <div className={styles.appContainer}>
        <div className={styles.boxContainer}>
          <div className={styles.contentHeader}>
            <HeaderHomePage user={user} />
          </div>
          <div className={styles.dashboardLayout}>
            <div className={styles.sideBar}>
              <SidebarMenu
                topMenuItems={topMenuItems}
                bottomMenuItems={bottomMenuItems}
              />
            </div>
            <div className={styles.mainContent}>
              <div className={styles.menuShow}>
                <IconPage icon={icon} label={label} />
              </div>
              <div className={styles.info}>{children}</div>
              <Footer color="#6D6D6D" disableMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LayoutAllPage;
