import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import OfficerPrivacy from "../../../hooks/OfficerPrivacy/OfficerPrivacy.jsx";
import Icon from "../../../assets/setting.png";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";
import styles from "./PrivacySettingsPageOfficer.module.css";
import { useNavigate } from "react-router-dom";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/officerMenuItems.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PrivacySettingsPageOfficer() {
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOfficerData = async () => {
    try {
      const res = await axios.get(API_BASE_URL + APIEndpoints.officer.logged, {
        withCredentials: true,
      });
      setOfficer(res.data.data);
    } catch (error) {
      console.error("Failed to fetch officer data:", error);
      toast.error("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
      navigate("/LoginOfficer");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficerData();
  }, [navigate]);

  const handleOfficerUpdated = async () => {
    setLoading(true);
    await fetchOfficerData();
  };

  const logout = async () => {
    try {
      await axios.post(
        API_BASE_URL + APIEndpoints.auth.logout,
        {},
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };


  return (
    <LayoutAllpage
      user={officer ? officer.first_name : "Loading..."}
      icon={Icon}
      label="ตั้งค่าความเป็นส่วนตัว"
      topMenuItems={topMenuItems}
      bottomMenuItems={bottomMenuItems(logout)}
    >
      <div className={styles.contentWrapper}>
        <OfficerPrivacy
          officer={officer}
          loading={loading}
          onOfficerUpdated={handleOfficerUpdated} 
        />
      </div>
      <ToastContainer position="top-center" />
    </LayoutAllpage>
  );
}

export default PrivacySettingsPageOfficer;
