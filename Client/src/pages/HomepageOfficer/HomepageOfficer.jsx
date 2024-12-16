import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AgencyApproveTable from "../../hooks/AgencyApproveTable/AgencyApproveTable.jsx";

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

  const updateStatus = async (agencyId, newStatus) => {
    try {
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
      alert(`สถานะถูกเปลี่ยนเป็น ${newStatus}`);
    } catch (error) {
      console.error("Failed to update agency status:", error);
      alert("ไม่สามารถอัปเดตสถานะได้");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!officer) {
    return <div>ไม่พบข้อมูล Officer</div>;
  }

  const pendingAgencies = agency.filter(
    (agencyItem) => agencyItem.status_approve === "pending"
  );

  return (
    <div>
      <h1>Welcome, {officer.first_name}</h1>
      <p>Email: {officer.email}</p>
      <p>Role: {officer.role}</p>

      <h3>Pending Agencies</h3>
      {pendingAgencies.length > 0 ? (
        <AgencyApproveTable
          agencies={pendingAgencies}
          onUpdateStatus={updateStatus}
        />
      ) : (
        <p>ไม่มี Agency ที่อยู่ในสถานะ Pending</p>
      )}
    </div>
  );
}

export default HomepagesOfficer;
