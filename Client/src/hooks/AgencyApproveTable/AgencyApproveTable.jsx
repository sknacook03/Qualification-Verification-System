import React from "react";
import styles from "./AgencyApproveTable.module.css"

function AgencyApproveTable({ agencies, onUpdateStatus }) {

  const normalizeImagePath = (path) => {
    if (!path) return null;
    return path.replace(/\\/g, "/");
  };  

  const viewImage = (url) => {
    if (url) {
      window.open(url, "_blank");
    } else {
      alert("No certificate available for this agency.");
    }
  };

  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>#</th>
          <th style={styles.th}>Agency Name</th>
          <th style={styles.th}>Certificate</th>
          <th style={styles.th}>Status</th>
          <th style={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {agencies.map((agencyItem, index) => (
          <tr key={index}>
            <td style={styles.td}>{index + 1}</td>
            <td style={styles.td}>{agencyItem.agency_name}</td>
            <td style={styles.td}>
              <div style={styles.imageContainer}>
                {agencyItem.certificate ? (
                  <button
                    style={{ ...styles.button, ...styles.viewButton }}
                    onClick={() =>
                      viewImage(`http://localhost:3000/${normalizeImagePath(agencyItem.certificate)}`)
                    }                    
                    
                  >
                    View
                  </button>
                ) : (
                  "No Certificate"
                )}
              </div>
            </td>
            <td style={styles.td}>{agencyItem.status_approve}</td>
            <td style={styles.td}>
              <button
                style={{ ...styles.button, ...styles.approveButton }}
                onClick={() => onUpdateStatus(agencyItem.id, "approved")}
              >
                Approve
              </button>
              <button
                style={{ ...styles.button, ...styles.rejectButton }}
                onClick={() => onUpdateStatus(agencyItem.id, "rejected")}
              >
                Reject
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AgencyApproveTable;
