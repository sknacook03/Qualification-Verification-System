import React from 'react';
import styles from './Input.module.css';

const Input = ({ label, id, name, type = 'text', value, onChange, placeholder, error, inputRef, accept }) => (
  <div className={styles.inputContainer}>
    <label className={styles.inputLabel} htmlFor={id}>{label}</label>
    <input 
      className={`${styles.inputField} ${error ? styles.inputError : ''}`}
      id={id}
      name={name}
      type={type} 
      value={value} 
      ref={inputRef}
      onChange={onChange}
      placeholder={placeholder}
      accept={accept}
    />
    {error && <div className={styles.errorMessage}>{error}</div>}
  </div>
);

export default Input;
