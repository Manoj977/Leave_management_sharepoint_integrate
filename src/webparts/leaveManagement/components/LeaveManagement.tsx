import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LeaveForm from "./LeaveForm";
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
          </Routes>
        </BrowserRouter>
      </section>
    );
  }
}
