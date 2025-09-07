import React, { useEffect, useState, useMemo } from "react";
import styles from "./AccessStatistics.module.css";
import Loading from "../../components/Loading/Loading.jsx";
import axios from "axios";
import { APIEndpoints, API_BASE_URL } from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandsAmericanSignLanguageInterpreting,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
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
  ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import LineChart from "./LineChart.jsx";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";
import html2canvas from "html2canvas";
import Popup from "../../components/Popup/Popup.jsx";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import pdfMake from "../../public/pdfFonts.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title,
  Filler,
  ArcElement,
  ChartDataLabels
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
  const [viewedStudents, setViewedStudents] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
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
  const [selectedTopType, setSelectedTopType] = useState(false);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popUpExport, setPopUpExport] = useState(false);

  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [exportFaculty, setExportFaculty] = useState("");
  const [exportDepartment, setExportDepartment] = useState("");
  const [exportAgencyId, setExportAgencyId] = useState("");

  const [exportTopType, setExportTopType] = useState(false);
  const [exportPDF, setExportPDF] = useState(false);
  const [exportExcel, setExportExcel] = useState(false);
  const [exportBar, setExportBar] = useState(false);
  const [exportPie, setExportPie] = useState(false);
  const [exportTopFaculty, setExportTopFaculty] = useState(false);
  const [exportTopDepartment, setExportTopDepartment] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const getChartBase64ById = async (id) => {
    const element = document.getElementById(id);
    if (!element) return null;
    const canvas = await html2canvas(element);
    return canvas.toDataURL("image/png");
  };
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          statisticsRes,
          agenciesRes,
          facultiesRes,
          trendRes,
          allAgencyForDropdownRes,
        ] = await Promise.all([
          axios.get(API_BASE_URL + APIEndpoints.pageview.statistics),
          axios.get(API_BASE_URL + APIEndpoints.pageview.topAgency),
          axios.get(API_BASE_URL + APIEndpoints.pageview.topFaculty),
          axios.get(API_BASE_URL + APIEndpoints.pageview.trend),
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
    if (selectedTopType) {
      setSelectedFacultyDisplayName("");
      setSelectedDepartment("");
    }
  }, [selectedTopType]);

  useEffect(() => {
    const fetchTopAgencies = async () => {
      try {
        let url = "";
        const query = `startDate=${startDate}&endDate=${endDate}`;
        if (selectedTopType) {
          url = `${API_BASE_URL}${APIEndpoints.pageview.topAgenciesByType}?${query}`;
        } else if (selectedDepartment) {
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
  }, [
    selectedFacultyDisplayName,
    selectedDepartment,
    selectedTopType,
    startDate,
    endDate,
  ]);

  const handleApplyDateFilter = async () => {
    try {
      setLoading(true);
      const query = `startDate=${startDate}&endDate=${endDate}`;

      const [statisticsRes, trendRes] = await Promise.all([
        axios.get(
          `${API_BASE_URL}${APIEndpoints.pageview.statistics}?${query}`
        ),
        axios.get(`${API_BASE_URL}${APIEndpoints.pageview.trend}?${query}`),
      ]);

      setTotalViews(statisticsRes.data.totalViews);
      setUniqueStudents(statisticsRes.data.uniqueStudents);
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

  const resetExportState = () => {
    setStartDate("");
    setEndDate("");
    setSelectedDepartment("");
    setSelectedView("faculty");
    setSelectedAgencyId("");
    setTempStartDate("");
    setTempEndDate("");
    setSelectedFacultyDisplayName("");
    setSelectedFacultyCodeName("");
    handleApplyDateFilter();
    setExportStartDate("");
    setExportEndDate("");
    setExportFaculty("");
    setExportDepartment("");
    setExportAgencyId("");
    setSelectedTopType(false);
    setExportPDF(false);
    setExportExcel(false);
    setExportBar(false);
    setExportPie(false);
    setExportTopFaculty(false);
    setExportTopDepartment(false);
  };
  const prepareAndExport = async () => {
    if (exportStartDate) setStartDate(exportStartDate);
    if (exportEndDate) setEndDate(exportEndDate);
    if (exportFaculty) {
      const code = displayNameToCodeNameMap[exportFaculty];
      setSelectedFacultyDisplayName(exportFaculty);
      setSelectedFacultyCodeName(code);
    }
    if (exportDepartment) setSelectedDepartment(exportDepartment);
    if (exportAgencyId) setSelectedAgencyId(exportAgencyId);

    if (exportTopFaculty) setSelectedView("faculty");
    else if (exportTopDepartment) setSelectedView("department");
    await new Promise((res) => setTimeout(res, 1000));

    await handleExport();
  };
  const handleExport = async () => {
    try {
      setExportLoading(true);

      const query = `startDate=${exportStartDate}&endDate=${exportEndDate}`;

      let exportTables = [];

      if (!exportFaculty && !exportDepartment && !exportTopType) {
        const res = await axios.get(
          `${API_BASE_URL}${APIEndpoints.pageview.topAgency}?${query}`
        );
        const list = Array.isArray(res.data.data) ? res.data.data : res.data;
        exportTables.push({
          title: `5 อันดับหน่วยงานที่มีการตรวสอบคุณวุฒิมากที่สุด (ทั้งหมด)`,
          rows: list.map((item, index) => [
            index + 1,
            item.agency_name,
            item.count,
          ]),
        });
      }

      if (exportFaculty) {
        const res = await axios.get(
          `${API_BASE_URL}${
            APIEndpoints.pageview.topAgenciesByFaculty
          }?faculty=${encodeURIComponent(selectedFacultyDisplayName)}&${query}`
        );
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        exportTables.push({
          title: `5 อันดับหน่วยงานที่มีการตรวสอบคุณวุฒิมากที่สุด (${exportFaculty})`,
          rows: list.map((item, index) => [
            index + 1,
            item.agency_name,
            item.count,
          ]),
        });
      }

      if (exportDepartment) {
        const res = await axios.get(
          `${API_BASE_URL}${
            APIEndpoints.pageview.topAgenciesByDepartment
          }?department=${encodeURIComponent(selectedDepartment)}&${query}`
        );
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        exportTables.push({
          title: `5 อันดับหน่วยงานที่มีการตรวสอบคุณวุฒิมากที่สุด (${exportDepartment})`,
          rows: list.map((item, index) => [
            index + 1,
            item.agency_name,
            item.count,
          ]),
        });
      }

      if (exportTopType) {
        const res = await axios.get(
          `${API_BASE_URL}${APIEndpoints.pageview.topAgenciesByType}?${query}`
        );
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.data)
          ? res.data.data
          : [];
        exportTables.push({
          title: `5 อันดับประเภทหน่วยงานที่มีการตรวจสอบคุณวุฒิมากที่สุด`,
          rows: list.map((item, index) => [
            index + 1,
            item.type_name,
            item.count,
          ]),
        });
      }

      if (exportTopFaculty) {
        const res = await axios.get(
          `${API_BASE_URL}${APIEndpoints.pageview.topFaculty}?${query}` +
            (exportAgencyId ? `&agencyId=${exportAgencyId}` : "")
        );
        const list = Array.isArray(res.data) ? res.data : [];
        exportTables.push({
          title: `5 อันดับคณะที่มีการตรวสอบคุณวุฒิมากที่สุด (${
            exportAgencyId ? `${selectedAgencyName}` : "ทั้งหมด"
          })`,
          rows: list.map((item, index) => [
            index + 1,
            item.faculty,
            item.count,
          ]),
        });
      }

      if (exportTopDepartment) {
        const res = await axios.get(
          `${API_BASE_URL}${APIEndpoints.pageview.topDepartment}?${query}` +
            (exportAgencyId ? `&agencyId=${exportAgencyId}` : "")
        );
        const list = Array.isArray(res.data) ? res.data : [];
        exportTables.push({
          title: `5 อันดับสาขาที่มีการตรวสอบคุณวุฒิมากที่สุด (${
            exportAgencyId ? `${selectedAgencyName}` : "ทั้งหมด"
          })`,
          rows: list.map((item, index) => [
            index + 1,
            item.department,
            item.count,
          ]),
        });
      }

      if (exportExcel) {
        const wb = XLSX.utils.book_new();
        const sheetCount = {};

        exportTables.forEach((table) => {
          let shortSheetName = "สถิติ";

          if (table.title.includes("หน่วยงาน")) {
            shortSheetName = "5 อันดับหน่วยงานที่ตรวจสอบ";
          } else if (table.title.includes("คณะที่")) {
            shortSheetName = "5 อันดับคณะที่มีการตรวจสอบ";
          } else if (table.title.includes("สาขาที่")) {
            shortSheetName = "5 อันดับสาขาที่มีการตรวจสอบ";
          } else if (table.title.includes("ประเภท")) {
            shortSheetName = "5 อันดับประเภทหน่วยงานที่มีการตรวจสอบ";
          }
          if (!sheetCount[shortSheetName]) sheetCount[shortSheetName] = 1;
          else sheetCount[shortSheetName] += 1;

          const finalSheetName =
            sheetCount[shortSheetName] === 1
              ? shortSheetName
              : `${shortSheetName} (${sheetCount[shortSheetName]})`;

          const sheetData = [
            [table.title],
            [],
            ["ลำดับ", "ชื่อ", "จำนวนการตรวจสอบคุณวุฒิ"],
            ...table.rows.map((r) => [r[0], r[1], r[2]]),
          ];

          const ws = XLSX.utils.aoa_to_sheet(sheetData);

          const range = XLSX.utils.decode_range(ws["!ref"]);
          for (let R = range.s.r; R <= range.e.r; ++R) {
            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
              if (!ws[cell_address]) continue;
              if (!ws[cell_address].s) ws[cell_address].s = {};
              ws[cell_address].s.border = {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              };
            }
          }

          XLSX.utils.book_append_sheet(wb, ws, finalSheetName);
        });

        const excelBuffer = XLSX.write(wb, {
          bookType: "xlsx",
          type: "array",
          cellStyles: true,
        });
        const blob = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        saveAs(blob, "access_statistics.xlsx");
      }

      if (exportPDF) {
        let content = [
          {
            text:
              exportStartDate && exportEndDate
                ? `ช่วงวันที่: ${exportStartDate} ถึง ${exportEndDate}`
                : "ช่วงวันที่: ทุกช่วงเวลา",
            alignment: "right",
            margin: [0, 0, 0, 10],
          },
          { text: "รายงานสถิติการตรวจสอบคุณวุฒิ", style: "header" },
          {
            canvas: [
              { type: "line", x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 },
            ],
            margin: [0, 0, 0, 10],
          },
        ];

        for (const section of exportTables) {
          content.push(
            {
              text: section.title,
              style: "headerTable",
              margin: [0, 10, 0, 5],
            },
            {
              layout: "customLayout",
              table: {
                headerRows: 1,
                widths: [50, 344, 100],
                body: [
                  [
                    { text: "ลำดับ", style: "tableHeader" },
                    { text: "ชื่อ", style: "tableHeader" },
                    { text: "จำนวนการตรวจสอบคุณวุฒิ", style: "tableHeader" },
                  ],
                  ...section.rows.map((r) => [
                    {
                      text: r[0].toString(),
                      style: "tableCell",
                      alignment: "center",
                    },
                    { text: r[1], style: "tableCell" },
                    {
                      text: r[2].toLocaleString(),
                      style: "tableCell",
                      alignment: "right",
                    },
                  ]),
                ],
              },
            }
          );
        }
        if (!exportBar && !exportPie) {
          content.push({
            text: `วันที่ส่งออกรายงาน: ${new Date().toLocaleDateString(
              "th-TH"
            )}`,
            alignment: "right",
            margin: [0, 20, 0, 0],
            fontSize: 10,
            color: "#666666",
          });
        }
        if (exportBar || exportPie) {
          content.push({ text: "", pageBreak: "before" });
        }
        if (exportBar) {
          const barChartBase64 = await getChartBase64ById("barChartContainer");
          if (barChartBase64) {
            content.push({
              text: "กราฟแท่ง (Bar Chart)",
              style: "headerTable",
            });
            content.push({ image: barChartBase64, fit: [500, 1500] });
          }
        }

        if (exportPie) {
          const pieChartBase64 = await getChartBase64ById("pieChartContainer");
          if (pieChartBase64) {
            content.push({
              text: "กราฟวงกลม (Pie Chart)",
              style: "headerTable",
              margin: [0, 10, 0, 10],
            });
            content.push({ image: pieChartBase64, fit: [500, 1500] });
          }
        }
        if (exportBar || exportPie) {
          content.push({
            text: `วันที่ส่งออกรายงาน: ${new Date().toLocaleDateString(
              "th-TH"
            )}`,
            alignment: "right",
            margin: [0, 20, 0, 0],
            fontSize: 10,
            color: "#666666",
          });
        }

        const docDefinition = {
          content,
          defaultStyle: {
            font: "THSarabun",
            fontSize: 12,
            lineHeight: 1,
          },
          styles: {
            header: {
              fontSize: 14,
              bold: true,
              alignment: "center",
              margin: [0, 0, 0, 10],
            },
            headerTable: {
              fontSize: 12,
              bold: true,
              alignment: "center",
              margin: [0, 0, 0, 10],
            },
            tableHeader: {
              bold: true,
              fontSize: 12,
              fillColor: "#d9edf7",
              alignment: "center",
            },
            tableCell: {
              fontSize: 10,
              margin: [0, 2, 0, 2],
            },
          },
          tableLayouts: {
            customLayout: {
              hLineWidth: () => 0.5,
              vLineWidth: () => 0.5,
              hLineColor: () => "#ccc",
              vLineColor: () => "#ccc",
              paddingLeft: () => 6,
              paddingRight: () => 6,
              paddingTop: () => 4,
              paddingBottom: () => 4,
            },
          },
        };

        const pdfName =
          exportStartDate && exportEndDate
            ? `access_statistics_${exportStartDate}_to_${exportEndDate}.pdf`
            : `access_statistics_all.pdf`;
        pdfMake.createPdf(docDefinition).download(pdfName);
      }

      toast.success("ส่งออกข้อมูลสำเร็จ");
      setPopUpExport(false);
      resetExportState();
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("เกิดข้อผิดพลาดในการส่งออกข้อมูล");
    } finally {
      setExportLoading(false);
    }
  };
  useEffect(() => {
    if (exportFaculty) {
      const facultyCode = displayNameToCodeNameMap[exportFaculty];
      if (facultyCode) {
        axios
          .get(
            `${
              API_BASE_URL + APIEndpoints.pageview.departmentsByFaculty
            }?faculty=${encodeURIComponent(facultyCode)}`
          )
          .then((res) => {
            setDepartmentsList(res.data);
          })
          .catch((err) => console.error("Export faculty load error:", err));
      }
    } else {
      setDepartmentsList([]);
      setExportDepartment("");
    }
  }, [exportFaculty]);

  // preload เข้า popup
  useEffect(() => {
    if (popUpExport) {
      setExportFaculty(selectedFacultyDisplayName);
      setExportDepartment(selectedDepartment);
      setExportAgencyId(selectedAgencyId);
      setExportStartDate(startDate);
      setExportEndDate(endDate);
      setExportTopDepartment(selectedView === "department");
      setExportTopFaculty(selectedView === "faculty");
    }
  }, [popUpExport]);

  const barChartData = useMemo(() => {
    const nameOf = (item) =>
      selectedTopType ? item?.type_name ?? "" : item?.agency_name ?? "";

    return {
      labels: topAgencies.map((item) => {
        const name = nameOf(item);
        return name.length > 12 ? name.slice(0, 12) + "..." : name;
      }),
      datasets: [
        {
          label: "จำนวนการตรวจสอบคุณวุฒิ",
          data: topAgencies.map((item) => Number(item?.count ?? 0)),
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
          borderRadius: 5,
        },
      ],
    };
  }, [topAgencies, backgroundColor, borderColor, selectedTopType]);

  const barChartOptions = useMemo(() => {
    const nameOf = (item) =>
      selectedTopType ? item?.type_name ?? "" : item?.agency_name ?? "";

    const getBarChartTitle = () => {
      if (selectedTopType)
        return "Top 5 ประเภทหน่วยงานที่มีการตรวจสอบคุณวุฒิมากที่สุด";
      if (selectedDepartment)
        return `Top 5 หน่วยงานที่มีการตรวจสอบคุณวุฒิมากที่สุด (${selectedDepartment})`;
      if (selectedFacultyDisplayName)
        return `Top 5 หน่วยงานที่มีการตรวจสอบคุณวุฒิมากที่สุด (${selectedFacultyDisplayName})`;
      return "Top 5 หน่วยงานที่มีการตรวจสอบคุณวุฒิมากที่สุด (ทั้งหมด)";
    };

    return {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const fullLabel = nameOf(topAgencies[index] || {});
              const value = context.dataset.data[index];
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
        datalabels: { display: exportBar },
      },
      scales: { y: { beginAtZero: true } },
    };
  }, [
    selectedTopType,
    selectedDepartment,
    selectedFacultyDisplayName,
    topAgencies,
    exportBar,
  ]);

  const pieChartData = useMemo(() => {
    const fullLabels =
      selectedView === "faculty"
        ? topFaculties.map((item) => item.faculty)
        : topDepartments.map((item) => item.department);
    const shortenedLabels = fullLabels.map((label) =>
      label.length > 12 ? label.substring(0, 12) + "..." : label
    );
    return {
      labels: shortenedLabels,
      datasets: [
        {
          label: "จำนวนการตรวจสอบคุณวุฒิ",
          data:
            selectedView === "faculty"
              ? topFaculties.map((item) => item.count)
              : topDepartments.map((item) => item.count),
          backgroundColor: backgroundColor,
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  }, [
    selectedView,
    topFaculties,
    topDepartments,
    backgroundColor,
    borderColor,
  ]);

  const pieChartOptions = useMemo(() => {
    const fullLabels =
      selectedView === "faculty"
        ? topFaculties.map((item) => item.faculty)
        : topDepartments.map((item) => item.department);
    return {
      responsive: true,
      plugins: {
        legend: { display: true, position: "top" },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context) {
              const index = context.dataIndex;
              const value = context.dataset.data[index];
              const fullLabel = fullLabels?.[index] ?? "";
              return `${fullLabel}: ${value}`;
            },
          },
        },
        title: {
          display: true,
          text:
            selectedView === "faculty"
              ? `Top 5 คณะที่มีการตรวจสอบคุณวุฒิมากที่สุด (${selectedAgencyName})`
              : `Top 5 สาขาที่มีการตรวจสอบคุณวุฒิมากที่สุด (${selectedAgencyName})`,
          color: "#333",
          padding: { top: 10, bottom: 6 },
        },
        datalabels: {
          color: "rgba(90, 90, 90, 1)",
          font: {
            weight: "bold",
            size: 12,
          },
          formatter: (value, context) => {
            const data = context.chart.data.datasets[0].data;
            const total = data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return exportPie ? `${value} (${percentage}%)` : `${percentage}%`;
          },
        },
      },
    };
  }, [
    selectedView,
    selectedAgencyName,
    topFaculties,
    topDepartments,
    exportPie,
  ]);

  const lineChartData = useMemo(() => {
    return {
      labels: trend.map((item) => item.date.slice(0, 10)),
      datasets: [
        {
          label: "จำนวนการตรวจสอบคุณวุฒิทั้งหมด",
          data: trend.map((item) => item.totalViews),
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "ผู้สำเร็จการศึกษาที่ถูกตรวจสอบคุณวุฒิไม่ซ้ำ",
          data: trend.map((item) => item.uniqueStudents),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [trend]);

  const lineChartOptions = useMemo(() => {
    return {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "แนวโน้มการตรวจสอบคุณวุฒิรายวัน",
          color: "#333",
          padding: { top: 10, bottom: 20 },
        },
        legend: {
          position: "top",
        },
        datalabels: {
          display: false,
        },
      },
      scales: {
        y: { beginAtZero: true },
      },
    };
  }, []);

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
                setSelectedTopType(false);
                setSelectedDepartment("");
                setSelectedView("faculty");
                setSelectedAgencyId("");
                setStartDate("");
                setEndDate("");
                setTempStartDate("");
                setTempEndDate("");
                setSelectedFacultyDisplayName("");
                setSelectedFacultyCodeName("");
                handleApplyDateFilter();
              }}
            >
              {" "}
              ล้างการค้นหา{" "}
            </button>
            <button
              className={styles.exportButton}
              variant="outline"
              onClick={() => setPopUpExport(true)}
            >
              ส่งออกข้อมูล
            </button>
          </div>
        )}
        <div className={styles.boxState}>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>
              จำนวนการตรวจสอบคุณวุฒิทั้งหมด
            </p>
            <h2 className={styles.numberTotalPageView}>
              {totalViews.toLocaleString()} ครั้ง
            </h2>
          </div>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>
              {agency
                ? "จำนวนผู้สำเร็จการศึกษาที่คุณตรวจสอบทั้งหมด"
                : "ผู้สำเร็จการศึกษาที่ถูกตรวจสอบคุณวุฒิทั้งหมด"}
            </p>
            <h2 className={styles.numberTotalPageView}>
              {agency
                ? viewedStudents.toLocaleString()
                : uniqueStudents.toLocaleString()}{" "}
              คน
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
            disabled={selectedTopType}
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
              disabled={!selectedFacultyDisplayName || selectedTopType}
            >
              <option value="">-- เลือกสาขา --</option>
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          )}
          {officer && (
            <div className={styles.viewSelector}>
              <label>
                <input
                  type="checkbox"
                  name="viewSelector"
                  value="department"
                  checked={selectedTopType}
                  onChange={(e) => {
                    setSelectedTopType(e.target.checked);
                    setSelectedDepartment("");
                    setSelectedFacultyDisplayName("");
                  }}
                />
                <span>เลือกตามประเภทหน่วยงาน</span>
              </label>
            </div>
          )}
        </div>
        <div className={styles.topAgencyView} id="barChartContainer">
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
        <div className={styles.topFacultyView} id="pieChartContainer">
          {loadingTopDepartments ? (
            <div className={styles.loadingBox}></div>
          ) : (selectedView === "faculty" && topFaculties.length > 0) ||
            (selectedView === "department" && topDepartments.length > 0) ? (
            <PieChart data={pieChartData} options={pieChartOptions} />
          ) : (
            <div className={styles.noData}>
              <p>ไม่พบข้อมูล</p>
            </div>
          )}
        </div>
      </div>
      {popUpExport && (
        <Popup
          topic="ส่งออกข้อมูล"
          closePopup={() => {
            setPopUpExport(false);
            resetExportState();
          }}
          textButtonSuccess="ส่งออก"
          successPopup={prepareAndExport}
          disabledSuccess={!exportPDF && !exportExcel}
          loading={exportLoading}
        >
          <div className={styles.exportForm}>
            <div className={styles.exportDateForm}>
              <label>
                <p>จากวันที่:</p>
                <input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => {
                    const date = e.target.value;
                    setExportStartDate(date);
                    setStartDate(date);
                  }}
                />
              </label>
              <label>
                <p>ถึงวันที่:</p>
                <input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => {
                    const date = e.target.value;
                    setExportEndDate(date);
                    setEndDate(date);
                  }}
                />
              </label>
            </div>
            <div className={styles.containerFieldset}>
              <fieldset>
                <legend>หน่วยงานที่มีการตรวจสอบคุณวุฒิมากที่สุด Top 5 </legend>
                <div className={styles.exportDateForm}>
                  <label>
                    <p>คณะ:</p>
                    <select
                      value={exportFaculty}
                      disabled={selectedTopType}
                      onChange={(e) => {
                        const selected = e.target.value;
                        const code = displayNameToCodeNameMap[selected] || "";
                        setExportFaculty(selected);
                        setSelectedFacultyDisplayName(selected);
                        setSelectedFacultyCodeName(code);
                        setExportDepartment("");
                        setSelectedDepartment("");
                      }}
                    >
                      <option value="">-- เลือกคณะ --</option>
                      {Object.keys(displayNameToCodeNameMap).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <p>สาขา:</p>
                    <select
                      value={exportDepartment}
                      disabled={selectedTopType}
                      onChange={(e) => {
                        const dept = e.target.value;
                        setExportDepartment(dept);
                        setSelectedDepartment(dept);
                      }}
                    >
                      <option value="">-- เลือกสาขา --</option>
                      {departmentsList.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="viewSelector"
                      value="department"
                      checked={selectedTopType}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setSelectedTopType(checked);
                        setExportTopType(checked);
                        setExportDepartment("");
                        setExportFaculty("");
                        setSelectedDepartment("");
                        setSelectedFacultyDisplayName("");
                      }}
                    />
                    <span>เลือกตามประเภทหน่วยงาน</span>
                  </label>
                </div>
                <label className={styles.bottomLegendBar}>
                  <input
                    type="checkbox"
                    className={styles.checkBox}
                    checked={exportBar}
                    disabled={!exportPDF}
                    title={!exportPDF ? "กรุณเลือกไฟล์ PDF ก่อน" : ""}
                    onChange={(e) => setExportBar(e.target.checked)}
                  />{" "}
                  <span>กราฟแท่ง</span>
                </label>
              </fieldset>

              <fieldset>
                <legend>คณะ/สาขา ที่ถูกตรวจสอบคุณวุฒิมากที่สุด Top 5 </legend>
                <div className={styles.exportDateForm}>
                  <label>
                    <p>หน่วยงาน:</p>
                    <select
                      value={exportAgencyId}
                      onChange={(e) => {
                        const agencyId = e.target.value;
                        setExportAgencyId(agencyId);
                        setSelectedAgencyId(agencyId);
                      }}
                    >
                      <option value="">-- เลือกหน่วยงาน --</option>
                      {agencyDropdown.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.agency_name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={styles.exportCheckbox}>
                  <label>
                    <input
                      type="checkbox"
                      checked={exportTopFaculty}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setExportTopFaculty(checked);
                        if (checked) {
                          setExportTopDepartment(false);
                          setSelectedView("faculty");
                        }
                      }}
                    />{" "}
                    Top 5 คณะที่เข้าดูสูงสุด
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={exportTopDepartment}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setExportTopDepartment(checked);
                        if (checked) {
                          setExportTopFaculty(false);
                          setSelectedView("department");
                        }
                      }}
                    />{" "}
                    Top 5 สาขาที่เข้าดูสูงสุด
                  </label>
                </div>
                <label className={styles.bottomLegendPie}>
                  <input
                    type="checkbox"
                    className={styles.checkBox}
                    checked={exportPie}
                    disabled={!exportPDF}
                    title={!exportPDF ? "กรุณเลือกไฟล์ PDF ก่อน" : ""}
                    onChange={(e) => setExportPie(e.target.checked)}
                  />{" "}
                  <span>กราฟวงกลม</span>
                </label>
              </fieldset>

              <fieldset>
                <legend>ประเภทไฟล์ที่ต้องการส่งออก</legend>
                <div className={styles.exportCheckBoxFile}>
                  <label>
                    <input
                      type="checkbox"
                      checked={exportPDF}
                      onChange={(e) => setExportPDF(e.target.checked)}
                    />{" "}
                    PDF
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={exportExcel}
                      onChange={(e) => setExportExcel(e.target.checked)}
                    />{" "}
                    Excel
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
};

export default AccessStatistics;
