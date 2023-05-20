/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-self-compare */
import React, { useEffect, useState, useRef } from 'react';
import convert from 'xml-js';
import Pagination from '../Pagination/Pagination';
import styles from './ApprovedList.module.scss';
import { FaSortUp, FaSortDown } from 'react-icons/fa';
import { RiLoader4Line } from 'react-icons/ri';

import LeaveCalculation from '../LeaveCalculation/LeaveCalculation';
import LopCalculation from '../LopCalculation/LopCalculation';

import CurrentMonth from '../Currentmonth/CurrentMonth';
type LeaveDetail = {
  leaveID: number;
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  FromDate: Date;
  ToDate: Date;
  LeaveType: string;
  Reason: string;
  Days: string;
  Status: string;
  Remark: string;
  [key: string]: any;
};
type TableHeading = {
  name: string;
  value: string;
};
const TableHeading: TableHeading[] = [
  { name: 'S.No', value: 'S.No' },
  { name: 'ID', value: 'ID' },
  { name: 'Name', value: 'Name' },
  { name: 'Leave', value: 'Leave' },
  { name: 'Leave Type', value: 'Leave Type' },
  { name: 'Date', value: 'Date' },
  { name: 'Days', value: 'Days' },
  { name: 'Status', value: 'Status' },
  { name: 'Remark', value: 'Remark' },
  { name: 'Action', value: 'Action' },
];
export const ApprovedList: React.FC = () => {
  LeaveCalculation();
  LopCalculation();

  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  // const [PendingLeaveDetails, setPendingLeaveDetails] = useState<LeaveDetail[]>(
  //   []
  // );
  const tableRef = useRef(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedOption, setSelectedOption] = React.useState('');
  const [dataPerPage] = useState(5);
  const [, setEmployeeId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const func = () => {
    setIsLoading(true);
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Leave%20Management')/items"
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
                LopFromDate: entry.content['m:properties']['d:FormDate']._text,
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
                LopToDate: entry.content['m:properties']['d:ToDate']._text,
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
  };

  useEffect(() => {
    func();
  }, []);
  const awaitDetails = LeaveDetails.map((e: any) => {
    if (e.Status !== 'Pending') return e;
  });

  const state = awaitDetails.filter((details) => {
    return details !== undefined;
  });

  let filteredEmployees: LeaveDetail[] = [];
  let CurrentData: LeaveDetail[];
  const handleSort = (sortBy: string) => {
    setSortOrder(
      sortBy === sortBy ? (sortOrder === 'asc' ? 'desc' : 'asc') : 'asc'
    );
    setSortBy(sortBy);
  };

  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value.toLowerCase().replace(/\s/g, ''));
  };
  console.log(filteredEmployees);
  // const handleDropdownChange = (
  //   event: React.FormEvent<HTMLSelectElement>
  // ): void => {
  //   setSelectedOption(event.currentTarget.value);
  // };
  let indexFirstData = 0;
  let indexOfLastPage = 0;
  if (state && Array.isArray(state)) {
    filteredEmployees = state.filter((employee) => {
      const name = employee.Name
        ? employee.Name.toLowerCase().replace(/\s/g, '')
        : '';
      const id = employee.ID
        ? employee.ID.toString().toLowerCase().replace(/\s/g, '')
        : '';
      const status = employee.Status
        ? employee.Status.toLowerCase().replace(/\s/g, '')
        : '';
      const leave = employee.Leave
        ? employee.Leave.toLowerCase().replace(/\s/g, '')
        : '';
      const leaveType = employee.LeaveType
        ? employee.LeaveType.toLowerCase().replace(/\s/g, '')
        : '';

      return (
        searchTerm === '' ||
        name.includes(searchTerm) ||
        id.includes(searchTerm) ||
        status.includes(searchTerm) ||
        leave.includes(searchTerm) ||
        leaveType.includes(searchTerm)
      );
    });

    const sortedItems = filteredEmployees.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === 'asc') {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });

    indexFirstData = (currentPage - 1) * dataPerPage;
    indexOfLastPage = Math.min(
      indexFirstData + dataPerPage,
      sortedItems.length
    );
    if (searchTerm.length !== 0) {
      CurrentData = sortedItems;
    } else {
      CurrentData = sortedItems.slice(indexFirstData, indexOfLastPage);
    }
  }

  const handleApproval = (leaveID: number) => {
    setEmployeeId(leaveID);
  };
  useEffect(() => {
    func();
  }, []);
  return (
    <div>
      <div className={styles.leaveapproval}>
        {CurrentData && (
          <div>
            <div className={styles.topSection}>
              <div className={styles.leaveapprovalSearchBox}>
                {/* <p className={styles.searchLabel}>Search:</p> */}
                <input
                  type='search'
                  id='search-dropdown'
                  className={styles.leaveapprovalInput}
                  placeholder={'Search....'}
                  value={searchTerm}
                  onChange={handleSearch}
                  autoComplete='off'
                  required
                />
                {/* <select value={selectedOption} onChange={handleDropdownChange}>
                <option value="">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select> */}
              </div>
              <div className={styles.export}>
                <CurrentMonth table={(filteredEmployees)} />
              </div>
            </div>
            <div className={styles.leaveDetailsDiv1}>
              <div className={styles.leaveDetailsDiv2}>
                <div className={styles.leaveDetailsDiv3}>
                  <div className={styles.leaveDetailsDiv4}>
                    <div className={styles.leaveDetailsDiv5}>
                      <div className={styles.leaveDetailsDiv6}>
                        <table className={styles.leaveDetailsTable}>
                          <thead>
                            <tr>
                              {window.innerWidth > 664 &&
                                TableHeading.map((option) => {
                                  const shouldDisplayIcon =
                                    option.value !== 'S.No' &&
                                    option.value !== 'Date' &&
                                    option.value !== 'Leave Type' &&
                                    option.value !== 'Reason' &&
                                    option.value !== 'Action';

                                  return (
                                    <th
                                      key={option.value}
                                      className={styles.leaveDetailsTableHead}
                                      onClick={() => {
                                        handleSort(option.value);
                                        setSortBy(option.value);
                                      }}
                                    >
                                      <p
                                        className={
                                          styles.leaveDetailsTableHeadSection
                                        }
                                      >
                                        {option.name}
                                        {shouldDisplayIcon &&
                                          sortBy === option.value &&
                                          sortOrder === 'asc' && (
                                            <span>
                                              <FaSortUp />
                                            </span>
                                          )}
                                        {shouldDisplayIcon &&
                                          sortBy === option.value &&
                                          sortOrder === 'desc' && (
                                            <span>
                                              <FaSortDown />
                                            </span>
                                          )}
                                      </p>
                                    </th>
                                  );
                                })}
                            </tr>
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
                                      <RiLoader4Line
                                        className={styles.loader}
                                      />
                                    </div>
                                  </p>
                                </td>
                              </tr>
                            ) : filteredEmployees.length > 0 ? (
                              CurrentData.map(
                                (leave, index) =>
                                  leave.Status !== 'Pending' && (
                                    <tr key={index}>
                                      {window.innerWidth > 590 && (
                                        <td
                                          className={
                                            styles.leaveDetailsDescription
                                          }
                                          data-label='S.No'
                                        >
                                          {searchTerm.length === 0
                                            ? indexFirstData + index + 1
                                            : index + 1}
                                        </td>
                                      )}
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='ID'
                                      >
                                        {leave.ID}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Name'
                                        style={{
                                          textAlign: 'left',
                                          paddingLeft: '1.5rem',
                                        }}
                                      >
                                        {leave.Name}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Leave'
                                      >
                                        {leave.Leave}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Leave Type'
                                      >
                                        {leave.LeaveType}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                      >
                                        <div
                                          className={`${styles.leaveApprovalButtonDiv} ${styles.leaveApprovalDate}`}
                                        >
                                          <p
                                            data-label='From Date'
                                            className={styles.fromDate}
                                          >
                                            {leave.FromDate}
                                          </p>
                                          {window.innerWidth > 665 && (
                                            <span>-</span>
                                          )}
                                          <p
                                            data-label='To Date'
                                            className={styles.toDate}
                                          >
                                            {leave.ToDate}
                                          </p>
                                        </div>
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Days'
                                      >
                                        {leave.Days}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Status'
                                      >
                                        <span
                                          className={`${
                                            leave.Status === 'Approved' &&
                                            `${styles.leaveStatusApprove}`
                                          }
                                        ${
                                          leave.Status === 'Rejected' &&
                                          `${styles.leaveStatusReject}`
                                        }
                                      
                                          `}
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
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Remark'
                                      >
                                        {leave.Remark}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Action'
                                      >
                                        <div
                                          className={
                                            styles.leaveApprovalButtonDiv
                                          }
                                        >
                                          <div>
                                            {leave.Status === 'Pending' ? (
                                              <button
                                                onClick={() =>
                                                  handleApproval(leave.leaveID)
                                                }
                                                className={
                                                  styles.leaveApprovalViewButton
                                                }
                                              >
                                                Action
                                              </button>
                                            ) : (
                                              leave.Status && (
                                                <p>Leave {leave.Status}</p>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                              )
                            ) : (
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
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {filteredEmployees.length > 0 && (
                      <div>
                        <Pagination
                          totalData={filteredEmployees.length}
                          dataPerPage={dataPerPage}
                          setCurrentPage={setCurrentPage}
                          currentPage={currentPage}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
