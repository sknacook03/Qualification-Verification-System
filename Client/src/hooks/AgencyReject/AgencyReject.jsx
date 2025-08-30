import React, { useEffect, useState } from "react";
import axios from "axios";
import AgencyApproveTable from "../../hooks/AgencyApproveTable/AgencyApproveTable.jsx";
import EditAgencyPopup from "../../hooks/EditAgencyPopup/EditAgencyPopup.jsx";
import InfoAgencyPopup from "../InfoAgencyPopup/InfoAgencyPopup.jsx";
import Loading from "../../components/Loading/Loading.jsx";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./AgencyReject.module.css";

const AgencyReject = ({ officer }) => {
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoAgency, setInfoAgency] = useState(null);

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
        toast.error("Agency not found");
        return;
      }

      await axios.put(
        API_BASE_URL + APIEndpoints.agency.updateAgency(agencyId),
        { status_approve: "approved", approve_by: officer.id },
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
          agency: agencyToUpdate.agency_name,
          status_approved: "approved",
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

      toast.success("Approval recorded and email sent.");
    } catch (error) {
      console.error("Failed to approve agency:", error);
      toast.error("Error while approving agency.");
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
      toast.success("แก้ไขเรียบร้อย");
    } catch (err) {
      console.error(err);
      toast.error("เกิดข้อผิดพลาด");
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

  const RejectAgencies = agency.filter(
    (agencyItem) => agencyItem.status_approve === "rejected"
  );

  return (
    <div className={styles.container}>
      {loading && <Loading />}
      {!loading && (
        <AgencyApproveTable
          agencies={RejectAgencies}
          onApprove={handleApprove}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onShowInfo={handleShowInfo}
          disableReject
          disablePending
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

export default AgencyReject;
