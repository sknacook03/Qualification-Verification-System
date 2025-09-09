import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import StudentSearch from "../../../hooks/StudentSearch/StudentSearch.jsx";
import Icon from "../../../assets/examine.png";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";
import styles from "./CheckQualificationsOfficer.module.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/officerMenuItems.jsx";

function CheckQualificationsOfficer() {
  const [officer, setOfficer] = useState(null);
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

  return (
    <>
      <LayoutAllpage
        user={officer ? officer.first_name : "Loading..."}
        topMenuItems={topMenuItems}
        bottomMenuItems={bottomMenuItems(logout)}
        icon={Icon}
        label="ตรวจสอบคุณวุฒิผู้สำเร็จการศึกษา"
        userRole="officer"
      >
        <StudentSearch forOfficer={true} />
      </LayoutAllpage>
      <ToastContainer position="top-center" />
    </>
  );
}

export default CheckQualificationsOfficer;
