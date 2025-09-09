import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import AllOfficer from "../../../hooks/AllOfficer/AllOfficer.jsx";
import AddOfficerByOfficer from "../../../hooks/AddOfficerByOfficer/AddOfficerByOfficer.jsx";
import Icon from "../../../assets/manage.png";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";
import styles from "./OfficerControlPanel.module.css";
import { useNavigate } from "react-router-dom";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/officerMenuItems.jsx";
import TabNavigation from "../../../components/TabNavigation/TabNavigation.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OfficerControlPanel() {
  const [officer, setOfficer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
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
        toast.error("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
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
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };
  const tabs = [{ label: "เจ้าหน้าที่ทั้งหมด" }, { label: "เพิ่มเจ้าหน้าที่" }];
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div>
            <AllOfficer officer={officer} />
          </div>
        );
      case 1:
        return (
          <div>
            <AddOfficerByOfficer officer={officer} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <LayoutAllpage
      user={officer ? officer.first_name : "Loading..."}
      topMenuItems={topMenuItems}
      bottomMenuItems={bottomMenuItems(logout)}
      icon={Icon}
      label="จัดการเจ้าหน้าที่"
      userRole="officer"
    >
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <div>{renderContent()}</div>
      <ToastContainer position="top-center" />
    </LayoutAllpage>
  );
}

export default OfficerControlPanel;
