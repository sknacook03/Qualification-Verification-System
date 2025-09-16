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
import Pagination from "../../../components/Pagination/Pagination.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function HomepagesOfficer() {
  const [officer, setOfficer] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [agencyCount, setAgencyCount] = useState(null);
  const [pageView, setPageView] = useState([]);
  const [loadingOfficer, setLoadingOfficer] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();

  const sortedPageviews = React.useMemo(() => {
    if (!pageView) return [];
    const sortableItems = [...pageView];

    if (sortConfig.key && sortConfig.direction !== "none") {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "updated_at":
            aValue = new Date(a.updated_at);
            bValue = new Date(b.updated_at);
            break;
          default:
            aValue = "";
            bValue = "";
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortableItems;
  }, [pageView, sortConfig]);

  const requestSort = (key) => {
    setSortConfig((prevConfig) => {
      if (prevConfig.key === key) {
        if (prevConfig.direction === "asc") {
          return { key, direction: "desc" };
        } else if (prevConfig.direction === "desc") {
          return { key: null, direction: "none" };
        }
      }
      return { key, direction: "asc" };
    });
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = pageView
    ? sortedPageviews.slice(offset, offset + itemsPerPage)
    : [];
  const pageCount = sortedPageviews
    ? Math.ceil(sortedPageviews.length / itemsPerPage)
    : 0;

  const axiosCfg = useMemo(() => ({ withCredentials: true }), []);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const normalizeImagePath = (path) => path?.replace(/\\/g, "/") || null;

  const viewImage = (url) => {
    if (url) window.open(url, "_blank");
    else toast.error("ไม่มีใบประกาศนียบัตรสำหรับนักเรียนคนนี้");
  };

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
        toast.error("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
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
        const raw = agenciesRes.data?.data ?? agenciesRes.data;
        const agencies = Array.isArray(raw) ? raw : [];

        const approvedCount = agencies.filter(
          (a) => String(a.status_approve).toLowerCase() === "approved"
        ).length;

        setAgencyCount(approvedCount);

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

    const fetchPageView = async () => {
      try {
        const pRes = await axios.get(
          API_BASE_URL + APIEndpoints.pageview.logs,
          axiosCfg
        );
        const items = Array.isArray(pRes.data?.items)
          ? pRes.data.items
          : Array.isArray(pRes.data?.data)
          ? pRes.data.data
          : Array.isArray(pRes.data)
          ? pRes.data
          : [];

        setPageView(items);
      } catch (error) {
        console.error("Failed to fetch pageview data:", error);
        setPageView([]);
      }
    };

    fetchPageView();
    fetchOfficerData();
    fetchCounts();
  }, [navigate, axiosCfg]);

  const logout = async () => {
    try {
      await axios.post(API_BASE_URL + APIEndpoints.auth.logout, {}, axiosCfg);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
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
      userRole="officer"
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
                ยินดีต้อนรับ
                {officer?.first_name ? `, ${officer.first_name}` : ""} 👋
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
                    <span className={styles.infoValue}>
                      {officer?.email || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className={`${styles.card} ${styles.statCard}`}>
                <div className={styles.statTop}>
                  <span className={styles.statIcon} aria-hidden>
                    🎓
                  </span>
                  <span className={styles.statLabel}>จำนวนผู้สำเร็จการศึกษาทั้งหมด</span>
                </div>
                <div className={styles.statValue}>
                  {studentCount !== null ? studentCount.toLocaleString() : "N/A"}
                </div>
              </div>

              <div className={`${styles.card} ${styles.statCard}`}>
                <div className={styles.statTop}>
                  <span className={styles.statIcon} aria-hidden>
                    🏢
                  </span>
                  <span className={styles.statLabel}>จำนวนหน่วยงานทั้งหมด</span>
                </div>
                <div className={styles.statValue}>
                  {agencyCount !== null ? agencyCount.toLocaleString() : "N/A"}
                </div>
              </div>
            </div>

            {/* PagesView Table */}
            <div className={styles.container}>
              <div className={styles.titleBar}>
                <h2 className={styles.title}>ตารางการตรวจสอบผู้สำเร็จการศึกษา</h2>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อนักศึกษา</th>
                      <th>หน่วยงาน</th>
                      <th>หนังสือยินยอมเปิดเผยข้อมูล</th>
                      <th>
                        <div
                          onClick={() => requestSort("updated_at")}
                          className={styles.thSort}
                        >
                          วันที่{" "}
                          <div className={styles.thArrow}>
                            <p
                              className={
                                sortConfig.key === "updated_at" &&
                                sortConfig.direction === "asc"
                                  ? styles.activeArrow
                                  : ""
                              }
                            >
                              ▲
                            </p>
                            <p
                              className={
                                sortConfig.key === "updated_at" &&
                                sortConfig.direction === "desc"
                                  ? styles.activeArrow
                                  : ""
                              }
                            >
                              ▼
                            </p>
                          </div>
                        </div>
                      </th>
                      <th>เวลา</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((pv, i) => {
                      const iso = pv.updated_at ?? pv.updated_at ?? "";
                      const dateStr = iso
                        ? `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${parseInt(iso.slice(0, 4)) + 543}`
                        : "-";
                      const timeStr = iso ? iso.slice(11, 16) : "-";

                      return (
                        <tr key={pv.id ?? i}>
                          <td data-label="#">{i + 1}</td>
                          <td data-label="ชื่อนักศึกษา">
                            {pv.student_name ?? "-"}
                          </td>
                          <td data-label="หน่วยงาน">{pv.agency_name ?? "-"}</td>
                          <td data-label="หนังสือยินยอมเปิดเผยข้อมูล">
                            {pv.student_certificate !=
                            "no_certificate_uploaded" ? (
                              <button
                                className={`${styles.button} ${styles.viewButton}`}
                                title="หนังสือยินยอมเปิดเผยข้อมูล"
                                onClick={() =>
                                  viewImage(
                                    `${API_BASE_URL}/${normalizeImagePath(
                                      pv.student_certificate
                                    )}`
                                  )
                                }
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </button>
                            ) : (
                              <span style={{ color: "red" }}>
                                ไม่มีหนังสือยินยอม
                              </span>
                            )}
                          </td>
                          <td data-label="วันที่">{dateStr}</td>
                          <td data-label="เวลา">{timeStr}น.</td>
                        </tr>
                      );
                    })}
                    {(pageView ?? []).length === 0 && (
                      <tr>
                        <td colSpan={6} className={styles.empty}>
                          ไม่มีข้อมูล
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <Pagination
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          </section>
        </div>
      )}
      <ToastContainer position="top-center" />
    </LayoutAllpage>
  );
}

export default HomepagesOfficer;
