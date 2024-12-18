import React from "react";

function AgencyApproveTable({ agencies, onUpdateStatus }) {

  const normalizeImagePath = (path) => {
    if (!path) return null;
    return path.replace(/\\/g, "/");
  };  

  const styles = {
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
      fontSize: "16px",
    },
    th: {
      backgroundColor: "#f9f9f9",
      color: "#333",
      padding: "12px",
      borderBottom: "2px solid #ddd",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #ddd",
      verticalAlign: "middle",
    },
    button: {
      padding: "5px 10px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "5px",
    },
    approveButton: {
      backgroundColor: "#4CAF50",
      color: "white",
    },
    rejectButton: {
      backgroundColor: "#f44336",
      color: "white",
    },
    viewButton: {
      backgroundColor: "#008CBA",
      color: "white",
    },
    image: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "4px",
      display: "block",
      marginBottom: "5px",
    },
    imageContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
    },
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
