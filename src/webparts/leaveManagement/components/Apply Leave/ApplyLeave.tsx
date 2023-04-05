/* eslint-disable no-unused-expressions */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import convert from "xml-js";
import { sp } from "@pnp/sp/presets/all";
import { Web } from "@pnp/sp/webs";
import { IList } from "@pnp/sp/lists";
import styles from "./ApplyLeave.module.scss";
import { MyContext } from "../../context/contextProvider";
type employeeData = {
  id: string;
  name: string;
  email: string;
  leaveID: number;
};
export const ApplyLeave = () => {
  const [employeeData, setEmployeeData] = useState<employeeData[]>([]);
  const { totalLeaves } = React.useContext(MyContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/lists/GetByTitle('Employee%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });

        const parsedData = JSON.parse(jsonData);
        console.log(parsedData);
        const empData: employeeData[] = parsedData.feed.entry.map(
          (entry: any) => ({
            id: entry.content["m:properties"]["d:Employee_x0020_ID"]._text,
            name: entry.content["m:properties"]["d:Display_x0020_Name"]._text,
            email: entry.content["m:properties"]["d:Email"]._text,
            leaveID: entry.content["m:properties"]["d:Id"]._text,
          })
        );

        setEmployeeData(empData);
      })
      .catch((err) => console.log(err));
  }, []);

  // const navigate = useNavigate();
  const [leave, setLeave] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [leaveType, setLeaveType] = useState("Full Day");
  const [leaveTypeError, setLeaveTypeError] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [reasonLengthError, setReasonLengthError] = useState("");
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [, setFromDateError] = useState("");
  const [toDate, setToDate] = useState("");
  const [toDateError, setToDateError] = useState("");
  const [userEmail, setUserEmail] = useState("");

  let userName = "";
  let ID = "";
  let leaveCount = 0;
  console.log("leaveID");
  void sp.web.currentUser.get().then((user) => {
    setUserEmail(user.Email);
  });
  employeeData.forEach((e) => {
    if (userEmail === e.email) {
      ID = e.id;
      userName = e.name;
    }
  });
  console.log(userName, leaveCount);
  console.log("ID", ID);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // Validate the leave type
    if (!leave || leave === "Select Leave") {
      setLeaveError("Please select a leave");
      setTimeout(() => {
        setLeaveError("");
      }, 3500);
    } else {
      setLeaveError("");
    }
    // Validate the reason
    if (!reason) {
      setReasonError("Please enter a reason for the leave");
      setTimeout(() => {
        setReasonError("");
      }, 3500);
    } else {
      setReasonError("");
    }
    if (reason.length > 50) {
      setReasonLengthError(
        `Reason must have less than 50 characters. Current length: ${reason.length}`
      );
      setTimeout(() => {
        setReasonLengthError("");
      }, 3500);
    } else {
      setReasonLengthError("");
    }
    if (!fromDate) {
      setFromDateError("From date is required");
      setTimeout(() => {
        setReasonError("");
      }, 3500);
    } else {
      setFromDateError("");
    }
    // Validate the to date
    if (!toDate) {
      setToDateError("To date is required");
      setTimeout(() => {
        setToDateError("");
      }, 3500);
    } else if (new Date(toDate) < new Date(fromDate)) {
      setToDateError("To date must be after the from date");
    } else {
      const oneDay = 1000 * 60 * 60 * 24; // milliseconds in one day

      let currentDay = new Date(fromDate);

      while (currentDay <= new Date(toDate)) {
        const dayOfWeek = currentDay.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
          // Exclude weekends (0 = Sunday, 6 = Saturday)
          leaveCount++;
        }
        currentDay.setTime(currentDay.getTime() + oneDay); // move to next day
        if (leaveType !== "Full Day") {
          leaveCount = 0.5;
        }
      }
      setToDateError("");
    }
    // Validate the leave type
    if (!leaveType) {
      setLeaveTypeError("Please select a leave type");
      setTimeout(() => {
        setLeaveTypeError("");
      }, 3500);
    } else {
      setLeaveTypeError("");
    }
    if (
      leave &&
      fromDate &&
      toDate &&
      new Date(toDate) > new Date(fromDate) &&
      leaveType
    ) {
      // Send the REST API request to add the item to the list
      // Define the data for the new item
      const itemData = {
        Title: ID,
        Name: userName,
        Email: userEmail,
        LeaveType: leave,
        Leave: leaveType,
        FormDate: new Date(fromDate).toISOString(),
        ToDate: new Date(toDate).toISOString(),
        count: leaveCount,
        Reason: reason,
        Status: "Pending",
        LOP:
          leaveCount < 3
            ? 0
            : leaveCount > 3
            ? leaveCount - 3
            : leaveCount === 3
            ? 0
            : leaveCount,
      };
      console.log(itemData);
      // Get a reference to the "Leave Management" list using the website URL
      const web = Web("https://zlendoit.sharepoint.com/sites/ZlendoTools");
      const list: IList = web.lists.getByTitle("Leave Management");

      //Add the new item to the list
      list.items
        .add(itemData)
        .then(() => {
          console.log("New item added to the list");
        })
        .catch((error) => {
          console.log("Error adding new item to the list: ", error);
        });
      navigate("/Leave Details");
      window.location.reload();
    }

    setLeave("");
    setLeaveType("");
    setReason("");
    setLeaveType("Full Day");
    setFromDate(new Date().toISOString().substr(0, 10));
    setToDate("");
  }

  return (
    <div className={styles.ApplyLeave}>
      <form onSubmit={handleSubmit} className={styles.ApplyLeave_form}>
        <div className={styles.ApplyLeave_form_heading}>
          <p className={styles.ApplyLeave_form_heading_name}>Apply Leave</p>
        </div>
        <div className={styles.ApplyLeave_form_layout}>
          <div className={styles.formAlign}>
            <label htmlFor="from-date" className={styles.ApplyLeave_form_label}>
              Leave Type
            </label>
            <select
              id="leave-type"
              value={leave}
              onChange={(event) => {
                setLeave(event.target.value);
              }}
              className={styles.ApplyLeave_form_input}
            >
              <option defaultValue="selected">Select Leave </option>
              <option value="Annual Leave"> Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Loss of Pay">Loss of Pay</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {leave && leave !== "Select Leave" && (
            <div className={styles.ApplyLeave_form_leaveInput}>
              <svg
                className={styles.ApplyLeave_form_leaveInput_svg}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>

              <p className={styles.ApplyLeave_form_leaveInput_desc}>
                Your Total Leave balance is {totalLeaves}
              </p>
            </div>
          )}
          <div className={""}>
            {leaveError && <p className={styles.error}> {leaveError}</p>}
          </div>

          <div className={styles.formAlign}>
            <label htmlFor="from-date" className={styles.ApplyLeave_form_label}>
              From Date
            </label>
            <input
              type="date"
              id="from-date"
              value={fromDate}
              className={styles.ApplyLeave_form_input}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </div>
          {/* <div className={formDivError}>
              {fromDateError && (
                <p className={formError}>{fromDateError}</p>
              )}
            </div> */}
          <div className={styles.formAlign}>
            <label htmlFor="to-date" className={styles.ApplyLeave_form_label}>
              To Date
            </label>
            <input
              type="date"
              id="to-date"
              value={toDate}
              className={styles.ApplyLeave_form_input}
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
          <div className={""}>
            {toDateError && <p className={styles.error}> {toDateError}</p>}
          </div>
          <div className={styles.formAlign}>
            <label htmlFor="from-date" className={styles.ApplyLeave_form_label}>
              Leave
            </label>
            {toDate !== fromDate ? (
              <input
                type="text"
                value="FullDay"
                className={styles.ApplyLeave_form_input}
                onChange={() => setLeaveType("FullDay")}
              />
            ) : (
              <>
                <select
                  id="leave-type"
                  value={leaveType}
                  onChange={(event) => setLeaveType(event.target.value)}
                  className={styles.ApplyLeave_form_input}
                >
                  <option value="FullDay">FullDay</option>
                  <option value="FN">FN</option>
                  <option value="AN">AN</option>
                </select>
              </>
            )}
          </div>
          <div className={""}>
            {leaveTypeError && <p className={styles.error}>{leaveTypeError}</p>}
          </div>
          <div className={styles.formAlign}>
            <label htmlFor="to-date" className={styles.ApplyLeave_form_label}>
              Reason
            </label>
            <input
              type="text"
              id="reason"
              placeholder="Enter the reason..."
              className={styles.ApplyLeave_form_input}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
          <div className={""}>
            {reasonError && <p className={styles.error}> {reasonError}</p>}
            {reasonLengthError && (
              <p className={styles.error}> {reasonError}</p>
            )}
          </div>
        </div>
        <div className={styles.button}>
          <div className="px-2" style={{ padding: "0rem 0.5rem" }}>
            <button
              className={`${styles.buttonSubmit} ${
                leave.length === 0 ||
                reason.length === 0 ||
                fromDate.length === 0 ||
                toDate.length === 0
                  ? `${""}`
                  : ` ${""}`
              }`}
              type="submit"
            >
              Submit
            </button>
          </div>
          <div>
            {/* <Link to={'/Profile'}>
                  <button className={formButton} type="submit">
                    Back
                  </button>
                </Link> */}
          </div>
        </div>
      </form>
    </div>
  );
};
