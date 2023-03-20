import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LeaveDetails from "../pages/LeaveDetail";
import LeaveForm from "../pages/LeaveForm";
import styles from "./LeaveManagement.module.scss";

import Sidebar from "./Sidebar";

export default class LeaveManagement extends React.Component<{}> {
  public render(): React.ReactElement {
    return (
      <section>
        <BrowserRouter>
          <div className={styles.sidebar}>
            <Sidebar />
          </div>
          <Routes>
            <Route path="/Apply Leave" element={<LeaveForm />} />
            <Route path="/Leave Details" element={<LeaveDetails />} />
          </Routes>
        </BrowserRouter>
      </section>
    );
  }
}
