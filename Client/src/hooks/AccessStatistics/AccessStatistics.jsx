import React, { useEffect, useState } from "react";
import styles from "./AccessStatistics.module.css";
import Loading from "../../components/Loading/Loading.jsx";
import axios from "axios";
import { APIEndpoints, API_BASE_URL } from "../../services/api";
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
} from "chart.js";

import LineChart from "./LineChart.jsx";
import BarChart from "./BarChart.jsx";
import PieChart from "./PieChart.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
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

const AccessStatistics = () => {
  const [totalViews, setTotalViews] = useState(0);
  const [uniqueStudents, setUniqueStudents] = useState(0);
  const [topAgencies, setTopAgencies] = useState([]);
  const [topFaculties, setTopFaculties] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statisticsRes, agenciesRes, facultiesRes, trendRes] =
          await Promise.all([
            axios.get(API_BASE_URL + APIEndpoints.pageview.statistics),
            axios.get(API_BASE_URL + APIEndpoints.pageview.topAgency),
            axios.get(API_BASE_URL + APIEndpoints.pageview.topFaculty),
            axios.get(API_BASE_URL + APIEndpoints.pageview.trend),
          ]);

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

  const barChartData = {
    labels: topAgencies.map((item) => item.agency_name),
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

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      title: {
        display: true,
        text: "Top 5 หน่วยงานที่มีการเข้าดูมากที่สุด",
        color: "#333",
        padding: { top: 10, bottom: 20 },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };
  const pieChartData = {
    labels: topFaculties.map((item) => item.faculty),
    datasets: [
      {
        label: "จำนวนการเข้าดู",
        data: topFaculties.map((item) => item.count),
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
      tooltip: { enabled: true },
      title: {
        display: true,
        text: "Top 5 คณะที่มีการเข้าดูมากที่สุด",
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
        <div className={styles.boxState}>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>จำนวนการเข้าดูทั้งหมด</p>
            <h2 className={styles.numberTotalPageView}>
              {totalViews.toLocaleString()}
            </h2>
          </div>
          <div className={styles.totalPageView}>
            <p className={styles.titleTotalPageView}>นักศึกษาที่เข้าดูไม่ซ้ำ</p>
            <h2 className={styles.numberTotalPageView}>
              {uniqueStudents.toLocaleString()}
            </h2>
          </div>
        </div>
        <div className={styles.graphBoxState}>
          <LineChart data={lineChartData} options={lineChartOptions} />
        </div>
      </div>

      <div className={styles.rightBoxState}>
        <div className={styles.topAgencyView}>
          {topAgencies.length > 0 && (
            <BarChart data={barChartData} options={barChartOptions} />
          )}
        </div>
        <div className={styles.topFacultyView}>
          {topFaculties.length > 0 && (
            <PieChart data={pieChartData} options={pieChartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessStatistics;
