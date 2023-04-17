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
import LeaveCalculation from "../LeaveCalculation/LeaveCalculation";
type employeeData = {
  id: string;
  name: string;
  email: string;
  leaveID: number;
};
type empData = { FormDate: Date; ToDate: Date; Status: string | any };
type leaveType = {
  leaveType: string;
};
export const ApplyLeave = () => {
  LeaveCalculation();
  const { availableLeaves } = React.useContext(MyContext);
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState<employeeData[]>([]);
  const [apileaveType, setApiLeaveType] = useState<leaveType[]>([]);
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
  const [dateSameError, setDateSameError] = useState("");
  const [weekOffError, setWeekOffError] = useState("");
  let overlap = false;

  const [userEmail, setUserEmail] = useState("");
  const [employeeData1, setEmployeeData1] = useState<empData[]>([]);

  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/lists/GetByTitle('Employee%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });

        const parsedData = JSON.parse(jsonData);
        const empData: employeeData[] = parsedData.feed.entry
          .map((entry: any) => {
            try {
              return {
                id: entry.content["m:properties"]["d:Employee_x0020_ID"]._text,
                name: entry.content["m:properties"]["d:Display_x0020_Name"]
                  ._text,
                email: entry.content["m:properties"]["d:Email"]._text,
                leaveID: entry.content["m:properties"]["d:Id"]._text,
              };
            } catch (error) {
              if (
                error instanceof TypeError &&
                error.message.includes("Cannot read properties of undefined")
              ) {
                return null;
              } else {
                throw error;
              }
            }
          })
          .filter(Boolean);

        setEmployeeData(empData);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/lists/GetByTitle('Leave%20Type%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });

        const parsedData = JSON.parse(jsonData);

        const leaveType: leaveType[] = parsedData.feed.entry
          .map((entry: any) => {
            try {
              return {
                leaveType:
                  entry.content["m:properties"]["d:Leave_x0020_Type"]._text,
              };
            } catch (error) {
              if (
                error instanceof TypeError &&
                error.message.includes("Cannot read properties of undefined")
              ) {
                return null;
              } else {
                throw error;
              }
            }
          })
          .filter(Boolean);

        setApiLeaveType(leaveType);
      })
      .catch((err) => console.log(err));
  }, []);

  let userName = "";
  let ID = "";
  let leaveCount = 0;

  void sp.web.currentUser.get().then((user) => {
    setUserEmail(user.Email);
  });
  employeeData.forEach((e) => {
    if (userEmail === e.email) {
      ID = e.id;
      userName = e.name;
    }
  });

  useEffect(() => {
    const url = `https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Leave%20Management')/items?$filter=Title%20eq%20%27${ID}%27`;

    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);

        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        const empData: empData[] = entries
          .map((entry: any) => {
            try {
              return {
                FormDate: entry.content["m:properties"]["d:FormDate"]._text,
                ToDate: entry.content["m:properties"]["d:ToDate"]._text,
                Count: entry.content["m:properties"]["d:count"]._text,
                LeaveId: entry.content["m:properties"]["d:Id"]._text,
                Status: entry.content["m:properties"]["d:Status"]._text,
              };
            } catch (error) {
              if (
                error instanceof TypeError &&
                error.message.includes("Cannot read properties of undefined")
              ) {
                return null;
              } else {
                throw error;
              }
            }
          })
          .filter(Boolean);

        setEmployeeData1(empData);
      })
      .catch((err) => console.log(err));
  }, [ID]);

  function isLeaveAlreadyApplied(
    employeeData: any,
    fromDate: any,
    toDate: any
  ) {
    const overlappingRecords = employeeData.filter((record: any) => {
      const recordStart = new Date(record.FormDate);
      const recordEnd = new Date(record.ToDate);
      const requestedStart = new Date(fromDate);
      const requestedEnd = new Date(toDate);
      return (
        (requestedStart >= recordStart && requestedStart <= recordEnd) ||
        (requestedEnd >= recordStart && requestedEnd <= recordEnd) ||
        (requestedStart <= recordStart && requestedEnd >= recordEnd)
      );
    });
    if (overlappingRecords.length > 0) {
      const overlappingApprovedOrPendingRecords = overlappingRecords.filter(
        (record: any) => {
          return record.Status !== "Cancelled" && record.Status !== "Rejected";
        }
      );
      if (overlappingApprovedOrPendingRecords.length > 0) {
        return {
          status: overlappingApprovedOrPendingRecords[0].Status,
          message:
            overlappingApprovedOrPendingRecords[0].Status === "Approved"
              ? `Your leave has already been taken and approved by Admin.`
              : `You have already applied for a leave on ${new Date(
                  overlappingApprovedOrPendingRecords[0].FormDate
                ).toLocaleDateString()} - ${new Date(
                  overlappingApprovedOrPendingRecords[0].ToDate
                ).toLocaleDateString()}. Please wait for admin approval. If you need overwrite it Please cancel the leave and Try Again`,
        };
      }
    }

    return false;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (toDate) {
      const overlappingRecord = isLeaveAlreadyApplied(
        employeeData1,
        fromDate,
        toDate
      );
      if (overlappingRecord) {
        setDateSameError(overlappingRecord.message);

        setTimeout(() => {
          setDateSameError("");
        }, 5500);
      } else {
        overlap = true;
        setDateSameError("");
      }
    }

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
    const fromDayOfWeek = new Date(fromDate).getDay();
    const toDayOfWeek = new Date(toDate).getDay();
    console.log(fromDayOfWeek, toDayOfWeek);
    if (
      (fromDayOfWeek === 6 && toDayOfWeek === 0) ||
      toDayOfWeek === 0 ||
      fromDayOfWeek === 6
    ) {
      console.log(fromDayOfWeek, toDayOfWeek);
      setWeekOffError("You cannot apply for leave on a weekend");
      setTimeout(() => {
        setWeekOffError("");
      }, 3500);
    } else {
      setWeekOffError("");
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

    if (leave && fromDate && toDate && leaveType && overlap && reason) {
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
        Remark: "-",
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
      setLeave("");
      setLeaveType("");
      setReason("");
      setLeaveType("Full Day");
      setFromDate(new Date().toISOString().substr(0, 10));
      setToDate("");
    }
  };

  return (
    <div className={styles.ApplyLeave}>
      <form className={styles.ApplyLeave_form} onSubmit={handleSubmit}>
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
              className={`${styles.ApplyLeave_form_input} ${
                leaveError !== "" ? `${styles.errorBorder}` : ""
              }`}
            >
              <option defaultValue="selected">Select Leave </option>
              {apileaveType.map((e) => {
                return (
                  <option
                    key={e.leaveType} // add a unique key for each element
                    value={e.leaveType}
                  >
                    {e.leaveType}
                  </option>
                );
              })}
            </select>
          </div>
          <div className={""}>
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
                  Your Total Leave balance is {availableLeaves}
                </p>
              </div>
            )}
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
              className={`${styles.ApplyLeave_form_input} ${
                dateSameError !== "" ? `${styles.errorBorder}` : ""
              } ${weekOffError !== "" ? `${styles.errorBorder}` : ""}`}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </div>

          <div className={styles.formAlign}>
            <label htmlFor="to-date" className={styles.ApplyLeave_form_label}>
              To Date
            </label>
            <input
              type="date"
              id="to-date"
              value={toDate}
              className={`${styles.ApplyLeave_form_input} ${
                dateSameError !== "" ? `${styles.errorBorder}` : ""
              } ${toDateError !== "" ? `${styles.errorBorder}` : ""}
              ${weekOffError !== "" ? `${styles.errorBorder}` : ""}`}
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
          <div className={""}>
            {toDateError && <p className={styles.error}> {toDateError}</p>}
          </div>
          <div>
            {weekOffError && <p className={styles.error}> {weekOffError}</p>}
          </div>

          <div>
            {dateSameError && <p className={styles.error}>{dateSameError}</p>}
          </div>
          <div className={""}></div>
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
              className={`${styles.ApplyLeave_form_input} ${
                reasonError !== "" ? `${styles.errorBorder}` : ""
              }`}
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
              onClick={(e) => handleSubmit(e)}
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
        </div>
      </form>
    </div>
  );
};
