import React from 'react';
import PropTypes from 'prop-types';
import './ArrowButton.css';

const ArrowButton = ({ direction, color, onClick, disabled, type = "button", style = {} }) => {
  return (
    <button 
      className={`arrow-button ${color}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      style={style}
    >
      <span className="arrow">{direction === 'left' ? '←' : '→'}</span>
    </button>
  );
};

ArrowButton.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  color: PropTypes.oneOf(['orange', 'grey']).isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  style: PropTypes.object,
};

export default ArrowButton;

