import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import Input from "../../components/Input/Input.jsx";
import PopupStudent from "../../components/PopupStudent/PopupStudent.jsx";
import Popup from "../../components/Popup/Popup.jsx";
import Button from "../../components/button/Button.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import styles from "./StudentSearch.module.css";

const StudentSearch = ({ agency, forOfficer }) => {
  const [filters, setFilters] = useState({
    name: "",
    lname: "",
    student_no: "",
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [popupStudentId, setPopupStudentId] = useState(null);
  const [fileMap, setFileMap] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);

  const extractDepartment = (currName) => {
    const firstOpen = currName.indexOf("(");
    const lastClose = currName.lastIndexOf(")");
    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
      return currName.slice(firstOpen + 1, lastClose).trim();
    }
    return "Unknown";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSearch = async () => {
    try {
      const newErrors = {};

      if (!filters.name || filters.name.trim() === "") {
        newErrors.name = "กรุณากรอกชื่อ";
      }
      if (!filters.lname || filters.lname.trim() === "") {
        newErrors.lname = "กรุณากรอกนามสกุล";
      }
      if (!filters.student_no || filters.student_no.trim() === "") {
        newErrors.student_no = "กรุณากรอกรหัสนักศึกษา";
      }

      if (Object.keys(newErrors).length > 0) {
        setError(newErrors);
        return;
      }

      setLoading(true);
      setError({});
      setStudents([]);
      const response = await axios.post(
        API_BASE_URL + APIEndpoints.student.search,
        filters,
        { withCredentials: true }
      );
      setStudents(response.data.data);
    } catch (err) {
      setError({
        general: err.response?.data?.error || "เกิดข้อผิดพลาดในการค้นหา",
      });
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };
  const handleShowPopup = async (student) => {
    setPopupStudentId(null);
    setSelectedStudent(student);

    if (forOfficer) return;

    const formData = new FormData();
    formData.append("student_id", student.id);
    formData.append("faculty", student.dept_code);
    formData.append("department", extractDepartment(student.curr_name));
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
      <h2>ค้นหาผู้สำเร็จการศึกษา</h2>
      <div className={styles.searchForm}>
        <Input
          type="text"
          name="name"
          placeholder="ชื่อ"
          onChange={handleChange}
          error={error.name}
        />
        <Input
          type="text"
          name="lname"
          placeholder="นามสกุล"
          onChange={handleChange}
          error={error.lname}
        />
        <Input
          type="text"
          name="student_no"
          placeholder="รหัสนักศึกษา"
          onChange={handleChange}
          error={error.student_no}
        />

        <Button onClick={handleSearch} text="ค้นหา" styleType="primary" />
      </div>

      {error.general && <p className={styles.errorMessage}>{error.general}</p>}

      {loading && <p>Loading...</p>}

      {!loading && students.length > 0 && (
        <div className={styles.studentTableContainer}>
          <table className={styles.studentTable}>
            <thead>
              <tr>
                <th>รหัสนักศึกษา</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>คณะ</th>
                <th>สาขา</th>
                <th>สถานะการศึกษา</th>
                <th>ข้อมูลเพิ่มเติม</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.student_no}>
                  <td data-label="รหัสนักศึกษา">{student.student_no}</td>
                  <td data-label="ชื่อ">{student.name}</td>
                  <td data-label="นามสกุล">{student.lname}</td>
                  <td data-label="คณะ">
                    {student.curr_name.split("(")[0].trim() || "Unknown"}
                  </td>
                  <td data-label="สาขา">
                    {extractDepartment(student.curr_name)}
                  </td>
                  <td
                    data-label="สถานะการศึกษา"
                    style={{
                      color: student.status_graduate == 1 ? "green" : "red",
                    }}
                  >
                    {student.status_graduate == 1
                      ? "สำเร็จการศึกษาแล้ว"
                      : "ยังไม่สำเร็จการศึกษา"}
                  </td>
                  <td data-label="ข้อมูลเพิ่มเติม">
                    <button
                      onClick={
                        forOfficer
                          ? () => handleShowPopup(student)
                          : () => setPopupStudentId(student.id)
                      }
                      className={styles.btnInfo}
                      aria-label="ดูข้อมูลเพิ่มเติม"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>

                    {!forOfficer && popupStudentId === student.id && (
                      <Popup
                        topic="อัปโหลดหนังสือยิมยอม"
                        info={
                          <>
                            อัพโหลดหนังสือยินยอมของผู้สำเร็จการศึกษา (ถ้ามี)
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
                          accept=".pdf,.png,.jpg,.jpeg"
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
        </div>
      )}
      {selectedStudent && (
        <PopupStudent student={selectedStudent} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default StudentSearch;
