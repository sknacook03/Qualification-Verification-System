import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import close from "../../assets/close.png";
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
  loading,
  children,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (textarea && !valueTextarea.trim()) return;
    successPopup();
  };
  return (
    <div className={styles.overlayPopup}>
      <form onSubmit={handleSubmit} className={styles.contentPopup}>
        {closePopup && (
          <img
            src={close}
            onClick={closePopup}
            alt="close"
            className={styles.closePopup}
            width={25}
            height={25}
          />
        )}
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
        {children}
        {loading ? (
          <div className={styles.loader}>
            <ClipLoader size={15} color={"#FF7100"} />
          </div>
        ) : (
          <button
            type="submit"
            className={styles.buttonPopup}
            disabled={textarea && !valueTextarea.trim()}
          >
            {textButtonSuccess}
          </button>
        )}
      </form>
    </div>
  );
};

export default Popup;
