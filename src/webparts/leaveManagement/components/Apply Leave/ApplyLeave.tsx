/* eslint-disable no-unused-expressions */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react"; // import { Link, useNavigate } from 'react-router-dom';
import convert from "xml-js";
import styles from "./ApplyLeave.module.scss";
import { sp } from "@pnp/sp/presets/all";
// import { Web } from "@pnp/sp/webs";
// import { IList } from "@pnp/sp/lists";
import { Link, useNavigate } from "react-router-dom";
type employeeData = {
  id: string;
  name: string;
  email: string;
  leaveID: number;
};

export const ApplyLeave = () => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState<employeeData[]>([]);
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
  // const [reasonLengthError, setReasonLengthError] = useState("");
  const [leave, setLeave] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [leaveType, setLeaveType] = useState("Full Day");
  const [leaveTypeError, setLeaveTypeError] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  // const [reasonLengthError, setReasonLengthError] = useState("");
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().substr(0, 10)
  );
  const [fromDateError, setFromDateError] = useState("");
  const [toDate, setToDate] = useState("");
  const [toDateError, setToDateError] = useState("");

  const [userEmail, setUserEmail] = useState("");
  let ID = "";
  let userName = "";
  let leaveCount = 0;
  console.log("leaveID");
  void sp.web.currentUser
    .get()
    .then(
      (user: {
        Email: React.SetStateAction<string>;
        Title: React.SetStateAction<string>;
      }) => {
        setUserEmail(user.Email);
      }
    );
  employeeData.forEach((e) => {
    if (userEmail === e.email) {
      console.log(e.name);
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
    } else if (reason.length > 100) {
      setReasonError(
        `Reason must have less than 100 characters. Current length is ${reason.length}`
      );
      setTimeout(() => {
        setReasonError("");
      }, 3500);
    } else {
      setReasonError("");
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
    if (leave && fromDate && toDate && leaveType) {
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
      };

      console.log(itemData); // Get a reference to the "Leave Management" list using the website URL
      // const web = Web("https://zlendoit.sharepoint.com/sites/ZlendoTools");
      // const list: IList = web.lists.getByTitle("Leave Management"); // Add the new item to the list
      // list.items
      //   .add(itemData)
      //   .then(() => {
      //     console.log("New item added to the list");
      //   })
      //   .catch((error: any) => {
      //     console.log("Error adding new item to the list: ", error);
      //   });
      setLeaveType("");
      setReason("");
      setFromDate(new Date().toISOString().substr(0, 10));
      setToDate("");
      navigate("/Leave Details");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.leaveForm}>
        <div className=" flex flex-col p-4 justify-center mx-auto w-4/6 max-sm:mx-2">
          <div className="items-center">
            <h1 className={styles.leaveFormH1}>Apply Leave</h1>
          </div>{" "}
          <div className={styles.formAlign}>
            <label htmlFor="from-date" className={styles.formLabel}>
              Leave
            </label>
            <select
              id="leave-type"
              value={leave}
              onChange={(event) => {
                setLeave(event.target.value);
              }}
              className={styles.formInput}
            >
              <option defaultValue="selected">Select Leave </option>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Nopay-Leave">NoPay Leave</option>
              <option value="Compensatory Leave">Compensatory Leave</option>
              <option value="Loss of Pay">Loss of Pay</option>

              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.formDivError}>
            {leaveError && <p className={styles.formError}> {leaveError}</p>}
          </div>
          {/* {window.innerWidth < 700 && leave && leave !== "Select Leave" ? (            
            <div>              
            <table className="w-full text-sm mx-5 border text-gray-700 dark:text-gray-700">                
            <tbody>                  
            <tr className="border">                    
            <td scope="col" className="px-6 py-3 border text-start">                      
            Leave Type                    
            </td>                    
            <td                      
            scope="row"                      
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border dark:text-white text-center"                    
            >                      
           
           {leave}                    
           </td>                  
           </tr>                  
           <tr className="border">                    
           <th scope="col" className="px-6 py-3 border text-start">                      
           Total                    
           </th>                    
           <td scope="row" className="px-6 py-4 border text-center">                      
           12                    
           </td>                  
           </tr>                  
           <tr className="border">                    
           <th scope="col" className="px-6 py-3 border text-start">                      
           Used                    
           </th>                    
           <td scope="row" className="px-6 py-4 border text-center">                      
           0                    
           </td>                  
           </tr>                  
           <tr className="border">                    
           <th scope="col" className="px-6 py-3 border text-start">                      
           Balance                    
           </th>                    
           <td scope="row" className="px-6 py-4 border text-center">                      
           12                    
           </td>                  
           </tr>                
           </tbody>              
           </table>            
           </div>) :*/}
          {leave && leave !== "Select Leave" ? (
            <div className={styles.formLeaveInfoDiv1}>
              {/* <table className="w-full text-sm  border text-gray-500 dark:text-gray-700">                
            <thead className="text-xs text-gray-700 border text-center uppercase bg-gray-300 dark:bg-gray-700 dark:text-gray-400">                  
            <tr className="border">                    
            <th scope="col" className="px-6 py-3 border">                      
            Leave Type                    
            </th>                    
            <th scope="col" className="px-6 py-3 border">                      
            Total                    
            </th>                    
            <th scope="col" className="px-6 py-3 border">                      
            Used                    
            </th>                    
            <th scope="col" className="px-6 py-3 border">                      
            Balance                    
            </th>                  
            </tr>                
            </thead>                
            <tbody>                  
            <tr className="bg-white border-b text-center dark:bg-gray-800 dark:border-gray-700">                    
            <td                      
            scope="row"                      
            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap border dark:text-white"                    
            >                      
            {leave}                    
            </td>                    
            <td className="px-6 py-4 border">12</td>                    
            <td className="px-6 py-4 border">0</td>                    
            <td className="px-6 py-4 border">12</td>                  
            </tr>                
            </tbody>              
            </table>{" "}              
            */}
              <div className={styles.formLeaveInfo} role="alert">
                <div className={styles.formLeaveInfoDisplay}>
                  <div className={styles.formLeaveInfoDiv2}>
                    <svg
                      className={styles.formLeaveInfoIcon}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />{" "}
                    </svg>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className={styles.formLeavePara}>
                      Your {leave} balance is 04
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className={styles.formAlign}>
            {" "}
            <label htmlFor="from-date" className={styles.formLabel}>
              {" "}
              From Date
            </label>{" "}
            <input
              type="date"
              id="from-date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className={styles.formInput}
            />
          </div>{" "}
          <div className={styles.formDivError}>
            {" "}
            {fromDateError && (
              <p className={styles.formError}>{fromDateError}</p>
            )}
          </div>{" "}
          <div className={styles.formAlign}>
            {" "}
            <label htmlFor="to-date" className={styles.formLabel}>
              {" "}
              To Date
            </label>{" "}
            <input
              type="date"
              id="to-date"
              value={toDate}
              className={styles.formInput}
              onChange={(event) => setToDate(event.target.value)}
            />{" "}
          </div>{" "}
          <div className={styles.formDivError}>
            {" "}
            {toDateError && <p className={styles.formError}> {toDateError}</p>}
          </div>{" "}
          <div className={styles.formAlign}>
            {" "}
            <label htmlFor="from-date" className={styles.formLabel}>
              {" "}
              Leave Type
            </label>{" "}
            {toDate !== fromDate ? (
              <input type="text" value="FullDay" className={styles.formInput} />
            ) : (
              <>
                {" "}
                <select
                  id="leave-type"
                  value={leaveType}
                  onChange={(event) => setLeaveType(event.target.value)}
                  className={styles.formInput}
                >
                  {" "}
                  <option value="Full Day">Full Day</option>
                  <option value="FN">FN</option> <option value="AN">AN</option>{" "}
                </select>{" "}
              </>
            )}
          </div>{" "}
          <div className={styles.formDivError}>
            {" "}
            {leaveTypeError && (
              <p className={styles.formError}>{leaveTypeError}</p>
            )}
          </div>{" "}
          <div className={styles.formAlign}>
            {" "}
            <label htmlFor="to-date" className={styles.formLabel}>
              {" "}
              Reason
            </label>{" "}
            <input
              id="reason"
              placeholder="Enter the reason..."
              className={styles.formInput}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />{" "}
          </div>{" "}
          <div className={styles.formDivError}>
            {" "}
            {reasonError && <p className={styles.formError}> {reasonError}</p>}
          </div>{" "}
          <div className={styles.formButtonAlign}>
            {" "}
            <div className="px-2">
              {" "}
              <button
                className={`${styles.formButton}                
                ${
                  leave.length === 0 ||
                  reason.length === 0 ||
                  fromDate.length === 0 ||
                  toDate.length === 0
                    ? `${styles.formCursorOff}`
                    : ` ${styles.formCursorOn}`
                }`}
                type="submit"
              >
                {" "}
                Submit
              </button>{" "}
            </div>{" "}
            {"  "}
            <div>
              {" "}
              <Link to={"/Profile"}>
            
                <button className={styles.formButton} type="submit">
                  
                  Back
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
