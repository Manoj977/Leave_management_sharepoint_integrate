/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { MyContext, MyContextProvider } from '../../context/contextProvider';
import Navbar from '../Navbar/Navbar';
import Sidebar from '../Sidebar/Sidebar';
import Profile from '../Profile/Profile';
import { LeaveApproval } from '../LeaveApproval/LeaveApproval';
import { ApplyLeave } from '../Apply Leave/ApplyLeave';
import { LeaveDetails } from '../Leave Details/LeaveDetails';

import { PublicHolidays } from '../Holidays/PublicHolidays';
// import LeaveCalculation from '../LeaveCalculation/LeaveCalculation';

const App: React.FC = () => {
  const { activeMenu, sidebarActive } = React.useContext(MyContext);
  return (
    <MyContextProvider>
      <HashRouter basename="/">
        <div className={styles.mainSection}>
          <div className={styles.sideBar}>
            <Sidebar />
          </div>
          <div
            className={`${styles.section} ${
              activeMenu
                ? styles.navbar_section
                : sidebarActive
                ? styles.navbar_section_1
                : ''
            }`}
          >
            <div className={styles.navbar}>
              <Navbar />
              {/* <LeaveCalculation /> */}
            </div>
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Leave Approval" element={<LeaveApproval />} />
              <Route path="/Apply Leave" element={<ApplyLeave />} />
              <Route path="/Leave Details" element={<LeaveDetails />} />
              <Route path="/Public Holidays" element={<PublicHolidays />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </MyContextProvider>
  );
};

export default App;
