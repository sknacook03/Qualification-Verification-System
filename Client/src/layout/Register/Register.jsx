import React from 'react'
import ArrowButton from '../../components/ArrowButton/ArrowButton';
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import  ThailandAddress  from '../../libs/ThailandAddress'
import styles from './Register.module.css'

function Register() {
    return (
        <div className= {styles.appContainer}>
            <Header />
            <div className={styles.appContent}>
                <h3>สมัครสมาชิก</h3>
                <ThailandAddress />
            </div>
            <Footer />
        </div>

      );
}

export default Register