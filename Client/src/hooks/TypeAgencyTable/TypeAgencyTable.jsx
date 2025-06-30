import React, { useEffect, useState } from "react";
import styles from "./TypeAgencyTable.module.css";
import Pagination from "../../components/Pagination/Pagination.jsx";
const TypeAgencyTable = ({ typeAgency, editType, deleteType, addType }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const offset = currentPage * itemsPerPage;
  const currentItems = typeAgency
    ? typeAgency.slice(offset, offset + itemsPerPage)
    : [];
  const pageCount = typeAgency
    ? Math.ceil(typeAgency.length / itemsPerPage)
    : 0;

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  return (
    <>
      <div className={styles.containerTypeAgency}>
        <button className={styles.btnAddTypeAgency} onClick={addType}>
          <span>+</span>เพิ่มประเภทหน่วยงาน
        </button>
        <table className={styles.tableTypeAgency}>
          <thead>
            <tr>
              <th>#</th>
              <th>ประเภทหน่วยงาน</th>
              <th>ตัวเลือก</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((typeItem, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{typeItem.type_name}</td>
                <td className={styles.btnTypeAgency}>
                  <div className={styles.btnContainer}>
                    <button
                      className={styles.editType}
                      onClick={() => editType(typeItem.id)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className={styles.deleteType}
                      onClick={() => deleteType(typeItem.id)}
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          pageCount={pageCount}
          onPageChange={handlePageClick}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};
export default TypeAgencyTable;
