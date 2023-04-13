/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-self-compare */
import React, { useEffect, useState } from "react";
import { MyContext } from "../../context/contextProvider";
import convert from "xml-js";
import Pagination from "../Pagination/Pagination";
import styles from "./LeaveApproval.module.scss";
import ApprovalPage from "../ApprovalPage/ApprovalPage";
import { FaSortUp, FaSortDown } from "react-icons/fa";
// import { AiOutlineSearch } from 'react-icons/ai';
import { RiLoader4Line } from "react-icons/ri";

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
  { name: "S.No", value: "S.No" },
  { name: "ID", value: "ID" },
  { name: "Name", value: "Name" },
  // { name: 'Email', value: 'Email' },
  { name: "Leave", value: "Leave" },
  { name: "Leave Type", value: "Leave Type" },
  { name: "Date", value: "Date" },
  // { name: 'Reason', value: 'Reason' },
  { name: "Days", value: "Days" },
  { name: "Status", value: "Status" },
  { name: "Remark", value: "Remark" },
  { name: "Action", value: "Action" },
];
export const LeaveApproval: React.FC = () => {
  const { action, setAction } = React.useContext(MyContext);

  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  // const [filteredData] = useState(LeaveDetails);
  const [approve, setApprove] = useState<string>("Pending");
  const [remark, setRemark] = useState<string>("-");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedOption, setSelectedOption] = React.useState('');
  const [dataPerPage] = useState(4);
  const [employeeId, setEmployeeId] = useState(0);

  useEffect(() => {
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
        const leaveDetail: LeaveDetail[] = entries.map((entry: any) => ({
          ID: entry.content["m:properties"]["d:Title"]._text,
          Name: entry.content["m:properties"]["d:Name"]._text,
          Email: entry.content["m:properties"]["d:Email"]._text,
          Leave: entry.content["m:properties"]["d:Leave"]._text,
          LeaveType: entry.content["m:properties"]["d:LeaveType"]._text,
          count: entry.content["m:properties"]["d:count"]._text,
          FromDate: new Date(
            entry.content["m:properties"]["d:FormDate"]._text
          ).toLocaleDateString(),
          ToDate: new Date(
            entry.content["m:properties"]["d:ToDate"]._text
          ).toLocaleDateString(),
          Reason: entry.content["m:properties"]["d:Reason"]._text,
          Status: entry.content["m:properties"]["d:Status"]._text,
          Remark: entry.content["m:properties"]["d:Remark"]._text,
          Days: entry.content["m:properties"]["d:count"]._text,
          leaveID: entry.content["m:properties"]["d:ID"]._text,
        }));
        setLeaveDetails(leaveDetail);
      })
      .catch((err) => console.log(err));
  }, []);
  let filteredEmployees;
  let CurrentData: LeaveDetail[];
  const handleSort = (sortBy: string) => {
    setSortOrder(
      sortBy === sortBy ? (sortOrder === "asc" ? "desc" : "asc") : "asc"
    );
    setSortBy(sortBy);
  };
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event: any) => {
    setSearchTerm(event.target.value);
  };
  console.log(LeaveDetails);
  // const handleDropdownChange = (
  //   event: React.FormEvent<HTMLSelectElement>
  // ): void => {
  //   setSelectedOption(event.currentTarget.value);
  // };

  if (LeaveDetails !== null) {
    filteredEmployees = LeaveDetails.filter(
      (employee) =>
        searchTerm === "" ||
        employee.Name.toLowerCase()
          .replace(/\s/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s/g, "")) ||
        employee.ID.toString()
          .toLowerCase()
          .replace(/\s/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s/g, "")) ||
        // employee.Email.toLowerCase()
        //   .replace(/\s/g, '')
        //   .includes(searchTerm.toLowerCase().replace(/\s/g, '')) ||
        employee.Status.toLowerCase()
          .replace(/\s/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s/g, "")) ||
        employee.Leave.toLowerCase()
          .replace(/\s/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s/g, "")) ||
        employee.LeaveType.toLowerCase()
          .replace(/\s/g, "")
          .includes(searchTerm.toLowerCase().replace(/\s/g, ""))
    );

    const sortedItems = filteredEmployees.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === "asc") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue > bValue) return -1;
        if (aValue < bValue) return 1;
        return 0;
      }
    });
    const indexOfLastPage = currentPage * dataPerPage;
    const indexFirstData = indexOfLastPage - dataPerPage;
    CurrentData = sortedItems.slice(indexFirstData, indexOfLastPage);
  }

  const handleApproval = (leaveID: number) => {
    setEmployeeId(leaveID);
    setAction(true);
  };
  console.log("CurrentData", CurrentData.length);
  return (
    <div>
      <div className={styles.leaveapproval}>
        {CurrentData && (
          <div>
            <div className={styles.leaveapprovalSearchBox}>
              {/* <p className={styles.searchLabel}>Search:</p> */}
              <input
                type="search"
                id="search-dropdown"
                className={styles.leaveapprovalInput}
                placeholder={"Search...."}
                value={searchTerm}
                onChange={handleSearch}
                autoComplete="off"
                required
              />
              {/* <select value={selectedOption} onChange={handleDropdownChange}>
                <option value="">All</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select> */}
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
                                    option.value !== "S.No" &&
                                    option.value !== "Date" &&
                                    option.value !== "Leave Type" &&
                                    option.value !== "Reason" &&
                                    option.value !== "Action";

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
                                          sortOrder === "asc" && (
                                            <span>
                                              <FaSortUp />
                                            </span>
                                          )}
                                        {shouldDisplayIcon &&
                                          sortBy === option.value &&
                                          sortOrder === "desc" && (
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
                            {CurrentData.map((leave, index) => (
                              <tr key={index}>
                                {window.innerWidth > 590 && (
                                  <td
                                    className={styles.leaveDetailsDescription}
                                    data-label="S.No"
                                  >
                                    {CurrentData.indexOf(leave) + 1}
                                  </td>
                                )}
                                <td
                                  className={`${styles.leaveDetailsDescription}`}
                                  data-label="ID"
                                >
                                  {leave.ID}
                                </td>
                                <td
                                  className={styles.leaveDetailsDescription}
                                  data-label="Name"
                                >
                                  {leave.Name}
                                </td>
                                <td
                                  className={styles.leaveDetailsDescription}
                                  data-label="Leave"
                                >
                                  {leave.Leave}
                                </td>
                                <td
                                  className={styles.leaveDetailsDescription}
                                  data-label="Leave Type"
                                >
                                  {leave.LeaveType}
                                </td>
                                <td className={styles.leaveDetailsDescription}>
                                  <div
                                    className={`${styles.leaveApprovalButtonDiv} ${styles.leaveApprovalDate}`}
                                  >
                                    <p data-label="From Date">
                                      {leave.FromDate}
                                    </p>
                                    <span>-</span>
                                    <p data-label="To Date">{leave.ToDate}</p>
                                  </div>
                                </td>
                                <td
                                  className={styles.leaveDetailsDescription}
                                  data-label="Days"
                                >
                                  {leave.Days}
                                </td>
                                <td
                                  className={styles.leaveDetailsDescription}
                                  data-label="Status"
                                >
                                  <span
                                    className={`${
                                      leave.Status === "Pending"
                                        ? `${styles.leaveStatusPending}`
                                        : ""
                                    } ${
                                      leave.Status === "Approved"
                                        ? `${styles.leaveStatusApprove}`
                                        : ""
                                    } ${
                                      leave.Status === "Cancelled"
                                        ? `${styles.leaveStatusCancel}`
                                        : ""
                                    } ${
                                      leave.Status === "Rejected"
                                        ? `${styles.leaveStatusReject}`
                                        : ""
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
                                  data-label="RemarK"
                                >
                                  {leave.Remark}
                                </td>
                                <td
                                  className={styles.leaveDetailsDescription}
                                  data-label="Status"
                                >
                                  <div
                                    className={styles.leaveApprovalButtonDiv}
                                  >
                                    <div>
                                      {leave.Status === "Pending" ? (
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
                            ))}
                            {(CurrentData === undefined &&
                              LeaveDetails !== undefined) ||
                              (LeaveDetails.length !== 0 &&
                                CurrentData.length === 0 && (
                                  <tr>
                                    <td
                                      className={styles.LeaveDetailsNoRecord}
                                      colSpan={9}
                                    >
                                      <p
                                        style={{
                                          textAlign: "center",
                                          fontWeight: 400,
                                        }}
                                      >
                                        No records found
                                      </p>
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {filteredEmployees === undefined ||
                      (filteredEmployees.length > 0 && (
                        <div>
                          <Pagination
                            totalData={filteredEmployees.length}
                            dataPerPage={dataPerPage}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {LeaveDetails === undefined ||
                (LeaveDetails.length === 0 && (
                  <div className={styles.LoaderDivision}>
                    <RiLoader4Line className={styles.loader} />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      {action && (
        <ApprovalPage
          employeeId={employeeId}
          setApprove={setApprove}
          approve={approve}
          setRemark={setRemark}
          remark={remark}
        />
      )}
    </div>
  );
};
