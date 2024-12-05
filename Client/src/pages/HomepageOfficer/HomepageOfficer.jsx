import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function HomepagesOfficer() {
  const [officer, setOfficer] = useState(null);
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/officer/logged-in", {
          withCredentials: true,
        });
        setOfficer(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch officer data:", error);
        alert("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
        navigate("/");
      }
    };

    fetchOfficerData();
  }, [navigate]);

  useEffect(() => {
    const fetchAgencyAll = async () => {
      try {
        const res = await axios.get("http://localhost:3000/agency/agencies", {
          withCredentials: true,
        });
        setAgency(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch agency data:", error);
      }
    };

    fetchAgencyAll();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!officer) {
    return <div>ไม่พบข้อมูล Officer</div>;
  }

  return (
    <div>
      <h1>Welcome, {officer.first_name}</h1>
      <p>Email: {officer.email}</p>
      <p>Role: {officer.role}</p>
      <h3>Agencies:</h3>
      <ul>
        {agency.map((agencyItem, index) => (
          <li key={index}>{agencyItem.agency_name}</li>
        ))}
      </ul>
    </div>
  );
}

export default HomepagesOfficer;
