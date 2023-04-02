/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import convert from "xml-js";
import { sp } from "@pnp/sp/presets/all";
import styles from "./LeaveDetails.module.scss";

import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
type LeaveDetail = {
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
export const LeaveDetails = () => {
  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(2);
  console.log(userEmail);
  useEffect(() => {
    // eslint-disable-next-line no-void

    void sp.web.currentUser.get().then((user) => {
      setUserEmail(user.Email);
    });
  }, []);
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
        }));
        setLeaveDetails(leaveDetail);
      })
      .catch((err) => console.log(err));
  }, []);
  const filteredLeaveDetails = LeaveDetails.filter(
    (detail) => detail.Email === userEmail
  );

  // pag

  const indexOfLastPage = currentPage * dataPerPage;
  const indexFirstData = indexOfLastPage - dataPerPage;
  const CurrentData: any =
    filteredLeaveDetails !== undefined
      ? filteredLeaveDetails.slice(indexFirstData, indexOfLastPage)
      : "";
  return (
    <div>
      {filteredLeaveDetails && (
        <div className={styles.leaveDetail}>
          <div className={styles.tableDetail}>
            <table className={styles.leaveTable}>
              <thead>
                <tr>
                  <th className={styles.tableHead}>S.No</th>
                  <th className={styles.tableHead}>ID</th>
                  <th className={styles.tableHead}>Leave</th>
                  <th className={styles.tableHead}>LeaveType</th>{" "}
                  <th className={styles.tableHead}>From Date</th>
                  <th className={styles.tableHead}>To Date</th>
                  <th className={styles.tableHead}>Reason</th>
                  <th className={styles.tableHead}>Days</th>
                  <th className={styles.tableHead}>Status</th>
                </tr>
              </thead>
              <tbody className={styles.tableBody}>
                {CurrentData.map((leave: any, index: any) => (
                  <tr key={index} className={styles.tableBodyRow}>
                    {window.innerWidth > 590 ? (
                      <td className={styles.tableBodyRow} data-label="S.No">
                        {index + 1}
                      </td>
                    ) : (
                      ""
                    )}
                    <td className={styles.tableBodyRow} data-label="ID">
                      {leave.ID}
                    </td>

                    <td className={styles.tableBodyRow} data-label="Leave">
                      {leave.Leave}
                    </td>
                    {window.innerWidth > 590 ? (
                      <td
                        className={styles.tableBodyRow}
                        data-label="LeaveType"
                      >
                        {leave.LeaveType}
                      </td>
                    ) : (
                      ""
                    )}
                    <td className={styles.tableBodyRow} data-label="Start Date">
                      <div
                        className={`${styles.leaveDateDiv} ${styles.leaveDate}`}
                      >
                        <span>{leave.FromDate}</span>
                      </div>
                    </td>
                    <td className={styles.tableBodyRow} data-label="End Date">
                      <div
                        className={`${styles.leaveDateDiv} ${styles.leaveDate}`}
                      >
                        <span>{leave.ToDate}</span>
                      </div>
                    </td>

                    <td className={styles.tableBodyRow} data-label="Reason">
                      {leave.Reason}
                    </td>
                    {window.innerWidth > 590 ? (
                      <td
                        className={styles.tableBodyRow}
                        data-label="No of Days Leave"
                      >
                        {leave.NoofDaysLeave}
                      </td>
                    ) : (
                      ""
                    )}
                    <td className={styles.tableBodyRow} data-label="Status">
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
                        <span aria-hidden className={styles.leaveStatusSpan}>
                          {" "}
                          {leave.Status}{" "}
                        </span>{" "}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeaveDetails === undefined ||
              (filteredLeaveDetails.length > 0 && (
                <div>
                  {" "}
                  <Pagination
                    totalData={filteredLeaveDetails.length}
                    dataPerPage={dataPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                  />{" "}
                </div>
              ))}
          </div>
        </div>
      )}

      <div className={styles.applyLeaveButtonDiv}>
        {" "}
        <Link to={"/Apply Leave"}>
          {" "}
          <button className={styles.applyLeaveButton}>Apply Leave</button>{" "}
        </Link>{" "}
      </div>
    </div>
  );
};
