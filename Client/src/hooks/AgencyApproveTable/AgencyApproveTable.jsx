import React from "react";
import styles from "./AgencyApproveTable.module.css";

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
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.th}>#</th>
          <th className={styles.th}>Agency Name</th>
          <th className={styles.th}>Certificate</th>
          <th className={styles.th}>Status</th>
          <th className={styles.th}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {agencies.map((agencyItem, index) => (
          <tr key={index}>
            <td className={styles.td}>{index + 1}</td>
            <td className={styles.td}>{agencyItem.agency_name}</td>
            <td className={styles.td}>
              <div className={styles.imageContainer}>
                {agencyItem.certificate ? (
                  <button
                    className={`${styles.button} ${styles.viewButton}`}
                    onClick={() =>
                      viewImage(
                        `http://localhost:3000/${normalizeImagePath(
                          agencyItem.certificate
                        )}`
                      )
                    }
                  >
                    View
                  </button>
                ) : (
                  "No Certificate"
                )}
              </div>
            </td>
            <td className={styles.td}>{agencyItem.status_approve}</td>
            <td className={styles.td}>
              <button
                className={`${styles.button} ${styles.approveButton}`}
                onClick={() => onUpdateStatus(agencyItem.id, "approved")}
              >
                Approve
              </button>
              <button
                className={`${styles.button} ${styles.rejectButton}`}
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
