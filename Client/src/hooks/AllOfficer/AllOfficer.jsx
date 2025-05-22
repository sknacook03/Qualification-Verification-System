import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./AllOfficer.module.css";

function AllOfficer() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State popup edit
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

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
    if (!editForm.first_name.trim() || !editForm.last_name.trim() || !editForm.email.trim()) {
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
      alert("แก้ไขเจ้าหน้าที่สำเร็จ");
    } catch (error) {
      console.error("Failed to update officer:", error);
      setEditError("แก้ไขไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this officer?")) return;
    try {
      await axios.delete(API_BASE_URL + APIEndpoints.officer.deleteOfficer(id), {
        withCredentials: true,
      });
      setOfficers((prev) => prev.filter((officer) => officer.id !== id));
      alert("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete officer:", error);
      alert("Delete failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Actions Officer</th>
          </tr>
        </thead>
        <tbody>
          {officers.map((officer, index) => (
            <tr key={officer.id}>
              <td>{index + 1}</td>
              <td>{officer.first_name}</td>
              <td>{officer.last_name}</td>
              <td>{officer.email}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => openEditModal(officer)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(officer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingOfficer && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>แก้ไขเจ้าหน้าที่</h3>
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
              <button
                onClick={handleEditSave}
                disabled={editLoading}
                className={styles.saveButton}
              >
                {editLoading ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button onClick={closeEditModal} className={styles.cancelButton}>
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AllOfficer;
