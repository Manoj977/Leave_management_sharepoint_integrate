/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty-pattern */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import styles from "./App.module.scss";
import { MyContext, MyContextProvider } from "../../context/contextProvider";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Profile from "../Profile/Profile";
import { LeaveApproval } from "../LeaveApproval/LeaveApproval";
import { ApplyLeave } from "../Apply Leave/ApplyLeave";
import { LeaveDetails } from "../Leave Details/LeaveDetails";
import convert from "xml-js";
import { PublicHolidays } from "../Holidays/PublicHolidays";
// import Footer from "../Footer/Footer";
import { sp } from "@pnp/sp/presets/all";
// import LeaveCalculation from '../LeaveCalculation/LeaveCalculation';
type Admin = {
  ID: string;
  name: string;
  Role: string;
};
type employeeData = {
  v: string;
  name: string;
  email: string;
  leaveID: number;
  Role: string;
};
const App: React.FC = () => {
  const { activeMenu, sidebarActive } = React.useContext(MyContext);
  const [Admin, setAdmin] = useState<Admin[]>([]);
  const [employeeData, setEmployeeData] = useState<employeeData[]>([]);
  // const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState("");
  useEffect(() => {
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/lists/GetByTitle('Employee%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });

        const parsedData = JSON.parse(jsonData);
        const empData: employeeData[] = parsedData.feed.entry.map(
          (entry: any) => ({
            v: entry.content["m:properties"]["d:Employee_x0020_ID"]._text,
            name: entry.content["m:properties"]["d:Display_x0020_Name"]._text,
            email: entry.content["m:properties"]["d:Email"]._text,
            leaveID: entry.content["m:properties"]["d:Id"]._text,
          })
        );

        setEmployeeData(empData);
      })
      .catch((err) => console.log(err));
    fetch(
      "https://zlendoit.sharepoint.com/sites/ZlendoTools/_api/lists/GetByTitle('Leave%20Management%20Admin')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        const loggedUserDetail: Admin[] = entries.map((entry: any) => ({
          ID: entry.content["m:properties"]["d:Employee_x0020_ID"]._text,
          name: entry.content["m:properties"]["d:Employee_x0020_Name"]._text,
          Role: entry.content["m:properties"]["d:Role"]._text,
        }));
        setAdmin(loggedUserDetail);
      })
      .catch((err) => console.log(err));
  }, []);

  let EmployeeRole = "";
  void sp.web.currentUser.get().then((user) => {
    setUserName(user.Title);
  });
  console.log(Admin);
  Admin.forEach((admin) => {
    employeeData.find((e) => {
      console.log(e.v, admin.ID, admin.name, userName);
      if (e.v === admin.ID && admin.name === userName)
        EmployeeRole = admin.Role;
    });
    console.log(EmployeeRole);
    // if (LoggedUserData.v === admin.ID) {
    //   LoggedUserData.Role = admin.Role;
    //   Role = LoggedUserData.Role;
    // } else {
    //   Role = 'User';
    // }
  });

  return (
    <MyContextProvider>
      <HashRouter basename="/">
        <div className={styles.mainSection}>
          <div className={styles.sideBar}>
            <Sidebar loggedUserRole={EmployeeRole} />
          </div>
          <div
            className={`${styles.section} ${
              activeMenu
                ? styles.navbar_section
                : sidebarActive
                ? styles.navbar_section_1
                : ""
            }`}
          >
            <div className={styles.navbar}>
              <Navbar />
              {/* <LeaveCalculation /> */}
            </div>
            <div className={styles.components}>
              <Routes>
                <Route path="/" element={<Profile />} />
                <Route path="/Profile" element={<Profile />} />
                {EmployeeRole === "Admin" && (
                  <Route path="/Leave Approval" element={<LeaveApproval />} />
                )}
                <Route path="/Apply Leave" element={<ApplyLeave />} />
                <Route path="/Leave Details" element={<LeaveDetails />} />
                <Route path="/Public Holidays" element={<PublicHolidays />} />
              </Routes>
            </div>
          </div>
        </div>
      </HashRouter>
    </MyContextProvider>
  );
};

export default App;
