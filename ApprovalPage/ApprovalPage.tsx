/* eslint-disable no-void */ /* eslint-disable prefer-const */ /* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable @typescript-eslint/no-floating-promises */ /* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import convert from "xml-js";
import styles from "./ApprovalPage.module.scss";
// import { sp } from "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
import { useLocation, useNavigate } from "react-router-dom";
import { MyContext } from "../../context/contextProvider";

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
type EmployeeDetail = {
  ID: string;
  phoneNumber: string;
};

interface ApprovalPageProps {
  setApprove: React.Dispatch<React.SetStateAction<string>>;
  approve: string;
  employeeId: number;
}

export const ApprovalPage: React.FC<ApprovalPageProps> = ({
  employeeId,
  setApprove,
  approve,
}) => {
  const { action, setAction } = React.useContext(MyContext);
  console.log("test", action);
  console.log("ID", employeeId);

  const [leaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  // const [contactNum, setContactNum] = useState(null);
  const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const pathArray = location.pathname.split("/");
  const LeaveId = pathArray[pathArray.length - 1];
  console.log(LeaveId);

  useEffect(() => {
    const url = `https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Leave%20Management')/items?&$filter=ID%20eq%20%27${employeeId}%27`;
    console.log(url);
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        console.log(parsedData);

        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        console.log(entries);

        const leaveDetail: LeaveDetail[] = entries.map((entry: any) => ({
          leaveId: entry.content["m:properties"]["d:Id"]._text,
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
          NoofDaysLeave: entry.content["m:properties"]["d:count"]._text,
          Status: entry.content["m:properties"]["d:Status"]._text,
          // LeaveId: parseInt(entry.content["m:properties"]["d:ID"]._text),
        }));
        setApprove(leaveDetail[0].Status);
        setLeaveDetails(leaveDetail);
      });
  }, []);
  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Employee%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        const EmployeeDetail: EmployeeDetail[] = entries.map((entry: any) => ({
          ID: entry.content["m:properties"]["d:Employee_x0020_ID"]._text,
          phoneNumber:
            entry.content["m:properties"]["d:Contact_x0020_Number"]._text,
        }));
        setEmployeeDetail(EmployeeDetail);
      });
  }, [LeaveId]);
  let contactNumber = "";
  employeeDetail.map((e) => {
    e.ID === leaveDetails[0].ID ? (contactNumber = e.phoneNumber) : "";
  });
  console.log(contactNumber);

  // Update the LeaveStatus value in SharePoint based on the leave item ID and the new status value

  const updateLeaveStatus = async (id: number, status: string) => {
    try {
      const web = Web("https://zlendoit.sharepoint.com/sites/ZlendoTools");
      const list: IList = web.lists.getByTitle("Leave Management");

      const itemToUpdate = list.items.getById(id);
      await itemToUpdate.update({ Status: status });
      console.log("Leave status updated successfully!");
      navigate("/Leave Approval");
    } catch (error) {
      console.log("Error updating leave status:", error);
    }
  };
  const handleApproval = async (id: number, status: string) => {
    console.log(id, status);

    await updateLeaveStatus(id, status);
    // Update the leaveDetails state to reflect the new status
    const updatedLeaveDetails = leaveDetails.map((leave) =>
      leave.leaveId === id ? { ...leave, Status: status } : leave
    );
    setLeaveDetails(updatedLeaveDetails);
    setApprove(status);
    setAction(false);
    window.location.reload();
  };
  console.log(leaveDetails);

  return (
    <div>
      {action && (
        <div className={styles.totalLeave}>
          <div className={styles.totalLeaveDiv1}>
            <div className={styles.totalLeaveDiv2}>
              <header className={styles.totalLeaveHeader}>
                <div className={styles.totalLeaveHeaderDiv}>
                  Confirm Approval
                </div>
              </header>

              <button
                type="button"
                onClick={() => setAction(false)}
                style={{
                  color: "rgb(153,171,180)",
                  borderRadius: "50%",
                  border: "none",
                }}
                className={styles.totalLeaveCloseButton}
              >
                <MdOutlineCancel />
              </button>
            </div>

            <div className={styles.totalLeaveTableContainer}>
              {leaveDetails.map((leaveDetail) => (
                <>
                  <table key={leaveDetail.ID} className={styles.approvalTable}>
                    <thead className={styles.approvalTableHead}>
                      <tr>
                        <th className={styles.approvalTableHeading}>
                          Employee ID
                        </th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.ID}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>Name</th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.Name}
                        </td>
                      </tr>

                      <tr>
                        <th className={styles.approvalTableHeading}>Email</th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.Email}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>
                          Contact Number
                        </th>

                        <td className={styles.approvalTableDescription}>
                          {contactNumber}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>
                          Leave Type
                        </th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.LeaveType}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>
                          From Date
                        </th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.FromDate}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>To Date</th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.ToDate}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>
                          No of Days Leave
                        </th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.NoofDaysLeave}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>Reason</th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.Reason}
                        </td>
                      </tr>
                      <tr>
                        <th className={styles.approvalTableHeading}>Status</th>
                        <td className={styles.approvalTableDescription}>
                          {leaveDetail.Status}
                        </td>
                      </tr>
                    </thead>
                  </table>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <div className={styles.approveButtonDiv}>
                      <button
                        onClick={() =>
                          handleApproval(leaveDetail.leaveId, "Approved")
                        }
                        className={styles.approveButton}
                      >
                        Approve
                      </button>
                    </div>
                    {/* <div className={styles.approveButtonDiv}>
                      <button
                        onClick={() =>
                          handleApproval(leaveDetail.leaveId, "Rejected")
                        }
                        className={styles.approveButton}
                      >
                        Rejected
                      </button>
                    </div> */}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ApprovalPage;
