/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import style from "./Profile.module.scss";
import { MyContext } from "../../context/contextProvider";
import LeaveCalculation from "../LeaveCalculation/LeaveCalculation";
import { sp } from "@pnp/sp/presets/all";
export default function Profile() {
  const {
    activeMenu,
    earningData,
    setLeaveData,
    setUsedLeave,
    setBalanceLeave,
    lossOfPay,
    setLossofPay,
    takenLeaves,
    totalLeaves,
    availableLeaves,
  } = React.useContext(MyContext);
  LeaveCalculation();
  const [userName, setUserName] = useState("");
  useEffect(() => {
    setLossofPay(lossOfPay); // update the state whenever lossOfPay changes
    void sp.web.currentUser.get().then((user) => {
      setUserName(user.Title);
    });
  }, [lossOfPay, userName]);
  const HandleLeave = (
    event: React.MouseEvent<HTMLButtonElement>,
    title: string
  ) => {
    if (title === "Total Leaves") {
      setLeaveData(true);
    }
    if (title === "Taken Leaves") {
      setUsedLeave(true);
    }
    if (title === "Available Leaves") {
      setBalanceLeave(true);
    }
    if (title === "Refresh") {
      window.location.reload();
    }
  };

  return (
    <div>
      <div
        className={`${style.profilesection_layout} ${
          activeMenu ? style.activeMenu : style.activeMenuNot
        }`}
      >
        <div
          className={`${style.employeeNameCard} ${
            activeMenu
              ? style.employeeNameCardActiveMenu + ' ' + style.bgDecor
              : style.employeeNameCardActiveMenuNot + ' ' + style.bgDecor
          }`}
        >
          <div className={style.nameBoard_layout}>
            <div className={style.nameBoard_layout_title}>
              <span
                style={{
                  fontSize: '30px',
                  fontWeight: '400',
                  marginTop: '-10px',
                }}
              >
                Hi,
              </span>
              <p className={style.nameBoard_layout_title_Name}>{userName}</p>
            </div>
          </div>
        </div>

        <div
          className={`${style.card} ${
            activeMenu === true ? style.card_gap1 : style.card_gap2
          }`}
        >
          {earningData.map((item, index) => (
            <div key={index} className={style.card_layout}>
              <button
                type="button"
                name={item.title}
                style={{
                  color: item.iconColor,
                  backgroundColor: item.iconBg,
                }}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  HandleLeave(event, item.title)
                }
                className={`${style.icon}${
                  !item.count ? ` ${style.icon1}` : ''
                }`}
              >
                {item.icon}
              </button>

              <p className={style.icon_count}>
                <span className={style.icon_count_number}>
                  {item.title === 'Taken Leaves'
                    ? (item.count = takenLeaves)
                    : ''}
                  {item.title === 'Available Leaves'
                    ? (item.count = availableLeaves)
                    : ''}

                  {item.title === 'Total Leaves' ? totalLeaves : ''}

                  {item.title === 'Loss of Pay' ? lossOfPay : ''}
                </span>
                <span
                  className={`${style.icon_title}${
                    !item.count ? ` ${style.icon_title1}` : ''
                  }`}
                >
                  {item.title}
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
