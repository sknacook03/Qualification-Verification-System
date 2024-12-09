import React from "react";
import './Textfield.css';

const Textfield = ({label, name, id, placeholder, cols, rows, value, onChange, error}) => {
  return (
    <div className="input-container">
      <label className="input-label" htmlFor={id} >{label}</label>
      <textarea 
        draggable="false"
        className={`input-textfield ${error ? 'input-error' : ''}`}
        name={name} 
        id={id} 
        placeholder={placeholder}
        cols={cols}
        rows={rows}
        value={value} 
        onChange={onChange}
      >
      </textarea>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Textfield;
