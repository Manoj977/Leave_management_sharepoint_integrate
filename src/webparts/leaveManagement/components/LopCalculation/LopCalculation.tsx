/* eslint-disable @typescript-eslint/no-floating-promises */
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
  NoofDaysLeave: string;
  Status: string;
};
interface leaves {
  name: string;
  days: number;
  dates: Date[];
}
// interface LOPDays {
//   date: string;
// }

const LopCalculation = () => {
  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);

  // const [LOPDays, setLopDateDays] = useState<LOPDays[]>([]);
  const {
    setLossofPay,
    setTakenLeaves,
    totalLeaves,
    takenLeaves,
    setAvailableLeaves,
    setLopDate,
  } = React.useContext(MyContext);

  const lops: any[] = [];
  useEffect(() => {
    let userEmail = '';
    sp.web.currentUser.get().then((user) => {
      userEmail = user.Email;
      const url = `https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leave%20Management')/items?$filter=Email%20eq%20%27${userEmail}%27`;

      fetch(url)
        .then((res) => res.text())
        .then((data) => {
          const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
          const parsedData = JSON.parse(jsonData);
          const entries = Array.isArray(parsedData.feed.entry)
            ? parsedData.feed.entry
            : [parsedData.feed.entry];
          const leaveDetail: LeaveDetail[] = entries.map((entry: any) => {
            try {
              return {
                ID: entry.content['m:properties']['d:Title']._text,
                Name: entry.content['m:properties']['d:Name']._text,
                Email: entry.content['m:properties']['d:Email']._text,
                Leave: entry.content['m:properties']['d:Leave']._text,
                FromDate: new Date(
                  entry.content['m:properties']['d:FormDate']._text
                ),
                ToDate: new Date(
                  entry.content['m:properties']['d:ToDate']._text
                ),
                Status: entry.content['m:properties']['d:Status']._text,
                NoofDaysLeave: parseFloat(
                  entry.content['m:properties']['d:count']._text
                ),
              };
            } catch (error) {
              if (
                error instanceof TypeError &&
                error.message.includes('Cannot read properties of undefined')
              ) {
                return null;
              } else {
                throw error;
              }
            }
          });
          const filteredLeaveDetail = leaveDetail.filter(
            (item) => item !== null
          );
          setLeaveDetails(filteredLeaveDetail);
        })
        .catch((err) => console.log(err));
    });
  }, []);
  function getDatesBetween(fromDate: Date, toDate: Date): Date[] {
    const dates = [];
    let currentDate = new Date(fromDate);
    while (currentDate.getTime() <= toDate.getTime()) {
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // 0 = Sunday, 6 = Saturday
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  useEffect(() => {
    const filteredLeaveDetails = LeaveDetails.filter(
      (leaveDetail) => leaveDetail.Status !== 'Cancelled'
    );
    const quarters = [
      { name: 'Q1', startMonth: 0, endMonth: 2, leaves: [] as leaves[] },
      { name: 'Q2', startMonth: 3, endMonth: 5, leaves: [] as leaves[] },
      { name: 'Q3', startMonth: 6, endMonth: 8, leaves: [] as leaves[] },
      { name: 'Q4', startMonth: 9, endMonth: 11, leaves: [] as leaves[] },
    ];

    filteredLeaveDetails.forEach((leaveDetail) => {
      if (leaveDetail.FromDate && leaveDetail.ToDate) {
        const fromDate = new Date(leaveDetail.FromDate);
        const toDate = new Date(leaveDetail.ToDate);

        const dates = getDatesBetween(fromDate, toDate);

        quarters.forEach((quarter) => {
          if (
            leaveDetail.FromDate.getMonth() >= quarter.startMonth &&
            leaveDetail.ToDate.getMonth() <= quarter.endMonth
          ) {
            quarter.leaves.push({
              name: leaveDetail.Name,
              days: dates.length,
              dates: dates,
            });
          }
        });
      }
    });

    const lopfunc = (index: number, count: number, date: string) => {
      if (count > 3) {
        let array = date;
        lops.push(array, filteredLeaveDetails[0].ID);
      } else null;
    };

    // console.log(LOPDays);
    quarters.forEach((quarter) => {
      let totalDays = 0;
      let count = 0;
      quarter.leaves.forEach((leave) => {
        totalDays += leave.days;
      });
      totalDays > 3
        ? quarter.leaves.filter((leave, index) =>
            leave.dates.map((e) => {
              lopfunc(index, ++count, e.toLocaleDateString('en-GB'));
            })
          )
        : null;
    });

    setLopDate([lops]);
  }, [
    // setLopDateDays,
    LeaveDetails,
    setLossofPay,
    setTakenLeaves,
    totalLeaves,
    takenLeaves,
    setAvailableLeaves,
  ]);
};

export default LopCalculation;
