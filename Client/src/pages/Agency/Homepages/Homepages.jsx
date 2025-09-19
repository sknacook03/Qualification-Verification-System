import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icon from "../../../assets/homepage.png";
import LayoutAllPage from "../../../components/LayoutAllPage/LayoutAllPage";
import PopupStudent from "../../../components/PopupStudent/PopupStudent";
import Loading from "../../../components/Loading/Loading";
import Pagination from "../../../components/Pagination/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faBuilding,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faUser,
  faUserTag,
  faCalendarAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Homepages.module.css";
import moment from "moment";
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
  const [loadingButtonExcel, setLoadingButtonExcel] = useState(false);
  const [loadingButtonPdf, setLoadingButtonPdf] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  
  // Filter students based on search term
  const filteredStudents = React.useMemo(() => {
    if (!student) return [];
    if (!searchTerm.trim()) return student;

    return student.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      
      return (
        item.student.name?.toLowerCase().includes(searchLower) ||
        item.student.lname?.toLowerCase().includes(searchLower) ||
        item.student.student_no?.includes(searchTerm) ||
        item.student.curr_name?.toLowerCase().includes(searchLower)
      );
    });
  }, [student, searchTerm]);

  const sortedStudents = React.useMemo(() => {
    if (!filteredStudents) return [];
    const sortableItems = [...filteredStudents];

    if (sortConfig.key && sortConfig.direction !== "none") {
      sortableItems.sort((a, b) => {
        let aValue, bValue;

        switch (sortConfig.key) {
          case "name":
            aValue = a.student.name;
            bValue = b.student.name;
            break;
          case "lname":
            aValue = a.student.lname;
            bValue = b.student.lname;
            break;
          case "curr_name":
            aValue = a.student.curr_name;
            bValue = b.student.curr_name;
            break;
          case "updated_at":
            aValue = new Date(a.updated_at);
            bValue = new Date(b.updated_at);
            break;
          case "student_no":
            aValue = a.student.student_no;
            bValue = b.student.student_no;
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
  }, [filteredStudents, sortConfig]);

  // Reset page when search term changes
  React.useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

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
  const currentItems = sortedStudents
    ? sortedStudents.slice(offset, offset + itemsPerPage)
    : [];
  const pageCount = sortedStudents ? Math.ceil(sortedStudents.length / itemsPerPage) : 0;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(API_BASE_URL + APIEndpoints.agency.logged, {
          withCredentials: true,
        });

        if (res.data.data.status_approve !== "approved") {
          toast.warning(
            "บัญชีของคุณยังไม่ได้รับการอนุมัติ โปรดติดต่อผู้ดูแลระบบ"
          );
          navigate("/");
          return;
        }

        setAgency(res.data.data);

        try {
          const response = await axios.get(
            API_BASE_URL + APIEndpoints.agency.latestSearch(res.data.data.id),
            { withCredentials: true }
          );
          setStudent(response.data.data);
        } catch (err) {
          setStudent(null);
        }

        setLoading(false);
      } catch (error) {
        toast.error("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
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
      localStorage.clear();
      navigate("/");
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
    }
  };
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleShowPopup = async (student) => {
    setSelectedStudent(student);
  };
  const handleClosePopup = () => {
    setSelectedStudent(null);
  };

  const handleToggleSelectMode = () => {
    setSelectMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (student_no) => {
    setSelectedIds((prev) =>
      prev.includes(student_no)
        ? prev.filter((id) => id !== student_no)
        : [...prev, student_no]
    );
  };

  const dateTimetoExport = () => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}_${month}_${year}`;
  };

  const handleExportPDF = async () => {
    setLoadingButtonPdf(true);
    if (selectedIds.length === 0) {
      toast.warning("กรุณาเลือกข้อมูลอย่างน้อย 1 รายการ");
      return;
    }
    try {
      const response = await axios.post(
        API_BASE_URL + APIEndpoints.exportFile.exportFilePDF,
        { studentNos: selectedIds, agency: agency.agency_name },
        { responseType: "blob", withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `student_report_${dateTimetoExport()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSelectMode(false);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Export PDF ล้มเหลว");
    } finally {
      setLoadingButtonPdf(false);
    }
  };

  const handleExportExcel = async () => {
    setLoadingButtonExcel(true);
    if (selectedIds.length === 0) {
      toast.warning("กรุณาเลือกข้อมูลอย่างน้อย 1 รายการ");
      return;
    }
    try {
      const response = await axios.post(
        API_BASE_URL + APIEndpoints.exportFile.exportFileExcel,
        { studentNos: selectedIds },
        { responseType: "blob", withCredentials: true }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `student_report_${dateTimetoExport()}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      setSelectMode(false);
      setSelectedIds([]);
    } catch (err) {
      toast.error("Export Excel ล้มเหลว");
    } finally {
      setLoadingButtonExcel(false);
    }
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
              <div className={styles.agencyHeader}>
                <div className={styles.agencyIcon}>
                  <FontAwesomeIcon icon={faBuilding} />
                </div>
                <div className={styles.agencyTitle}>
                  <h3>{agency.agency_name}</h3>
                  <span
                    className={`${styles.statusBadge} ${
                      agency.status_approve === "approved"
                        ? styles.approved
                        : agency.status_approve === "pending"
                        ? styles.pending
                        : styles.rejected
                    }`}
                  >
                    {agency.status_approve === "approved"
                      ? "อนุมัติแล้ว"
                      : agency.status_approve === "pending"
                      ? "รอการอนุมัติ"
                      : "ไม่อนุมัติ"}
                  </span>
                </div>
              </div>

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className={styles.infoIcon}
                  />
                  <div className={styles.infoContent}>
                    <strong>อีเมล</strong>
                    <span>{agency.email}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon icon={faUser} className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <strong>แผนก</strong>
                    <span>{agency.department}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon icon={faPhone} className={styles.infoIcon} />
                  <div className={styles.infoContent}>
                    <strong>โทรศัพท์</strong>
                    <span>{agency.telephone_number}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon
                    icon={faUserTag}
                    className={styles.infoIcon}
                  />
                  <div className={styles.infoContent}>
                    <strong>บทบาท</strong>
                    <span>{agency.role}</span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className={styles.infoIcon}
                  />
                  <div className={styles.infoContent}>
                    <strong>ที่อยู่</strong>
                    <span>
                      {agency.address} {agency.subdistrict} {agency.district}{" "}
                      {agency.province} {agency.postal_code}
                    </span>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className={styles.infoIcon}
                  />
                  <div className={styles.infoContent}>
                    <strong>สมัครเมื่อ</strong>
                    <span>
                      {moment(agency.created_at).add(543, 'years').format("DD/MM/YYYY HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h4 className={styles.topic}>ข้อมูลของผู้สำเร็จการศึกษาที่เคยตรวจสอบ</h4>
            
            <div className={styles.searchContainer}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="ค้นหาชื่อ, นามสกุล, รหัสนักศึกษา หรือสาขาวิชา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className={styles.studentCountSummary}>
              <div className={styles.totalCount}>
                จำนวนผู้สำเร็จการศึกษาที่เคยตรวจสอบทั้งหมด: <span className={styles.countNumber}>{student?.length || 0}</span> คน
              </div>
              {searchTerm && (
                <div className={styles.filteredCount}>
                  แสดงผลลัพธ์การค้นหา: <span className={styles.countNumber}>{filteredStudents.length}</span> คน
                </div>
              )}
            </div>
            
            <div className={styles.selectedBox} style={{ marginBottom: 10 }}>
              {!selectMode ? (
                <button
                  className={styles.selectButton}
                  onClick={handleToggleSelectMode}
                >
                  <FontAwesomeIcon icon={faInfo} style={{ marginRight: 8 }} />
                  เลือกข้อมูล
                </button>
              ) : (
                <>
                  <button
                    className={styles.exportButton}
                    onClick={handleExportPDF}
                    disabled={loadingButtonPdf || selectedIds.length === 0}
                    type="button"
                    aria-busy={loadingButtonPdf}
                  >
                    {loadingButtonPdf ? (
                      <ClipLoader size={20} color="#008cba" />
                    ) : (
                      "Export PDF"
                    )}
                  </button>
                  <button
                    className={styles.exportButton}
                    onClick={handleExportExcel}
                    disabled={loadingButtonExcel || selectedIds.length === 0}
                    type="button"
                    aria-busy={loadingButtonExcel}
                  >
                    {loadingButtonExcel ? (
                      <ClipLoader size={20} color="#008cba" />
                    ) : (
                      "Export Excel"
                    )}
                  </button>
                  <button
                    className={styles.cancelButton}
                    onClick={handleToggleSelectMode}
                    style={{ marginLeft: 10 }}
                  >
                    ยกเลิก
                  </button>
                </>
              )}
            </div>
            <div className={styles.boxHistory}>
              {currentItems.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.studentTable}>
                    <thead>
                      <tr>
                        <th>
                          {!selectMode ? (
                            "#"
                          ) : (
                            <input
                              type="checkbox"
                              checked={
                                filteredStudents &&
                                selectedIds.length > 0 &&
                                selectedIds.length === filteredStudents.length
                              }
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds(
                                    filteredStudents.map((s) => s.student.student_no)
                                  );
                                } else {
                                  setSelectedIds([]);
                                }
                              }}
                            />
                          )}
                        </th>
                        <th>
                          <div
                            onClick={() => requestSort("student_no")}
                            className={styles.thSort}
                          >
                            รหัสนักศึกษา{" "}
                            <div className={styles.thArrow}>
                              <p
                                className={
                                  sortConfig.key === "student_no" &&
                                  sortConfig.direction === "asc"
                                    ? styles.activeArrow
                                    : ""
                                }
                              >
                                ▲
                              </p>
                              <p
                                className={
                                  sortConfig.key === "student_no" &&
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
                        <th>
                          <div
                            onClick={() => requestSort("name")}
                            className={styles.thSort}
                          >
                            ชื่อ{" "}
                            <div className={styles.thArrow}>
                              <p
                                className={
                                  sortConfig.key === "name" &&
                                  sortConfig.direction === "asc"
                                    ? styles.activeArrow
                                    : ""
                                }
                              >
                                ▲
                              </p>
                              <p
                                className={
                                  sortConfig.key === "name" &&
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
                        <th>
                          <div
                            onClick={() => requestSort("lname")}
                            className={styles.thSort}
                          >
                            นามสกุล{" "}
                            <div className={styles.thArrow}>
                              <p
                                className={
                                  sortConfig.key === "lname" &&
                                  sortConfig.direction === "asc"
                                    ? styles.activeArrow
                                    : ""
                                }
                              >
                                ▲
                              </p>
                              <p
                                className={
                                  sortConfig.key === "lname" &&
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
                        <th>
                          <div
                            onClick={() => requestSort("curr_name")}
                            className={styles.thSort}
                          >
                            สาขา{" "}
                            <div className={styles.thArrow}>
                              <p
                                className={
                                  sortConfig.key === "curr_name" &&
                                  sortConfig.direction === "asc"
                                    ? styles.activeArrow
                                    : ""
                                }
                              >
                                ▲
                              </p>
                              <p
                                className={
                                  sortConfig.key === "curr_name" &&
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
                        <th>
                          <div
                            onClick={() => requestSort("updated_at")}
                            className={styles.thSort}
                          >
                            วันที่เข้าชม{" "}
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
                        <th>สถานะการศึกษา</th>
                        <th>ข้อมูลเพิ่มเติม</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr key={item.student.student_no}>
                          <td>
                            {!selectMode ? (
                              index + 1
                            ) : (
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(
                                  item.student.student_no
                                )}
                                onChange={() =>
                                  handleCheckboxChange(item.student.student_no)
                                }
                              />
                            )}
                          </td>
                          <td>{item.student.student_no}</td>
                          <td>{item.student.name}</td>
                          <td>{item.student.lname}</td>
                          <td>
                            {item.student.curr_name?.match(/\((.*)\)/)?.[1] ||
                              "Unknown"}
                          </td>
                          <td>
                            {moment.utc(item.updated_at).add(543, 'years').format("DD/MM/YYYY")}
                          </td>
                          <td
                            style={{
                              color:
                                item.student.status_graduate === 1
                                  ? "green"
                                  : "red",
                            }}
                          >
                            {item.student.status_graduate === 1
                              ? "สำเร็จการศึกษาแล้ว"
                              : "ยังไม่สำเร็จการศึกษา"}
                          </td>
                          <td className={styles.TdInfo}>
                            <button
                              onClick={() => handleShowPopup(item.student)}
                              className={styles.btnInfo}
                            >
                              <FontAwesomeIcon icon={faInfo} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <p>
                    {searchTerm 
                      ? `ไม่พบข้อมูลที่ตรงกับ "${searchTerm}"` 
                      : "ยังไม่มีข้อมูลผู้สำเร็จการศึกษา"}
                  </p>
                </div>
              )}
              {sortedStudents.length > 0 && (
                <Pagination
                  pageCount={pageCount}
                  onPageChange={handlePageClick}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={setItemsPerPage}
                  setCurrentPage={setCurrentPage}
                />
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
        <ToastContainer />
      </LayoutAllPage>
    </>
  );
}

export default Homepages;
