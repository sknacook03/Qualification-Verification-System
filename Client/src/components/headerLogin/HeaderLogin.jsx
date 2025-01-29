import React from 'react';
import './headerLogin.css';
import logo from '../../assets/Cassia-flowers-rmuti.png';

export default function HeaderLogin() {
    return(
        <div className='container'>
            <div className="logo">
                <img src={logo} alt="logo-RMUTI" width={85}/>
            </div>
            <div className="info">
                <h2 className='header-info1'>ระบบตรวจสอบคุณวุฒิ</h2>
                <h2>มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน</h2>
            </div>
        </div>
    );
}
