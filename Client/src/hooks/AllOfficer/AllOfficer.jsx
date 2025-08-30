import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading/Loading.jsx";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./AllOfficer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import Popup from "../../components/Popup/Popup.jsx";

function AllOfficer() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletingOfficer, setDeletingOfficer] = useState(null);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const offset = currentPage * itemsPerPage;
  const currentItems = officers
    ? officers.slice(offset, offset + itemsPerPage)
    : [];
  const pageCount = officers ? Math.ceil(officers.length / itemsPerPage) : 0;

  useEffect(() => {
    const fetchOfficerAll = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + APIEndpoints.officer.fetchAll,
          { withCredentials: true }
        );
        setOfficers(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch officer data:", error);
        setLoading(false);
      }
    };

    fetchOfficerAll();
  }, []);

  const openEditModal = (officer) => {
    setEditingOfficer(officer);
    setEditForm({
      first_name: officer.first_name,
      last_name: officer.last_name,
      email: officer.email,
    });
    setEditError("");
  };

  const closeEditModal = () => {
    setEditingOfficer(null);
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditError("");
  };

  const handleEditSave = async () => {
    if (
      !editForm.first_name.trim() ||
      !editForm.last_name.trim() ||
      !editForm.email.trim()
    ) {
      setEditError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setEditLoading(true);
    setEditError("");
    try {
      await axios.put(
        API_BASE_URL + APIEndpoints.officer.updateOfficer(editingOfficer.id),
        editForm,
        { withCredentials: true }
      );
      // อัปเดตใน state ทันที
      setOfficers((prev) =>
        prev.map((off) =>
          off.id === editingOfficer.id ? { ...off, ...editForm } : off
        )
      );
      closeEditModal();
      toast.success("แก้ไขเจ้าหน้าที่สำเร็จ");
    } catch (error) {
      console.error("Failed to update officer:", error);
      setEditError("แก้ไขไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {

    try {
      await axios.delete(
        API_BASE_URL + APIEndpoints.officer.deleteOfficer(id),
        {
          withCredentials: true,
        }
      );
      setOfficers((prev) => prev.filter((officer) => officer.id !== id));
      toast.success("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete officer:", error);
      toast.error("Delete failed");
    } finally {
      setDeletingOfficer(null);
      setShowDeletePopup(false);
    }
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <>
      {loading && <Loading />}
      {!loading && (
        <div className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>อีเมล</th>
                <th>จัดการเจ้าหน้าที่</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((officer, index) => (
                <tr key={officer.id}>
                  <td data-label="#"> {index + 1} </td>
                  <td data-label="ชื่อ"> {officer.first_name} </td>
                  <td data-label="นามสกุล"> {officer.last_name} </td>
                  <td data-label="อีเมล"> {officer.email} </td>
                  <td data-label="จัดการเจ้าหน้าที่">
                    <div className={styles.btnContainer}>
                      <button
                        className={`${styles.button} ${styles.editButton}`}
                        onClick={() => openEditModal(officer)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          setDeletingOfficer(officer.id);
                          setShowDeletePopup(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            pageCount={pageCount}
            onPageChange={handlePageClick}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
      {editingOfficer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.titleOverlayOfficer}>
              แก้ไขข้อมูลเจ้าหน้าที่
            </h2>
            <div className={styles.formGroup}>
              <label>ชื่อ:</label>
              <input
                type="text"
                name="first_name"
                value={editForm.first_name}
                onChange={handleEditChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>นามสกุล:</label>
              <input
                type="text"
                name="last_name"
                value={editForm.last_name}
                onChange={handleEditChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>อีเมล:</label>
              <input
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
              />
            </div>

            {editError && <p className={styles.formError}>{editError}</p>}

            <div className={styles.modalActions}>
              <button onClick={closeEditModal} className={styles.cancelButton}>
                ยกเลิก
              </button>
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className={styles.saveButton}
              >
                {editLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllOfficer;
