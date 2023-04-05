/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sp } from '@pnp/sp/presets/all';
import React, { useEffect, useState } from 'react';
import convert from 'xml-js';
import { MyContext } from '../../context/contextProvider';

type LeaveDetail = {
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  FromDate: Date;
  ToDate: Date;
  LeaveType: Date;
  Reason: string;
  NoofDaysLeave: string;
  Status: string;
  Lop: number;
};
const LeaveCalculation = () => {
  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [leaveFromDate] = useState<Date>(new Date());
  const [leaveToDate] = useState<Date>(new Date());
  const {
    setLossofPay,
    setTakenLeaves,
    totalLeaves,
    takenLeaves,
    setAvailableLeaves,
  } = React.useContext(MyContext);
  console.log(takenLeaves, totalLeaves);
  setAvailableLeaves(totalLeaves - takenLeaves);
  let userEmail = '';
  useEffect(() => {
    // eslint-disable-next-line no-void
    void sp.web.currentUser.get().then((user) => {
      userEmail = user.Email;
      const url = `https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Leave%20Management')/items?$filter=Email%20eq%20%27${userEmail}%27`;
      console.log(url);
      fetch(url)
        .then((res) => res.text())
        .then((data) => {
          const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
          const parsedData = JSON.parse(jsonData);
          const entries = Array.isArray(parsedData.feed.entry)
            ? parsedData.feed.entry
            : [parsedData.feed.entry];
          const leaveDetail: LeaveDetail[] = entries.map((entry: any) => ({
            ID: entry.content['m:properties']['d:Title']._text,
            Name: entry.content['m:properties']['d:Name']._text,
            Email: entry.content['m:properties']['d:Email']._text,
            Leave: entry.content['m:properties']['d:Leave']._text,
            LeaveType: entry.content['m:properties']['d:LeaveType']._text,
            count: entry.content['m:properties']['d:count']._text,
            FromDate: new Date(
              entry.content['m:properties']['d:FormDate']._text
            ).toLocaleDateString(),
            ToDate: new Date(
              entry.content['m:properties']['d:ToDate']._text
            ).toLocaleDateString(),
            Reason: entry.content['m:properties']['d:Reason']._text,
            Status: entry.content['m:properties']['d:Status']._text,
            NoofDaysLeave: entry.content['m:properties']['d:count']._text,
            Lop: parseInt(entry.content['m:properties']['d:LOP']._text),
          }));
          setLeaveDetails(leaveDetail);
        })
        .catch((err) => console.log(err));
    });
  }, []);
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };
  console.log(LeaveDetails);
  let lop = 0;
  LeaveDetails.map((e) => {
    e.Status === 'Approved' ? console.log(e.Lop) : '';
  });
  console.log('LOP', lop);
  let countNum = 0;

  const approvedLeaves = LeaveDetails.filter((leave) =>
    leave.Status === 'Approved'
      ? (countNum += parseInt(leave.NoofDaysLeave))
      : ''
  );
  console.log(countNum);
  console.log(approvedLeaves);
  const approvedLeavesCount = countNum;
  console.log(approvedLeavesCount);
  const leaveCount = approvedLeaves.reduce((total, leave) => {
    return total + parseInt(leave.NoofDaysLeave);
  }, 0);
  console.log(leaveCount);

  const calculateLeaveDays = (): number => {
    let leaveDays = approvedLeavesCount;

    console.log(leaveDays);
    let currentDate = new Date(leaveFromDate.getTime());
    console.log(currentDate, leaveToDate, leaveDays, leaveCount);
    while (currentDate <= leaveToDate && leaveDays < leaveCount) {
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();

      const daysInMonth = getDaysInMonth(month, year);

      let daysInSection = Math.min(leaveCount - leaveDays, 3);
      console.log(month, year, daysInMonth, daysInSection);

      // Reduce the days in section if it's more than the remaining days in the current month
      if (daysInSection > daysInMonth - currentDate.getDate() + 1) {
        daysInSection = daysInMonth - currentDate.getDate() + 1;
      }

      // Only add to leaveDays if the section still has days remaining
      if (daysInSection > 0) {
        leaveDays += daysInSection;
      }

      // Move to the next month if the current section has been exhausted
      if (daysInSection === 3) {
        currentDate.setMonth(currentDate.getMonth() + 1);
        currentDate.setDate(1);
      } else {
        currentDate.setDate(currentDate.getDate() + daysInSection);
      }
    }

    return leaveDays;
  };

  const calculateLossOfPayDays = (): number => {
    const totalLeaveDays = calculateLeaveDays();
    console.log(totalLeaveDays);
    console.log('countNum', countNum);
    console.log('totalLeaveDays', totalLeaveDays);
    setTakenLeaves(countNum);

    const lossOfPayDays = Math.max(totalLeaveDays - 3, 0);

    countNum > totalLeaves ? (lop = countNum - totalLeaves) : lop;
    setLossofPay(lop);
    return lossOfPayDays;
  };

  calculateLeaveDays();
  calculateLossOfPayDays();
};

export default LeaveCalculation;
