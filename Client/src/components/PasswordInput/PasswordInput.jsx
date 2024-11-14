import React, { useState } from 'react';
import hide from '../../assets/hide.png';
import visibility from '../../assets/visibility.png';
import './PasswordInput.css';

const PasswordInput = ({ label, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="password-container">
      <label>{label}</label>
      <div className="password-field-wrapper">
        <input 
          className="password-field"
          type={showPassword ? 'text' : 'password'} 
          value={value} 
          onChange={onChange} 
        />
        <button 
          type="button" 
          className="toggle-password-btn" 
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <img src={visibility} alt="visibility" width={25}/> : <img src={hide} alt="hide" width={25}/>}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
