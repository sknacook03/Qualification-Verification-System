import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Cassia-flowers-rmuti.png";
import logoUser from "../../assets/user.png";
import styles from "../HeaderHomePage/HeaderHomePage.module.css";
import { Squash as Hamburger } from "hamburger-react";
import Button from "../button/Button";

const HeaderHomePage = ({ user, toggleSidebar, userRole }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.hamberger}>
          <Hamburger size={25} color="#FFF" onToggle={toggleSidebar} />
        </div>
        <div className={styles.logo}>
          <div className={styles.imageRmuti}>
            <img src={logo} alt="logo-RMUTI" width={55} />
          </div>

          <div className={styles.info}>
            <h2 className={styles.headerInfo1}>
              มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน นครราชสีมา
            </h2>
            <h2>RAJAMANGALA UNIVERSITY OF TECHNOLOGY ISAN, NAKHON RATCHASIMA</h2>
          </div>
        </div>
        <div className={styles.user}>
          {userRole === "officer" && (
            <div className={styles.testLabel}>
              <a
                href="https://drive.google.com/drive/folders/1qUpt3W2GaVBnFZyDCaY5Ik0U3eBd5Ewc?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.driveLink}
              >
                <span>คู่มือการใช้งานของเจ้าหน้าที่</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ marginLeft: "6px" }}
                >
                  <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                </svg>
              </a>
            </div>
          )}
          <div className={styles.nameUser}>
            <p>{user}</p>
          </div>
          {user ? (
            <div className={styles.userImage}>
              <img src={logoUser} alt="logo-user" width={30} />
            </div>
          ) : (
            <Link to="/" style={{ width: "100%", textDecoration: "none" }}>
              <Button text="ไปยังหน้าแรก" styleType="primary" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default HeaderHomePage;
