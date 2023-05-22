/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { MyContext } from '../../context/contextProvider';
import styles from './Lop.module.scss';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
export const Lop: React.FC = () => {
  const [LopError, setLopError] = useState<string>('');
  const { LopCount, setDefaultLop, defaultLop } = React.useContext(MyContext);
  const [lop, setLop] = useState<number>(defaultLop);
  const updateLopCount = async (count: number, Title: any) => {
    try {
      const web = Web('https://zlendoit.sharepoint.com/sites/production');
      const list: IList = web.lists.getByTitle('Leave Management Default Lop');
      const itemToUpdate = list.items.getById(1);
      await itemToUpdate.update({
        Default_x0020_Lop: count,
        Description: Title,
      });
      setDefaultLop(count);
      alert('Lop  status updated successfully!');
    } catch (error) {
      console.log(`Error updating leaveDetail status: ${error}`);
    }
  };
  // useEffect(() => {
  //   setDefaultLop(defaultLop);
  // }, [defaultLop, setDefaultLop]);
  console.log(defaultLop);
  const handleSubmit = async (selectedLop: any) => {
    console.log('selectedLop', selectedLop);
    setDefaultLop(selectedLop.count);
    await updateLopCount(parseInt(selectedLop.count), selectedLop.Title);
    // Validate the selected Lop
    if (!selectedLop) {
      setLopError('Field cannot be Empty');
      setTimeout(() => {
        setLopError('');
      }, 3500);
    } else {
      setLopError('');
    }
  };

  useEffect(() => {
    setDefaultLop(defaultLop);
  }, [setDefaultLop, defaultLop]);
  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className={styles.Head}>
        <div style={{ width: '100%' }}>
          <p className={styles.defaultLop}>
            Default Lop Selected: {lop}
          </p>
        </div>
        <div style={{ display: 'flex' }}>
          <div className={styles.inputContainer}>
            <select
              id='leave-type'
              value={lop}
              onChange={(event) => setLop(parseInt(event.target.value))}
              className={styles.ApplyLeave_form_input}
            >
              {LopCount.map((value: any, index: number) => {
                return value.map((LopData: any, index: number) => (
                  <option key={index} value={LopData.count}>
                    {LopData.Title}
                  </option>
                ));
              })}
            </select>
            {LopError && <p className={`${styles.error}`}>{LopError}</p>}
          </div>
          <div className={styles.button}>
            <div className='px-2' style={{ padding: '0rem 0.5rem' }}>
              {}
              <button
                onClick={(e) => {
                  LopCount.map((value: any, index: number) => {
                    return value.map(
                      (LopData: any, index: number) =>
                        LopData.count == lop && handleSubmit(LopData)
                    );
                  });
                }}
                className={`${styles.buttonSubmit}`}
                type='submit'
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
