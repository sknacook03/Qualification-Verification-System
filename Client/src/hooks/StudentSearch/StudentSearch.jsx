import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import Input from "../../components/Input/Input.jsx";
import PopupStudent from "../../components/PopupStudent/PopupStudent.jsx";
import Popup from "../../components/Popup/Popup.jsx";
import Button from "../../components/button/Button.jsx";
import styles from "./StudentSearch.module.css";

const StudentSearch = ({ agency }) => {
  const [filters, setFilters] = useState({
    name: "",
    lname: "",
    student_no: "",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [popupStudentId, setPopupStudentId] = useState(null);
  const [fileMap, setFileMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      setStudents([]);
      const response = await axios.post(
        API_BASE_URL + APIEndpoints.student.search,
        filters,
        { withCredentials: true }
      );
      setStudents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการค้นหา");
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  const handleShowPopup = async (student) => {
    setPopupStudentId(null);
    setSelectedStudent(student);

    const formData = new FormData();
    formData.append("student_id", student.id);
    formData.append(
      "faculty",
      student.curr_name.split("(")[0].trim() || "Unknown"
    );
    formData.append(
      "department",
      student.curr_name.match(/\((.*?)\)/)?.[1] || "Unknown"
    );
    formData.append("action_type", "VIEW");

    const selectedFile = fileMap[student.id];
    if (selectedFile) {
      formData.append("student_certificate", selectedFile);
    }

    try {
      await axios.post(API_BASE_URL + APIEndpoints.pageview.create, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("Error uploading certificate or logging page view:", error);
    }
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
  };
  return (
    <div className={styles.containerSearch}>
      <h2>ค้นหานักศึกษา</h2>
      <div className={styles.searchForm}>
        <Input
          type="text"
          name="name"
          placeholder="ชื่อ"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="lname"
          placeholder="นามสกุล"
          onChange={handleChange}
        />
        <Input
          type="text"
          name="student_no"
          placeholder="รหัสนักศึกษา"
          onChange={handleChange}
        />
        <Button onClick={handleSearch} text="ค้นหา" styleType="primary" />
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {loading && <p>Loading...</p>}

      {!loading && students.length > 0 && (
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>รหัสนักศึกษา</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>สถานะการศึกษา</th>
              <th>เพิ่มเติม</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_no}>
                <td>{student.student_no}</td>
                <td>{student.name}</td>
                <td>{student.lname}</td>
                <td
                  style={{
                    color: student.status_graduate == 1 ? "green" : "red",
                  }}
                >
                  {student.status_graduate == 1
                    ? "สำเร็จการศึกษาแล้ว"
                    : "ยังไม่สำเร็จการศึกษา"}
                </td>
                <td>
                  <button
                    onClick={() => setPopupStudentId(student.id)}
                    className={styles.btnInfo}
                  >
                    Info
                  </button>
                  {popupStudentId === student.id && (
                    <Popup
                      topic="อัปโหลดหนังสือยิมยอม"
                      info={
                        <>
                          อัพโหลดหนังสือยินยอมของนักศึกษา (ถ้ามี)
                          <br />
                          (รองรับไฟล์ .pdf .png .jpg ขนาดไม่เกิน 10 MB)
                        </>
                      }
                      successPopup={() => handleShowPopup(student)}
                      textButtonSuccess="ยืนยัน"
                      closePopup={() => setPopupStudentId(null)}
                    >
                      <Input
                        type="file"
                        onChange={(e) =>
                          setFileMap((prev) => ({
                            ...prev,
                            [student.id]: e.target.files[0],
                          }))
                        }
                      />
                    </Popup>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedStudent && (
        <PopupStudent student={selectedStudent} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default StudentSearch;
