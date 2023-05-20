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

const LeaveCalculation = () => {
  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [lopDates, setLopDates] = useState<Date[]>([]); // Array to store LOP dates
  let {
    setLossofPay,
    setTakenLeaves,
    totalLeaves,
    setAvailableLeaves,
    defaultLop,
  } = React.useContext(MyContext);
  defaultLop = parseInt(defaultLop);

  useEffect(() => {
    let userEmail = '';
    sp.web.currentUser.get().then((user) => {
      userEmail = user.Email;
      const url = `https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Leave%20Management')/items?$filter=Email%20eq%20%27${userEmail}%27`;

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

  useEffect(() => {
    if (defaultLop === 3) {
      let totalTakenLeaves = LeaveDetails.reduce((total, leaveDetail) => {
        return total + parseFloat(leaveDetail.NoofDaysLeave);
      }, 0);

      const quarterLeaveCounts = [0, 0, 0, 0];
      const lopDates: Date[] = [];

      const ApprovedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
        return leaveDetail.Status === 'Approved';
      });

      ApprovedLeaveDetails.forEach((leaveDetail) => {
        const quarterIndex = Math.floor(
          leaveDetail.FromDate.getMonth() / defaultLop
        );
        quarterLeaveCounts[quarterIndex] += parseFloat(
          leaveDetail.NoofDaysLeave
        );
      });

      let lossOfPay = 0;

      quarterLeaveCounts.forEach((quarterCount, quarterIndex) => {
        if (quarterCount > defaultLop) {
          const excessLeaveCount = quarterCount - defaultLop;
          quarterLeaveCounts[quarterIndex] = defaultLop;
          lossOfPay += (excessLeaveCount * totalLeaves) / 12;

          ApprovedLeaveDetails.forEach((leaveDetail) => {
            const quarterStartMonth = quarterIndex * defaultLop;
            const quarterEndMonth = (quarterIndex + 1) * defaultLop - 1;
            const leaveStartMonth = leaveDetail.FromDate.getMonth();
            const leaveEndMonth = leaveDetail.ToDate.getMonth();

            if (
              leaveStartMonth >= quarterStartMonth &&
              leaveEndMonth <= quarterEndMonth
            ) {
              const startDate = leaveDetail.FromDate;
              const endDate = leaveDetail.ToDate;

              for (
                let currentDate = startDate;
                currentDate <= endDate;
                currentDate.setDate(currentDate.getDate() + 1)
              ) {
                if (
                  currentDate.getDay() !== 0 &&
                  currentDate.getDay() !== 6 &&
                  quarterLeaveCounts[
                    Math.floor(currentDate.getMonth() / defaultLop)
                  ] < defaultLop
                ) {
                  lopDates.push(new Date(currentDate));
                  quarterLeaveCounts[
                    Math.floor(currentDate.getMonth() / defaultLop)
                  ]++;
                }
              }
            }
          });
        }
      });

      const totalQuarterLeaveCount = quarterLeaveCounts.reduce(
        (total, count) => total + count,
        0
      );

      if (totalQuarterLeaveCount <= totalLeaves) {
        setTakenLeaves(totalTakenLeaves);
        setAvailableLeaves(totalLeaves - totalQuarterLeaveCount);
      } else {
        setTakenLeaves(totalTakenLeaves);
        setAvailableLeaves(0);
      }
      setLossofPay(lossOfPay);
    }
    if (defaultLop === 1) {
      let totalTakenLeaves = LeaveDetails.reduce((total, leaveDetail) => {
        return total + parseFloat(leaveDetail.NoofDaysLeave);
      }, 0);

      const lopDates: Date[] = [];

      const ApprovedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
        return leaveDetail.Status === 'Approved';
      });

      let remainingLeaves = totalLeaves;

      ApprovedLeaveDetails.forEach((leaveDetail) => {
        const leaveDays = Math.min(1, remainingLeaves); // Consider only one leave day per month
        const lopDays = parseInt(leaveDetail.NoofDaysLeave) - leaveDays;

        if (lopDays > 0) {
          remainingLeaves -= leaveDays;
          for (let i = 0; i < lopDays; i++) {
            const lopDate = new Date(leaveDetail.FromDate);
            lopDate.setDate(lopDate.getDate() + i + leaveDays);
            lopDates.push(lopDate);
          }
        } else {
          remainingLeaves -= parseInt(leaveDetail.NoofDaysLeave);
        }
      });

      setTakenLeaves(totalTakenLeaves);
      setAvailableLeaves(remainingLeaves);
      setLossofPay(lopDates.length);
      setLopDates(lopDates); // Update the LOP dates array
    }

    if (defaultLop === 12) {
      let totalTakenLeaves = LeaveDetails.reduce((total, leaveDetail) => {
        return total + parseFloat(leaveDetail.NoofDaysLeave);
      }, 0);

      const lopDates: Date[] = [];

      const ApprovedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
        return leaveDetail.Status === 'Approved';
      });

      let remainingLeaves = totalLeaves;

      ApprovedLeaveDetails.forEach((leaveDetail) => {
        remainingLeaves -= parseFloat(leaveDetail.NoofDaysLeave);
        if (remainingLeaves < 0) {
          const excessDays = Math.abs(remainingLeaves);
          for (let i = 0; i < excessDays; i++) {
            const lopDate = new Date(leaveDetail.FromDate);
            lopDate.setDate(lopDate.getDate() + i);
            lopDates.push(lopDate);
          }
          remainingLeaves = 0;
        }
      });

      setTakenLeaves(totalTakenLeaves);
      setAvailableLeaves(remainingLeaves);
      setLossofPay(lopDates.length);
      setLopDates(lopDates); // Update the LOP dates array
    }
  }, [
    LeaveDetails,
    setLossofPay,
    setTakenLeaves,
    setAvailableLeaves,
    totalLeaves,
    defaultLop,
  ]);
  lopDates.map((e) => {
    console.log(e.toLocaleString().substr(0, 10));
  });
};
export default LeaveCalculation;
