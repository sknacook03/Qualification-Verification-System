import React from 'react';
import './OptionTypeAgency.css';

const OptionTypeAgency = ({ label, id, name, value, onChange, placeholder }) => (
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
      <option value="school">สถานศึกษา</option>
      <option value="hospital">โรงพยาบาล</option>
      <option value="government">ราชการ</option>
      <option value="state_enterprise">รัฐวิสาหกิจ</option>
      <option value="company">บริษัท</option>
      <option value="recruitment_agency">บริษัทจัดหางาน</option>
      <option value="bank">ธนาคาร</option>
    </select>
  </div>
);

export default OptionTypeAgency;
