/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-self-compare */
import React, { useState } from 'react';
import { BiExport } from 'react-icons/bi';
import styles from '../ApprovedList/ApprovedList.module.scss';
import * as XLSX from 'xlsx';

interface EmployeeData {
  ID: string;
  Name: string;
  Email: string;
  FromDate: string;
  ToDate: string;
  Days: number;
  Status: string;

  rest?: object;
}
interface EmployeeDataYear {
  ID: string;
  Name: string;
  Email: string;
  FromDate: string;
  ToDate: string;
  Days: number;
  Status: string;
  // TotalTakenLeave: number;
  Lop: number;
  rest?: object;
}

interface EmployeeDatas {
  ID: string;
  Name: string;
  Email: string;
  FromDate: string;
  ToDate: string;
  Days: number;
  Status: string;
  rest?: object;
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
  console.log(data.Lop, 'Lop');

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [exportOption, setExportOption] = useState('currentMonth');

  const handleExport = () => {
    let filteredData: EmployeeData[] = [];

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

      console.log(filteredData, 'Monthly');
    } else if (exportOption === 'currentMonth') {
      const totalLeaveByEmployee: { [key: string]: number } = {};

      filteredData = data.CurrentMonthLeave.filter(
        (employee: EmployeeDatas) => {
          const fromDate = new Date(employee.FromDate);
          const month = fromDate.getMonth() + 1;
          const year = fromDate.getFullYear();
          return month === currentMonth && year === currentYear;
        }
      )
        .map((employee: EmployeeDatas) => {
          const { ID, Name, Email, FromDate, ToDate, Days, Status } = employee;

          if (Status === 'Approved') {
            if (totalLeaveByEmployee[ID]) {
              totalLeaveByEmployee[ID] += Days;
            } else {
              totalLeaveByEmployee[ID] = Days;
            }

            return {
              ID,
              Name,
              Email,
              FromDate,
              ToDate,
              Days,
              Status,
            };
          }

          return null; // Exclude non-approved leave entries
        })
        .filter((employee) => employee !== null);

      // Sort the filteredData array by month
      filteredData.sort((a, b) => {
        const aDate = new Date(a.FromDate);
        const bDate = new Date(b.FromDate);
        return aDate.getMonth() - bDate.getMonth();
      });

      console.log(filteredData, 'CurrentmonthLop');
    } else if (exportOption === 'yearly') {
      data.CurrentData.map((datas, index) => {
        console.log(datas);

        data.Lop.map((lopemail, index) => {
          filteredData = data.CurrentYearLeave.filter(
            (employee: EmployeeDataYear) => employee.Status === 'Approved'
          ).map((employee: EmployeeDataYear) => {
            if (lopemail.Email === employee.Email) {
              // employee.TotalTakenLeave = datas.Days;
              employee.Lop = lopemail.lop;
            }
            return {
              ID: employee.ID,
              Name: employee.Name,
              Email: employee.Email,
              FromDate: employee.FromDate,
              ToDate: employee.ToDate,
              Days: employee.Days,
              Status: employee.Status,
              // TotalTakenLeave: employee.TotalTakenLeave, // Add TotalTakenLeave property
              Lop: employee.Lop, // Add Lop property
            };
          });
        });
      });

      filteredData.map((datas) => {
        data.Lop.map((lopemail, index) => {
          if (datas.Email === lopemail.Email) {
            console.log('Lop Email: ', lopemail.Email);
          }
        });
        // Sort the filteredData array by month
        filteredData.sort((a, b) => {
          const aDate = new Date(a.FromDate);
          const bDate = new Date(b.FromDate);
          return aDate.getMonth() - bDate.getMonth();
        });
      });
      console.log(filteredData, 'yearly');
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');

    if (filteredData.length > 0) {
      XLSX.writeFile(workbook, 'exported_data.xlsx');
    } else {
      alert('This month has no approved leave entries.');
    }
  };

  return (
    <div className={styles.export}>
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
      <button className={styles.exportButton} onClick={handleExport}>
        <span className={styles.exportButtonText}>
          <BiExport className={styles.exportButtonIcon} />
          <span className={styles.exportButtonName}>Export</span>
        </span>
      </button>
    </div>
  );
};

export default CurrentMonth;
