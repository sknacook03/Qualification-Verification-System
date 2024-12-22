import React from "react";
import logo from "../../assets/Cassia-flowers-rmuti.png";
import logoUser from "../../assets/user.png";
import styles from "../HeaderHomePage/HeaderHomePage.module.css";
import { Squash as Hamburger } from "hamburger-react";

const HeaderHomePage = ({ user }) => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.hamberger}>
          <Hamburger size={25} color="#FFF" />
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
          <div className={styles.userImage}>
            <img src={logoUser} alt="logo-user" width={30} />
          </div>
        </div>
      </div>
    </>
  );
};
export default HeaderHomePage;
