import React, { useEffect, useState } from "react";
import axios from "axios";
import LayoutAllpage from "../../../components/LayoutAllPage/LayoutAllPage.jsx";
import Icon from "../../../assets/general.png";
import Loading from "../../../components/Loading/Loading.jsx";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GeneralControlPanel() {
  const [officer, setOfficer] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [typeAgency, setTypeAgency] = useState([]);
  const [editData, setEditData] = useState({ type_name: "" });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
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
        toast.error("คุณยังไม่ได้ล็อกอิน! กรุณาเข้าสู่ระบบก่อน");
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
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  const handleDeleteConfirm = async () => {
    setBtnLoading(true);
    try {
      await axios.delete(
        API_BASE_URL + APIEndpoints.typeAgency.deleteType(deleteId),
        {
          withCredentials: true,
        }
      );
      toast.success("ลบเรียบร้อยแล้ว");
      const res = await axios.get(
        API_BASE_URL + APIEndpoints.typeAgency.fetchAll,
        { withCredentials: true }
      );
      setTypeAgency(res.data.data);
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch (error) {
      console.error("ลบไม่สำเร็จ:", error);
      
    
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || "";
        
        if (status === 400 || status === 409 || errorMessage.includes("foreign key") || errorMessage.includes("constraint")) {
          toast.error("ไม่สามารถลบประเภทหน่วยงานนี้ได้ เนื่องจากมีหน่วยงานที่ใช้ประเภทนี้อยู่");
        } else if (status === 404) {
          toast.error("ไม่พบข้อมูลประเภทหน่วยงานที่ต้องการลบ");
        } else {
          toast.error("เกิดข้อผิดพลาดในการลบ");
        }
      } else {
        toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
      }
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeletePopup(false);
    setDeleteId(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEditData({ type_name: "" });
    setErrors({});
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
      setIsEditMode(true);
      setShowPopup(true);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
      toast.error("โหลดข้อมูลไม่สำเร็จ");
    }
  };

  const addTypeAgency = () => {
    setErrors({});
    setEditData({ type_name: "" });
    setIsEditMode(false);
    setShowPopup(true);
  };

  const handleSave = async () => {
    setBtnLoading(true);
    const newErrors = {};
    if (!editData.type_name || editData.type_name.trim() === "") {
      newErrors.type_name = "กรุณากรอกชื่อประเภทหน่วยงาน";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (isEditMode) {
        await axios.put(
          API_BASE_URL + APIEndpoints.typeAgency.updateType(editData.id),
          editData,
          { withCredentials: true }
        );
        toast.success("แก้ไขข้อมูลสำเร็จ");
      } else {
        await axios.post(
          API_BASE_URL + APIEndpoints.typeAgency.createType,
          editData,
          { withCredentials: true }
        );
        toast.success("เพิ่มข้อมูลสำเร็จ");
      }
      setShowPopup(false);
      setErrors({});
      const res = await axios.get(
        API_BASE_URL + APIEndpoints.typeAgency.fetchAll,
        { withCredentials: true }
      );
      setTypeAgency(res.data.data);
    } catch (error) {
      console.error("บันทึกข้อมูลไม่สำเร็จ:", error);

      if (error.response && error.response.status === 409) {
        setErrors((prev) => ({
          ...prev,
          type_name: "ชื่อประเภทหน่วยงานนี้มีอยู่แล้ว",
        }));
      } else {
        toast.error("เกิดข้อผิดพลาดในการบันทึก");
      }
    } finally {
      setBtnLoading(false);
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
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
      toast.error("เกิดข้อผิดพลาดในการออกจากระบบ");
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
              addType={addTypeAgency}
            />
          </div>
        );
      default:
        return null;
    }
  };

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
        {loading && <Loading />}
        {!loading && <div>{renderContent()}</div>}
      </div>
      {showPopup && (
        <Popup
          topic={isEditMode ? "แก้ไขประเภทหน่วยงาน" : "เพิ่มประเภทหน่วยงาน"}
          closePopup={handleClosePopup}
          successPopup={handleSave}
          loading={btnLoading}
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
      {showDeletePopup && (
        <Popup
          topic="ยืนยันการลบ"
          closePopup={handleDeleteCancel}
          successPopup={handleDeleteConfirm}
          loading={btnLoading}
          textButtonSuccess="ยืนยัน"
        >
          <p>คุณต้องการลบประเภทหน่วยงานนี้ใช่หรือไม่?</p>
        </Popup>
      )}
      <ToastContainer position="top-center" />
    </LayoutAllpage>
  );
}

export default GeneralControlPanel;
