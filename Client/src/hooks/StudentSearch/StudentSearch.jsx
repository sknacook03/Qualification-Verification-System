import React, { useState } from "react";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api.jsx";
import styles from "./StudentSearch.module.css";

const StudentSearch = () => {
  const [filters, setFilters] = useState({ name: "", lname: "", student_no: "" });
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    try {
      setError(null);
      const response = await axios.post(API_BASE_URL + APIEndpoints.student.search, filters,
        { withCredentials: true }
      );
      setStudents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการค้นหา");
      setStudents([]);
    }
  };

  return (
    <div className={styles.containerSearch}>
      <h2>ค้นหานักศึกษา</h2>
      <div className={styles.searchForm}>
        <input type="text" name="name" placeholder="ชื่อ" onChange={handleChange} />
        <input type="text" name="lname" placeholder="นามสกุล" onChange={handleChange} />
        <input type="text" name="student_no" placeholder="รหัสนักศึกษา" onChange={handleChange} />
        <button onClick={handleSearch}>ค้นหา</button>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {students.length > 0 && (
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>รหัสนักศึกษา</th>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>เกรดเฉลี่ย</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.student_no}>
                <td>{student.student_no}</td>
                <td>{student.name}</td>
                <td>{student.lname}</td>
                <td>{student.gpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentSearch;
