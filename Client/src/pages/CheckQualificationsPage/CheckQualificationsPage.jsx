import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Icon from "../../assets/examine.png";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
import LayoutAllPage from "../../components/LayoutAllPage/LayoutAllPage";
function CheckQualificationsPage() {
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await toast.promise(
          axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
            withCredentials: true,
          }),
          {
            pending: "กำลังตรวจสอบสถานะ...",
          }
        );
        if (res.data.data.status_approve !== "approved") {
          alert("บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อผู้ดูแลระบบ");
          navigate("/");
          return;
        }
        setAgency(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch agency data:", error);
        alert("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
        navigate("/");
        return;
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!agency) {
    return <div>ไม่พบข้อมูล Agency</div>;
  }

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
    { label: "หน้าหลัก", route: "/Homepages" },
    { label: "ตรวจสอบคุณวุฒินักศึกษา", route: "/CheckQualificationsPage" },
    { label: "สถิติการเข้าถึง", route: "/AccessStatisticsPage" },
  ];

  const bottomMenuItems = [
    { label: "ตั้งค่าความเป็นส่วนตัว", route: "/PrivacySettingsPage" },
    { label: "ออกจากระบบ", onClick: logout },
  ];
  return (
    <>
      <LayoutAllPage
        user={agency.agency_name}
        topMenuItems={topMenuItems}
        bottomMenuItems={bottomMenuItems}
        icon={Icon}
        label="ตรวจสอบคุณวุฒินักศึกษา"
      ></LayoutAllPage>
    </>
  );
}
export default CheckQualificationsPage;
