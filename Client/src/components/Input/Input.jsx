import React from 'react';
import './Input.css';

const Input = ({ label, id, name, type = 'text', value, onChange, placeholder, error }) => (
  <div className="input-container">
    <label className="input-label" htmlFor={id}>{label}</label>
    <input 
      className={`input-field ${error ? 'input-error' : ''}`}
      id={id}
      name={name}
      type={type} 
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <div className="error-message">{error}</div>}
  </div>
);

export default Input;
