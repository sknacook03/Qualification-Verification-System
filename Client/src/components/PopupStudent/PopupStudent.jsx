import React from "react";
import close from "../../assets/close.png";
import styles from "./PopupStudent.module.css";

const PopupStudent = ({ student, onClose }) => {
  if (!student) return null;

  const formatDateToBuddhist = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear() + 543;
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "-";
    }
  };

  const getFacultyFromDeptCode = (deptCode) => {
    if (deptCode === 103) {
      return "ระบบรางและการขนส่ง";
    }
    if (deptCode === 104) {
      return "นวัตกรรมและเทคโนโลยีการเกษตร";
    }
    
    const facultyCode = Math.floor(deptCode / 100);
    
    const facultyCodeMap = {
      15: "บริหารธุรกิจ", 
      16: "วิทยาศาสตร์และศิลปศาสตร์",
      17: "วิศวกรรมศาสตร์และเทคโนโลยี", 
      18: "สถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์", 
      19: "สถาบันสหสรรพศาสตร์", 
    };
    
    return facultyCodeMap[facultyCode] || "ไม่ทราบคณะ";
  };

  const getMajorFromCurrName = (currName) => {
    if (!currName) return "Unknown";
    
    const match = currName.match(/^(.+?)\((.+)\)$/);
    if (match) {
      const majorName = match[2].trim();
      return majorName;
    }
    
    return "Unknown";
  };

  const getDegreeLevelFromCurrName = (currName) => {
    if (!currName) return "Unknown";
    
    if (currName.includes("ชั้นสูง")) {
      return "ประกาศนียบัตรวิชาชีพชั้นสูง";
    } else if (currName.includes("ดุษฎีบัณฑิต")) {
      return "ปริญญาเอก";
    } else if (currName.includes("มหาบัณฑิต")) {
      return "ปริญญาโท";
    } else if (currName.includes("บัณฑิต")) {
      return "ปริญญาตรี";
    }
    
    return "Unknown";
  };

  const faculty = getFacultyFromDeptCode(student.dept_code, student.curr_name);
  const major = getMajorFromCurrName(student.curr_name);
  const degreeLevel = getDegreeLevelFromCurrName(student.curr_name);
  
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={close} alt="Close" width={25} height={25} />
        </button>
        <h2>ข้อมูลผู้สำเร็จการศึกษา</h2>
        <table className={styles.studentTable}>
          <tbody>
            <tr>
              <th>รหัสนักศึกษา : </th>
              <td>{student.student_no}</td>
              <th>วันที่สำเร็จการศึกษา : </th>
              <td>{formatDateToBuddhist(student.graduate_date)}</td>
            </tr>
            <tr>
              <th>คำนำหน้าชื่อ : </th>
              <td>{student.prefix_name}</td>
              <th>ระดับ : </th>
              <td>{degreeLevel}</td>
            </tr>
            <tr>
              <th>ชื่อ - นามสกุล : </th>
              <td>{student.name} {student.lname}</td>
              <th>คณะ : </th>
              <td>{faculty}</td>
            </tr>
            <tr>
              <th>เกรดเฉลี่ยสะสม : </th>
              <td>{student.gpa || "-"}</td>
              <th>สาขาวิชา : </th>
              <td>{major}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopupStudent;
