import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OptionTypeAgency.css";

const OptionTypeAgency = ({ label, id, name, value, onChange, placeholder }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherValue, setOtherValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(value || "");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:3000/typeagency");
        const result = response.data;
        if (result.success) {
          setOptions(result.data);
        } else {
          console.error("Error: API response unsuccessful");
          setOptions([]);
        }
      } catch (error) {
        console.error("Error fetching options:", error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    setShowOtherInput(newValue === "other");
    if (onChange) onChange({ target: { name, value: newValue } });
  };

  const handleOtherInputChange = (e) => {
    setOtherValue(e.target.value);
  };

  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <select
        name={name}
        id={id}
        value={selectedValue}
        onChange={handleSelectChange}
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
        <option value="other">อื่นๆ</option>
      </select>

      {showOtherInput && (
        <input
          type="text"
          name="otherType"
          id="otherType"
          value={otherValue}
          onChange={handleOtherInputChange}
          placeholder="กรุณาระบุประเภทหน่วยงาน"
          className="input-text"
        />
      )}
    </div>
  );
};

export default OptionTypeAgency;
