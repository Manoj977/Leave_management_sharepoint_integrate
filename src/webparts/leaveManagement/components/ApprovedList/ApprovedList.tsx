/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { MyContext } from '../../context/contextProvider';

import CurrentMonth from '../Currentmonth/CurrentMonth';
import Table from '../Table/Table';
import CurrentMonthLop from '../../../functions/CurrentMonthLop';
import LeaveCalculationFunc from '../../../functions/LeaveCalculationFunc';
type LeaveDetail = {
  leaveID: number;
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  FromDate: string;
  ToDate: string;
  LeaveType: string;
  Reason: string;
  Days: number;
  leaveDays: number;
  NoofDaysLeave: string;
  lop: number;
  Status: string;
  Remark: string;
  [key: string]: any;
};
type EachLeaveDetail = {
  ID: string;
  Name: string;
  Email: string;
  Days: number;
  Status: string;
};
type TableHeading = {
  name: string;
  value: string;
};
const TableHeading: TableHeading[] = [
  { name: 'S.No', value: 'S.No' },
  { name: 'ID', value: 'ID' },
  { name: 'Name', value: 'Name' },
  // { name: 'Leave', value: 'Leave' },
  // { name: 'Leave Type', value: 'Leave Type' },
  // { name: 'Date', value: 'Date' },
  // { name: 'Date', value: 'Date' },
  { name: 'Total Leave Taken', value: 'Total Leave Taken' },
  { name: 'Loss of Pay', value: 'Loss of Pay' },
  { name: 'Status', value: 'Status' },
  // { name: 'Remark', value: 'Remark' },
  // { name: 'Action', value: 'Action' },
];
export const ApprovedList: React.FC = () => {
  let {
    defaultLop,
    lossOfPay,
    lopEmail,
    lopData,
    setLopData,
    setLopEmail,
    lopCalc,
    eachData,
  } = React.useContext(MyContext);
  // Assuming lopCalc is an array containing the objects you mentioned

  useEffect(() => {
    setLopData(lopData);
    setLopEmail(lopEmail);
  }, []);
  useEffect(() => {
    setLopData(lopData);
    setLopEmail(lopEmail);
  }, [setLopData, lopData, setLopEmail, lopEmail]);
  lopCalc = lopCalc.filter((item: any) => item.Email !== '');

  const [LeaveDetails, setLeaveDetails] = useState<EachLeaveDetail[]>([]);
  const [EachLeave, setEachLeave] = useState<LeaveDetail[]>([]);
  const [EachLeaveDetails, setEachLeaveDetails] = useState<LeaveDetail[]>([]);
  const tableRef = useRef(null);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedOption, setSelectedOption] = React.useState('');
  const [dataPerPage] = useState(15);
  const [, setEmployeeId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalLeave, setTotalLeave] = useState<Record<string, number>>({});
  const calculateTotalLeaveCount = (
    employeeId: string,
    leaveDetails: LeaveDetail[]
  ) => {
    return leaveDetails.reduce((total, leave) => {
      if (leave.EmployeeId === employeeId) {
        return total + leave.Days;
      }
      return total;
    }, 0);
  };

  useEffect(() => {
    const func = () => {
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
                  LopFromDate: new Date(
                    entry.content['m:properties']['d:FormDate']._text
                  )
                    .toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })
                    .split(' ')
                    .join('-'),
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
                  LopToDate: new Date(
                    entry.content['m:properties']['d:ToDate']._text
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
                  Days: parseFloat(
                    entry.content['m:properties']['d:count']._text
                  ),
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
          setEachLeaveDetails(leaveDetail);
          setEachLeave(leaveDetail);
          // Calculate total leave for each employee
          const leaveTotals: Record<string, number> = {};
          leaveDetail.forEach((item) => {
            const id = item.ID;
            if (!leaveTotals[id]) {
              leaveTotals[id] = item.Days;
            } else {
              leaveTotals[id] += item.Days;
            }
          });

          // Create consolidated entries for employees with multiple leaves
          const consolidatedLeaveDetail: EachLeaveDetail[] = [];

          leaveDetail.forEach((item) => {
            const id = item.ID;
            const status = item.Status;
            const totalLeave = leaveTotals[id];
            const existingEntry = consolidatedLeaveDetail.find(
              (entry) => entry.ID === id && entry.Status === status
            );
            if (existingEntry) {
              existingEntry.Days += item.Days;
            } else {
              consolidatedLeaveDetail.push({
                ID: id,
                Name: item.Name,
                Email: item.Email,
                Days: item.Days,
                Status: item.Status,
              });
            }
          });
          setLeaveDetails(consolidatedLeaveDetail);
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
    func();
  }, []);

  const awaitDetails = LeaveDetails.map((e: any) => {
    if (e.Status !== 'Pending' && e.Status !== 'Cancelled') return e;
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

  interface LeaveDetails {
    ID: string;
    Name: string;
    Email: string;
    FromDate: string;
    ToDate: string;
    leaveDays: number;
    Status: string;
  }

  interface EmployeeLeaves {
    [key: string]: LeaveDetails[];
  }
  const leaveDetailss: EmployeeLeaves = {};
  let leavesThisMonth: LeaveDetails[] = [];
  let ID: any[] = [];
  let notInMonth: any[] = [];
  let currentMonthLeave: any[] = [];
  let CurrentYearLeave: any[] = [];
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  // Initialize variables
  const data: any[] = [];
  let curtLop: any[] = [];
  let uniqueDatas: any[] = [];
  CurrentData.map((leave, index) => {
    if (leave.Status === 'Approved') {
      EachLeaveDetails.map((e) => {
        if (!leaveDetailss[e.ID]) {
          leaveDetailss[e.ID] = [];
        }
        leaveDetailss[e.ID].push({
          ID: e.ID,
          Name: e.Name,
          Email: e.Email,
          FromDate: e.FromDate,
          ToDate: e.ToDate,
          leaveDays: e.Days,
          Status: e.Status,
        });
        if (e.Status === 'Approved') {
          uniqueDatas.push(e);
          ID.push(e.ID);
        }
      });
    }
  });
  let uniqueID: any[] = [];
  ID = uniqueID = Array.from(
    new Set(ID.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));
  uniqueDatas = Array.from(
    new Set(uniqueDatas.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));

  uniqueDatas.map((CurrentDataleaves, index) => {
    ID.map((ID, index) => {
      if (CurrentDataleaves.ID === ID) {
        const fromDate = new Date(CurrentDataleaves.FromDate);
        const toDate = new Date(CurrentDataleaves.ToDate);

        const LeaveTakenYear = fromDate.getFullYear();
        const LeaveTakenMonth = fromDate.getMonth() + 1;

        if (
          LeaveTakenYear === currentYear &&
          LeaveTakenMonth === currentMonth
        ) {
          currentMonthLeave.push(CurrentDataleaves);
        }
        if (
          LeaveTakenYear === currentYear &&
          LeaveTakenMonth !== currentMonth
        ) {
          notInMonth.push(CurrentDataleaves);
        }
        if (LeaveTakenYear === currentYear) {
          CurrentYearLeave.push(CurrentDataleaves);
        }
      }
    });
  });
  currentMonthLeave = Array.from(
    new Set(currentMonthLeave.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));
  notInMonth = Array.from(
    new Set(notInMonth.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));
  CurrentYearLeave = Array.from(
    new Set(CurrentYearLeave.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));

  // console.log(currentMonthLeave, 'currentMonthLeave');
  // console.log(notInMonth, 'notInMonth');
  // console.log(CurrentYearLeave, 'CurrentYearLeave');
  // Remove duplicates from the data array
  const uniqueData = Array.from(
    new Set(data.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));
  const curtLopuniqueData = Array.from(
    new Set(curtLop.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));

  CurrentMonthLop(uniqueData, EachLeaveDetails);
  let totalLeaves = 12;

  // if (parseInt(defaultLop) === 3) {
  //   const filteredData = EachLeaveDetails.filter(
  //     (e) => e !== undefined && e.Status === 'Approved'
  //   );

  //   const quarterLeaveCounts = [0, 0, 0, 0];
  //   const lopDates: any[] = [];

  //   const ApprovedLeaveDetails = filteredData.filter(
  //     (leaveDetail) => leaveDetail.Status === 'Approved'
  //   );

  //   ApprovedLeaveDetails.forEach((leaveDetail) => {
  //     const quarterIndex = Math.floor(
  //       new Date(leaveDetail.FromDate).getMonth() / defaultLop
  //     );

  //     quarterLeaveCounts[quarterIndex] += leaveDetail.Days;
  //   });

  //   let lossOfPay = 0;

  //   quarterLeaveCounts.forEach((quarterCount, quarterIndex) => {
  //     if (quarterCount > parseInt(defaultLop)) {
  //       const excessLeaveCount = quarterCount - defaultLop;
  //       quarterLeaveCounts[quarterIndex] = defaultLop;
  //       lossOfPay += (excessLeaveCount * totalLeaves) / 12;

  //       ApprovedLeaveDetails.forEach((leaveDetail) => {
  //         const leaveStartMonth = new Date(leaveDetail.FromDate).getMonth();
  //         const leaveEndMonth = new Date(leaveDetail.ToDate).getMonth();
  //         const quarterStartMonth = quarterIndex * defaultLop;
  //         const quarterEndMonth = (quarterIndex + 1) * defaultLop - 1;

  //         if (
  //           leaveStartMonth >= quarterStartMonth &&
  //           leaveEndMonth <= quarterEndMonth
  //         ) {
  //           const startDate = new Date(leaveDetail.FromDate);
  //           const endDate = new Date(leaveDetail.ToDate);

  //           for (
  //             let currentDate = startDate;
  //             currentDate <= endDate;
  //             currentDate.setDate(currentDate.getDate() + 1)
  //           ) {
  //             if (
  //               currentDate.getDay() !== 0 &&
  //               currentDate.getDay() !== 6 &&
  //               quarterLeaveCounts[
  //                 Math.floor(currentDate.getMonth() / defaultLop)
  //               ] < defaultLop
  //             ) {
  //               lopDates.push(currentDate);
  //               quarterLeaveCounts[
  //                 Math.floor(currentDate.getMonth() / defaultLop)
  //               ]++;
  //             }
  //           }
  //         }
  //       });
  //     }
  //   });

  //   const totalQuarterLeaveCount = quarterLeaveCounts.reduce(
  //     (total, count) => total + count,
  //     0
  //   );

  //   if (totalQuarterLeaveCount <= totalLeaves) {
  //     console.log(
  //       'Remaining Leave Count:',
  //       totalLeaves - totalQuarterLeaveCount
  //     );
  //   }

  //   console.log('Loss of Pay: ', lossOfPay);
  //   console.log('Loss of Pay Dates:', lopDates);
  // }
  let emails: any[] = [];
  CurrentData.map((e) => {
    if (e.Status === 'Approved') {
      emails.push(e.Email);
    }
  });
  const emailentry = Array.from(
    new Set(emails.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));
  let employeeEmail: any[] = [];
  emailentry.map((e) => {
    if (e) {
      employeeEmail.push(e);
      lopEmail.push(e);
    }
  });

  // let t = Array.from(new Set(lopEmail.map((item) => JSON.stringify(item)))).map(
  //   (item) => JSON.parse(item)
  // );

  LeaveCalculationFunc();

  // t.map((e: any) => {
  //   console.log(e);
  // });
  useEffect(() => {
    lopCalc;
  }, [lopCalc]);
  CurrentData.map((currentData) => {
    lopCalc.map((lopData: any) => {
      // console.log(currentData.Days);
      // console.log(parseFloat(defaultLop));
      // console.log(currentData.Email);
      // console.log(lopData.Email);
      if (currentData.Email === lopData.Email) {
      }

      if (
        currentData.Email === lopData.Email &&
        currentData.Days > parseFloat(defaultLop)
      ) {
        currentData.lop = lopData.lop;
      } else if (
        currentData.Email === lopData.Email &&
        currentData.Days < parseFloat(defaultLop)
      ) {
        currentData.lop = 0;
      }
    });
  });
  return (
    <div>
      <div className={styles.leaveapproval}>
        {CurrentData && (
          <div>
            <div className={styles.topSection}>
              <div>
                <p className={styles.defaultLop}>
                  Default Lop Calculation:
                  {parseInt(defaultLop) === 1 && <span> Monthly</span>}
                  {parseInt(defaultLop) === 3 && <span> Quarterly </span>}
                  {parseInt(defaultLop) === 12 && <span> Yearly </span>}
                </p>
              </div>
              <div className={styles.headSection}>
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
                  <CurrentMonth
                    data={{
                      // table: uniqueData,

                      Lop: lopCalc,
                      CurrentData: CurrentData,
                      CurrentMonthLeave: currentMonthLeave,
                      CurrentYearLeave: CurrentYearLeave,
                    }}
                  />
                </div>
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
                                    option.value !== 'Status' &&
                                    // option.value !== 'Loss of Pay' &&
                                    // option.value !== 'No of Days Leave' &&
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
                                  leave.Status === 'Approved' && (
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
                                      {/* <td
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
                                      </td> */}
                                      {/* <td
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
                                      </td> */}
                                      {/* <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Total Leave'
                                      >
                                        {totalLeave[leave.ID]}
                                      </td> */}
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Total Leave Taken'
                                      >
                                        {leave.Days}
                                      </td>
                                      <td
                                        className={
                                          styles.leaveDetailsDescription
                                        }
                                        data-label='Loss of Pay'
                                      >
                                        {leave.lop}
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

                                      {/* <td
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
                                      </td> */}
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
      {console.log(eachData)}
    </div>
  );
};
