import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Icon from "../../../assets/homepage.png";
import LayoutAllPage from "../../../components/LayoutAllPage/LayoutAllPage";
import PopupStudent from "../../../components/PopupStudent/PopupStudent";
import Loading from "../../../components/Loading/Loading";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Homepages.module.css";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../../services/api";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/agencyMenuItems";
function Homepages() {
  const [agency, setAgency] = useState(null);
  const [student, setStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await toast.promise(
          axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
            withCredentials: true,
          }),
          {
            pending: "กำลังตรวจสอบสถานะ...",
          }
        );

        if (res.data.data.status_approve !== "approved") {
          alert("บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อผู้ดูแลระบบ");
          navigate("/");
          return;
        }

        setAgency(res.data.data);

        try {
          const response = await axios.get(
            API_BASE_URL + APIEndpoints.agency.latestSearch(res.data.data.id),
            { withCredentials: true }
          );
          console.log(response.data.data);
          setStudent(response.data.data);
        } catch (err) {
          console.warn("ไม่สามารถโหลดประวัตินักศึกษาได้:", err);
          setStudent(null);
        }

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch agency data:", error);
        alert("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
        navigate("/");
        return;
      }
    };

    fetchUserData();
  }, [navigate]);

  const logout = async () => {
    try {
      await axios.post(
        API_BASE_URL + APIEndpoints.auth.logout,
        {},
        {
          withCredentials: true,
        }
      );

      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };
  const handleShowPopup = async (student) => {
    setSelectedStudent(student);
  };

  const handleClosePopup = () => {
    setSelectedStudent(null);
  };
  return (
    <>
      <LayoutAllPage
        user={agency ? agency.agency_name : "Loading..."}
        topMenuItems={topMenuItems}
        bottomMenuItems={bottomMenuItems(logout)}
        icon={Icon}
        label="หน้าหลัก"
      >
        {loading && <Loading />}
        {!loading && (
          <>
            <h4 className={styles.topic}>ข้อมูลของท่าน</h4>
            <div className={styles.boxInfoAgency}>
              <p>Email: {agency.email}</p>
              <p>Department: {agency.department}</p>
              <p>Role: {agency.role}</p>
            </div>
            <h4 className={styles.topic}>ข้อมูลของนักศึกษาที่เคยตรวจสอบ</h4>
            <div className={styles.boxHistory}>
              {student && (
                <>
                  <table className={styles.studentTable}>
                    <thead>
                      <tr>
                        <th>รหัสนักศึกษา</th>
                        <th>ชื่อ</th>
                        <th>นามสกุล</th>
                        <th>คณะ</th>
                        <th>สาขา</th>
                        <th>สถานะการศึกษา</th>
                        <th>เพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {student.map((item) => (
    
                      <tr key={item.student.student_no}>
                        <td>{item.student.student_no}</td>
                        <td>{item.student.name}</td>
                        <td>{item.student.lname}</td>
                        <td>
                          {item.student.curr_name?.split?.("(")?.[0]?.trim() ||
                            "Unknown"}
                        </td>
                        <td>
                          {item.student.curr_name?.match?.(/\((.*?)\)/)?.[1] ||
                            "Unknown"}
                        </td>

                        <td
                          style={{
                            color:
                              item.student.status_graduate === 1 ? "green" : "red",
                          }}
                        >
                          {item.student.status_graduate === 1
                            ? "สำเร็จการศึกษาแล้ว"
                            : "ยังไม่สำเร็จการศึกษา"}
                        </td>
                        <td>
                          <button
                            onClick={() => handleShowPopup(item.student)}
                            className={styles.btnInfo}
                          >
                            Info
                          </button>
                        </td>
                      </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            {selectedStudent && (
              <PopupStudent
                student={selectedStudent}
                onClose={handleClosePopup}
              />
            )}
          </>
        )}
      </LayoutAllPage>
    </>
  );
}

export default Homepages;
