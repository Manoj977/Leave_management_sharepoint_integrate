/* eslint-disable no-unused-expressions */ /* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import { MyContext } from "../../context/contextProvider";
import convert from "xml-js";
import Pagination from "../Pagination/Pagination";
import styles from "./LeaveApproval.module.scss";
import ApprovalPage from "../ApprovalPage/ApprovalPage";

type LeaveDetail = {
  leaveID: number;
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  FromDate: Date;
  ToDate: Date;
  LeaveType: Date;
  Reason: string;
  NoofDaysLeave: string;
  Status: string;
};

export const LeaveApproval: React.FC = () => {
  const { action, setAction } = React.useContext(MyContext);

  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  // const [filteredData] = useState(LeaveDetails);
  let [approve, setApprove] = useState<string>("Pending");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(2);
  const [searchTerm] = useState("");
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
          NoofDaysLeave: entry.content["m:properties"]["d:count"]._text,
          leaveID: entry.content["m:properties"]["d:ID"]._text,
        }));
        setLeaveDetails(leaveDetail);
      })
      .catch((err) => console.log(err));
  }, []);
  let filteredEmployees;
  let CurrentData;
  let handleSort: (event: any, property: any) => void;
  if (LeaveDetails !== null) {
    filteredEmployees = LeaveDetails.filter(
      (employee) =>
        employee.Name.toLowerCase().includes(searchTerm) ||
        employee.ID.toString().toLowerCase().includes(searchTerm)
    );
    handleSort = (event, property) => {
      event.preventDefault();
      if (property === sortBy) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortBy(property);
        setSortOrder("asc");
      }
    };
    filteredEmployees.sort((a, b) => {
      if (!sortBy) {
        return 0; // default sort
      }
      if (sortOrder === "asc") {
        return a < b ? -1 : 1;
      } else {
        return a < b ? 1 : -1;
      }
    });
    const indexOfLastPage = currentPage * dataPerPage;
    const indexFirstData = indexOfLastPage - dataPerPage;
    CurrentData = filteredEmployees.slice(indexFirstData, indexOfLastPage);
  }

  const handleApproval = (leaveID: number) => {
    setEmployeeId(leaveID);
    setAction(true);
  };
  console.log("test", employeeId);
  return (
    <div>
      <div className={styles.leaveapproval}>
        {CurrentData && (
          <div className={styles.leaveDetailsDiv1}>
            <div className={styles.leaveDetailsDiv2}>
              <div className={styles.leaveDetailsDiv3}>
                <div className={styles.leaveDetailsDiv4}>
                  <div className={styles.leaveDetailsDiv5}>
                    <div className={styles.leaveDetailsDiv6}>
                      <table className={styles.leaveDetailsTable}>
                        <thead>
                          <tr>
                            <th className={styles.leaveDetailsTableHead}>
                              S.No
                            </th>
                            <th
                              onClick={(event) => {
                                handleSort(event, "ID");
                              }}
                              className={styles.leaveDetailsTableHead}
                            >
                              ID
                            </th>
                            <th
                              onClick={(event) => {
                                handleSort(event, "Name");
                              }}
                              className={styles.leaveDetailsTableHead}
                            >
                              Name
                            </th>
                            <th
                              onClick={(event) => {
                                handleSort(event, "Email");
                              }}
                              className={styles.leaveDetailsTableHead}
                            >
                              Email
                            </th>
                            <th
                              onClick={(event) => {
                                handleSort(event, "Leave");
                              }}
                              className={styles.leaveDetailsTableHead}
                            >
                              Leave
                            </th>
                            <th
                              onClick={(event) => {
                                handleSort(event, "LeaveType");
                              }}
                              className={styles.leaveDetailsTableHead}
                            >
                              LeaveType
                            </th>
                            <th
                              onClick={(event) => {
                                handleSort(event, "FromDate");
                              }}
                              className={styles.leaveDetailsTableHead}
                            >
                              Date
                            </th>

                            <th className={styles.leaveDetailsTableHead}>
                              Reason
                            </th>
                            <th className={styles.leaveDetailsTableHead}>
                              No of Days Leave
                            </th>
                            <th className={styles.leaveDetailsTableHead}>
                              Status
                            </th>
                            <th className={styles.leaveDetailsTableHead}>
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className={styles.leaveDetailsTableBody}>
                          {CurrentData.map((leave, index) => (
                            <tr key={index}>
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="S.No"
                              >
                                {index + 1}
                              </td>
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="ID"
                              >
                                {leave.ID}
                              </td>
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="Name"
                              >
                                {leave.Name}
                              </td>
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="Email"
                              >
                                {leave.Email}
                              </td>
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="Leave"
                              >
                                {leave.Leave}
                              </td>
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="LeaveType"
                              >
                                {leave.LeaveType}
                              </td>{" "}
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="FromDate"
                              >
                                <div
                                  className={`${styles.leaveApprovalButtonDiv} ${styles.leaveApprovalDate}`}
                                >
                                  <span>{leave.FromDate}</span>-
                                  <span>{leave.ToDate}</span>
                                </div>
                              </td>{" "}
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="Reason"
                              >
                                {leave.Reason}
                              </td>{" "}
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="No of Days Leave"
                              >
                                {leave.NoofDaysLeave}
                              </td>{" "}
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="Status"
                              >
                                <span
                                  className={`${
                                    leave.Status === "Pending"
                                      ? `${styles.leaveStatusPeanding}`
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
                                  {" "}
                                  <span
                                    aria-hidden
                                    className={styles.leaveStatusSpan}
                                  >
                                    {" "}
                                    {leave.Status}{" "}
                                  </span>{" "}
                                </span>
                              </td>{" "}
                              <td
                                className={styles.leaveDetailsDescrition}
                                data-label="Status"
                              >
                                <div className={styles.leaveApprovalButtonDiv}>
                                  <div>
                                    <button
                                      onClick={() =>
                                        handleApproval(leave.leaveID)
                                      }
                                      className={styles.leaveApprovalViewButton}
                                    >
                                      Approve
                                    </button>
                                  </div>
                                  <div>
                                    <button
                                      className={styles.leaveRejectButton}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {filteredEmployees === undefined ||
              (filteredEmployees.length > 0 && (
                <div>
                  {" "}
                  <Pagination
                    totalData={filteredEmployees.length}
                    dataPerPage={dataPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />
                </div>
              ))}
          </div>
        )}
      </div>
      {action && (
        <ApprovalPage
          employeeId={employeeId}
          setApprove={setApprove}
          approve={approve}
        />
      )}
    </div>
  );
};
