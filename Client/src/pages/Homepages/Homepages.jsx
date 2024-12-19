import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
function Homepages() {
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await toast.promise( axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
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
        "http://localhost:3000/auth/logout",
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
    <div>
      <h1>Welcome, {agency.agency_name}</h1>
      <p>Email: {agency.email}</p>
      <p>Department: {agency.department}</p>
      <p>Role: {agency.role}</p>
      <button onClick={logout}>
          ออกจากระบบ
        </button>
    </div>
    
  );
}

export default Homepages;
