import React, { useState } from "react";
import hide from "../../assets/hide.png";
import visibility from "../../assets/visibility.png";
import styles from "./PasswordInput.module.css";

const PasswordInput = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className={styles.passwordContainer}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.passwordFieldWrapper}>
        <input
          className={`${styles.passwordField} ${error ? styles.passwordError : ""}`}
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className={styles.togglePasswordBtn}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <img src={visibility} alt="visibility" width={25} />
          ) : (
            <img src={hide} alt="hide" width={25} />
          )}
        </button>
      </div>
      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default PasswordInput;
