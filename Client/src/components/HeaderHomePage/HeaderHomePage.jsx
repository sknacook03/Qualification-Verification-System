import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Cassia-flowers-rmuti.png";
import logoUser from "../../assets/user.png";
import styles from "../HeaderHomePage/HeaderHomePage.module.css";
import { Squash as Hamburger } from "hamburger-react";
import Button from "../button/Button";

const HeaderHomePage = ({ user, toggleSidebar }) => {
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
              มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน
            </h2>
            <h2>RAJAMANGARA UNIVERSITY OF TECHNOLOGY ISAN</h2>
          </div>
        </div>
        <div className={styles.user}>
          <div className={styles.nameUser}>
            <p>{user}</p>
          </div>
          {user ? (
            <div className={styles.userImage}>
              <img src={logoUser} alt="logo-user" width={30} />
            </div>
          ) : (
            <Link
              to="/"
              style={{ width: "100%", textDecoration: "none" }}
            >
              <Button text="ไปยังหน้าแรก" styleType="primary" />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};
export default HeaderHomePage;
