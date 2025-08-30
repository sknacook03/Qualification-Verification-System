import React, { useEffect, useState } from "react";
import axios from "axios";
import AgencyApproveTable from "../../hooks/AgencyApproveTable/AgencyApproveTable.jsx";
import EditAgencyPopup from "../../hooks/EditAgencyPopup/EditAgencyPopup.jsx";
import InfoAgencyPopup from "../InfoAgencyPopup/InfoAgencyPopup.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import Popup from "../../components/Popup/Popup.jsx";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AllAgency.module.css";

const AllAgency = ({ officer }) => {
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [rejectedAgency, setRejectedAgency] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoAgency, setInfoAgency] = useState(null);
  const [editingAgency, setEditingAgency] = useState(null);

  const toastConfig = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    draggable: true,
  };

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

  const handlePending = async (agencyId) => {
    try {
      await axios.put(
        API_BASE_URL + APIEndpoints.agency.updateAgency(agencyId),
        { status_approve: "pending", approve_by: officer.id },
        { withCredentials: true }
      );

      setAgency((prevAgency) =>
        prevAgency.map((agencyItem) =>
          agencyItem.id === agencyId
            ? { ...agencyItem, status_approve: "pending" }
            : agencyItem
        )
      );

      toast.success("Agency status updated to pending.");
    } catch (error) {
      console.error("Failed to update agency status to pending:", error);
      toast.error("Error while updating agency status.");
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
        toast.error("Agency not found");
        return;
      }

      await axios.put(
        API_BASE_URL + APIEndpoints.agency.updateAgency(rejectedAgency),
        { status_approve: "rejected", approve_by: officer.id },
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
          agency_id: agencyToUpdate.id,
          email: agencyToUpdate.email,
          agency: agencyToUpdate.agency_name,
          status_approved: "rejected",
          reason: rejectionReason,
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
      toast.success("Rejection recorded and email sent.");
    } catch (error) {
      console.error("Failed to reject agency:", error);
      toast.error("Error while rejecting agency.");
    }
  };

  const handleEdit = (agencyId) => {
    const target = agency.find((a) => a.id === agencyId);
    if (!target) return;
    setEditingAgency(target);
    setShowEditPopup(true);
  };

  const submitEdit = async (id, updatedFields) => {
    try {
      await axios.put(
        API_BASE_URL + APIEndpoints.agency.updateAgency(id),
        updatedFields,
        { withCredentials: true }
      );
      setAgency((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a))
      );
      setShowEditPopup(false);
      toast.success("แก้ไขเรียบร้อย", toastConfig);
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด", toastConfig);
    }
  };

  const handleDelete = async (agencyId) => {
    if (!window.confirm("ยืนยันการลบ agency นี้หรือไม่?")) return;

    try {
      const res = await axios.delete(
        API_BASE_URL + APIEndpoints.agency.deleteAgency(agencyId),
        { withCredentials: true }
      );
      if (res.status !== 200 || !res.data.success) {
        throw new Error("Delete failed");
      }
      setAgency((prev) => prev.filter((a) => a.id !== agencyId));
      toast.success("ลบหน่วยงานเรียบร้อยแล้ว");
    } catch (error) {
      console.error("Failed to delete agency:", error);
      toast.error("เกิดข้อผิดพลาดในการลบหน่วยงาน");
    }
  };

  const handleShowInfo = (agencyId) => {
    const target = agency.find((a) => a.id === agencyId);
    if (!target) return;
    setInfoAgency(target);
    setShowInfoPopup(true);
  };

  const ApprovedAgencies = agency.filter(
    (agencyItem) => agencyItem.status_approve === "approved"
  );

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {!loading && (
        <AgencyApproveTable
          agencies={ApprovedAgencies}
          disableApprove
          onReject={handleReject}
          onPending={handlePending}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowInfo={handleShowInfo}
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
      {showEditPopup && (
        <EditAgencyPopup
          isOpen={showEditPopup}
          agency={editingAgency}
          onCancel={() => setShowEditPopup(false)}
          onSave={submitEdit}
        />
      )}
      {showInfoPopup && (
        <InfoAgencyPopup
          show={showInfoPopup}
          agency={infoAgency}
          onClose={() => setShowInfoPopup(false)}
        />
      )}
      
    </div>
  );
};

export default AllAgency;
