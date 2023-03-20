/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styles from './App.module.scss';
import { MyContext, MyContextProvider } from '../../context/contextProvider';
import Navbar from '../Navbar/Navbar';
import { debounce } from '@syncfusion/ej2-base';
import Sidebar from '../Sidebar/Sidebar';
import Profile from '../Profile/Profile';
import { LeaveApproval } from '../LeaveApproval/LeaveApproval';
import { ApplyLeave } from "../Apply Leave/ApplyLeave";
import { LeaveDetails } from "../Leave Details/LeaveDetails";

const App: React.FC = () => {
  const { activeMenu, setScreenSize, setActiveMenu, screenSize } =
    React.useContext(MyContext);

  const [, setModifiedScreenSize] = useState(screenSize);

  // Listen to screen size changes and update screenSize state
  useEffect(() => {
    const handleResize = () => {
      debounce(() => {
        const newScreenSize = window.innerWidth;
        setScreenSize(newScreenSize);
        setModifiedScreenSize(newScreenSize);
      }, 500)();
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  // Update activeMenu state when screenSize changes
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  // Log updated screenSize when it changes
  console.log('screenSize', screenSize);
  useEffect(() => {
    console.log('screenSize', screenSize);
  }, [screenSize]);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   navigate('/Profile', { replace: true }); // Navigate to /Profile when the app first loads
  // }, []);
  return (
    <MyContextProvider>
      <BrowserRouter>
        <div className={styles.mainSection}>
          <div className={styles.sideBar}>
            <Sidebar />
          </div>
          <div
            className={`${styles.section} ${
              activeMenu ? styles.navbar_section : styles.navbar_section_1
            }`}
          >
            <div className={styles.navbar}>
              <Navbar />
            </div>
            {/* <div>{navigate}</div> */}
            <Routes>
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Leave Approval" element={<LeaveApproval />} />
              <Route path="/Apply Leave" element={<ApplyLeave />} />
              <Route path="/Leave Details" element={<LeaveDetails />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </MyContextProvider>
  );
};

export default App;
