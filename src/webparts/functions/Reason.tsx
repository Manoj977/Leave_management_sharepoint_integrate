/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-self-compare */
import React, { useState } from 'react';
import styles from '../leaveManagement/components/Leave Details/LeaveDetails.module.scss';

const Reason = (Reason: any, leaveID: any) => {
  const [isReasonClicked, setIsReasonClicked] = useState(false);
  const MAX_LENGTH = 20;
  return (
    <div className={styles.leaveApprovalButtonDiv}>
      {Reason.length > MAX_LENGTH ? (
        <>
          {!isReasonClicked ? (
            <div
              className={styles.scrollable}
              style={{
                textAlign: 'right',
                width: '200px',
              }}
            >
              <span>{`${Reason.slice(0, MAX_LENGTH)}...`}</span>
              <a
                onClick={() => {
                  if (leaveID === leaveID) {
                    console.log(leaveID);
                    () => {
                      setIsReasonClicked(!isReasonClicked);
                    };
                  } else {
                    console.log('Remaining leave id: ', leaveID);
                  }
                }}
              >
                click here
              </a>
            </div>
          ) : (
            <div className={styles.scrollable} style={{ width: '400px' }}>
              <span id={`reason-${leaveID}`}>{Reason}</span>
              <a
                onClick={() => {
                  if (leaveID === leaveID) {
                    console.log(leaveID);
                    () => {
                      setIsReasonClicked(!isReasonClicked);
                    };
                  } else {
                    console.log('Remaining leave id: ', leaveID);
                  }
                }}
              >
                Show less
              </a>
            </div>
          )}
        </>
      ) : (
        <div>{Reason}</div>
      )}
    </div>
  );
};

export default Reason;
