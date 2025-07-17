import React, { useEffect, useState } from "react";
import styles from "./AccessStatistics.module.css";
import Loading from "../../components/Loading/Loading.jsx";
import axios from "axios";
import { APIEndpoints, API_BASE_URL } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  defaults,
  Filler,
} from "chart.js";

import LineChart from "./LineChart.jsx";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";
import { use } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.plugins = defaults.plugins || {};
defaults.plugins.title = defaults.plugins.title || {};
defaults.plugins.title.font = {
  family: "'Prompt', sans-serif",
  size: 16,
  weight: "normal",
};

const AccessStatistics = ({ officer, agency }) => {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueStudents, setUniqueStudents] = useState(0);
  const [topAgencies, setTopAgencies] = useState([]);
  const [selectedAgencyId, setSelectedAgencyId] = useState("");
  const [agencyDropdown, setAgencyDropdown] = useState([]);
  const [topFaculties, setTopFaculties] = useState([]);
  const [topDepartments, setTopDepartments] = useState([]);
  const [facultiesList, setFacultiesList] = useState([]);
  const [viewedStudents, setViewedStudents] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedView, setSelectedView] = useState("faculty");
  const [loadingTopAgencies, setLoadingTopAgencies] = useState(false);
  const [loadingTopDepartments, setLoadingTopDepartments] = useState(false);
  const [tempStartDate, setTempStartDate] = useState("");
  const [tempEndDate, setTempEndDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedFacultyCodeName, setSelectedFacultyCodeName] = useState("");
  const [selectedFacultyDisplayName, setSelectedFacultyDisplayName] =
    useState("");
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedAgencyName =
    agencyDropdown.find((a) => a.id.toString() === selectedAgencyId)
      ?.agency_name || "ทั้งหมด";
  const backgroundColor = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
  ];
  const borderColor = [
    "rgba(255, 99, 132, 1)",
    "rgba(54, 162, 235, 1)",
    "rgba(255, 206, 86, 1)",
    "rgba(75, 192, 192, 1)",
    "rgba(153, 102, 255, 1)",
  ];
  const facultyCodeMap = {
    103: "คณะระบบรางและการขนส่ง",
    104: "คณะนวัตกรรมและเทคโนโลยีการเกษตร",
    15: "คณะบริหารธุรกิจ",
    16: "คณะวิทยาศาสตร์และศิลปศาสตร์",
    17: "คณะวิศวกรรมศาสตร์และเทคโนโลยี",
    18: "คณะสถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์",
    19: "สถาบันสหสรรพศาสตร์",
  };
  const displayNameToCodeNameMap = {
    คณะระบบรางและการขนส่ง: "ระบบรางและการขนส่งบัณฑิต",
    คณะนวัตกรรมและเทคโนโลยีการเกษตร: "นวัตกรรมและเทคโนโลยีการเกษตรบัณฑิต",
    คณะบริหารธุรกิจ: "บริหารธุรกิจบัณฑิต",
    คณะวิทยาศาสตร์และศิลปศาสตร์: "วิทยาศาสตร์และศิลปศาสตร์บัณฑิต",
    คณะวิศวกรรมศาสตร์และเทคโนโลยี: "วิศวกรรมศาสตรบัณฑิต",
    คณะสถาปัตยกรรมศาสตร์และศิลปกรรมสร้างสรรค์: "สถาปัตยกรรมศาสตรบัณฑิต",
    สถาบันสหสรรพศาสตร์: "สหสรรพศาสตร์บัณฑิต",
  };

  const mappedFaculties = [
    ...new Map(
      facultiesList.map((item) => {
        const code2digit = Math.floor(item.code / 100);
        const displayName = facultyCodeMap[code2digit];
        return [code2digit, { faculty: displayName, displayName }];
      })
    ).values(),
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statisticsRes,
          agenciesRes,
          facultiesRes,
          trendRes,
          facultiesListRes,
          allAgencyForDropdownRes,
        ] = await Promise.all([
          axios.get(API_BASE_URL + APIEndpoints.pageview.statistics),
          axios.get(API_BASE_URL + APIEndpoints.pageview.topAgency),
          axios.get(API_BASE_URL + APIEndpoints.pageview.topFaculty),
          axios.get(API_BASE_URL + APIEndpoints.pageview.trend),
          axios.get(API_BASE_URL + APIEndpoints.pageview.allFaculties),
          axios.get(API_BASE_URL + APIEndpoints.agency.allAgencyForDropdown),
        ]);

        setAgencyDropdown(allAgencyForDropdownRes.data.data);
        setTotalViews(statisticsRes.data.totalViews);
        setUniqueStudents(statisticsRes.data.uniqueStudents);
        setTopAgencies(Array.isArray(agenciesRes.data) ? agenciesRes.data : []);
        setTopFaculties(
          Array.isArray(facultiesRes.data) ? facultiesRes.data : []
        );
        setTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
        setFacultiesList(facultiesListRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!agency) return;
    console.log("agency id in AccessStatistics:", agency);
    const fetchData = async () => {
      try {
        const query = `startDate=${startDate}&endDate=${endDate}`;
        const constAgencyRes = await axios.get(
          `${API_BASE_URL}${APIEndpoints.pageview.countAgencyViews(
            agency
          )}?${query}`
        );
        const agencyData = constAgencyRes.data[0];
        setViewedStudents(Number(agencyData?.count || 0));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [agency]);

  useEffect(() => {
    if (selectedFacultyCodeName) {
      axios
        .get(
          `${
            API_BASE_URL + APIEndpoints.pageview.departmentsByFaculty
          }?faculty=${encodeURIComponent(selectedFacultyCodeName)}`
        )
        .then((res) => {
          setDepartmentsList(res.data);
        })
        .catch((err) => console.error(err));
    } else {
      setDepartmentsList([]);
      setSelectedDepartment("");
    }
  }, [selectedFacultyCodeName]);

  useEffect(() => {
    const fetchTopDepartments = async () => {
      try {
        let url = "";
        const query = `startDate=${startDate}&endDate=${endDate}${
          selectedAgencyId ? `&agencyId=${selectedAgencyId}` : ""
        }`;
        if (selectedView === "faculty") {
          url = `${API_BASE_URL}${APIEndpoints.pageview.topFaculty}?${query}`;
        } else if (selectedView === "department") {
          url = `${API_BASE_URL}${APIEndpoints.pageview.topDepartment}?${query}`;
        }

        setLoadingTopDepartments(true);
        const res = await axios.get(url);
        console.log("res.data:", res.data);
        console.log("selectedView:", selectedView);
        if (selectedView === "faculty") {
          setTopFaculties(Array.isArray(res.data) ? res.data : []);
        } else if (selectedView === "department") {
          setTopDepartments(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching top departments:", err);
      } finally {
        setLoadingTopDepartments(false);
      }
    };

    fetchTopDepartments();
  }, [selectedView, startDate, endDate, selectedAgencyId]);

  useEffect(() => {
    const fetchTopAgencies = async () => {
      try {
        let url = "";
        const query = `startDate=${startDate}&endDate=${endDate}`;
        if (selectedDepartment) {
          url = `${API_BASE_URL}${
            APIEndpoints.pageview.topAgenciesByDepartment
          }?department=${encodeURIComponent(
            selectedDepartment
          )}&limit=5&${query}`;
        } else if (selectedFacultyDisplayName) {
          url = `${API_BASE_URL}${
            APIEndpoints.pageview.topAgenciesByFaculty
          }?faculty=${encodeURIComponent(
            selectedFacultyDisplayName
          )}&limit=5&${query}`;
        } else {
          url = `${API_BASE_URL}${APIEndpoints.pageview.topAgency}?${query}`;
        }

        setLoadingTopAgencies(true);
        const res = await axios.get(url);
        const data = Array.isArray(res.data.data) ? res.data.data : res.data;

        setTopAgencies(data);
      } catch (err) {
        console.error("Error fetching top agencies:", err);
      } finally {
        setLoadingTopAgencies(false);
      }
    };

    fetchTopAgencies();
  }, [selectedFacultyDisplayName, selectedDepartment]);

  const handleApplyDateFilter = async () => {
    try {
      setLoading(true);
      const query = `startDate=${startDate}&endDate=${endDate}`;

      const [statisticsRes, agenciesRes, facultiesRes, trendRes] =
        await Promise.all([
          axios.get(
            `${API_BASE_URL}${APIEndpoints.pageview.statistics}?${query}`
          ),
          axios.get(
            `${API_BASE_URL}${APIEndpoints.pageview.topAgency}?${query}`
          ),
          axios.get(
            `${API_BASE_URL}${APIEndpoints.pageview.topFaculty}?${query}`
          ),
          axios.get(`${API_BASE_URL}${APIEndpoints.pageview.trend}?${query}`),
        ]);

      setTotalViews(statisticsRes.data.totalViews);
      setUniqueStudents(statisticsRes.data.uniqueStudents);
      setTopAgencies(Array.isArray(agenciesRes.data) ? agenciesRes.data : []);
      setTopFaculties(
        Array.isArray(facultiesRes.data) ? facultiesRes.data : []
      );
      setTrend(Array.isArray(trendRes.data) ? trendRes.data : []);
    } catch (error) {
      console.error("Error applying date filter:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (startDate === "" && endDate === "") {
      handleApplyDateFilter();
    } else if (startDate && endDate) {
      handleApplyDateFilter();
    }
  }, [startDate, endDate]);

  const barChartData = {
    labels: topAgencies.map((item) =>
      item.agency_name.length > 12
        ? item.agency_name.substring(0, 12) + "..."
        : item.agency_name
    ),
    datasets: [
      {
        label: "จำนวนการเข้าดู",
        data: topAgencies.map((item) => item.count),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const getBarChartTitle = () => {
    if (selectedDepartment)
      return `Top 5 หน่วยงานที่มีการเข้าดูมากที่สุด (${selectedDepartment})`;
    if (selectedFacultyDisplayName)
      return `Top 5 หน่วยงานที่มีการเข้าดูมากที่สุด (${selectedFacultyDisplayName})`;
    return "Top 5 หน่วยงานที่มีการเข้าดูมากที่สุด (ทั้งหมด)";
  };
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            const fullLabel = topAgencies[index].agency_name;
            return `${fullLabel}: ${value}`;
          },
        },
      },
      title: {
        display: true,
        text: getBarChartTitle(),
        color: "#333",
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  const fullLabels =
    selectedView === "faculty"
      ? topFaculties.map((item) => item.faculty)
      : topDepartments.map((item) => item.department);
  const shortenedLabels = fullLabels.map((label) =>
    label.length > 12 ? label.substring(0, 12) + "..." : label
  );
  const pieChartData = {
    labels: shortenedLabels,
    datasets: [
      {
        label: "จำนวนการเข้าดู",
        data:
          selectedView === "faculty"
            ? topFaculties.map((item) => item.count)
            : topDepartments.map((item) => item.count),
        backgroundColor: backgroundColor,
        borderColor: borderColor,
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const value = context.dataset.data[index];
            const fullLabel = fullLabels[index]; 
            return `${fullLabel}: ${value}`;
          },
        },
      },
      title: {
        display: true,
        text:
          selectedView === "faculty"
            ? `Top 5 คณะที่มีการเข้าดูมากที่สุด (${selectedAgencyName})`
            : `Top 5 สาขาที่มีการเข้าดูมากที่สุด (${selectedAgencyName})`,
        color: "#333",
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  const lineChartData = {
    labels: trend.map((item) => item.date.slice(0, 10)),
    datasets: [
      {
        label: "จำนวนการเข้าดูทั้งหมด",
        data: trend.map((item) => item.totalViews),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "นักศึกษาที่เข้าดูไม่ซ้ำ",
        data: trend.map((item) => item.uniqueStudents),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "แนวโน้มการเข้าดูรายวัน",
        color: "#333",
        padding: { top: 10, bottom: 20 },
      },
      legend: {
        position: "top",
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return loading ? (
    <Loading />
  ) : (
    <div className={styles.containerStatistics}>
      <div className={styles.leftBoxState}>
        {officer && (
          <div className={styles.filter}>
            <div className={styles.filterDate}>
              <label>
                จากวันที่:
                <input
                  type="date"
                  value={tempStartDate}
                  onChange={(e) => setTempStartDate(e.target.value)}
                />
              </label>
              <label>
                ถึงวันที่:
                <input
                  type="date"
                  value={tempEndDate}
                  onChange={(e) => setTempEndDate(e.target.value)}
                />
              </label>
              <button
                onClick={() => {
                  setStartDate(tempStartDate);
                  setEndDate(tempEndDate);
                  handleApplyDateFilter();
                }}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </div>
            <button
              className={styles.resetButton}
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setSelectedFaculty("");
                setSelectedDepartment("");
                setSelectedView("faculty");
                setSelectedAgencyId("");
                setStartDate("");
                setEndDate("");
                setTempStartDate("");
                setTempEndDate("");
                handleApplyDateFilter();
              }}
            >
              {" "}
              ล้างการค้นหา{" "}
            </button>
          </div>
        )}
        <div className={styles.boxState}>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>จำนวนการเข้าดูทั้งหมด</p>
            <h2 className={styles.numberTotalPageView}>
              {totalViews.toLocaleString()}
            </h2>
          </div>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>
              {agency ? "จำนวนนักศึกษาที่คุณเข้าชม" : "นักศึกษาที่ถูกเข้าชม"}
            </p>
            <h2 className={styles.numberTotalPageView}>
              {agency
                ? viewedStudents.toLocaleString()
                : uniqueStudents.toLocaleString()}
            </h2>
          </div>
        </div>
        <div className={styles.graphBoxState}>
          <LineChart data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className={styles.rightBoxState}>
        <div className={styles.filterContainer}>
          <select
            value={selectedFacultyDisplayName}
            onChange={(e) => {
              const selectedDisplay = e.target.value;
              const actualCode =
                displayNameToCodeNameMap[selectedDisplay] || "";
              setSelectedFacultyDisplayName(selectedDisplay);
              setSelectedFacultyCodeName(actualCode);
              setSelectedDepartment("");
            }}
          >
            <option value="">-- เลือกคณะ --</option>
            {Object.keys(displayNameToCodeNameMap).map((display) => (
              <option key={display} value={display}>
                {display}
              </option>
            ))}
          </select>

          {officer && (
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={!selectedFacultyDisplayName}
            >
              <option value="">-- เลือกสาขา --</option>
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.topAgencyView}>
          {loadingTopAgencies && <div className={styles.loadingBox}></div>}
          {!loadingTopAgencies && topAgencies.length > 0 ? (
            <BarChart data={barChartData} options={barChartOptions} />
          ) : (
            <div className={styles.noData}>
              <p>ไม่พบข้อมูล</p>
            </div>
          )}
        </div>
        <div className={styles.filterContainer}>
          <label>
            <input
              type="radio"
              name="viewSelector"
              value="faculty"
              checked={selectedView === "faculty"}
              onChange={() => setSelectedView("faculty")}
            />
            <span>ดูตามคณะ</span>
          </label>
          <label>
            <input
              type="radio"
              name="viewSelector"
              value="department"
              checked={selectedView === "department"}
              onChange={() => setSelectedView("department")}
            />
            <span>ดูตามสาขา</span>
          </label>
          {officer && (
            <select
              value={selectedAgencyId}
              onChange={(e) => setSelectedAgencyId(e.target.value)}
            >
              <option value="">-- เลือกหน่วยงาน --</option>
              {agencyDropdown.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.agency_name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className={styles.topFacultyView}>
          {(selectedView === "faculty" && topFaculties.length > 0) ||
          (selectedView === "department" && topDepartments.length > 0) ? (
            <PieChart data={pieChartData} options={pieChartOptions} />
          ) : (
            <div className={styles.noData}>
              <p>ไม่พบข้อมูล</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessStatistics;
