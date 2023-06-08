/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { RiLoader4Line } from 'react-icons/ri';
import styles from '../ApprovalPage/Approvalpage.module.scss';
import EachEmployeePagination from '../Pagination/EachEmployeePagination';

const EachEmployeeData = ({
  data,
}: {
  data: {
    EachEmployeeDetails: any;
    action: any;
    setAction: any;
  };
}) => {
  const [isLoading] = useState(false);

  const [, setMaxLength] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(6);
  useEffect(() => {
    // adjust MAX_LENGTH based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMaxLength(10);
      } else if (window.innerWidth < 1024) {
        setMaxLength(15);
      } else {
        setMaxLength(20);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // call initially
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  let indexFirstData = 0;
  let indexOfLastPage = 0;
  let CurrentData = [];
  indexFirstData = (currentPage - 1) * dataPerPage;
  indexOfLastPage = Math.min(indexFirstData + dataPerPage);

  if (data.EachEmployeeDetails.length !== 0) {
    CurrentData = data.EachEmployeeDetails.slice(
      indexFirstData,
      indexOfLastPage
    );
  } else {
    CurrentData = [];
  }
  const CurrentDatas = CurrentData.sort((a: any, b: any) => {
    const dateA = a.FromDate;
    const dateB = b.FromDate;
    return dateA - dateB;
  });
  return (
    <div
      className={styles.totalLeave}
      style={{
        flexDirection: 'column',
      }}
    >
      <div
        className={styles.totalLeaveDiv1}
        style={{
          width: '80%',
          borderRadius: "1rem"
        }}
      >
        <div
          className={styles.totalLeaveDiv2}
          style={{
            overflow: 'scroll',
            position: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '80%',
            background: 'white',
            borderRadius: "1rem"

          }}
        >
          <header className={styles.totalLeaveHeader}>
            {!isLoading && (
              <div className={styles.totalLeaveHeaderDiv}>
                <p>
                  <span>Leave Details of </span>
                  <span>
                    {data.EachEmployeeDetails.length > 0 &&
                      data.EachEmployeeDetails[0].ID}
                  </span>
                </p>
              </div>
            )}
          </header>

          <button
            type='button'
            onClick={() => {
              data.setAction(false);
            }}
            style={{
              color: 'rgb(153,171,180)',
              borderRadius: '50%',
              border: 'none',
            }}
            className={styles.totalLeaveCloseButton}
          >
            <MdOutlineCancel />
          </button>
        </div>

        <div
          style={{ marginTop: '4rem', overflow: 'scroll', }}
          className={styles.totalLeaveTableContainer}
        >
          <div
            style={{
              overflow: 'hidden',
              marginTop: '1rem',
              display: 'flex',
              gap: '3rem',
              flexWrap: 'wrap',
              justifyContent: 'space-evenly',
              marginLeft: "3rem",
              marginRight: "3rem",
            }}
          >
            {isLoading ? (
              <table style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td className={styles.LeaveDetailsNoRecord} colSpan={11}>
                      <p
                        style={{
                          textAlign: 'center',
                          fontWeight: 400,
                        }}
                      >
                        <div className={styles.LoaderDivision}>
                          <RiLoader4Line className={styles.loader} />
                        </div>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (

              <>
                <table
                  className={styles.approvalTable}
                  style={{ minWidth: '100%', margin: "auto 3rem" }}
                >
                  <thead className={styles.approvalTableHead}>
                    <tr>
                      <th style={{ textAlign: "center" }} className={styles.approvalTableHeading}>
                        From Date
                      </th>
                      <th style={{ textAlign: "center" }} className={styles.approvalTableHeading}>To Date</th>
                      <th style={{ textAlign: "center" }} className={styles.approvalTableHeading}>
                        No of Days Leave
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {CurrentDatas.map((leaveDetail: any) => (
                      <tr key={leaveDetail.ID}>
                        <td
                          style={{ textAlign: 'center' }}
                          className={styles.approvalTableDescription}
                        >
                          {leaveDetail.FromDate}
                        </td>
                        <td
                          style={{ textAlign: 'center' }}
                          className={styles.approvalTableDescription}
                        >
                          {leaveDetail.ToDate}
                        </td>
                        <td
                          style={{ textAlign: 'center' }}
                          className={styles.approvalTableDescription}
                        >
                          {leaveDetail.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>

            )}
          </div>
        </div>
        {data.EachEmployeeDetails.length > 0 && (
          <div>
            <EachEmployeePagination
              totalData={data.EachEmployeeDetails.length}
              dataPerPage={dataPerPage}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EachEmployeeData;
