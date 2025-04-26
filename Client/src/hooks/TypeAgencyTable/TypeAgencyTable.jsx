import React from "react";
import styles from "./TypeAgencyTable.module.css";

const TypeAgencyTable = ({ typeAgency, editType, deleteType, addType }) => {
  return (
    <>
    <div className={styles.containerTypeAgency}>
      <button className={styles.btnAddTypeAgency} onClick={addType}><span>+</span>เพิ่มประเภทหน่วยงาน</button>
      <table className={styles.tableTypeAgency}>
        <thead>
          <tr>
            <th>#</th>
            <th>ประเภทหน่วยงาน</th>
            <th>ตัวเลือก</th>
          </tr>
        </thead>
        <tbody>
          {typeAgency.map((typeItem, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{typeItem.type_name}</td>
              <td className={styles.btnTypeAgency}>
                <button className={styles.editType} onClick={() => editType(typeItem.id)}>แก้ไข</button>
                <button className={styles.deleteType} onClick={() => deleteType(typeItem.id)}>ลบ</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};
export default TypeAgencyTable;
