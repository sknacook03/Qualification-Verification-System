import React, { useEffect, useState } from "react";
import axios from "axios";
import AgencyApproveTable from "../../hooks/AgencyApproveTable/AgencyApproveTable.jsx";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./AgencyReject.module.css";

const AgencyReject = ({ officer }) => {
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(true);

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
  
        alert("Approval recorded and email sent.");
      } catch (error) {
        console.error("Failed to approve agency:", error);
        alert("Error while approving agency.");
      }
    };
  const RejectAgencies = agency.filter(
    (agencyItem) => agencyItem.status_approve === "rejected"
  );

  return (
    <div className={styles.container}>
      {loading && <p className={styles.loading}>Loading...</p>}
      {!loading && (
        <AgencyApproveTable
          agencies={RejectAgencies}
          onApprove={handleApprove}
          disableReject
        />
      )}
    </div>
  );
};

export default AgencyReject;
