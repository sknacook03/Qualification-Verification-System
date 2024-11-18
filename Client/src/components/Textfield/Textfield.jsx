import React from "react";
import './Textfield.css';

const Textfield = ({label, name, id, placeholder, cols, rows, value, onChange}) => {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <textarea 
        draggable="false"
        className="input-textfield"
        name={name} 
        id={id} 
        placeholder={placeholder}
        cols={cols}
        rows={rows}
        value={value} 
        onChange={onChange}
      >
      </textarea>
    </div>
  );
};

export default Textfield;
