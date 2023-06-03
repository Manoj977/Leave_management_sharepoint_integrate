import React, { useEffect, useState } from 'react';
import { MyContext } from '../../context/contextProvider';
import styles from './Lop.module.scss';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';

export const Lop: React.FC = () => {
  const [LopError, setLopError] = useState<string>('');
  const { LopCount, setDefaultLop, defaultLop } = React.useContext(MyContext);
  const [defaultLopLabel, setDefaultLopLabel] = useState<string>('');
  const [selectedLopValue, setSelectedLopValue] = useState<string>(defaultLop);

  const updateLopCount = async (count: number, Title: any) => {
    try {
      const web = Web('https://zlendoit.sharepoint.com/sites/production');
      const list: IList = web.lists.getByTitle('Leave Management Default Lop');
      const itemToUpdate = list.items.getById(1);
      await itemToUpdate.update({
        Default_x0020_Lop: count,
        Description: Title,
      });

      // Set the appropriate label based on the updated value
      let label = '';
      if (count === 1) {
        label = 'Monthly';
      } else if (count === 3) {
        label = 'Quarterly';
      } else if (count === 12) {
        label = 'Yearly';
      }

      setDefaultLop(count);
      setDefaultLopLabel(label);
      console.log('count: ', count);
      // Display success alert
      alert('Updated successfully!');
    } catch (error) {
      console.log(`Error updating leaveDetail status: ${error}`);
      // Display error alert
      alert('Error updating leaveDetail status');
    }
  };

  console.log(parseInt(defaultLop));

  const handleSubmit = async (selectedLop: any, e: any) => {
    console.log(e.target.value);
    console.log('selectedLop', selectedLop);
    setSelectedLopValue(selectedLop.count);
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

  let initialLabel = '';
  useEffect(() => {
    setDefaultLop(parseInt(defaultLop));
    // Set the initial label based on the defaultLop value
    if (parseInt(defaultLop) === 1) {
      initialLabel = 'Monthly';
    } else if (parseInt(defaultLop) === 3) {
      initialLabel = 'Quarterly';
    } else if (parseInt(defaultLop) === 12) {
      initialLabel = 'Yearly';
    }
    setDefaultLopLabel(initialLabel);
  }, [setDefaultLopLabel, defaultLopLabel]);
  useEffect(() => {
    setDefaultLop(defaultLop);
    // Set the initial label based on the defaultLop value
    if (parseInt(defaultLop) === 1) {
      initialLabel = 'Monthly';
    } else if (parseInt(defaultLop) === 3) {
      initialLabel = 'Quarterly';
    } else if (parseInt(defaultLop) === 12) {
      initialLabel = 'Yearly';
    }
    setDefaultLopLabel(initialLabel);
  }, []);

  return (
    <div style={{ marginTop: '1.25rem' }}>
      <div className={styles.Head}>
        <div style={{ width: '100%' }}>
          <p className={styles.defaultLop}>
            Default Lop Calculation:
            {defaultLopLabel && <span> {defaultLopLabel} </span>}
          </p>
        </div>
        <div style={{ display: 'flex' }}>
          <div className={styles.inputContainer}>
            <select
              id='leave-type'
              value={selectedLopValue}
              onChange={(event) => {
                setSelectedLopValue(event.target.value);
              }}
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
              <button
                onClick={(e: any) => {
                  LopCount.map((value: any, index: number) => {
                    return value.map(
                      (LopData: any, index: number) =>
                        LopData.count === selectedLopValue &&
                        handleSubmit(LopData, e)
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
