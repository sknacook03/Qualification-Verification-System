import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import Icon from "../../../assets/general.png";
import { API_BASE_URL, APIEndpoints } from "../../../services/api.jsx";
import styles from "./GeneralControlPanel.module.css";
import { useNavigate } from "react-router-dom";
import {
  topMenuItems,
  bottomMenuItems,
} from "../../../constants/officerMenuItems.jsx";
import TabNavigation from "../../../components/TabNavigation/TabNavigation.jsx";
import TypeAgencyTable from "../../../hooks/TypeAgencyTable/TypeAgencyTable.jsx";
import Popup from "../../../components/Popup/Popup.jsx";
import Input from "../../../components/Input/Input.jsx";

function GeneralControlPanel() {
  const [officer, setOfficer] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [typeAgency, setTypeAgency] = useState([]);
  const [editData, setEditData] = useState({ type_name: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfficerData = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + APIEndpoints.officer.logged,
          {
            withCredentials: true,
          }
        );
        setOfficer(res.data.data);
      } catch (error) {
        console.error("Failed to fetch officer data:", error);
        alert("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
        navigate("/LoginOfficer");
      }
    };

    const fetchTypeAgency = async () => {
      try {
        const res = await axios.get(
          API_BASE_URL + APIEndpoints.typeAgency.fetchAll,
          {
            withCredentials: true,
          }
        );
        setTypeAgency(res.data.data);
      } catch (error) {
        console.error("Failed to fetch type agency data:", error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchOfficerData();
      await fetchTypeAgency();
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const deleteTypeAgency = async (id) => {
    if (!window.confirm("คุณต้องการลบประเภทหน่วยงานนี้ใช่หรือไม่?")) return;

    try {
      await axios.delete(
        API_BASE_URL + APIEndpoints.typeAgency.deleteType(id),
        {
          withCredentials: true,
        }
      );
      alert("ลบเรียบร้อยแล้ว");
      const res = await axios.get(
        API_BASE_URL + APIEndpoints.typeAgency.fetchAll,
        { withCredentials: true }
      );
      setTypeAgency(res.data.data);
    } catch (error) {
      console.error("ลบไม่สำเร็จ:", error);
      alert("เกิดข้อผิดพลาดในการลบ");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const editTypeAgency = async (id) => {
    try {
      setErrors({});
      const res = await axios.get(
        API_BASE_URL + APIEndpoints.typeAgency.fetchById(id),
        {
          withCredentials: true,
        }
      );
      setEditData(res.data.data);
      setShowPopup(true);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      alert("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  const handleEditSave = async () => {
    const newErrors = {};

    if (!editData.type_name || editData.type_name.trim() === "") {
      newErrors.type_name = "กรุณากรอกชื่อประเภทหน่วยงาน";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.put(
        API_BASE_URL + APIEndpoints.typeAgency.updateType(editData.id),
        editData,
        { withCredentials: true }
      );
      alert("บันทึกข้อมูลสำเร็จ");
      setShowPopup(false);
      setErrors({});
      const res = await axios.get(
        API_BASE_URL + APIEndpoints.typeAgency.fetchAll,
        { withCredentials: true }
      );
      setTypeAgency(res.data.data);
    } catch (error) {
      console.error("บันทึกข้อมูลไม่สำเร็จ:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    }
  };

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

  const tabs = [{ label: "จัดการประเถทหน่วยงาน" }];
  const renderContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <div>
            <TypeAgencyTable
              typeAgency={typeAgency}
              editType={editTypeAgency}
              deleteType={deleteTypeAgency}
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <p className={styles.loading}>กำลังโหลดข้อมูล...</p>;
  }
  return (
    <LayoutAllpage
      user={officer ? officer.first_name : "Loading..."}
      topMenuItems={topMenuItems}
      bottomMenuItems={bottomMenuItems(logout)}
      icon={Icon}
      label="จัดการทั่วไป"
    >
      <div className={styles.container}>
        <TabNavigation
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <div>{renderContent()}</div>
      </div>
      {showPopup && (
        <Popup
          topic="แก้ไขประเภทหน่วยงาน"
          closePopup={handleClosePopup}
          successPopup={handleEditSave}
          textButtonSuccess="บันทึก"
        >
          <Input
            label="ชื่อประเภทหน่วยงาน"
            value={editData.type_name}
            onChange={(e) => {
              setEditData({ ...editData, type_name: e.target.value });
              setErrors((prev) => ({ ...prev, type_name: null })); 
            }}
            placeholder="กรอกชื่อประเภทหน่วยงาน"
            error={errors.type_name}
          />
        </Popup>
      )}
    </LayoutAllpage>
  );
}

export default GeneralControlPanel;
