/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { MdOutlineCancel } from 'react-icons/md';

import styles from './TotalLeave.module.scss';

interface TotalPageProps {
  setLeaveData: any;
}

const TotalLeave: React.FC<TotalPageProps> = ({ setLeaveData }) => {
  return (
    <div>
      <div className={styles.totalLeave}>
        <div className={styles.totalLeaveDiv1}>
          <div className={styles.totalLeaveDiv2}>
            <header className={styles.totalLeaveHeader}>
              <div className={styles.totalLeaveHeaderDiv}>Total leave</div>
            </header>

            <button
              type='button'
              onClick={() => setLeaveData(false)}
              style={{
                color: 'rgb(153,171,180)',
                borderRadius: '50%',
                border: 'none',
              }}
              className={styles.totalLeaveCloseButton}
            >
              <MdOutlineCancel />
            </button>
          </div>

          <div className={styles.totalLeaveTableContainer}>
            <table className={styles.Table}>
              <thead>
                <tr>
                  <th className={styles.TableHeaderHeading}>
                    <div className={styles.TableHeaderHeadingDiv}>
                      Leave Type
                    </div>
                  </th>
                  <th className={styles.TableHeaderHeading}>
                    <div className={styles.TableHeaderHeadingDiv}>Count</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    Annual Leave
                  </th>

                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>4</div>
                  </td>
                </tr>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    Casual Leave
                  </th>
                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>2</div>
                  </td>
                </tr>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    compensatory Leave
                  </th>
                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>0</div>
                  </td>
                </tr>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    Sick Leave
                  </th>
                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>4</div>
                  </td>
                </tr>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    Nopay Leave
                  </th>
                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>2</div>
                  </td>
                </tr>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    Others
                  </th>
                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>0</div>
                  </td>
                </tr>
                <tr>
                  <th scope='col' className={styles.TableBodyHead}>
                    Total
                  </th>
                  <td className={styles.TableBodyDescription}>
                    <div className={styles.TableHeaderHeadingDiv}>12</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalLeave;
