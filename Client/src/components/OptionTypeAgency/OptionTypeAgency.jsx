import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OptionTypeAgency.css";
import { API_BASE_URL,APIEndpoints } from "../../services/api";

const OptionTypeAgency = ({ label, id, name, value, onChange, placeholder, error }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedValue, setSelectedValue] = useState(value || "");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(API_BASE_URL + APIEndpoints.typeAgency.fetchAll);
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
    if (onChange) onChange({ target: { name, value: newValue } });
  };

  return (
    <div className="input-container">
      <label className="input-label" htmlFor={id} >{label}</label>
      <select
        name={name}
        id={id}
        value={selectedValue}
        onChange={handleSelectChange}
        placeholder={placeholder}
        className={`input-select ${error ? 'input-error' : ''}`}
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
      {error && <div className="error-message">{error}</div>}      
    </div>
  );
};

export default OptionTypeAgency;
