/* eslint-disable no-self-compare */
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
import { MyContext } from '../leaveManagement/context/contextProvider';

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
let Email = '';
const LeaveCalculationFunc = () => {
  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [lopDates, setLopDates] = useState<Date[]>([]); // Array to store LOP dates
  let {
    setLossofPay,
    setTakenLeaves,
    totalLeaves,
    setAvailableLeaves,
    defaultLop,
    lopEmail,
    lopData,
    setLopData,
    setLopEmail,
    lopCalc,
    eachData,
    setEachData,
  } = React.useContext(MyContext);
  defaultLop = parseInt(defaultLop);
  let Emails = '';

  let i = 0;
  if (lopEmail.length > 0) {
    ++i;
  }
  const test = Array.from(
    new Set(lopEmail.map((item) => JSON.stringify(item)))
  ).map((item) => JSON.parse(item));
  // const test = ['aiswarya.s@zlendo.com'];
  // console.log(test);

  useEffect(() => {
    if (i !== 0) {
      // Add this condition
      for (let e of test) {
        const url = `https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leave%20Management')/items?$filter=Email%20eq%20%27${e}%27`;

        fetch(url)
          .then((res) => res.text())
          .then((data) => {
            const jsonData = convert.xml2json(data, {
              compact: true,
              spaces: 4,
            });
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

            const filteredLeaveDetail = leaveDetail.filter((item) => {
              return item !== null && item.Status === 'Approved';
            });
            setLeaveDetails(filteredLeaveDetail);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [i]);

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
            Emails = leaveDetail.Email;
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
      console.log(Emails, lossOfPay);

      lopCalc.push({
        Email: Emails,
        lop: lossOfPay,
      });
    }
    // if (defaultLop === 1) {
    //   let totalTakenLeaves = LeaveDetails.reduce((total, leaveDetail) => {
    //     return total + parseFloat(leaveDetail.NoofDaysLeave);
    //   }, 0);
    //   console.log('totalTakenLeaves', totalTakenLeaves);

    //   const lopDates: Date[] = [];

    //   const approvedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
    //     return leaveDetail.Status === 'Approved';
    //   });
    //   console.log('approvedLeaveDetails: ', approvedLeaveDetails);

    //   let remainingLeaves = totalLeaves;

    //   approvedLeaveDetails.forEach((leaveDetail) => {
    //     const leaveDays = Math.min(1, remainingLeaves); // Consider only one leave day per month
    //     const lopDays = parseInt(leaveDetail.NoofDaysLeave) - leaveDays;
    //     console.log('Lop Days: ', lopDays);

    //     if (lopDays > 0) {
    //       remainingLeaves -= leaveDays;

    //       for (let i = 0; i < lopDays; i++) {
    //         const lopDate = new Date(leaveDetail.FromDate);
    //         console.log(lopDate.getDate());
    //         console.log(lopDate.getDate() + leaveDays);
    //         lopDate.setDate(lopDate.getDate() + leaveDays);
    //         lopDates.push(lopDate);
    //       }
    //     } else {
    //       remainingLeaves -= parseInt(leaveDetail.NoofDaysLeave);
    //     }
    //   });

    //   setTakenLeaves(totalTakenLeaves);
    //   setAvailableLeaves(remainingLeaves);
    //   setLossofPay(lopDates.length);
    //   setLopDates(lopDates); // Update the LOP dates array
    // }

    if (defaultLop === 1) {
      let data: any[] = [];
      let leaveDetails = LeaveDetails.map((e) => {
        if (e.Status === 'Approved')
          if (e !== undefined) {
            return e;
          }
      });
      leaveDetails.map((e) => {
        if (
          e !== undefined &&
          parseFloat(e.NoofDaysLeave) !== 1 &&
          e.FromDate.getDay() !== 0 &&
          e.FromDate.getDay() !== 6 &&
          e.ToDate.getDay() !== 0 &&
          e.FromDate.getDay() !== 6
        ) {
          data.push(e);
        }
      });

      const leaveDetailss = Array.from(
        new Set(data.map((item) => JSON.stringify(item)))
      ).map((item) => JSON.parse(item));
      let TotalLopofYear = 0;
      let TotalLeaveTaken = 0;
      data.map((e) => {
        console.log(e.Email, e.NoofDaysLeave);

        TotalLeaveTaken += e.NoofDaysLeave;
      });
      console.log(TotalLeaveTaken);

      // Create a map to store leave details by month
      const leaveDetailsByMonth = new Map();

      leaveDetailss.forEach((e) => {
        let fromDate = new Date(e.FromDate);
        let toDate = new Date(e.ToDate);
        const startDate = new Date(
          fromDate.getFullYear(),
          fromDate.getMonth(),
          fromDate.getDate()
        );
        const endDate = new Date(
          toDate.getFullYear(),
          toDate.getMonth(),
          toDate.getDate()
        );
        console.log('data: ', data);
        data.map((e) => {
          if (
            e.NoofDaysLeave !== 1 &&
            e.FromDate.getDay() !== 0 &&
            e.FromDate.getDay() !== 6 &&
            e.ToDate.getDay() !== 0 &&
            e.FromDate.getDay() !== 6
          ) {
            console.log(e);
          }
        });
        data.map((e) => {
          Email = e.Email;
        });
        let currentDate = startDate;
        const datesInRange = [];
        let TotalLeaveTaken = 0;
        while (currentDate <= endDate) {
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            const formattedDate = currentDate.toISOString().split('T')[0];
            datesInRange.push(formattedDate);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        // console.log('TotalTakenLeave: ', TotalLeaveTaken);
        const leaveMonth = fromDate.toLocaleString('default', {
          month: 'long',
          year: 'numeric',
        });

        // Accumulate Leave Days for the same month
        if (leaveDetailsByMonth.has(leaveMonth)) {
          leaveDetailsByMonth.set(
            leaveMonth,
            leaveDetailsByMonth.get(leaveMonth) + e.NoofDaysLeave
          );
        } else {
          leaveDetailsByMonth.set(leaveMonth, e.NoofDaysLeave);
        }

        if (datesInRange.length !== 0) {
          if (e.NoofDaysLeave >= defaultLop) {
            console.log('defaultLop: ', defaultLop, e.NoofDaysLeave);

            // console.log('From Date:', fromDate.toISOString().split('T')[0]);
            // console.log('To Date:');
            // console.log('Leave Days:', e.NoofDaysLeave);
            // console.log(
            //   'Dates in Between (excluding Sat and Sun):',
            //   datesInRange
            // );
            // console.log('Leave Month:', leaveMonth);
            // console.log('--------------------');
            const adjustedFromDate = new Date(
              fromDate.getFullYear(),
              fromDate.getMonth(),
              fromDate.getDate() + 1
            );
            if (toDate >= new Date(adjustedFromDate.toISOString())) {
              console.log(new Date(adjustedFromDate.toISOString()), toDate);
              e.FromDate = new Date(adjustedFromDate.toISOString());
            } else if (e.FromDate === e.ToDate) {
              e.FromDate = toDate;
            }
            e.ToDate = toDate;
            // e.FromDate = adjustedFromDate.toISOString();
            const startDate = new Date(e.FromDate);
            const endDate = new Date(e.ToDate);
            const millisecondsPerDay = 24 * 60 * 60 * 1000; // Number of milliseconds in a day
            let leaveDays = 0;

            while (startDate <= endDate) {
              const dayOfWeek = startDate.getDay(); // 0 (Sunday) to 6 (Saturday)

              if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                leaveDays++;
              }

              startDate.setTime(startDate.getTime() + millisecondsPerDay); // Move to the next day
            }

            e.NoofDaysLeave = leaveDays;
          }
        }
      });

      let eachData = leaveDetailss.map((e) => {
        return {
          ...e,
        };
      });

      interface LeaveCount {
        ID: string;
        Month: number;
        LeaveCount: number;
        LeaveEntries?: LeaveDetail[];
      }

      const leaveCounts: { [key: string]: LeaveCount } = {};

      leaveDetailss.forEach((leave) => {
        const { ID, FromDate, ToDate, NoofDaysLeave } = leave;
        const fromMonth = new Date(FromDate).getMonth();
        const toMonth = new Date(ToDate).getMonth();

        for (let month = fromMonth; month <= toMonth; month++) {
          const key = `${ID}-${month}`;

          if (!leaveCounts[key]) {
            leaveCounts[key] = {
              ID,
              Month: month,
              LeaveCount: NoofDaysLeave,
              LeaveEntries: [leave],
            };
          } else {
            leaveCounts[key].LeaveCount += NoofDaysLeave;
            if (leaveCounts[key].LeaveCount > 1) {
              leaveCounts[key].LeaveEntries?.push(leave);
              eachData.map((e, index) => {
                if (
                  parseInt(leaveCounts[key].LeaveEntries[0].NoofDaysLeave) ===
                  defaultLop
                ) {
                  if (
                    e.FromDate === leaveCounts[key].LeaveEntries[0].FromDate
                  ) {
                    console.log(e.FromDate);
                    eachData.splice(index, 1);
                  }
                }
              });
            }
          }
        }
      });

      const monthlyLeaveCounts = Object.values(leaveCounts);

      console.log('monthlyLeaveCounts: ', monthlyLeaveCounts);

      let tester: any[] = [];
      monthlyLeaveCounts.map((e) => {
        if (e.LeaveCount > 1) {
          console.log('tester: ', e);
          tester.push(e);
        }
      });
      console.log(tester);

      const test = tester.map((e) => {
        return {
          ...e,
          TotalLopofYear,
        };
      });

      test.map((e) => {
        // console.log('test', e);
        eachData.push(e);
        TotalLopofYear += e.LeaveCount;
      });

      // Print the accumulated Leave Days by month
      // leaveDetailsByMonth.forEach((leaveDays, leaveMonth) => {
      //   console.log('Leave Month:', leaveMonth);
      //   console.log('Leave Days:', leaveDays);
      //   console.log('--------------------');
      // });

      // let totalTakenLeaves = LeaveDetails.reduce((total, leaveDetail) => {
      //   console.log(total, parseFloat(leaveDetail.NoofDaysLeave));

      //   return total + parseFloat(leaveDetail.NoofDaysLeave);
      // }, 0);
      // console.log('totalTakenLeaves', totalTakenLeaves);

      // const lopDates: Date[] = [];

      // const approvedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
      //   return leaveDetail.Status === 'Approved';
      // });
      // console.log('approvedLeaveDetails: ', approvedLeaveDetails);

      // let remainingLeaves = totalLeaves;
      // console.log('remainingLeaves', remainingLeaves);

      // approvedLeaveDetails.forEach((leaveDetail) => {
      //   const leaveDays = Math.min(1, remainingLeaves); // Consider only one leave day per month
      //   console.log(leaveDetail.FromDate, 'From Date');
      //   console.log(leaveDetail.ToDate, 'To Date');
      //   console.log(leaveDetail.NoofDaysLeave, 'NoofDaysLeave');

      //   const lopDays = parseInt(leaveDetail.NoofDaysLeave) - leaveDays;
      //   console.log('Lop Days: ', lopDays);

      //   if (lopDays > 0) {
      //     remainingLeaves -= leaveDays;

      //     for (let i = 0; i < lopDays; i++) {
      //       const lopDate = new Date(leaveDetail.FromDate);
      //       console.log(lopDate.getDate());
      //       console.log(lopDate.getDate() + leaveDays);
      //       lopDate.setDate(lopDate.getDate() + leaveDays);
      //       lopDates.push(lopDate);
      //     }
      //   } else {
      //     remainingLeaves -= parseInt(leaveDetail.NoofDaysLeave);
      //   }
      // });
      console.log(totalLeaves);
      console.log('TotalLeaveTaken: ', TotalLeaveTaken);
      console.log(
        'TotalLeaveTaken - TotalLopofYear: ',
        TotalLeaveTaken,
        TotalLopofYear
      );
      console.log('TotalLopofYear: ', TotalLopofYear, Email);

      setTakenLeaves(TotalLeaveTaken);
      setAvailableLeaves(totalLeaves - (TotalLeaveTaken - TotalLopofYear));
      setLossofPay(TotalLopofYear);
      setLopDates(lopDates); // Update the LOP dates array
      let datas = [];

      lopCalc.push({
        Email: Email,
        lop: TotalLopofYear,
      });
    }

    if (defaultLop === 12) {
      let totalTakenLeaves = LeaveDetails.reduce((total, leaveDetail) => {
        return total + parseFloat(leaveDetail.NoofDaysLeave);
      }, 0);

      const lopDates: Date[] = [];

      const ApprovedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
        return leaveDetail.Status === 'Approved';
      });
      console.log(LeaveDetails);
      let lossofPay = 0;
      let remainingLeaves = totalLeaves;
      let count = 0;
      ApprovedLeaveDetails.forEach((leaveDetail) => {
        Emails = leaveDetail.Email;
        // console.log(leaveDetail.NoofDaysLeave);
        count += parseFloat(leaveDetail.NoofDaysLeave);
        // console.log(count);

        remainingLeaves -= parseFloat(leaveDetail.NoofDaysLeave);

        if (remainingLeaves < 0) {
          console.log(remainingLeaves);
          const excessDays = Math.abs(remainingLeaves);
          console.log(excessDays);
          lossofPay = excessDays;
          // for (let i = 0; i < excessDays; i++) {
          //   const lopDate = new Date(leaveDetail.FromDate);
          //   lopDate.setDate(lopDate.getDate() + i);
          //   lopDates.push(lopDate);
          // }
          // remainingLeaves = 0;
        } else {
          lossofPay = 0;
        }
      });

      setTakenLeaves(totalTakenLeaves);
      setAvailableLeaves(remainingLeaves);
      setLossofPay(lossofPay);
      setLopDates(lopDates); // Update the LOP dates array

      lopCalc.push({
        Email: Emails,
        lop: lossofPay,
      });
    }
  }, [
    LeaveDetails,
    setLossofPay,
    setTakenLeaves,
    setAvailableLeaves,
    totalLeaves,
    defaultLop,
  ]);
  // lopDates.map((e) => {
  //   console.log(e.toLocaleString().substr(0, 10));
  // });
};
export default LeaveCalculationFunc;
