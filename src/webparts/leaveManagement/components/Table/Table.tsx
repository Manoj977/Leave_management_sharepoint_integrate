import React from 'react';

interface Employee {
  ID: string;
  Name: string;
  Status: string;
}

interface Props {
  data: Employee[];
  leaveTotal: Record<string, number>;
  currentData: Employee[]; 
}

const Table = ({ data, leaveTotal, currentData }: Props): JSX.Element => {
  const employeesWithMoreLeaves: string[] = [];
  data.forEach((item: Employee) => {
    const id = item.ID;
    const approvedLeaveCount = data.filter(
      (leave: Employee) => leave.ID === id && leave.Status === 'Approved'
    ).length;
    if (leaveTotal[id] > approvedLeaveCount) {
      if (employeesWithMoreLeaves.indexOf(id) === -1) {
        employeesWithMoreLeaves.push(id);
      }
    }
  });

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>NAME</th>
          <th>Total Leave Days</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {employeesWithMoreLeaves.map((id) => {
          const employee = data.find((item) => item.ID === id);
          const totalLeaveDays = leaveTotal[id];
          const status = employee ? employee.Status : '';

          return (
            <tr key={id}>
              <td>{id}</td>
              <td>{employee?.Name}</td>
              <td>{totalLeaveDays}</td>
              <td>{status}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Table;
