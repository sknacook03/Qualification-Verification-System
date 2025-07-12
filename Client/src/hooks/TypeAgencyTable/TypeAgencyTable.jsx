import React, { useEffect, useState } from "react";
import styles from "./TypeAgencyTable.module.css";
import Pagination from "../../components/Pagination/Pagination.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faPenToSquare } from "@fortawesome/free-regular-svg-icons";

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
        <div className={styles.tableWrapper}>
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
                  <td data-label="#"> {index + 1} </td>
                  <td data-label="ประเภทหน่วยงาน"> {typeItem.type_name} </td>
                  <td data-label="ตัวเลือก" className={styles.btnTypeAgency}>
                    <div className={styles.btnContainer}>
                      <button
                        className={styles.editType}
                        onClick={() => editType(typeItem.id)}
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className={styles.deleteType}
                        onClick={() => deleteType(typeItem.id)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
