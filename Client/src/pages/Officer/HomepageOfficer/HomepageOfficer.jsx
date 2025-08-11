import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import Loading from "../../../components/Loading/Loading.jsx";
import Icon from "../../../assets/homepage.png";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";
import styles from "./HomepageOfficer.module.css";
import { useNavigate } from "react-router-dom";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/officerMenuItems.jsx";

function HomepagesOfficer() {
  const [officer, setOfficer] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [agencyCount, setAgencyCount] = useState(null);

  const [loadingOfficer, setLoadingOfficer] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  const axiosCfg = useMemo(
    () => ({ withCredentials: true }),
    []
  );

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + APIEndpoints.officer.logged,
          axiosCfg
        );
        setOfficer(res.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch officer data:", error);
        alert("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
        setRedirecting(true);
        navigate("/LoginOfficer");
      } finally {
        setLoadingOfficer(false);
      }
    };

    const fetchCounts = async () => {
      try {
        const agenciesRes = await axios.get(
          API_BASE_URL + APIEndpoints.agency.fetchAll,
          axiosCfg
        );
        const agencies = Array.isArray(agenciesRes.data?.data)
          ? agenciesRes.data.data
          : agenciesRes.data ?? [];
        setAgencyCount(agencies.length ?? 0);

        let totalStudents = null;
        try {
          const sCount = await axios.get(
            API_BASE_URL + APIEndpoints.student.count,
            axiosCfg
          );
          const total =
            sCount.data?.total ??
            sCount.data?.data?.total ??
            (Number.isFinite(Number(sCount.data)) ? Number(sCount.data) : null);
          if (Number.isFinite(Number(total))) {
            totalStudents = Number(total);
          }
        } catch (_) {
          // ignore -> ไป fallback
        }

        setStudentCount(
          typeof totalStudents === "number" ? totalStudents : null
        );
      } catch (err) {
        console.error("Failed to fetch stats:", err);
        setAgencyCount(null);
        setStudentCount(null);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchOfficerData();
    fetchCounts();
  }, [navigate, axiosCfg]);

  const logout = async () => {
    try {
      await axios.post(
        API_BASE_URL + APIEndpoints.auth.logout,
        {},
        axiosCfg
      );
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };

  const isLoading = loadingOfficer || loadingStats || redirecting;

  return (
    <LayoutAllpage
      user={officer ? officer.first_name : "Loading..."}
      topMenuItems={topMenuItems}
      bottomMenuItems={bottomMenuItems(logout)}
      icon={Icon}
      label="หน้าหลัก"
    >
      {isLoading ? (
        <Loading />
      ) : (
        <div className={styles.page}>
          {/* Officer Section */}
          <section className={styles.section}>
            <div className={styles.headRow}>
              <h1 className={styles.title}>สรุปภาพรวม</h1>
              <div className={styles.badge}>
                ยินดีต้อนรับ{officer?.first_name ? `, ${officer.first_name}` : ""} 👋
              </div>
            </div>

            <div className={styles.grid}>
              <div className={`${styles.card} ${styles.cardOfficer}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon} aria-hidden>
                    <span className={styles.iconCircle}>👮‍♂️</span>
                  </div>
                  <h2 className={styles.cardTitle}>ข้อมูลเจ้าหน้าที่</h2>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>ชื่อ - สกุล</span>
                    <span className={styles.infoValue}>
                      {officer?.first_name || "-"} {officer?.last_name || ""}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>อีเมล</span>
                    <span className={styles.infoValue}>{officer?.email || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className={`${styles.card} ${styles.statCard}`}>
                <div className={styles.statTop}>
                  <span className={styles.statIcon} aria-hidden>🎓</span>
                  <span className={styles.statLabel}>จำนวนนักศึกษาทั้งหมด</span>
                </div>
                <div className={styles.statValue}>
                  {studentCount ?? "N/A"}
                </div>
              </div>

              <div className={`${styles.card} ${styles.statCard}`}>
                <div className={styles.statTop}>
                  <span className={styles.statIcon} aria-hidden>🏢</span>
                  <span className={styles.statLabel}>จำนวนหน่วยงานทั้งหมด</span>
                </div>
                <div className={styles.statValue}>
                  {agencyCount ?? "N/A"}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </LayoutAllpage>
  );
}

export default HomepagesOfficer;
