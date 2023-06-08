/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-self-compare */
import React, { useState } from 'react';
import { BiExport } from 'react-icons/bi';
import styles from '../ApprovedList/ApprovedList.module.scss';
import * as XLSX from 'xlsx';
import { MdOutlineCancel } from 'react-icons/md';

interface EmployeeData {
  ID: string;
  Name: string;
  Email: string;
  FromDate: string;
  ToDate: string;
  Days: number;
  Status: string;
  LeaveDatas: any;
}

interface FilteredDataItem {
  ID: string;
  Name: string;
  Email: string;
  FromDate: string;
  ToDate: string;
  Days: number;
  Status: string;
  TotalLeaveTaken?: number;
}

interface FilteredDataItemYearly extends EmployeeData {
  LeaveDetails: {
    FromDate: string;
    ToDate: string;
    Days: number;
  }[];
  TotalTakenLeave: number;
  Lop: number;
}

const CurrentMonth = ({
  data,
}: {
  data: {
    // table: EmployeeData[];
    Lop: any[];
    CurrentData: any[];
    CurrentMonthLeave: any[];
    CurrentYearLeave: any[];
  };
}) => {
  // Create an object to store total leave taken by each employee
  const employeeTotalLeave: { [email: string]: number } = {};

  // data.CurrentYearLeave.forEach((employee: EmployeeData) => {
  //   if (employee.Status === 'Approved') {
  //     const email = employee.Email;
  //     const days = employee.Days;

  //     // Check if the email already exists in the object
  //     if (employeeTotalLeave.hasOwnProperty(email)) {
  //       // Email exists, increment the total leave days
  //       employeeTotalLeave[email] += days;
  //     } else {
  //       // Email doesn't exist, initialize the total leave days
  //       employeeTotalLeave[email] = days;
  //     }
  //   }
  // });
  let count: number = 0;
  const calcFunc = (
    FromDate: any,
    ToDate: any,
    email: string,
    Description: any
  ) => {
    const fromDate = new Date(FromDate);
    const toDate = new Date(ToDate);
    if (email === email) {
      count = 0;
    }
    // Calculate the number of days between fromDate and toDate (including the last day)
    const totalDays =
      Math.floor((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) +
      1;

    // Create an array to store the dates
    const dateArray = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(
        fromDate.getTime() + i * 24 * 60 * 60 * 1000
      );

      // Check if the current date is not a Saturday or Sunday
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dateArray.push(currentDate);
      }
    }

    // Iterate over the dateArray and format the dates as desired
    dateArray.forEach((date) => {
      const formattedDate = `${date.getDate()}-${
        date.getMonth() + 1
      }-${date.getFullYear()}`;
      // console.log(formattedDate, ++count, Description);
    });
  };

  data.CurrentYearLeave.forEach((employee: EmployeeData) => {
    if (employee.Status === 'Approved') {
      const email = employee.Email;
      const leaveDetails = data.CurrentYearLeave.filter(
        (data: EmployeeData) => data.Email === email
      );

      let totalTakenLeave = 0;

      // console.log(`Employee Email: ${email}`);
      // console.log('Leave Details:');
      leaveDetails.forEach((leave) => {
        totalTakenLeave += leave.Days;

        calcFunc(leave.FromDate, leave.ToDate, email, 'Leaves');
      });
      // console.log('Total Taken Leaves:', totalTakenLeave);
      // console.log('\n');
    }
  });

  // Log the total leave taken by each employee
  for (const email in employeeTotalLeave) {
    if (employeeTotalLeave.hasOwnProperty(email)) {
      // console.log(`Employee Email: ${email}`);
      // console.log(`Total Leave Taken: ${employeeTotalLeave[email]} days`);
    }
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const [exportOption, setExportOption] = useState<string>('currentMonth');
  const [click, setClick] = useState<boolean>(false);

  const handleExport = () => {
    let filteredData: any[] = [];

    if (exportOption === 'currentMonthLop') {
      filteredData = data.CurrentMonthLeave.filter(
        (employee: EmployeeData, index: number, self: EmployeeData[]) => {
          return (
            index === self.findIndex((e: EmployeeData) => e.ID === employee.ID)
          );
        }
      )
        .filter((employee: EmployeeData) => {
          const fromDate = new Date(employee.FromDate);
          const month = fromDate.getMonth() + 1;
          const year = fromDate.getFullYear();
          return month === currentMonth && year === currentYear;
        })
        .map((employee: EmployeeData) => ({
          ...employee,
          Days: employee.Days,
        }))
        .filter((employee) => employee !== null);

      // Sort the filteredData array by month
      filteredData.sort((a, b) => {
        const aDate = new Date(a.FromDate);
        const bDate = new Date(b.FromDate);
        return aDate.getMonth() - bDate.getMonth();
      });

      // console.log(filteredData, 'Monthly');
    } else if (exportOption === 'currentMonth') {
      filteredData = data.CurrentMonthLeave.filter(
        (employee: EmployeeData) => employee.Status === 'Approved'
      ).map((employee: EmployeeData) => {
        const leaveDetails = data.CurrentMonthLeave.filter(
          (datas: EmployeeData) => datas.Email === employee.Email
        ).map((datas) => ({
          FromDate: datas.FromDate,
          ToDate: datas.ToDate,
          Days: datas.Days,
        }));
        employee.LeaveDatas = leaveDetails;

        // Sort the leave details by FromDate in ascending order
        leaveDetails.sort((a, b) => a.FromDate - b.FromDate);

        const totalTakenLeave = leaveDetails.reduce(
          (total, leave) => total + leave.Days,
          0
        );

        // Concatenating leave details into a single string
        const concatenatedLeaveDetails = employee.LeaveDatas.map(
          (leave: any) =>
            `FromDate: ${leave.FromDate} - ToDate: ${leave.ToDate}, ${
              leave.Days === 1 ? 'Day:' : 'Days: '
            } ${leave.Days} ${leave.Days === 1 ? 'Day' : 'Days'}`
        ).join('\r\n');

        return {
          ID: employee.ID,
          Name: employee.Name,
          Email: employee.Email,
          LeaveDetails: concatenatedLeaveDetails,
          CurrentMonthLeave: totalTakenLeave,
          CurrentMonthLop: 0, // Replace 0 with the actual value of LOP for the current month
        };
      });
      // Sort the filteredData array by month
      filteredData.sort((a, b) => a.FromDate - b.FromDate);

      // console.log(filteredData, 'Currentmonth');
    }
    if (exportOption === 'yearly') {
      filteredData = data.CurrentYearLeave.filter(
        (employee) => employee.Status === 'Approved'
      ).map((employee) => {
        if (data.Lop.some((lopemail) => lopemail.Email === employee.Email)) {
          const lopEmail = data.Lop.find(
            (lopemail) => lopemail.Email === employee.Email
          );
          employee.Lop = lopEmail.lop;
          const leaveDetails = data.CurrentYearLeave.filter(
            (datas) => datas.Email === employee.Email
          ).map((datas) => ({
            FromDate: datas.FromDate,
            ToDate: datas.ToDate,
            Days: datas.Days,
          }));

          // Sort the leave details by FromDate in ascending order
          leaveDetails.sort((a, b) => a.FromDate - b.FromDate);

          const totalTakenLeave = leaveDetails.reduce(
            (total, leave) => total + leave.Days,
            0
          );

          // Concatenating leave details into a single string
          const concatenatedLeaveDetails = leaveDetails
            .map(
              (leave) =>
                `FromDate: ${leave.FromDate} - ToDate: ${leave.ToDate},Days: ${leave.Days} days `
            )
            .join('\r\n');
          // console.log(concatenatedLeaveDetails);

          return {
            ID: employee.ID,
            Name: employee.Name,
            Email: employee.Email,
            LeaveDetails: concatenatedLeaveDetails,
            TotalTakenLeave: totalTakenLeave,
            Lop: employee.Lop,
          };
        }
      });
    }

    const leaveData = filteredData.reduce((uniqueItems, item) => {
      const isDuplicate = uniqueItems.some(
        (uniqueItem: any) => uniqueItem.ID === item.ID
      );
      if (!isDuplicate) {
        uniqueItems.push(item);
      }
      return uniqueItems;
    }, []);
    // console.log(leaveData);
    filteredData = leaveData;
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
    setClick(!click);

    if (filteredData.length > 0) {
      XLSX.writeFile(workbook, 'exported_data.xlsx');
    } else {
      alert('This month has no approved leave entries.');
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        transition: 'opacity 0.5s',
        marginBottom: '1rem',
      }}
      className={styles.Heads}
    >
      <div>
        {!click && (
          <p
            style={{ cursor: 'pointer' }}
            className={styles.exportButton}
            onClick={() => {
              setClick(!click);
            }}
          >
            <span className={styles.exportButtonName}>Export the data</span>
          </p>
        )}
      </div>
      {click && (
        <div
          className={styles.export}
          style={{
            opacity: click ? 1 : 0,
            transition: 'opacity 0.5s',
            marginTop: '1rem',
            marginBottom: '1rem',
            columnGap: '1rem',
            cursor: 'pointer',
          }}
        >
          <div className={styles.exportOptions}>
            {/* <label>
          <input
            type='radio'
            name='exportOption'
            value='currentMonthLop'
            checked={exportOption === 'currentMonthLop'}
            onChange={() => setExportOption('currentMonthLop')}
          />
          Lop
        </label> */}
            <label>
              <input
                type='radio'
                name='exportOption'
                value='currentMonth'
                checked={exportOption === 'currentMonth'}
                onChange={() => setExportOption('currentMonth')}
              />
              Current Month
            </label>
            <label>
              <input
                type='radio'
                name='exportOption'
                value='yearly'
                checked={exportOption === 'yearly'}
                onChange={() => setExportOption('yearly')}
              />
              Current Year
            </label>
          </div>

          <button
            style={{ background: '#f40', color: 'whitesmoke' }}
            className={styles.exportButton}
            onClick={handleExport}
          >
            <span
              className={styles.exportButtonText}
              style={{ background: '#f40', color: 'whitesmoke' }}
            >
              <BiExport size={24} />
            </span>
          </button>
          <div
            onClick={() => {
              setClick(!click);
            }}
            style={{
              color: 'rgb(153,171,180)',
              borderRadius: '20%',
              border: 'none',
              position: 'absolute',
              top: '-18px',
              right: '-16px',
              fontSize: 'medium',
            }}
            className={styles.totalLeaveCloseButton}
          >
            <MdOutlineCancel />
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentMonth;
