import React from "react";
import "./Popup.css";

const Popup = ({ topic, info, img, closePopup, textButton }) => {
  return (
    <div className="overlay">
      <div className="content">
        <h2>{topic}</h2>
        <img src={img} alt="" />
        <p>{info}</p>
        <button onClick={closePopup}>{textButton}</button>
      </div>
    </div>
  );
};

export default Popup;
