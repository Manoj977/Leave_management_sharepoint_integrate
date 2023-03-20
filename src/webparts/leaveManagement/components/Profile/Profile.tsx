/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import style from './Profile.module.scss';
import { MyContext } from '../../context/contextProvider';
// import LeaveManagement from '../LeaveManagement';

export default function Profile() {
  const {
    activeMenu,
    earningData,
    isSkeletonLoading,
    setLeaveData,
    setUsedLeave,
    setBalanceLeave,
  } = React.useContext(MyContext);
  const HandleLeave = (
    event: React.MouseEvent<HTMLButtonElement>,
    title: string
  ) => {
    if (title === 'Total Leaves') {
      setLeaveData(true);
    }
    if (title === 'Taken Leaves') {
      setUsedLeave(true);
    }
    if (title === 'Available Leaves') {
      setBalanceLeave(true);
    }
    if (title === 'Refresh') {
      window.location.reload();
    }
  };
  return (
    <div>
      <div className={style.profileSection}>
        <div
          className={` ${activeMenu ? style.activeMenu : style.activeMenuNot} `}
        >
          {isSkeletonLoading ? (
            <>
              <div className={`${style.nameBoard}`}>
                <div className={style.nameBoard_layout}>
                  <div className={style.nameBoard_layout_title}>
                    <span>Hi,</span>
                    <p className={style.nameBoard_layout_title_Name}>Name</p>
                    {/* <img
                      alt=""
                      src={require('../../assets/logo.png')}
                      className={""}
                    /> */}
                  </div>
                </div>
              </div>

              <div
                className={`${style.card} ${
                  activeMenu === true ? style.card_gap1 : style.card_gap2
                }} `}
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
                      className={`${!item.count ? style.icon1 : style.icon2}`}
                    >
                      {item.icon}
                    </button>

                    <p className={style.icon_count}>
                      <span className={style.icon_count_number}>
                        {item.count}
                      </span>
                      <span
                        className={` ${
                          !item.count ? style.icon_title1 : style.icon_title2
                        } `}
                      >
                        {item.title}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div
                className={`bg-white overflow-hidden dark:text-gray-200 dark:bg-secondary-dark-bg h-40  ${'w-[97%] card dark:Skeletoncard'} rounded-xl drop-shadow-xl  p-4 m-3   bg-cover bg-center `}
              >
                <div className="flex  justify-between flex-wrap mt-10 lg:flex-nowrap animate-pulse  ">
                  <div className="flex flex-col  ">
                    <div className="h-4 w-10 rounded mb-1 bg-gray-500 dark:bg-gray-700" />
                    <div className="h-4 w-32 rounded bg-gray-500 dark:bg-gray-700 text-xl md:text-3xl capitalize font-semibold  " />
                  </div>
                </div>
              </div>

              <div
                className={`max-[320px]:grid max-[320px]:grid-cols-2  flex mx-8 m-3  flex-wrap  items-center ${'justify-center gap-6 '}`}
              >
                {earningData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white h-24 w-24 min-[533px]:h-32 min-[533px]:w-32  md:h-40 drop-shadow-xl md:w-40  dark:text-gray-200 dark:bg-secondary-dark-bg flex flex-col items-center justify-center rounded-2xl "
                  >
                    <div className="animate-pulse">
                      <div className="text-sm md:text-2xl opacity-0.9 bg-slate-500 rounded-full p-4  md:p-5 hover:drop-shadow-xl" />
                    </div>

                    <p className="flex flex-col mt-3 text-center animate-pulse">
                      <span
                        className={` bg-gray-500 dark:bg-gray-700 rounded mx-auto my-0  ${
                          item.count ? '  mt-2 h-2 w-12' : 'mt-2 h-4 w-16'
                        }`}
                      />
                      <span
                        className={` bg-gray-500 dark:bg-gray-700 rounded mx-auto my-0  ${
                          item.count ? '  mt-2 h-2 w-12' : ''
                        }`}
                      />
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
