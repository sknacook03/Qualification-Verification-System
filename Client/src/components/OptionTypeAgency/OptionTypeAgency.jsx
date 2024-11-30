import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ตรวจสอบว่าติดตั้ง axios แล้ว: npm install axios
import './OptionTypeAgency.css';

const OptionTypeAgency = ({ label, id, name, value, onChange, placeholder }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/typeagency');
        const result = response.data; // ดึงข้อมูล JSON จาก response
        if (result.success) {
          setOptions(result.data); // ตั้งค่า options ด้วยข้อมูลที่ได้
        } else {
          console.error('Error: API response unsuccessful');
          setOptions([]); // ตั้งค่า options เป็นอาร์เรย์ว่างหาก API ไม่สำเร็จ
        }
      } catch (error) {
        console.error('Error fetching options:', error);
        setOptions([]); // ตั้งค่า options เป็นอาร์เรย์ว่างในกรณีมีข้อผิดพลาด
      } finally {
        setLoading(false); // ปิดสถานะกำลังโหลด
      }
    };

    fetchOptions();
  }, []);

  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <select
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-select"
      >
        <option value="">กรุณาเลือกประเภทหน่วยงาน</option>
        {loading ? (
          <option value="">กำลังโหลด...</option>
        ) : (
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.type_name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default OptionTypeAgency;
