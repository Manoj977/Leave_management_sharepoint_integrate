import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const CurrentMonthLop = (leavesThisMonth: any, filteredEmployees: any) => {
  const uniqueLeaves = leavesThisMonth.reduce(
    (accumulator: any, currentLeave: any) => {
      const isDuplicate = accumulator.some(
        (leave: any) =>
          leave.ID === currentLeave.ID &&
          leave.FromDate === currentLeave.FromDate &&
          leave.ToDate === currentLeave.ToDate &&
          leave.leaveDays === currentLeave.leaveDays
      );

      if (!isDuplicate) {
        accumulator.push(currentLeave);
      }

      return accumulator;
    },
    []
  );
  // console.log(uniqueLeaves);

  // // Mapping data from uniqueLeaves and filteredEmployees
  // const exportedData = uniqueLeaves.map((leave: any) => {
  //   const matchingEmployee = filteredEmployees.find(
  //     (employee: any) => employee.ID === leave.EmployeeID
  //   );

  //   return {
  //     ID: matchingEmployee.ID,
  //     Name: matchingEmployee.Name,
  //     Email: matchingEmployee.Email,
  //     FromDate: leave.fromDate,
  //     ToDate: leave.toDate,
  //     LeaveDays: leave.leaveDays,
  //   };
  // });

  // const workbook = XLSX.utils.book_new();
  // const worksheet = XLSX.utils.json_to_sheet(exportedData);
  // // console.log(workbook, worksheet);

  // XLSX.utils.book_append_sheet(workbook, worksheet, 'Exported Data');
  // XLSX.writeFile(workbook, 'exported_data.xlsx');
};

export default CurrentMonthLop;
