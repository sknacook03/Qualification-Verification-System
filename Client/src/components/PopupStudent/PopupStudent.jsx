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

  const formatYearToBuddhist = (year) => {
    if (!year || isNaN(Number(year))) return year || "-";
    return Number(year) + 543;
  };

    const displayNameToCodeNameMap = {
    ระบบรางและการขนส่งบัณฑิต: "ระบบรางและการขนส่ง",
    นวัตกรรมและเทคโนโลยีการเกษตรบัณฑิต: "นวัตกรรมและเทคโนโลยีการเกษตร",
    บริหารธุรกิจบัณฑิต: "บริหารธุรกิจ",
    วิทยาศาสตร์และศิลปศาสตร์บัณฑิต: "วิทยาศาสตร์และศิลปศาสตร์",
    วิศวกรรมศาสตรบัณฑิต: "วิศวกรรมศาสตร์และเทคโนโลยี",
    สถาปัตยกรรมศาสตรบัณฑิต: "สถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์",
    สหสรรพศาสตร์บัณฑิต: "สถาบันสหสรรพศาสตร์",
  };

  // แยกชื่อปริญญา (หน้าวงเล็บ) และสาขาวิชา (ในวงเล็บ)
  const getFacultyAndMajor = (currName) => {
    if (!currName) return { faculty: "Unknown", major: "Unknown" };
    
    const match = currName.match(/^(.+?)\((.+)\)$/);
    if (match) {
      const degreeDisplayName = match[1].trim();
      const majorName = match[2].trim(); 
      
      const facultyName = displayNameToCodeNameMap[degreeDisplayName] || degreeDisplayName;
      
      return { faculty: facultyName, major: majorName };
    }
    
    return { 
      faculty: displayNameToCodeNameMap[currName] || currName, 
      major: "Unknown" 
    };
  };

  const { faculty, major } = getFacultyAndMajor(student.curr_name);
  
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
              <th>ชื่อปริญญา : </th>
              <td>{student.deg_name}</td>
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
