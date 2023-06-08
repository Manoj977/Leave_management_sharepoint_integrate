/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-line @typescript-eslint/no-explicit-any
import * as React from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import styles from './EachEmployeePagination.module.scss';

const EachEmployeePagination = ({
    totalData,
    dataPerPage,
    currentPage,
    setCurrentPage,
}: {
    totalData: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    dataPerPage: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    currentPage: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    setCurrentPage: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
    const totalPages = Math.ceil(totalData / dataPerPage);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            window.scrollTo(0, 0);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className={styles.pagination}>
            <div className={styles.paginationAlign}>
                <div
                    className={`${styles.paginationPageNum} ${currentPage === 1 ? `${styles.paginationPageNumNotAllowed}` : ''
                        }`}
                    onClick={handlePrevious}
                >
                    <BsChevronLeft size={14} />
                    <p className={styles.paginationPrevious}>Previous</p>
                </div>
                <div className={styles.pagenationSelectDiv}>
                    <select
                        className={styles.pagenationSelect}
                        value={currentPage}
                        onChange={(e) => setCurrentPage(parseInt(e.target.value))}
                    >
                        {pages.map((page) => (
                            <option key={page} value={page}>
                                {page}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.paginationHide}>
                    {pages.map((page) => {
                        const isActive = currentPage === page;
                        const buttonClass = `${styles.paginationButtonClass} ${isActive ? `${styles.paginationButtonActive}` : ''
                            }`;

                        return (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={buttonClass}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>
                <div
                    className={`${styles.paginationNextDiv} ${currentPage === totalPages
                            ? `${styles.paginationPageNumNotAllowed}`
                            : ''
                        }`}
                    onClick={handleNext}
                >
                    <p className={styles.paginationNext}>Next</p>
                    <BsChevronRight size={14} />
                </div>
            </div>
        </div>
    );
};

export default EachEmployeePagination;
