import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Icon from "../../../assets/homepage.png";
import LayoutAllPage from "../../../components/LayoutAllPage/LayoutAllPage";
import PopupStudent from "../../../components/PopupStudent/PopupStudent";
import Loading from "../../../components/Loading/Loading";
import Pagination from "../../../components/Pagination/Pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
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
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();
  const sortedStudents = React.useMemo(() => {
    if (!student) return [];
    const sortableItems = [...student];

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
  }, [student, sortConfig]);

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
  const pageCount = student ? Math.ceil(student.length / itemsPerPage) : 0;

  useEffect(() => {
    console.log(sortConfig);
  }, [sortConfig]);

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
          setStudent(response.data.data);
          console.log(response.data.data);
        } catch (err) {
          setStudent(null);
        }

        setLoading(false);
      } catch (error) {
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
      alert("เกิดข้อผิดพลาดในการออกจากระบบ");
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
    if (selectedIds.length === 0) {
      toast.warning("กรุณาเลือกข้อมูลอย่างน้อย 1 รายการ");
      return;
    }
    try {
      const response = await axios.post(
        API_BASE_URL + APIEndpoints.exportFile.exportFilePDF,
        { studentNos: selectedIds },
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
    }
  };

  const handleExportExcel = async () => {
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
              <p>Email: {agency.email}</p>
              <p>Department: {agency.department}</p>
              <p>Role: {agency.role}</p>
            </div>
            <h4 className={styles.topic}>ข้อมูลของนักศึกษาที่เคยตรวจสอบ</h4>
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
                    disabled={selectedIds.length === 0}
                  >
                    Export PDF
                  </button>
                  <button
                    className={styles.exportButton}
                    onClick={handleExportExcel}
                    disabled={selectedIds.length === 0}
                  >
                    Export Excel
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
              {student && (
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
                              student &&
                              selectedIds.length > 0 &&
                              selectedIds.length === student.length
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds(
                                  student.map((s) => s.student.student_no)
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
                          {moment.utc(item.updated_at).format("DD/MM") +
                            "/" +
                            (moment.utc(item.updated_at).year() + 543)
                              .toString()
                              .slice(-2)}
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
              )}
              <Pagination
                pageCount={pageCount}
                onPageChange={handlePageClick}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                setCurrentPage={setCurrentPage}
              />
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
