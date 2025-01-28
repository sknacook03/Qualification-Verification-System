import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import TabNavigation from "../../../components/TabNavigation/TabNavigation.jsx";
import AgencyApproval from "../../../hooks/AgencyApproval/AgencyApproval.jsx";
import AllAgency from "../../../hooks/AllAgency/AllAgency.jsx";
import AgencyReject from "../../../hooks/AgencyReject/AgencyReject.jsx";
import Icon from "../../../assets/manage.png";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";
import styles from "./AgencyControlPanel.module.css";
import { useNavigate } from "react-router-dom";

function AgencyControlPanel() {
  const [officer, setOfficer] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + APIEndpoints.officer.logged,
          {
            withCredentials: true,
          }
        );
        setOfficer(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch officer data:", error);
        alert("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
        navigate("/LoginOfficer");
      }
    };

    fetchOfficerData();
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post(
        API_BASE_URL + APIEndpoints.auth.logout,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };
  const topMenuItems = [
    { label: "หน้าหลัก", route: "/HomepagesOfficer" },
    { label: "ตรวจสอบคุณวุฒินักศึกษา", route: "/" },
    { label: "สถิติการเข้าถึง", route: "/" },
    { label: "จัดการหน่วยงาน", route: "/AgencyControlPanel" },
    { label: "จัดการเจ้าหน้าที่", route: "/" },
  ];

  const bottomMenuItems = [
    { label: "ตั้งค่าความเป็นส่วนตัว", route: "/" },
    { label: "ออกจากระบบ", onClick: logout },
  ];
  const tabs = [
    { label: "หน่วยงานทั้งหมด" },
    { label: "คำขอหน่วยงาน" },
    { label: "หน่วยงานที่ปฏิเสธ" },
    { label: "เพิ่มหน่วยงาน" },
  ];
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div>
            <AllAgency officer={officer} />
          </div>
        );
      case 1:
        return (
          <div>
            <AgencyApproval officer={officer} />
          </div>
        );
      case 2:
        return (
          <div>
            <AgencyReject officer={officer} />
          </div>
        );
      case 3:
        return <div>เนื้อหาสำหรับ "เพิ่มหน่วยงาน"</div>;
      default:
        return null;
    }
  };
  if (loading) {
    return <p className={styles.loading}>กำลังโหลดข้อมูล...</p>;
  }
  return (
    <LayoutAllpage
      user={officer ? officer.first_name : "Loading..."}
      topMenuItems={topMenuItems}
      bottomMenuItems={bottomMenuItems}
      icon={Icon}
      label="จัดการหน่วยงาน"
    >
      <div className={styles.container}>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div>{renderContent()}</div>
      </div>
    </LayoutAllpage>
  );
}

export default AgencyControlPanel;
