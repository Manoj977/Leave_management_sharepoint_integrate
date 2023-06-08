/* eslint-disable no-unused-expressions */
/* eslint-disable no-void */ /* eslint-disable prefer-const */ /* eslint-disable @typescript-eslint/no-explicit-any */ /* eslint-disable @typescript-eslint/no-unused-vars */ /* eslint-disable @typescript-eslint/no-floating-promises */ /* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useState } from 'react';
import convert from 'xml-js';
import styles from './Approvalpage.module.scss';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
import { useLocation } from 'react-router-dom';
import { MyContext } from '../../context/contextProvider';
import { RxBorderDotted } from 'react-icons/rx';
import { MdOutlineCancel } from 'react-icons/md';
import { RiLoader4Line } from 'react-icons/ri';
import { toast } from 'react-hot-toast';

type LeaveDetail = {
  ID: string;
  Name: string;
  Email: string;
  Leave: string;
  FromDate: Date;
  ToDate: Date;
  LeaveType: Date;
  Reason: string;
  NoofDaysLeave: string;
  Status: string;
  leaveId: number;
};
type EmployeeDetail = {
  ID: string;
  phoneNumber: string;
};

interface ApprovalPageProps {
  setApprove: React.Dispatch<React.SetStateAction<string>>;
  approve: string;
  employeeId: number;
  setRemark: React.Dispatch<React.SetStateAction<string>>;
  remark: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  status: string;
}

export const ApprovalPage: React.FC<ApprovalPageProps> = ({
  employeeId,
  status,
  setStatus,
  setApprove,
  approve,
  setRemark,
  remark,
}) => {
  const { action, setAction, setApproveLeave, approveLeave } =
    React.useContext(MyContext);

  const [leaveDetails, setLeaveDetails] = useState<LeaveDetail[]>([]);
  // const [contactNum, setContactNum] = useState(null);
  const [loading, setLoading] = useState(false);

  const [employeeDetail, setEmployeeDetail] = useState<EmployeeDetail[]>([]);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reasonpopup, setReasonPopup] = useState(false);
  const location = useLocation();
  const pathArray = location.pathname.split('/');
  const LeaveId = pathArray[pathArray.length - 1];
  const [expandedID, setExpandedID] = useState(null);
  const [MAX_LENGTH, setMaxLength] = useState(20);
  useEffect(() => {
    // adjust MAX_LENGTH based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setMaxLength(10);
      } else if (window.innerWidth < 1024) {
        setMaxLength(15);
      } else {
        setMaxLength(20);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // call initially
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const func = () => {
    setIsLoading(true);

    const url = `https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Leave%20Management')/items?&$filter=ID%20eq%20%27${employeeId}%27`;

    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);

        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];

        const leaveDetail: LeaveDetail[] = entries.map((entry: any) => ({
          leaveId: entry.content['m:properties']['d:Id']._text,
          ID: entry.content['m:properties']['d:Title']._text,
          Name: entry.content['m:properties']['d:Name']._text,
          Email: entry.content['m:properties']['d:Email']._text,
          Leave: entry.content['m:properties']['d:Leave']._text,
          LeaveType: entry.content['m:properties']['d:LeaveType']._text,
          count: entry.content['m:properties']['d:count']._text,
          FromDate: new Date(entry.content['m:properties']['d:FormDate']._text)
            .toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .split(' ')
            .join('-'),
          ToDate: new Date(entry.content['m:properties']['d:ToDate']._text)
            .toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
            .split(' ')
            .join('-'),
          Reason: entry.content['m:properties']['d:Reason']._text,
          NoofDaysLeave: entry.content['m:properties']['d:count']._text,
          Status: entry.content['m:properties']['d:Status']._text,
          Remark: entry.content['m:properties']['d:Remark']._text,
          // LeaveId: parseInt(entry.content["m:properties"]["d:ID"]._text),
        }));
        setApprove(leaveDetail[0].Status);
        setLeaveDetails(leaveDetail);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    func();
  }, []);
  useEffect(() => {
    func();
  }, [setApproveLeave, approveLeave]);
  useEffect(() => {
    setIsLoading(true);
    fetch(
      "https://zlendoit.sharepoint.com/sites/production/_api/web/lists/getbytitle('Employee%20Master')/items"
    )
      .then((res) => res.text())
      .then((data) => {
        const jsonData = convert.xml2json(data, { compact: true, spaces: 4 });
        const parsedData = JSON.parse(jsonData);
        const entries = Array.isArray(parsedData.feed.entry)
          ? parsedData.feed.entry
          : [parsedData.feed.entry];
        const EmployeeDetail: EmployeeDetail[] = entries.map((entry: any) => ({
          ID: entry.content['m:properties']['d:Employee_x0020_ID']._text,
          phoneNumber:
            entry.content['m:properties']['d:Contact_x0020_Number']._text,
        }));
        setEmployeeDetail(EmployeeDetail);
        setIsLoading(false);
      });
  }, [LeaveId]);
  let contactNumber = '';
  if (leaveDetails?.[0]?.ID) {
    employeeDetail.map((e) => {
      e.ID === leaveDetails[0].ID ? (contactNumber = e.phoneNumber) : '';
    });
  }

  // Update the LeaveStatus value in SharePoint based on the leaveDetail item ID and the new status value

  const updateLeaveStatus = async (
    id: number,
    status: string,
    remark: string
  ) => {
    try {
      const web = Web('https://zlendoit.sharepoint.com/sites/production');
      const list: IList = web.lists.getByTitle('Leave Management');

      const itemToUpdate = list.items.getById(id);
      await itemToUpdate.update({ Status: status });
      await itemToUpdate.update({ Remark: remark });
      func();
    } catch (error) {
      console.clear();
    }
  };
  const handleApproval = (leaveId: any) => {
    setApproveLeave(true);
    setStatus('Approved');
  };
  const handleReject = (leaveId: any) => {
    setApproveLeave(true);
    setStatus('Rejected');
  };
  const handleSubmitApproval = async (
    id: number,
    status: string,
    remark: string
  ) => {
    await updateLeaveStatus(id, status, remark);
    // Update the leaveDetails state to reflect the new status
    const updatedLeaveDetails = leaveDetails.map((leaveDetail) =>
      leaveDetail.leaveId === id
        ? { ...leaveDetail, Status: status, Remark: remark }
        : leaveDetail
    );
    const updateMessage = `Leave status updated successfully!.`;
    setLoading(true);
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)), // Simulating an asynchronous operation
      {
        loading: 'Updating',
        success: () => {
          setLoading(false);
          setLeaveDetails(updatedLeaveDetails);
          setApprove(status);
          setRemark(remark);
          setAction(false);
          setApproveLeave(false);
          setReasonPopup(!reasonpopup);
          // Additional state updates and actions

          return updateMessage;
        },

        error: '',
      }
    );
  };

  return (
    <div>
      {action && (
        <div className={styles.totalLeave}>
          <div className={styles.totalLeaveDiv1}>
            <div className={styles.totalLeaveDiv2}>
              <header className={styles.totalLeaveHeader}>
                {!isLoading && (
                  <div className={styles.totalLeaveHeaderDiv}>
                    <p>
                      <span>Leave Details of </span>
                      <span>
                        {leaveDetails.length > 0 && leaveDetails[0].ID}
                      </span>
                    </p>
                  </div>
                )}
              </header>

              <button
                type='button'
                onClick={() => {
                  setReason('');
                  setAction(false);
                }}
                style={{
                  color: 'rgb(153,171,180)',
                  borderRadius: '50%',
                  border: 'none',
                }}
                className={styles.totalLeaveCloseButton}
              >
                <MdOutlineCancel />
              </button>
            </div>

            <div className={styles.totalLeaveTableContainer}>
              {isLoading ? (
                <table style={{ width: '100%' }}>
                  <tbody>
                    <tr>
                      <td className={styles.LeaveDetailsNoRecord} colSpan={11}>
                        <p
                          style={{
                            textAlign: 'center',
                            fontWeight: 400,
                          }}
                        >
                          <div className={styles.LoaderDivision}>
                            <RiLoader4Line className={styles.loader} />
                          </div>
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                leaveDetails.map((leaveDetail) => (
                  <>
                    <table
                      key={leaveDetail.ID}
                      className={styles.approvalTable}
                    >
                      <thead className={styles.approvalTableHead}>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            Employee ID
                          </th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.ID}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>Name</th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.Name}
                          </td>
                        </tr>

                        <tr>
                          <th className={styles.approvalTableHeading}>Email</th>
                          <td
                            style={{ textTransform: 'lowercase' }}
                            className={styles.approvalTableDescription}
                          >
                            {leaveDetail.Email}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            Contact Number
                          </th>

                          <td className={styles.approvalTableDescription}>
                            {contactNumber}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            Leave Type
                          </th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.LeaveType}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            From Date
                          </th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.FromDate}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            To Date
                          </th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.ToDate}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            No of Days Leave
                          </th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.NoofDaysLeave}
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            Reason
                          </th>
                          <td className={styles.approvalTableDescription}>
                            <div
                              className={`${styles.leaveApprovalButtonDiv} ${
                                expandedID === null
                                  ? styles.leaveApprovalButtonDiv1
                                  : styles.leaveApprovalButtonDiv2
                              }`}
                            >
                              {leaveDetail.Reason.length > MAX_LENGTH ? (
                                <>
                                  {!expandedID ||
                                  expandedID !== leaveDetail.ID ? (
                                    <div className={styles.scrollable}>
                                      <div className={styles.reason}>
                                        <p style={{ whiteSpace: 'nowrap' }}>
                                          {`${leaveDetail.Reason.slice(
                                            0,
                                            MAX_LENGTH
                                          )} `}
                                        </p>
                                        <a
                                          onClick={() => {
                                            setExpandedID(leaveDetail.ID);
                                          }}
                                          id={`reason-link-${leaveDetail.ID}`}
                                          className={styles.clickHere}
                                        >
                                          <RxBorderDotted />
                                        </a>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className={styles.scrollable}>
                                        <span id={`reason-${leaveDetail.ID}`}>
                                          {leaveDetail.Reason}
                                        </span>
                                      </div>

                                      <a
                                        onClick={() => {
                                          setExpandedID(null);
                                        }}
                                        id={`reason-link-${leaveDetail.ID}`}
                                        className={styles.ShowLess}
                                      >
                                        {!expandedID ? 'Show less' : 'Hide'}
                                      </a>
                                    </>
                                  )}
                                </>
                              ) : (
                                <div>{leaveDetail.Reason}</div>
                              )}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th className={styles.approvalTableHeading}>
                            Status
                          </th>
                          <td className={styles.approvalTableDescription}>
                            {leaveDetail.Status}
                          </td>
                        </tr>
                      </thead>
                    </table>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <div className={styles.approveButtonDiv}>
                        <button
                          onClick={handleApproval}
                          className={styles.approveButton}
                        >
                          Approve
                        </button>
                        <button
                          // onClick={() =>
                          //   handleApproval(leaveDetail.leaveId, "Rejected")
                          // }
                          onClick={handleReject}
                          className={styles.approveButton}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </>
                ))
              )}
            </div>
          </div>
          {approveLeave &&
            leaveDetails.map((leaveDetail, index) => (
              <div key={index} className={styles.approvalLeave}>
                <div className={styles.approvalLeaveDiv1}>
                  <div className={styles.totalLeaveDiv2}>
                    <header className={styles.totalLeaveHeader}>
                      <div className={styles.totalLeaveHeaderDiv}>
                        {status === 'Approved' ? status.slice(0, -1) : ''}
                        {status === 'Rejected' ? status.slice(0, -2) : ''}
                      </div>
                    </header>

                    <button
                      type='button'
                      onClick={() => setApproveLeave(false)}
                      style={{
                        color: 'rgb(153,171,180)',
                        borderRadius: '50%',
                        border: 'none',
                      }}
                      className={styles.totalLeaveCloseButton}
                    >
                      <MdOutlineCancel />
                    </button>
                  </div>
                  <div className={styles.totalLeaveTableContainer}>
                    <div className={styles.approvalTable}>
                      <div className=''>
                        <textarea
                          rows={3}
                          cols={50}
                          style={{ resize: 'none' }}
                          placeholder='Reason...'
                          onChange={(event) => setReason(event.target.value)}
                          className={`${styles.ApprovalLeaveTextarea} `}
                          value={reason}
                        />
                      </div>

                      <div>
                        <div className={styles.button}>
                          <button
                            className={styles.approveButton}
                            style={{ width: '6rem' }}
                            type='submit'
                            onClick={() =>
                              handleSubmitApproval(
                                leaveDetail.leaveId,
                                status,
                                reason
                              )
                            }
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default ApprovalPage;
