import React from "react";
import "./Button.css";

const Button = ({ text, onClick, styleType, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={
        styleType === "primary"
          ? "button-primary"
          : styleType === "secondary"
          ? "button-secondary"
          : styleType === "back"
          ? "button-back"
          : "button-third"
      }
    >
      {text}
    </button>
  );
};

export default Button;
