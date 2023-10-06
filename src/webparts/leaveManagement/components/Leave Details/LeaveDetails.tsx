/* eslint-disable no-self-compare */
/* eslint-disable no-void */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import convert from 'xml-js';
import { IList, Web, sp } from '@pnp/sp/presets/all';
import styles from './LeaveDetails.module.scss';

import { MyContext } from '../../context/contextProvider';
import { Link } from 'react-router-dom';
import Pagination from '../Pagination/Pagination';
import { MdOutlineCancel } from 'react-icons/md';
import { RiLoader4Line } from 'react-icons/ri';
import { RxBorderDotted } from 'react-icons/rx';
import { MdKeyboardDoubleArrowUp } from 'react-icons/md';
// import { RiLoader4Line } from 'react-icons/ri';
type LeaveDetail = {
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  FromDate: Date;
  ToDate: Date;
  LeaveType: Date;
  Reason: string;
  Days: string;
  Status: string;
  leaveID: number;
};
type SortOption = { name: string; value: string; };
const sortOptions: SortOption[] = [
  { name: 'S.No', value: 'S.No' },
  { name: 'ID', value: 'ID' },
  { name: 'Leave', value: 'Leave' },
  { name: 'Leave Type', value: 'Leave Type' },
  { name: 'From Date', value: 'From Date' },
  { name: 'To Date', value: 'To Date' },
  { name: 'Reason', value: 'Reason' },
  { name: 'Days', value: 'Days' },
  { name: 'Status', value: 'Status' },
  { name: 'Remark', value: 'Remark' },
  { name: 'Action', value: 'Action' },
];
export const LeaveDetails = () => {
  const { cancelReason, setCancelReason } = React.useContext(MyContext);
  const [leaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(15);
  const [, setLeaveStatus] = useState('');
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [leaveID, setLeaveID] = useState(0);
  const [expandedID, setExpandedID] = useState(null);
  const [MAX_LENGTH, setMaxLength] = useState(30);
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
  useEffect(() => {
    // eslint-disable-next-line no-void
    void sp.web.currentUser.get().then((user) => {
      setUserEmail(user.Email.toLocaleLowerCase());
    });
  }, []);
  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leave%20Management')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];

        const leaveDetail: LeaveDetail[] = entries
          .map((entry: any) => {
            try {
              return {
                ID: entry.content['m:properties']['d:Title']._text,
                Name: entry.content['m:properties']['d:Name']._text,
                Email: entry.content['m:properties']['d:Email']._text,
                Leave: entry.content['m:properties']['d:LeaveType']._text,
                LeaveType: entry.content['m:properties']['d:Leave']._text,
                count: entry.content['m:properties']['d:count']._text,
                FromDate: new Date(
                  entry.content['m:properties']['d:FormDate']._text
                )
                  .toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  .split(' ')
                  .join('-'),
                ToDate: new Date(
                  entry.content['m:properties']['d:ToDate']._text
                )
                  .toLocaleString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  .split(' ')
                  .join('-'),
                Reason: entry.content['m:properties']['d:Reason']._text,
                Status: entry.content['m:properties']['d:Status']._text,
                Remark: entry.content['m:properties']['d:Remark']._text,
                Days: entry.content['m:properties']['d:count']._text,
                leaveID: entry.content['m:properties']['d:Id']._text,
              };
            } catch (error) {
              if (
                error instanceof TypeError &&
                error.message.includes('Cannot read properties of undefined')
              ) {
                return null;
              } else {
                throw error;
              }
            }
          })
          .filter(Boolean);

        setLeaveDetails(leaveDetail);
        setIsLoading(false);
      })
      .catch((err) => {
        if (
          !(
            err instanceof TypeError &&
            err.message.includes('Cannot read properties of undefined')
          )
        ) {
          console.log(err);
        }
      });
  }, []);

  const filteredLeaveDetails = leaveDetails.filter((detail) => {
    if (detail.Email !== undefined)
      return detail.Email.toLocaleLowerCase() === userEmail.toLocaleLowerCase();
  });

  // pag
  const indexOfLastPage = currentPage * dataPerPage;
  const indexFirstData = indexOfLastPage - dataPerPage;
  const CurrentData: any =
    filteredLeaveDetails !== undefined
      ? filteredLeaveDetails.slice(indexFirstData, indexOfLastPage)
      : '';
  const updateLeaveStatus = async (
    id: number,
    Remark: string,
    status: string
  ) => {
    try {
      const web = Web('https://zlendoit.sharepoint.com/sites/production');
      const list: IList = web.lists.getByTitle('Leave Management');

      const itemToUpdate = list.items.getById(id);
      await itemToUpdate.update({ Status: status, Remark: Remark });
      alert('Leave status updated successfully!');
      window.location.reload();
    } catch (error) {
      alert(`Error updating leave status: ${error}`);
    }
  };
  const handleCancel = async (id: number, Remark: string, status: string) => {
    await updateLeaveStatus(id, Remark, status);
    // Update the leaveDetails state to reflect the new status
    const updatedLeaveDetails = leaveDetails.map((leave: any) =>
      leave.leaveID === id ? { ...leave, Status: status } : leave
    );
    setLeaveDetails(updatedLeaveDetails);
    setLeaveStatus(status);
    setCancelReason(false);
  };

  return (
    <div>
      {leaveDetails && (
        <div className={styles.leaveDetailsDiv1}>
          <div className={styles.leaveDetailsDiv2}>
            <div className={styles.leaveDetailsDiv3}>
              <div className={styles.leaveDetailsDiv4}>
                <div className={styles.leaveDetailsDiv5}>
                  <div className={styles.leaveDetailsDiv6}>
                    <table className={styles.leaveDetailsTable}>
                      <thead>
                        {window.innerWidth > 664 &&
                          sortOptions.map((heading) => {
                            return (
                              <th
                                key={heading.value}
                                className={styles.leaveDetailsTableHead}
                              >
                                <p
                                  className={
                                    styles.leaveDetailsTableHeadSection
                                  }
                                >
                                  {heading.name}
                                </p>
                              </th>
                            );
                          })}
                      </thead>
                      <tbody className={styles.leaveDetailsTableBody}>
                        {isLoading ? (
                          <tr>
                            <td
                              className={styles.LeaveDetailsNoRecord}
                              colSpan={11}
                            >
                              <p className={styles.LeaveDetailsNoRecordP}>
                                <div className={styles.LoaderDivision}>
                                  <RiLoader4Line className={styles.loader} />
                                </div>
                              </p>
                            </td>
                          </tr>
                        ) : filteredLeaveDetails.length > 0 ? (
                          CurrentData.map((leave: any, index: any) => (
                            <tr key={index}>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='S.No'
                              >
                                {index + 1}
                              </td>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='ID'
                              >
                                {leave.ID}
                              </td>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Leave'
                              >
                                {leave.Leave}
                              </td>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Leave Type'
                              >
                                {leave.LeaveType}
                              </td>
                              {window.innerWidth >= 666 ? (
                                <>
                                  <td
                                    className={styles.leaveDetailsDescription}
                                    data-label='Start Date'
                                  >
                                    <div
                                      className={`${styles.leaveApprovalButtonDiv} ${styles.leaveApprovalDate}`}
                                    >
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {leave.FromDate}
                                      </span>
                                    </div>
                                  </td>
                                  <td
                                    className={styles.leaveDetailsDescription}
                                    data-label='End Date'
                                  >
                                    <div
                                      className={`${styles.leaveApprovalButtonDiv} ${styles.leaveApprovalDate}`}
                                    >
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {leave.ToDate}
                                      </span>
                                    </div>
                                  </td>
                                </>
                              ) : (
                                <td className={styles.leaveDetailsDescription}>
                                  <div
                                    className={`${styles.leaveApprovalButtonDiv} ${styles.leaveApprovalDate}`}
                                  >
                                    <p data-label='From Date'>
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {leave.FromDate}
                                      </span>
                                    </p>
                                    <span>-</span>
                                    <p data-label='To Date'>
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        {leave.ToDate}
                                      </span>
                                    </p>
                                  </div>
                                </td>
                              )}
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Reason'
                              >
                                <div
                                  className={`${styles.leaveApprovalButtonDiv
                                    } ${expandedID === null
                                      ? styles.leaveApprovalButtonDiv1
                                      : styles.leaveApprovalButtonDiv2
                                    }`}
                                >
                                  {leave.Reason.length > MAX_LENGTH ? (
                                    <>
                                      {!expandedID ||
                                        expandedID !== leave.leaveID ? (
                                        <div className={styles.scrollable}>
                                          <p className={styles.reason}>
                                            <p
                                              style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                display: 'flex',
                                              }}
                                            >{`${leave.Reason.slice(
                                              0,
                                              MAX_LENGTH
                                            )}`}</p>
                                            <a
                                              onClick={() => {
                                                setExpandedID(leave.leaveID);
                                              }}
                                              id={`reason-link-${leave.leaveID}`}
                                              className={styles.clickHere}
                                            >
                                              <RxBorderDotted />
                                            </a>
                                          </p>
                                        </div>
                                      ) : (
                                        <>
                                          <div className={styles.scrollable}>
                                            <p className={styles.reason}>
                                              <p
                                                id={`reason-${leave.leaveID}`}
                                                style={{
                                                  whiteSpace: 'initial',
                                                }}
                                              >
                                                {leave.Reason}
                                              </p>
                                            </p>
                                          </div>
                                          <a
                                            onClick={() => {
                                              setExpandedID(null);
                                            }}
                                            id={`reason-link-${leave.leaveID}`}
                                            className={styles.ShowLess}
                                          >
                                            {!expandedID ? (
                                              'Show less'
                                            ) : (
                                              <button className={styles.arrow}>
                                                <MdKeyboardDoubleArrowUp />
                                              </button>
                                            )}
                                          </a>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    <div>{leave.Reason}</div>
                                  )}
                                </div>
                              </td>

                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Days'
                              >
                                {leave.Days}
                              </td>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Status'
                              >
                                <span
                                  className={`${leave.Status === 'Pending'
                                      ? `${styles.leaveStatusPending}`
                                      : ''
                                    } ${leave.Status === 'Approved'
                                      ? `${styles.leaveStatusApprove}`
                                      : ''
                                    } ${leave.Status === 'Cancelled'
                                      ? `${styles.leaveStatusCancel}`
                                      : ''
                                    } ${leave.Status === 'Rejected'
                                      ? `${styles.leaveStatusReject}`
                                      : ''
                                    }`}
                                >
                                  <span
                                    aria-hidden
                                    className={styles.leaveStatusSpan}
                                  >
                                    {leave.Status}
                                  </span>
                                </span>
                              </td>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Remark'
                              >
                                {leave.Remark}
                              </td>
                              <td
                                className={styles.leaveDetailsDescription}
                                data-label='Action'
                              >
                                {leave.Status === 'Pending' ? (
                                  <button
                                    style={{ margin: '0px 2rem' }}
                                    onClick={() => {
                                      setLeaveID(leave.leaveID);
                                      setCancelReason(true);
                                    }}
                                    className={styles.leaveCancelButton}
                                  >
                                    Cancel
                                  </button>
                                ) : (
                                  <p
                                    style={{
                                      paddingLeft: '1rem',
                                      paddingRight: '1rem',
                                      paddingTop: '0.5rem',
                                      paddingBottom: '0.5rem',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {leave.Status}
                                  </p>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          CurrentData.length === 0 && (
                            <tr>
                              <td
                                className={styles.LeaveDetailsNoRecord}
                                colSpan={11}
                              >
                                <p className={styles.LeaveDetailsNoRecordP}>
                                  No records found
                                </p>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {filteredLeaveDetails.length > 0 && (
            <div>
              <Pagination
                totalData={filteredLeaveDetails.length}
                dataPerPage={dataPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          )}
        </div>
      )}
      {!isLoading && (
        <div className={styles.applyLeaveButtonDiv}>
          <Link to={'/Apply Leave'}>
            <button className={styles.applyLeaveButton}>Apply Leave</button>
          </Link>
        </div>
      )}
      {cancelReason && (
        <div className={styles.cancelReason}>
          <div className={styles.align}>
            <div className={styles.cancelReasonDiv1}>
              <div className={styles.cancelReasonDiv2}>
                <header className={styles.header}>
                  <div className={styles.headerDiv}>
                    Enter the reason for cancellation (Optional)
                  </div>
                </header>
                <button
                  type='button'
                  onClick={() => setCancelReason(false)}
                  style={{
                    color: 'rgb(153,171,180)',
                    borderRadius: '50%',
                    border: 'none',
                  }}
                  className={styles.CloseButton}
                >
                  <MdOutlineCancel />
                </button>
              </div>
              <div className={styles.inputContainer}>
                <form className={styles.cancelReasonTextarea}>
                  <div className=''>
                    <textarea
                      rows={3}
                      cols={50}
                      style={{ resize: 'none' }}
                      placeholder='Enter the reason...'
                      onChange={(event) => setReason(event.target.value)}
                      className={styles.CancelReasonTextarea}
                      value={reason}
                    />
                  </div>
                  <div className={styles.button}>
                    <button
                      className={styles.buttonSubmit}
                      onClick={() => handleCancel(leaveID, reason, 'Cancelled')}
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};