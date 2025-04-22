import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Icon from "../../../assets/examine.png";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL, APIEndpoints } from "../../../services/api";
import LayoutAllPage from "../../../components/LayoutAllPage/LayoutAllPage";
import StudentSearch from "../../../hooks/StudentSearch/StudentSearch";
import { topMenuItems, bottomMenuItems } from "../../../constants/agencyMenuItems";

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

  if (loading) {
    return <div>กำลังโหลดข้อมูล...</div>;
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

  return (
    <>
      <LayoutAllPage
        user={agency ? agency.agency_name : "Loading..."}
        topMenuItems={topMenuItems}
        bottomMenuItems={bottomMenuItems(logout)}
        icon={Icon}
        label="ตรวจสอบคุณวุฒินักศึกษา"
      >
        <StudentSearch />
      </LayoutAllPage>
    </>
  );
}
export default CheckQualificationsPage;
