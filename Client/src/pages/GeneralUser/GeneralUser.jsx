import React from "react";
import LayoutAllpage from "../../components/LayoutAllPage/LayoutAllPage.jsx";
import AccessStatistics from "../../hooks/AccessStatistics/AccessStatistics.jsx";
import SEO from "../../components/SEO/SEO.jsx";
import Icon from "../../assets/statistics.png";
import styles from "./GeneralUser.module.css";
import {
  topMenuItems,
} from "../../constants/userMenuItems.jsx";

function GeneralUser() {
  return (
    <>
      <SEO 
        title="สถิติการเข้าถึง - ระบบตรวจคุณวุฒิมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน | มทร.อีสาน"
        description="ดูสถิติการเข้าถึงระบบตรวจสอบคุณวุฒิ จำนวนการค้นหา และข้อมูลการใช้งานของหน่วยงานต่างๆ"
        keywords="สถิติการเข้าถึง, การใช้งานระบบ, ตรวจสอบคุณวุฒิ, สถิติหน่วยงาน"
        url="https://cpermuti.com/eduverify/general-user"
      />
      <LayoutAllpage
        generalUser
        topMenuItems={topMenuItems}
        icon={Icon}
        label="สถิติการเข้าถึง"
        guest
      >
        <AccessStatistics />
      </LayoutAllpage>
    </>
  );
}

export default GeneralUser;
