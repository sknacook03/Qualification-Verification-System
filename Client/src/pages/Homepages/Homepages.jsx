import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import HeaderHomePage from "../../components/HeaderHomePage/HeaderHomePage";
import Footer from "../../components/footer/footer.jsx";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Homepages.module.css";
import axios from "axios";
import { API_BASE_URL, APIEndpoints } from "../../services/api";
function Homepages() {
  const [agency, setAgency] = useState(null);
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

  if (!agency) {
    return <div>ไม่พบข้อมูล Agency</div>;
  }

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/auth/logout",
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

  return (
    <>
      <div className={styles.container}>
        <div className={styles.boxContainer}>
          <div className={styles.nav}>
            <HeaderHomePage user={agency.agency_name} />
          </div>
          <div className={styles.boxContainerInfo}>
            <div className={styles.info}>
              <h4 className={styles.topic}>ข้อมูลของท่าน</h4>
              <div className={styles.boxInfoAgency}>
                <p>Email: {agency.email}</p>
                <p>Department: {agency.department}</p>
                <p>Role: {agency.role}</p>
                <button onClick={logout}>ออกจากระบบ</button>
              </div>
              <h4 className={styles.topic}>ข้อมูลของนักศึกษาที่เคยตรวจสอบ</h4>
              <div className={styles.boxHistory}>
                
              </div>
            </div>
            <div className={styles.footer}>
              <Footer color="#6D6D6D" disableMenu />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Homepages;
