import React from 'react'
import styles from "./IconPage.module.css"
const IconPage = ({ icon, label}) => {
  return (
    <>
        <div className={styles.containerIconPage}>
            <img src={icon} alt="" width={25} height={25} />
            <h3>{label}</h3>
        </div>
    </>
  )
}

export default IconPage