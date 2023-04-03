/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import convert from "xml-js";
import { IList, Web, sp } from "@pnp/sp/presets/all";
import styles from "./LeaveDetails.module.scss";

import { MyContext } from "../../context/contextProvider";
import { Link } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import { MdOutlineCancel } from "react-icons/md";
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
  leaveId: number;
};
export const LeaveDetails = () => {
  const { cancelReason, setCancelReason } = React.useContext(MyContext);
  const [leaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPage] = useState(2);
  const [leaveStatus, setLeaveStatus] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
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
          leaveId: entry.content["m:properties"]["d:ID"]._text,
        }));

        setLeaveDetails(leaveDetail);
        setLeaveStatus(leaveDetail[0].Status);
      })
      .catch((err) => console.log(err));
  }, []);
  const filteredLeaveDetails = leaveDetails.filter(
    (detail) => detail.Email === userEmail
  );
  console.log(leaveStatus);

  // pag

  const indexOfLastPage = currentPage * dataPerPage;
  const indexFirstData = indexOfLastPage - dataPerPage;
  const CurrentData: any =
    filteredLeaveDetails !== undefined
      ? filteredLeaveDetails.slice(indexFirstData, indexOfLastPage)
      : "";

  const updateLeaveStatus = async (id: number, status: string) => {
    try {
      const web = Web("https://zlendoit.sharepoint.com/sites/ZlendoTools");
      const list: IList = web.lists.getByTitle("Leave Management");

      const itemToUpdate = list.items.getById(id);
      await itemToUpdate.update({ Status: status });
      console.log("Leave status updated successfully!");
    } catch (error) {
      console.log("Error updating leave status:", error);
    }
  };
  const handleCancel = async (id: number, status: string) => {
    console.log(id, status);

    await updateLeaveStatus(id, status);
    // Update the leaveDetails state to reflect the new status
    const updatedLeaveDetails = leaveDetails.map((leave: any) =>
      leave.leaveId === id ? { ...leave, Status: status } : leave
    );
    setLeaveDetails(updatedLeaveDetails);
    setLeaveStatus(status);
    setCancelReason(true);
  };
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Validate the reason
    if (!reason) {
      setReasonError("Please enter a reason for the leave");
      setTimeout(() => {
        setReasonError("");
      }, 3500);
    } else if (reason.length > 50) {
      setReasonError(
        `Reason must have less than 50 characters. Current length: ${reason.length}`
      );
    } else {
      setReasonError("");
    }
    if (reason) {
      const data = {
        CanselReason: reason,
      };
      console.log(data);
      // Get a reference to the "Leave Management" list using the website URL
      // const web = Web('https://zlendoit.sharepoint.com/sites/ZlendoTools');
      // const list: IList = web.lists.getByTitle('Leave Management');
      // Add the new item to the list
      // list.items
      // .add(itemData)
      // .then(() => {
      // console.log('New item added to the list');
      // })
      // .catch((error) => {
      // console.log('Error adding new item to the list: ', error);
      // });
    }
  }

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
                  <th className={styles.tableHead}>Cancel Leave</th>
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
                    <td
                      className={styles.tableBodyRow}
                      data-label="Cancel Request"
                    >
                      {" "}
                      <button
                        onClick={() => handleCancel(leave.leaveId, "Cancelled")}
                        className={styles.leaveCancelButton}
                      >
                        Cancel
                      </button>
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
      {cancelReason && (
        <div className={styles.cancelReason}>
          <div className={styles.cancelReasonDiv1}>
            <div className={styles.cancelReasonDiv2}>
              <header className={styles.header}>
                <div className={styles.headerDiv}>
                  Enter the reason for cancellation
                </div>
              </header>

              <button
                type="button"
                onClick={() => setCancelReason(false)}
                style={{
                  color: "rgb(153,171,180)",
                  borderRadius: "50%",
                  border: "none",
                }}
                className={styles.CloseButton}
              >
                <MdOutlineCancel />
              </button>
            </div>
            <div className={styles.inputContainer}>
              <form
                className={styles.cancelReasonTextarea}
                onSubmit={handleSubmit}
              >
                <div className="">
                  <textarea
                    placeholder="Enter the reason..."
                    onChange={(event) => setReason(event.target.value)}
                    className={styles.CancelReasonTextarea}
                    value={reason}
                  />
                </div>
                {reasonError && <p className={styles.error}> {reasonError}</p>}
                <div className={styles.button}>
                  <button className={styles.buttonSubmit} type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
