/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';

import styles from './PublicHolidays.module.scss';
import { RiLoader4Line } from 'react-icons/ri';
import { MyContext } from '../../context/contextProvider';

export const PublicHolidays = () => {
  const { holiday } = React.useContext(MyContext);
  return (
    <>
      {holiday && (
        <>
          <div className={styles.publicHolidaysTitle}>PublicHolidays</div>
          <div className={styles.publicHolidaysSection}>
            <div className={styles.publicHolidaysSection_one}>
              <table className={styles.publicHolidaysSection_one_Table}>
                <thead>
                  <tr>
                    <th className={styles.publicHolidaysSection_one_Table_th}>
                      S.No
                    </th>
                    <th
                      className={styles.publicHolidaysSection_one_Table_th_max}
                    >
                      Title
                    </th>
                    <th className={styles.publicHolidaysSection_one_Table_th}>
                      Date
                    </th>
                    <th className={styles.publicHolidaysSection_one_Table_th}>
                      Day
                    </th>
                  </tr>
                </thead>
                <tbody className={styles.publicHolidaysSection_one_Table_tbody}>
                  {holiday.length > 0 ? (
                    holiday.map((holiday, index) => (
                      <tr key={index}>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label='S.No'
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label='Title'
                        >
                          {holiday.HolidayName}
                        </td>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label='Date'
                        >
                          {new Date(holiday.Date).toLocaleDateString('en-GB')}
                        </td>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label='Day'
                        >
                          {holiday.Day}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <div className={styles.LoaderDivision}>
                          <RiLoader4Line className={styles.loader} />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};
