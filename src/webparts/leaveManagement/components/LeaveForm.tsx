import * as React from "react";
import { useState, Fragment } from "react";

import { Link } from "react-router-dom";

import employees from "../../../fakeApi.json";
import { useNavigate } from "react-router-dom";
import styles from "./LeaveManagement.module.scss";
const LeaveForm = () => {
  const navigate = useNavigate();

  let data = employees.employees.map((employee) => {
    return employee;
  });

  const empData = data.filter((e) => {
    return e !== undefined;
  });
  const empInfo = empData.pop();

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

  const leaveStatus = "Pending";

  const employeeId = empInfo.id;
  const employeeName = empInfo.first_name + " " + empInfo.last_name;
  const department = empInfo.department;
  const email = empInfo.email;
  const image = empInfo.image;
  const leaveId = new Date().getTime();

  const handleSubmit = () => {
    // Validate the leave type
    if (!leave) {
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
    // if (!reason.length > 50) {
    //   setReasonLengthError(
    //     `Reason must have less than 50 characters. Current length: ${reason.length}`
    //   );
    //   setTimeout(() => {
    //     setReasonLengthError("");
    //   }, 3500);
    // } else {
    //   setReasonLengthError("");
    // }
    // Validate the from date
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
    var leaveDetails = JSON.parse(localStorage.getItem("leaveDatas") || "[]");
    var leaveData = {
      employeeName: employeeName,
      employeeId: employeeId,
      email: email,
      department: department,
      leave: leave,
      leaveType: leaveType,
      reason: reason,
      fromDate: fromDate,
      toDate: toDate,
      leaveId: leaveId,
      image,
      leaveStatus,
    };
    if (leave && reason && fromDate && toDate && leaveType) {
      leaveDetails.push(leaveData);
      localStorage.setItem("leaveDatas", JSON.stringify(leaveDetails));
      setLeaveType("");
      setReason("");
      setFromDate(new Date().toISOString().substr(0, 10));
      setToDate("");
      navigate("/Leave Details");
    }
  };

  return (
    <Fragment>
      <div className={styles.leaveForm}>
        <form className=" flex flex-col p-4 justify-center mx-auto w-4/6 max-sm:mx-2">
          <div className="items-center">
            <h1 className="  text-center max-sm:ml- mt-16 text-xl mb-5 max-sm:mb-2  md:mt-0 md:text-3xl font-semibold py-2">
              Apply Leave
            </h1>
          </div>
          <div className="formAlign flex">
            <label
              htmlFor="from-date"
              className="label w-[10vw] flex-shrink-0  inline-flex  pt-2 pl-4 pb-2 pr-0  text-md font-bold text-center text-gray-700  "
            >
              Leave
            </label>

            <select
              id="leave-type"
              value={leave}
              onChange={(event) => {
                setLeave(event.target.value);
              }}
              className="inputView border  border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <div className="ml-48  mb-4 max-sm:mb-0 max-sm:ml-2">
            {leaveError && (
              <p className="text-red-500 text-xs italic mt-2"> {leaveError}</p>
            )}
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
            <div className="mt-[-0.5rem] mb-2 px-5 max-sm:mt-1 max-sm:mb-0">
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
              <div
                className=" text-sm  dark:text-gray-700 bg-orange-200   text-orange-600  rounded px-4 py-2  ml-44 max-sm:ml-2  max-sm:w-64  "
                role="alert"
              >
                <div className="flex">
                  <div className="py-1">
                    <svg
                      className="fill-current h-6 w-6 text-orange-500 mr-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                    </svg>
                  </div>

                  <div>
                    {" "}
                    <p className="font-bold mt-1">Your {leave} balance is 04</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="formAlign flex">
            <label
              htmlFor="from-date"
              className="label  w-[10vw] flex-shrink-0  inline-flex pt-2 pl-4 pb-2 pr-0  text-md font-bold text-center text-gray-700  "
            >
              From Date
            </label>

            <input
              type="date"
              id="from-date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
              className="inputView border  border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            ></input>
          </div>
          <div className="mx-36 mb-4 max-sm:mb-0 max-sm:ml-2">
            {fromDateError && (
              <p className="text-red-500 text-xs italic mt-2">
                {fromDateError}
              </p>
            )}
          </div>
          <div className="formAlign flex ">
            <label
              htmlFor="to-date"
              className=" label  w-[10vw] flex-shrink-0  inline-flex pt-2 pl-4 pb-2 pr-0  text-md font-bold  text-center text-gray-700  "
            >
              To Date
            </label>
            <input
              type="date"
              id="to-date"
              value={toDate}
              className=" border  border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={(event) => setToDate(event.target.value)}
            />
          </div>
          <div className="ml-48 mb-4 max-sm:mb-0 max-sm:ml-2">
            {toDateError && (
              <p className="text-red-500 text-xs italic mt-2"> {toDateError}</p>
            )}
          </div>

          <div className="formAlign flex">
            <label
              htmlFor="from-date"
              className="label  w-[10vw] flex-shrink-0  inline-flex  pt-2 pl-4 pb-2 pr-0  text-md font-bold text-center text-gray-700  "
            >
              Leave Type
            </label>
            {toDate !== fromDate ? (
              <input
                type="text"
                value="FullDay"
                className="inputView border  border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            ) : (
              <>
                <select
                  id="leave-type"
                  value={leaveType}
                  onChange={(event) => setLeaveType(event.target.value)}
                  className="inputView border  border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {" "}
                  <option value="FN">FN</option>
                  <option value="AN">AN</option>
                </select>
              </>
            )}
          </div>
          <div className="ml-48 mb-4 max-sm:mb-0 max-sm:ml-2">
            {leaveTypeError && (
              <p className="text-red-500 text-xs italic mt-2">
                {leaveTypeError}
              </p>
            )}
          </div>

          <div className="formAlign flex">
            <label
              htmlFor="to-date"
              className="label  w-[10vw] flex-shrink-0 inline-flex  pt-2 pl-4 pb-2 pr-0 text-md font-bold  text-center text-gray-700  "
            >
              Reason
            </label>
            <input
              id="reason"
              placeholder="Enter the reason..."
              className="inputView border  border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
          </div>
          <div className="ml-48 mb-4 max-sm:mb-2 max-sm:ml-2">
            {reasonError && (
              <p className="text-red-500 text-xs italic mt-2"> {reasonError}</p>
            )}
            {/* {reasonLengthError && (
              <p className="text-red-500 text-xs italic mt-2"> {reasonError}</p>
            )} */}
          </div>
          <div className="button flex justify-end max-sm:justify-start">
            <div className="px-2">
              <button
                className={`text-white bg-gradient-to-br from-red-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-200 dark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 ${
                  leave.length === 0 ||
                  reason.length === 0 ||
                  fromDate.length === 0 ||
                  toDate.length === 0
                    ? "cursor-not-allowed opacity-50  "
                    : "cursor-pointer hover:bg-fontColor"
                }`}
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            {"  "}
            <div>
              <Link to={"/employee"}>
                <button
                  className=" text-white bg-gradient-to-br from-orange-500 to-red-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-orange-200 dark:focus:ring-orange-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  type="submit"
                >
                  Back
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default LeaveForm;
