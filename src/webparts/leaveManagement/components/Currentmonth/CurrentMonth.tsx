import React, { useState } from 'react';
import { BiExport } from 'react-icons/bi';
import styles from '../ApprovedList/ApprovedList.module.scss';
import * as XLSX from 'xlsx';

const CurrentMonth = (data: any) => {
  // Get the current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
  const currentYear = currentDate.getFullYear();

  // State to track the selected export option
  const [exportOption, setExportOption] = useState('currentMonth');

  // Function to handle export button click
  const handleExport = () => {
    let filteredData;

    if (exportOption === 'currentMonth') {
      filteredData = data.table
        .filter((E: any) => {
          const fromDate = new Date(E.FromDate);
          const month = fromDate.getMonth() + 1; // Months are zero-based, so add 1
          const year = fromDate.getFullYear();
          return month === currentMonth && year === currentYear;
        })
        .map((e: any) => {
          return {
            ID: e.ID,
            Name: e.Name,
            Email: e.Email,
            FromDate: e.FromDate,
            ToDate: e.ToDate,
            Days: e.Days,
            ...e.rest, // Assuming `rest` is an object containing the remaining properties
          };
        });
    } else if (exportOption === 'yearly') {
      filteredData = data.table.map((e: any) => {
        return {
          ID: e.ID,
          Name: e.Name,
          Email: e.Email,
          FromDate: e.FromDate,
          ToDate: e.ToDate,
          Days: e.Days,
          ...e.rest, // Assuming `rest` is an object containing the remaining properties
        };
      });
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  return (
    <div className={styles.export}>
      <div className={styles.exportOptions}>
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
          Yearly
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
