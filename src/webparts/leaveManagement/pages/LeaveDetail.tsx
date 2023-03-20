/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import { Link } from "react-router-dom";

import moment from "moment";
import employees from "../../../fakeApi.json";

// import Pagination from "./Pagination";
const LeaveDetails = () => {
  // const [isLoading, setIsLoading] = useState(false);
  const [currentPage] = useState(1);
  const [dataPerPage] = useState(11);

  const data = JSON.parse(localStorage.getItem("leaveDatas"));

  let employeedetails = employees.employees.map((employee) => {
    return employee;
  });
  let userDatas;
  const empData = employeedetails.filter((e) => {
    return e !== undefined;
  });
  const empInfo = empData.pop();
  if (data) {
    let logeddata = data.map((userData: { email: string }) => {
      if (empInfo.email === userData.email) {
        return userData;
      }
    });

    let dataEmail: any[] = [];
    logeddata.map((e: any) => {
      dataEmail.push(e);
    });

    const dataLoggedUser = dataEmail;

    userDatas = dataLoggedUser.filter((e) => {
      return e !== undefined;
    });
  }

  let Days;

  //Get Current Page
  const indexOfLastPage = currentPage * dataPerPage;
  const indexFirstData = indexOfLastPage - dataPerPage;
  const CurrentData: any =
    userDatas !== undefined
      ? userDatas.slice(indexFirstData, indexOfLastPage)
      : "";

  return (
    <div className="">
      <div className=" my-20 mx-3 md:rounded-lg overflow-hidden">
        {/* <style jsx="true">
          {`
    @media (max-width: 767px) {
      .table-auto {
        display: block;
        width: 100%;
        overflow-x: hidden;
        padding:0px 20px;
        -webkit-overflow-scrolling: hidden;
      }
      .table-auto thead {
        display: none;
      }
      .table-auto tr {
        
        display: block;
        
      }
      .table-auto td {
        display: block;
        text-align:right;
        font-size: 0.775rem;
        padding:8px;
        border-bottom: none;
      }
      
      .table-auto td::before
      {
         
          float: left;
          font-weight: bold;
          text-transform: uppercase;
          font-size: 0.75rem;
          margin-bottom: 0.3125rem;
          }
       
          .table-auto td:nth-of-type(1):before {
            content: "Leave";
          }
          .table-auto td:nth-of-type(2):before {
            content: "Start Date";
          }
          .table-auto td:nth-of-type(3):before {
            content: "Leave End Date";
          }
       
          .table-auto td:nth-of-type(4):before {
            content: "Reason";
          }
          .table-auto td:nth-of-type(5):before {
            content: "Status";
          }
    
          
          `}
        </style> */}

        <div className=" mt-3 mx-3 md:mt-0 bg-white shadow-md rounded-lg overflow-hidden">
          <div>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="bg-gray-200  p-3 text-center">
                    <p>Sl No.</p>
                  </th>
                  <th className="bg-gray-200  p-3 text-center ">
                    <p>Leave </p>
                  </th>
                  <th className="bg-gray-200  p-3 text-center">
                    <p>Leave Start</p>
                  </th>
                  <th className="bg-gray-200  p-3 text-center">
                    <p>Leave End</p>
                  </th>
                  <th className="bg-gray-200  p-3 text-center">
                    <p>Days</p>
                  </th>
                  <th className="bg-gray-200  p-3 text-center">
                    <p> Leave Type</p>
                  </th>
                  <th className="bg-gray-200  p-3 text-center">
                    <p>Reason</p>
                  </th>

                  <th className="bg-gray-200  p-3 text-center">
                    <p className="flex items-center justify-center">Status</p>
                  </th>
                </tr>
              </thead>
              <tbody className="max-[766px]:flex max-[766px]:flex-col items-stretch text-gray-600 text-sm font-ligh">
                {CurrentData === undefined || CurrentData.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 h-40 py-5 border-b border-gray-200 bg-white max-[640px]:text-sm text-4xl  capitalize text-gray-600  shadow-2xl font-sans hover:font-serif"
                      style={{ textShadow: "3px 4px 5px #ccc" }}
                    >
                      <p className=" text-center"> No records found</p>
                    </td>
                  </tr>
                ) : (
                  CurrentData.map(
                    (
                      data: {
                        leave: any;
                        fromDate: moment.MomentInput;
                        toDate: moment.MomentInput;
                        leaveType: any;
                        reason: any;
                        leaveStatus: string;
                      },
                      index: any
                    ) => (
                      <tr className="px-5 py-5 border-b border-gray-200 bg-white text-sm ">
                        {window.innerWidth > 766 ? (
                          <td
                            key={index}
                            className="py-3 px-6  whitespace-nowrap"
                          >
                            {<p>{index + 1}</p>}
                          </td>
                        ) : (
                          ""
                        )}
                        <td className="py-3 px-6  whitespace-nowrap ">
                          {data.leave}
                        </td>
                        <td className="py-3 px-6  whitespace-nowrap ">
                          {data.fromDate}
                        </td>
                        <td className="py-3 px-6  whitespace-nowrap">
                          {data.toDate}
                        </td>
                        {window.innerWidth > 766 ? (
                          <td className="py-3 px-6  whitespace-nowrap ">
                            <span>
                              {
                                (Days =
                                  1 +
                                  moment(data.toDate, "YYYY-MM-DD").diff(
                                    moment(data.fromDate, "YYYY-MM-DD"),
                                    "days"
                                  ))
                              }{" "}
                              {Days > 1 ? "Days" : "Day"}
                            </span>
                          </td>
                        ) : (
                          ""
                        )}
                        {window.innerWidth > 766 ? (
                          <td className="py-3 px-6  whitespace-nowrap ">
                            {data.leaveType}
                          </td>
                        ) : (
                          ""
                        )}

                        <td className="py-3 px-6  whitespace-nowrap">
                          {data.reason}
                        </td>
                        <td className="py-3 px-6  whitespace-nowrap">
                          <span
                            className={`${
                              data.leaveStatus === "Pending"
                                ? "relative inline-block px-3 py-1 font-semibold text-slate-800 leading-tight"
                                : ""
                            } ${
                              data.leaveStatus === "Approve"
                                ? "relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight"
                                : ""
                            }
                              ${
                                data.leaveStatus === "Reject"
                                  ? "relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight "
                                  : ""
                              }`}
                          >
                            <span
                              className={`${
                                data.leaveStatus === "Reject"
                                  ? "absolute inset-0 bg-orange-200 opacity-50 rounded-full"
                                  : ""
                              } ${
                                data.leaveStatus === "Approve"
                                  ? "absolute inset-0 bg-green-200 opacity-50 rounded-full"
                                  : ""
                              } ${
                                data.leaveStatus === "Pending"
                                  ? "absolute inset-0 bg-gray-200 opacity-50 rounded-full "
                                  : ""
                              }`}
                            ></span>
                            <span aria-hidden className="relative text-xs">
                              {data.leaveStatus}
                            </span>
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
          {/* {userDatas === undefined ||
            (userDatas.length > 0 && (
              <div>
                <Pagination
                  totalData={userDatas.length}
                  dataPerPage={dataPerPage}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                />
              </div>
            ))} */}
        </div>
      </div>
      <div className="mt-[-6vh] mb-2 flex items-center justify-center">
        <Link to={"/Apply Leave"}>
          <button className="w-56  text-white bg-gradient-to-br from-orange-500 to-red-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-bold rounded-full text-md px-5 py-2.5 text-center mr-2 mb-2 buttonView">
            Apply for Leave
          </button>
        </Link>
      </div>
    </div>
  );
};
export default LeaveDetails;
