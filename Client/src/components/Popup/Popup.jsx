import React from "react";
import close from "../../assets/close.png"
import styles from "./Popup.module.css";

const Popup = ({
  topic,
  info,
  img,
  successPopup,
  textButtonSuccess,
  closePopup,
  textarea,
  onChangeTextarea,
  placeholderTextarea,
  valueTextarea,
}) => {
  return (
    <div className={styles.overlayPopup}>
      <div className={styles.contentPopup}>
        {closePopup && <img src={close} onClick={closePopup} alt="close" className={styles.closePopup} width={25} height={25} />}
        <h2>{topic}</h2>
        {img && <img src={img} alt="" width={100} height={100} />}
        {info && <p>{info}</p>}
        {textarea && (
          <textarea
            value={valueTextarea}
            placeholder={placeholderTextarea}
            onChange={onChangeTextarea}
          ></textarea>
        )}
          <button onClick={successPopup} className={styles.buttonPopup}>{textButtonSuccess}</button>
      </div>
    </div>
  );
};

export default Popup;
