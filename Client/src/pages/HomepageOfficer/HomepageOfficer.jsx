import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AgencyApproveTable from "../../hooks/AgencyApproveTable/AgencyApproveTable.jsx";
import styles from "../HomepageOfficer/HomepageOfficer.module.css";

function HomepagesOfficer() {
  const [officer, setOfficer] = useState(null);
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/officer/logged-in", {
          withCredentials: true,
        });
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

  useEffect(() => {
    const fetchAgencyAll = async () => {
      try {
        const res = await axios.get("http://localhost:3000/agency/agencies", {
          withCredentials: true,
        });
        setAgency(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch agency data:", error);
      }
    };

    fetchAgencyAll();
  }, []);
  const sendEmailAgency = async (email, message) => {
    try{
      const res = await axios.post("http://localhost:3000/officer/send-email",
        { email, message },
        { withCredentials: true } 
      )
      console.log("Email sent successfully");
    }catch (error) {
      console.error("Failed to send Email:", error);
    }
  }
  const updateStatus = async (agencyId, newStatus) => {
    try {
      const agencyToUpdate = agency.find((item) => item.id === agencyId);
      if (!agencyToUpdate) {
        alert("Agency not found");
        return;
      }
      await axios.put(
        `http://localhost:3000/agency/update-agency/${agencyId}`,
        { status_approve: newStatus },
        { withCredentials: true }
      );

      setAgency((prevAgency) =>
        prevAgency.map((agencyItem) =>
          agencyItem.id === agencyId
            ? { ...agencyItem, status_approve: newStatus }
            : agencyItem
        )
      );
      let emailMessage;
    if (newStatus === "approved") {
      emailMessage =
        "อีเมลของคุณสามารถใช้งานระบบตรวจสอบคุณวุฒิ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน ได้แล้ว";
    } else if (newStatus === "rejected") {
      emailMessage =
        "อีเมลของคุณถูกปฎิเสธโดยเจ้าหน้าที่ จากระบบตรวจสอบคุณวุฒิ มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน กรุณาติดต่อเจ้าหน้าที่";
    }
      await sendEmailAgency(agencyToUpdate.email, emailMessage);
      alert(`สถานะถูกเปลี่ยนเป็น ${newStatus}`);
    } catch (error) {
      console.error("Failed to update agency status:", error);
      alert("ไม่สามารถอัปเดตสถานะได้");
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/LoginOfficer");
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  if (loading) {
    return (
      <div className={styles["loading-container"]}>
        <div className={styles.spinner}></div>
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!officer) {
    return <div className={styles["error-message"]}>ไม่พบข้อมูล Officer</div>;
  }

  const pendingAgencies = agency.filter(
    (agencyItem) => agencyItem.status_approve === "pending"
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome, {officer.first_name}</h1>
        <p>Email: {officer.email}</p>
        <p>Role: {officer.role}</p>
        <button className={styles.logoutButton} onClick={logout}>
          ออกจากระบบ
        </button>
      </header>

      <section className={styles.content}>
        <h3>Pending Agencies</h3>
        {pendingAgencies.length > 0 ? (
          <AgencyApproveTable
            agencies={pendingAgencies}
            onUpdateStatus={updateStatus}
          />
        ) : (
          <p>ไม่มี Agency ที่อยู่ในสถานะ Pending</p>
        )}
      </section>
    </div>
  );
}

export default HomepagesOfficer;
