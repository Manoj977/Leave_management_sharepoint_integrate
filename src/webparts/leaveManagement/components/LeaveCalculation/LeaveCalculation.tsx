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
  const {
    setLossofPay,
    setTakenLeaves,
    totalLeaves,
    takenLeaves,
    setAvailableLeaves,
  } = React.useContext(MyContext);

  useEffect(() => {
    let userEmail = '';
    sp.web.currentUser.get().then((user) => {
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
            FromDate: new Date(
              entry.content['m:properties']['d:FormDate']._text
            ),
            ToDate: new Date(entry.content['m:properties']['d:ToDate']._text),
            Status: entry.content['m:properties']['d:Status']._text,
            NoofDaysLeave: parseFloat(
              entry.content['m:properties']['d:count']._text
            ),
          }));
          setLeaveDetails(leaveDetail);
        })
        .catch((err) => console.log(err));
    });
  }, []);

  useEffect(() => {
    let totalTakenLeaves = 0;
    let lossOfPay = 0;
    const quarterLeaveCounts = [0, 0, 0, 0];
    const ApprovedLeaveDetails = LeaveDetails.filter((leaveDetail) => {
      return leaveDetail.Status === 'Approved';
    });

    ApprovedLeaveDetails.forEach((leaveDetail) => {
      const leaveDate = new Date(leaveDetail.FromDate);
      const quarterIndex = Math.floor(leaveDate.getMonth() / 3);
      quarterLeaveCounts[quarterIndex] += parseFloat(leaveDetail.NoofDaysLeave);
      totalTakenLeaves += parseFloat(leaveDetail.NoofDaysLeave);
    });

    for (let i = 0; i < 4; i++) {
      if (quarterLeaveCounts[i] > 3) {
        const excessLeaveCount = quarterLeaveCounts[i] - 3;
        quarterLeaveCounts[i] = 3;
        lossOfPay += (excessLeaveCount * totalLeaves) / 12;
      }
    }

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

    // lossOfPay = (takenLeaves - totalLeaves) * (totalLeaves / 12);
    setLossofPay(lossOfPay);
  }, [
    LeaveDetails,
    setLossofPay,
    setTakenLeaves,
    setAvailableLeaves,
    takenLeaves,
    totalLeaves,
  ]);
};

export default LeaveCalculation;
