import React from 'react';
import './Button.css';

const Button = ({ text, onClick, styleType }) => {
  return (
    <button
      onClick={onClick}
      className={styleType === 'primary' ? 'button-primary' : 'button-secondary'}
    >
      {text}
    </button>
  );
};

export default Button;
