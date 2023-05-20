/* eslint-disable no-unused-expressions */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-self-compare */
import React, { useEffect, useState } from 'react';
import convert from 'xml-js';

import { MyContext } from '../leaveManagement/context/contextProvider';
type LeaveDetail = {
  leaveID: number;
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  LopFromDate: any;
  FromDate: any;
  ToDate: any;
  LopToDate: any;
  LeaveType: string;
  Reason: string;
  Days: string;
  Status: string;
  Remark: string;
  [key: string]: any;
};
const Caluclation = () => {
  const [approve, setApprove] = useState<string>('Pending');

  const { lopDate } = React.useContext(MyContext);
  const lopDates: any[] = [];
  const daysList: any[] = [];
  let uniqueArray: any[] = [];
  let uniqueValues: any[] = [];
  let ToDate: any[] = [];
  let FromDate: any[] = [];
  const LopFromDate: any[] = [];
  const LopToDate: any[] = [];
  let uniqueArrays: any[] = [];
  let LopsFromDate: any[] = [];
  let LopsToDate: any[] = [];
  let FromDates: any[] = [];
  let ToDates: any[] = [];
  const uniqueLopFromDate: number[] = [];
  const uniqueLopToDate: number[] = [];
  const [lopFalls, setLopFalls] = useState<boolean>(false);
  const [LeaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  const [, setIsLoading] = useState(false);

  let CurrentData: LeaveDetail[];
  const func = () => {
    setIsLoading(true);
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('Leave%20Management')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];

        const leaveDetail: LeaveDetail[] = entries
          .map((entry: any) => {
            try {
              return {
                ID: entry.content['m:properties']['d:Title']._text,
                Name: entry.content['m:properties']['d:Name']._text,
                Email: entry.content['m:properties']['d:Email']._text,
                Leave: entry.content['m:properties']['d:LeaveType']._text,
                LeaveType: entry.content['m:properties']['d:Leave']._text,
                count: entry.content['m:properties']['d:count']._text,
                LopFromDate: entry.content['m:properties']['d:FormDate']._text,
                FromDate: new Date(
                  entry.content['m:properties']['d:FormDate']._text
                ).toLocaleDateString('en-GB'),
                LopToDate: entry.content['m:properties']['d:ToDate']._text,
                ToDate: new Date(
                  entry.content['m:properties']['d:ToDate']._text
                ).toLocaleDateString('en-GB'),
                Reason: entry.content['m:properties']['d:Reason']._text,
                Status: entry.content['m:properties']['d:Status']._text,
                Remark: entry.content['m:properties']['d:Remark']._text,
                Days: entry.content['m:properties']['d:count']._text,
                leaveID: entry.content['m:properties']['d:Id']._text,
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
          })
          .filter(Boolean);

        setLeaveDetails(leaveDetail);
        setIsLoading(false);
      })
      .catch((err) => {
        if (
          !(
            err instanceof TypeError &&
            err.message.includes('Cannot read properties of undefined')
          )
        ) {
          console.log(err);
        }
      });
  };
  lopDate.map((lop: any) => {
    uniqueArray = lop.filter((value: any, index: any, array: any) => {
      return array.indexOf(value) === index;
    });
    uniqueArrays = lop.filter((value: any, index: any, array: any) => {
      return array.indexOf(value) === index;
    });
    const element = uniqueArray[1];
    const element1 = uniqueArrays[1];
    uniqueArray.splice(1, 1);
    uniqueArray.splice(0, 0, element);
    uniqueArrays.splice(1, 1);
    uniqueArrays.splice(0, 0, element1);
    LeaveDetails.map(
      (e: {
        ID: any;
        LopFromDate: string | number | Date;
        LopToDate: string | number | Date;
      }) => {
        if (e.ID === uniqueArray[0]) {
          const fromDate = new Date(e.LopFromDate);
          const toDate = new Date(e.LopToDate);
          const millisecondsPerDay = 1000 * 60 * 60 * 24; // Number of milliseconds in a day
          const daysBetween = Math.round(
            (toDate.getTime() - fromDate.getTime()) / millisecondsPerDay
          );

          // Reset the daysList array
          daysList.length = 0;

          for (let i = 0; i <= daysBetween; i++) {
            const currentDate = new Date(
              fromDate.getTime() + i * millisecondsPerDay
            );
            const dayOfWeek = currentDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
              // Ignore Saturdays and Sundays
              daysList.push(currentDate.toLocaleDateString('en-GB'));
            }
          }

          uniqueArray.map((unique: any) => {
            if (unique === fromDate.toLocaleDateString('en-GB')) {
              lopDates.push(unique);
            }
            if (unique === toDate.toLocaleDateString('en-GB')) {
              lopDates.push(unique);
            }
          });
        }
      }
    );

    const myArray = lopDates.concat(daysList);
    uniqueValues = Array.from(new Set(myArray));
  });

  LeaveDetails.map((e) => {
    const ID = e.ID;
    if (e.ID === uniqueArray[0]) {
      uniqueValues.some((uv) => {
        if ((uv === e.FromDate || uv === e.ToDate) && e.ID === uniqueArray[0]) {
          if (e.FromDate === uv) {
            e.FromDate === uv && FromDate.push(e.FromDate);
          }
          if (e.ToDate === uv) {
            e.ToDate === uv && ToDate.push(e.ToDate);
          }

          // lopFalls = true;
        }
        // else {
        //   lopFalls = false;
        // }
      });
    }

    function removeFromDateDuplicates(arr: any) {
      return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
    }
    function removeToDateDuplicates(arr: any) {
      return arr.filter((item: any, index: any) => arr.indexOf(item) === index);
    }

    FromDate.length > 0 && (FromDate = removeFromDateDuplicates(FromDate));
    ToDate.length > 0 && (ToDate = removeToDateDuplicates(ToDate));
    CurrentData.map((leave, index) => {
      FromDate.map((fromDate) => {
        ToDate.map((toDate) => {
          // if (fromDate === leave.FromDate && ID === uniqueArray[0]) {
          //   lopFalls = true;
          // }

          // if (toDate === leave.ToDate && ID === uniqueArray[0]) {
          //   lopFalls = true;
          // }

          if (toDate && fromDate && ID === uniqueArray[0]) {
            if (
              leave.FromDate &&
              leave.Status !== 'Rejected' &&
              leave.Status !== 'Cancelled' &&
              leave.ToDate
            ) {
              if (leave.FromDate === fromDate) {
                LopFromDate.push(fromDate);
              }
              if (leave.ToDate === toDate) {
                LopToDate.push(toDate);
              }

              LopFromDate.filter((e) => {
                return e !== LopFromDate;
              });
              LopToDate.filter((e) => {
                return e !== LopToDate;
              });
              CurrentData.map((leave, index) => {
                FromDate.map((fromDate) => {
                  ToDate.map((toDate) => {
                    if (toDate && fromDate && ID === uniqueArray[0]) {
                      if (
                        leave.FromDate &&
                        leave.Status !== 'Rejected' &&
                        leave.Status !== 'Cancelled' &&
                        leave.ToDate
                      ) {
                        if (leave.FromDate === fromDate) {
                          LopFromDate.push(fromDate.toString());
                        }
                        if (leave.ToDate === toDate) {
                          LopToDate.push(toDate.toString());
                        }

                        LopFromDate.filter((e) => {
                          return e !== LopFromDate;
                        });
                        LopToDate.filter((e) => {
                          return e !== LopToDate;
                        });

                        LopFromDate.filter(
                          (element) =>
                            !element.includes(leave.FromDate.toString())
                        );
                        LopToDate.filter(
                          (element) =>
                            !element.includes(leave.ToDate.toString())
                        );

                        CurrentData.map((e: any) => {
                          LopFromDate.map((FromDate) => {
                            LopToDate.map((ToDate) => {
                              if (FromDate === e.FromDate) {
                                LopsFromDate.push(fromDate);
                              } else if (FromDate !== e.FromDate) {
                                FromDates.push(e.FromDate);
                              }
                              if (ToDate === e.ToDate) {
                                LopsToDate.push(toDate);
                              } else if (ToDate !== e.ToDate) {
                                ToDates.push(e.ToDate);
                              }
                            });
                          });
                        });
                      }
                    }
                  });
                });
              });
            }
          }
        });
      });
    });
  });
  LopsFromDate = Array.from(new Set(LopsFromDate));
  LopsToDate = Array.from(new Set(LopsToDate));
  FromDates = Array.from(new Set(FromDates));
  ToDates = Array.from(new Set(ToDates));
  CurrentData.map((CurrentDatas) => {
    if (CurrentDatas.ID === uniqueArray[0]) {
      FromDates.map((fromdate) => {
        ToDates.map((todate) => {
          LopsFromDate.map((LopsFromDate) => {
            LopsToDate.map((LopsToDate) => {
              uniqueArrays.map((uniqueArray) => {
                if (uniqueArray === CurrentDatas.FromDate) {
                  console.log('From Date: ', CurrentDatas.FromDate);
                  uniqueArrays.map((uniqueArrays) => {
                    CurrentData.filter((data) => {
                      if (data.FromDate === LopsFromDate) {
                        data.FromDate = '';
                        setLopFalls(true);
                        console.log(LopsFromDate);
                        uniqueLopFromDate.push(LopsFromDate);
                      } else {
                        setLopFalls(false);
                      }
                    });
                  });
                }

                console.log(lopFalls);

                if (uniqueArray === CurrentDatas.ToDate) {
                  uniqueArrays.map((uniqueArrays) => {
                    if (uniqueArrays === LopsToDate) {
                      CurrentData.filter((data) => {
                        if (data.ToDate === LopsToDate) {
                          data.ToDate = '';
                          setLopFalls(true);
                          console.log(LopsToDate);
                          uniqueLopToDate.push(LopsToDate);
                        } else {
                          setLopFalls(false);
                        }
                      });
                    }
                  });
                }
              });
            });
          });
        });
      });
    }
  });
  console.log(uniqueLopFromDate);
  console.log(uniqueLopToDate);
  useEffect(() => {
    func();
  }, [setApprove, approve]);

  return <div>Caluclation</div>;
};

export default Caluclation;
