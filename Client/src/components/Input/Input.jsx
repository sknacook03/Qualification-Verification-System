import React from 'react';
import './Input.css';

const Input = ({ label, id, name, type = 'text', value, onChange }) => (
  <div className="input-container">
    <label className="input-label">{label}</label>
    <input 
      className="input-field"
      id={id}
      name={name}
      type={type} 
      value={value} 
      onChange={onChange} 
    />
  </div>
);

export default Input;
