import React, { useEffect, useState } from "react";
import axios from "axios";
import AgencyApproveTable from "../../hooks/AgencyApproveTable/AgencyApproveTable.jsx";
import Popup from "../../components/Popup/Popup.jsx";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./HomepageOfficer.module.css";
import { useNavigate } from "react-router-dom";

function HomepagesOfficer() {
  const [officer, setOfficer] = useState(null);
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [rejectedAgency, setRejectedAgency] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const res = await axios.get(API_BASE_URL + APIEndpoints.officer.logged, {
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
        const res = await axios.get(
          API_BASE_URL + APIEndpoints.agency.fetchAll,
          { withCredentials: true }
        );
        setAgency(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch agency data:", error);
      }
    };

    fetchAgencyAll();
  }, []);

  const handleApprove = async (agencyId) => {
    try {
      const agencyToUpdate = agency.find((item) => item.id === agencyId);
      if (!agencyToUpdate) {
        alert("Agency not found");
        return;
      }

      await axios.put(
        API_BASE_URL + APIEndpoints.agency.updateAgency(agencyId),
        { status_approve: "approved",
          approve_by: officer.id,
         },
        { withCredentials: true }
      );

      await axios.post(
        API_BASE_URL + APIEndpoints.approvalog.createLogs,
        {
          agency_id: agencyId,
          officer_id: officer.id,
          status_approve: "approved",
          reason: "N/A",
        },
        { withCredentials: true }
      );

      await axios.post(
        API_BASE_URL + APIEndpoints.officer.sendEmail,
        {
          email: agencyToUpdate.email,
          message: "คำขอของคุณในการเข้าใช้งานระบบตรวจสอบคุณวุฒิของมหาวิทยาลัยเทคโนโลยีอีสานได้รับการอนุมัติแล้ว ยินดีต้อนรับ!",
        },
        { withCredentials: true }
      );

      setAgency((prevAgency) =>
        prevAgency.map((agencyItem) =>
          agencyItem.id === agencyId
            ? { ...agencyItem, status_approve: "approved" }
            : agencyItem
        )
      );

      alert("Approval recorded and email sent.");
    } catch (error) {
      console.error("Failed to approve agency:", error);
      alert("Error while approving agency.");
    }
  };

  const handleReject = (agencyId) => {
    setRejectedAgency(agencyId);
    setShowPopup(true);
  };

  const submitRejection = async () => {
    try {
      const agencyToUpdate = agency.find((item) => item.id === rejectedAgency);
      if (!agencyToUpdate) {
        alert("Agency not found");
        return;
      }

      await axios.put(
        API_BASE_URL + APIEndpoints.agency.updateAgency(rejectedAgency),
        { status_approve: "rejected",
          approve_by: officer.id,
         },
        { withCredentials: true }
      );

      await axios.post(
        API_BASE_URL + APIEndpoints.approvalog.createLogs,
        {
          agency_id: rejectedAgency,
          officer_id: officer.id,
          status_approve: "rejected",
          reason: rejectionReason,
        },
        { withCredentials: true }
      );

      await axios.post(
        API_BASE_URL + APIEndpoints.officer.sendEmail,
        {
          email: agencyToUpdate.email,
          message: `คำขอของคุณในการเข้าใช้งานระบบตรวจสอบคุณวุฒิของมหาวิทยาลัยเทคโนโลยีอีสานถูกปฏิเสธด้วยเหตุผลดังต่อไปนี้: ${rejectionReason}`,
          formAttachment: "url_to_form",
        },
        { withCredentials: true }
      );

      setAgency((prevAgency) =>
        prevAgency.map((agencyItem) =>
          agencyItem.id === rejectedAgency
            ? { ...agencyItem, status_approve: "rejected" }
            : agencyItem
        )
      );

      setShowPopup(false);
      setRejectionReason("");
      alert("Rejection recorded and email sent.");
    } catch (error) {
      console.error("Failed to reject agency:", error);
      alert("Error while rejecting agency.");
    }
  };

  const pendingAgencies = agency.filter((agencyItem) => agencyItem.status_approve === "pending");

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Loading...</p>}
      {!loading && (
        <AgencyApproveTable
          agencies={pendingAgencies}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {showPopup && (
        <Popup 
        topic="หมายเหตุ"
        info="โปรดระบุเหตุผลในการปฏิเสธหน่วยงาน"
        textarea
        valueTextarea={rejectionReason}
        onChangeTextarea={(e) => setRejectionReason(e.target.value)}
        placeholderTextarea="กรุณากรอกหมายเหตุ"
        successPopup={submitRejection}
        textButtonSuccess="ยืนยัน"
        closePopup={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default HomepagesOfficer;
