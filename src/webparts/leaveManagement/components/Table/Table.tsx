import React from 'react';

const Table = ({
  data,
  leaveTotal,
  currentData,
}: {
  data: any[];
  leaveTotal: any;
  currentData: any;
}): JSX.Element => {  // Add return type annotation for the component function
  const employeesWithMoreLeaves: string[] = [];
  data.forEach((item: any) => {
    const id = item.ID;
    const approvedLeaveCount = data.filter(
      (leave: any) => leave.ID === id && leave.STATUS === 'Approved'
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
