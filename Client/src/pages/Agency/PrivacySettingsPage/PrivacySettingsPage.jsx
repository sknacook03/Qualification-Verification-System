import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import LayoutAllPage from "../../../components/LayoutAllPage/LayoutAllPage";
import AgencyPrivacy from "../../../hooks/AgencyPrivacy/AgencyPrivacy";
import Icon from "../../../assets/setting.png";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, APIEndpoints } from "../../../services/api";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/agencyMenuItems";

export default function PrivacySettingsPage() {
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAgencyData = useCallback(async () => {
    try {
      const res = await axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
        withCredentials: true,
      });
      const data = res.data.data;
      if (data.status_approve !== "approved") {
        toast.warning(
          "บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อผู้ดูแลระบบ"
        );
        navigate("/");
        return;
      }
      setAgency(data);
    } catch (error) {
      console.error("Failed to fetch agency data:", error);
      toast.error("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
      navigate("/");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAgencyData();
  }, [fetchAgencyData]);

  const logout = async () => {
    try {
      await axios.post(
        API_BASE_URL + APIEndpoints.auth.logout,
        {},
        { withCredentials: true }
      );
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  const handleAgencyUpdated = async () => {
    setLoading(true);
    await fetchAgencyData();
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <>
      <LayoutAllPage
        user={agency.agency_name}
        topMenuItems={topMenuItems}
        bottomMenuItems={bottomMenuItems(logout)}
        icon={Icon}
        label="ตั้งค่าความเป็นส่วนตัว"
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <AgencyPrivacy
          agency={agency}
          loading={loading}
          onAgencyUpdated={handleAgencyUpdated}
        />
      </LayoutAllPage>
    </>
  );
}
