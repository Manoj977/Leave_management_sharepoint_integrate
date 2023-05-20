import React from 'react';
import { BiExport } from 'react-icons/bi';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import styles from '../ApprovedList/ApprovedList.module.scss';
const CurrentMonth = (data: any, table: any) => {
  console.log(data, table);
  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const currentYear = currentDate.getFullYear();

  // Filter the table data to get the dates in the current month
  const currentMonthData = data.table.filter((E: any) => {
    const fromDate = new Date(E.FromDate);
    const month = fromDate.getMonth() + 1; // Months are zero-based, so add 1
    const year = fromDate.getFullYear();
    return month === currentMonth && year === currentYear;
  });

  // Display the filtered dates
  currentMonthData.forEach((E: any) => {
    console.log('data:', E);
  });

  return (
    
    <></>
  );
};

export default CurrentMonth;
