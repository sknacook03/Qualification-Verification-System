import React from "react";
import close from "../../assets/close.png";
import styles from "./PopupStudent.module.css";

const PopupStudent = ({ student, onClose }) => {
  if (!student) return null;
  
  // ฟังก์ชันแปลงวันที่จาก ค.ศ. เป็น พ.ศ. และจัดฟอร์แมตแบบไทย
  const formatDateToBuddhist = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear() + 543; // แปลงเป็น พ.ศ.
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "-";
    }
  };

  // ฟังก์ชันแปลงปีจาก ค.ศ. เป็น พ.ศ.
  const formatYearToBuddhist = (year) => {
    if (!year || isNaN(Number(year))) return year || "-";
    return Number(year) + 543;
  };
  

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose} >
          <img src={close} alt="Close" width={25} height={25} />
        </button>
        <h2>ข้อมูลนักศึกษา</h2>
        <table className={styles.studentTable}>
            <tbody>
                <tr>
                    <th>ปีที่เข้าเรียน : </th>
                    <td>{formatYearToBuddhist(student.std_year_no)}</td>
                    <th>วันที่สำเร็จการศึกษา : </th>
                    <td>{formatDateToBuddhist(student.graduate_date)}</td>
                </tr>
                <tr>
                    <th>ปีสำเร็จการศึกษา : </th>
                    <td>{formatYearToBuddhist(student.year_no)}</td>
                    <th>ชื่อปริญญา : </th>
                    <td>{student.deg_name}</td>
                </tr>
                <tr>
                    <th>รหัสนักศึกษา : </th>
                    <td>{student.student_no}</td>
                    <th>เกียรตินิยม : </th>
                    <td>{student.honors ? student.honors : "-"}</td>
                </tr>
                <tr>
                    <th>คำนำหน้า : </th>
                    <td>{student.prefix_name}</td>
                    <th>หัวข้อวิทยานิพนธ์ (ไทย) : </th>
                    <td>{student.thesis_topic_th ? student.thesis_topic_th : "-"}</td>
                </tr>
                <tr>
                    <th>ชื่อ - นามสกุล : </th>
                    <td>{student.name} {student.lname}</td>
                    <th>หัวข้อวิทยานิพนธ์ (อังกฤษ) : </th>
                    <td>{student.thesis_topic_en ? student.thesis_topic_en : "-"}</td>
                </tr>
                <tr>
                    <th>หน่วยกิตสอบผ่านสะสม : </th>
                    <td>{student.cca} หน่วยกิต</td>
                    <th>รหัสภาควิชา : </th>
                    <td>{student.dept_code}</td>
                </tr>
                <tr>
                    <th>เกรดเฉลี่ย : </th>
                    <td>{student.gpa}</td>
                    <th>ชื่อหลักสูตร : </th>
                    <td>{student.curr_name}</td>
                </tr>
                <tr>
                    <th>สถานะการศึกษา : </th>
                    <td>{student.status_graduate == 1 ? "สำเร็จการศึกษาแล้ว" : "ยังไม่สำเร็จการศึกษา"}</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PopupStudent;
