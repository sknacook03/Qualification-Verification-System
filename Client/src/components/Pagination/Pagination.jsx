import React from "react";
import ReactPaginate from "react-paginate";
import styles from "./Pagination.module.css";

function Pagination({
  pageCount,
  onPageChange,
  itemsPerPage,
  setItemsPerPage,
  setCurrentPage,
}) {
  return (
    <>
      <div className={styles.paginationContainer}>
        {setItemsPerPage && (
          <div className={styles.dropdownContainer}>
            <label htmlFor="itemsPerPage">แสดงผลต่อหน้า :</label>
            <select
              id="itemsPerPage"
              className={styles.select}
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                if (setCurrentPage) setCurrentPage(0);
              }}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        )}
        <ReactPaginate
          breakLabel="..."
          nextLabel="ถัดไป >"
          previousLabel="< ย้อนกลับ"
          onPageChange={onPageChange}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          containerClassName={styles.pagination}
          activeClassName={styles.activePage}
        />
      </div>
    </>
  );
}

export default Pagination;
