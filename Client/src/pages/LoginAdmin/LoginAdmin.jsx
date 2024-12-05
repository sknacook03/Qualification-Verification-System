import React from 'react'
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import LoginForm from '../../hooks/LoginForm/LoginForm';
import styles from "./LoginAdmin.module.css"
function LoginAdmin() {
  return (
    <>
    <div className={styles.appContainer}>
      <Header />
      <div className={styles.boxContact}>
        <div className={styles.boxIn}>
          <h2>เจ้าหน้าที่ทะเบียน</h2>
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  </>
  )
}

export default LoginAdmin