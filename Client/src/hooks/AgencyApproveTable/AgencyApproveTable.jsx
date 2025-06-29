import React, { useEffect, useState } from "react";
import styles from "./AgencyApproveTable.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faPenToSquare,
  faTrashCan,
  faClock,
  faRectangleXmark,
  faSquareCheck,
} from "@fortawesome/free-regular-svg-icons";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api";

function AgencyApproveTable({
  agencies,
  onApprove,
  onPending,
  onReject,
  onEdit,
  onDelete,
  onShowInfo,
  disableApprove,
  disablePending,
  disableReject,
  disableEdit,
  disableDelete,
}) {
  const [loadingApproveId, setLoadingApproveId] = useState(null);
  const [loadingPendingId, setLoadingPendingId] = useState(null);
  const [typeAgencies, setTypeAgencies] = useState([]);

  const handleApprove = async (id) => {
    setLoadingApproveId(id);
    try {
      await onApprove(id);
    } finally {
      setLoadingApproveId(null);
    }
  };

  const handlePending = async (id) => {
    setLoadingPendingId(id);
    try {
      await onPending(id);
    } finally {
      setLoadingPendingId(null);
    }
  };
  const normalizeImagePath = (path) => path?.replace(/\\/g, "/") || null;

  const viewImage = (url) => {
    if (url) window.open(url, "_blank");
    else alert("No certificate available for this agency.");
  };

  const getStatus = (status) => {
    switch (status) {
      case "approved":
        return styles.approved;
      case "pending":
        return styles.pending;
      case "rejected":
        return styles.rejected;
      default:
        return "";
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}${APIEndpoints.typeAgency.fetchAll}`, {
        withCredential: true,
      })
      .then((res) => {
        const list = Array.isArray(res.data.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setTypeAgencies(list);
      })
      .catch((err) => {
        console.error("โหลดประเภทหน่วยงานล้มเหลว", err);
        setTypeAgencies([]);
      });
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.responsiveTableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อหน่วยงาน</th>
              <th>เบอร์โทรศัพท์</th>
              <th>ประเภทหน่วยงาน</th>
              <th>หนังสือรับรอง</th>
              <th>สถานะ</th>
              <th>จัดการสถานะ</th>
              <th>จัดการหน่วยงาน</th>
            </tr>
          </thead>
          <tbody>
            {agencies.map((agencyItem, index) => (
              <tr key={agencyItem.id || index}>
                <td data-label="#"> {index + 1} </td>
                <td data-label="ชื่อหน่วยงาน">
                  {agencyItem.agency_name}
                  <br />
                  <span className={styles.emailText}>{agencyItem.email}</span>
                </td>
                <td data-label="เบอร์โทรศัพท์">
                  <span className={styles.telText}>
                    {agencyItem.telephone_number}
                  </span>
                </td>
                <td data-label="ประเภทหน่วยงาน">
                  {typeAgencies.find((t) => t.id === agencyItem.type_id)
                    ?.type_name || agencyItem.type_id}
                </td>
                <td data-label="หนังสือรับรอง">
                  <div className={styles.imageContainer}>
                    {agencyItem.certificate ? (
                      <button
                        className={`${styles.button} ${styles.viewButton}`}
                        title="ดูหนังสือรับรอง"
                        onClick={() =>
                          viewImage(
                            `http://localhost:3000/${normalizeImagePath(
                              agencyItem.certificate
                            )}`
                          )
                        }
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                    ) : (
                      "No Certificate"
                    )}
                  </div>
                </td>
                <td data-label="สถานะ">
                  <div className={getStatus(agencyItem.status_approve)}>
                    <span className={styles.dotSymbol}></span>
                    {agencyItem.status_approve}
                  </div>
                </td>
                <td data-label="จัดการสถานะ">
                  {!disableApprove && (
                    <button
                      className={`${styles.button} ${styles.approveButton}`}
                      title="ยืนยันหน่วยงาน"
                      onClick={() => handleApprove(agencyItem.id)}
                      disabled={loadingApproveId === agencyItem.id}
                    >
                      {loadingApproveId === agencyItem.id ? (
                        <ClipLoader size={15} color="#fff" />
                      ) : (
                        <FontAwesomeIcon icon={faSquareCheck} />
                      )}
                    </button>
                  )}

                  {!disablePending && (
                    <button
                      className={`${styles.button} ${styles.pendingButton}`}
                      title="รอดำเนินการ"
                      onClick={() => handlePending(agencyItem.id)}
                      disabled={loadingPendingId === agencyItem.id}
                    >
                      {loadingPendingId === agencyItem.id ? (
                        <ClipLoader size={15} color="#fff" />
                      ) : (
                        <FontAwesomeIcon icon={faClock} />
                      )}
                    </button>
                  )}
                  {!disableReject && (
                    <button
                      className={`${styles.button} ${styles.rejectButton}`}
                      title="ปฏิเสธหน่วยงาน"
                      onClick={() => onReject(agencyItem.id)}
                    >
                      <FontAwesomeIcon icon={faRectangleXmark} />
                    </button>
                  )}
                </td>
                <td data-label="จัดการหน่วยงาน">
                  {!disableEdit && (
                    <button
                      className={`${styles.button} ${styles.editButton}`}
                      title="แก้ไขหน่วยงาน"
                      onClick={() => onEdit(agencyItem.id)}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}
                  {!disableDelete && (
                    <button
                      className={`${styles.button} ${styles.deleteButton}`}
                      title="ลบหน่วยงาน"
                      onClick={() => onDelete(agencyItem.id)}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  )}
                  <button
                    className={`${styles.button} ${styles.infoButton}`}
                    title="ข้อมูลหน่วยงาน"
                    onClick={() => onShowInfo(agencyItem.id)}
                  >
                    <FontAwesomeIcon icon={faInfo} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AgencyApproveTable;
