import React from 'react';
import PropTypes from 'prop-types';
import './ArrowButton.css';

const ArrowButton = ({ direction, color }) => {
  return (
    <button className={`arrow-button ${color}`}>
      <span className="arrow">{direction === 'left' ? '←' : '→'}</span>
    </button>
  );
};

ArrowButton.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  color: PropTypes.oneOf(['orange', 'grey']).isRequired,
};

export default ArrowButton;
