/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useEffect } from 'react';
import convert from 'xml-js';
import styles from './PublicHolidays.module.scss';
import { RiLoader4Line } from 'react-icons/ri';

type Holiday = {
  'S.No': number;
  HolidayName: string;
  Date: string;
  Day: string;
};

export const PublicHolidays = () => {
  const [holidaysData, setHolidaysData] = useState<Holiday[]>([]);

  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/web/lists/getbytitle('HolidayList')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const holidays: Holiday[] = parsedData.feed.entry.map((entry: any) => ({
          HolidayName: entry.content['m:properties']['d:Title']._text,
          Date: new Date(
            entry.content['m:properties']['d:HolidayDate']._text
          ).toLocaleDateString(),
          Day: entry.content['m:properties']['d:Day']._text,
        }));
        setHolidaysData(holidays);
      })
      .catch((err) => console.log(err));
  }, []);
  //Get Current Page

  return (
    <>
      {holidaysData && (
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
                  {holidaysData.length > 0 ? (
                    holidaysData.map((holiday, index) => (
                      <tr key={index}>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label="S.No"
                        >
                          {index + 1}
                        </td>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label="Title"
                        >
                          {holiday.HolidayName}
                        </td>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label="Date"
                        >
                          {holiday.Date}
                        </td>
                        <td
                          className={`${styles.publicHolidaysSection_one_Table_tbody_td}`}
                          data-label="Day"
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
