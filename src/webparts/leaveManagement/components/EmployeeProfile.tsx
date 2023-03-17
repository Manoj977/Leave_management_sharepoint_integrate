import * as React from "react";
import { Fragment } from "react";
import { MyContext } from "../../Context/contextProvide";
// import Button from "./Button";
// import { useNavigate } from "react-router-dom";

// import MetaData from "./MetaData";

const EmployeeProfile = () => {
  const {
    activeMenu,
    earningData,
    // setLeaveData,
    // setUsedLeave,
    // setBalanceLeave,
    isSkeletonLoading,
    // setIsSkeletonLoading,
  } = React.useContext(MyContext);
  // let data = employees.employees.map((employee) => {
  //   if (employee.email === DisplayName) {
  //     return employee;
  //   }
  // });

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsSkeletonLoading(false);
  //   }, 3000);
  // }, []);

  // const empData = data.filter((e) => {
  //   return e !== undefined;
  // });
  // const empInfo = empData.pop();

  // const handleToltal = (event) => {
  //   if (event === "Total Leaves") {
  //     setLeaveData(true);
  //   }
  //   if (event === "Taken Leaves") {
  //     setUsedLeave(true);
  //   }
  //   if (event === "Available Leaves") {
  //     setBalanceLeave(true);
  //   }
  //   if (event === "Refresh") {
  //     window.location.reload();
  //   }
  // };
  return (
    <Fragment>
      {/* <MetaData title={"Profile"} /> */}
      <div className="mt-16 md:mt-10 nav-item ">
        <div
          className={`flex items-center   ${
            activeMenu === true ? "flex-row " : "flex-col mx-4"
          }  flex-wrap lg:flex-nowrap justify-center `}
        >
          {!isSkeletonLoading ? (
            <>
              <div
                className={`bg-white overflow-hidden dark:text-gray-200 dark:bg-secondary-dark-bg h-40  ${
                  activeMenu === true ? "w-[500px] ml-10 card " : "w-[97%] card"
                } rounded-xl drop-shadow-xl  p-4 m-3   bg-cover bg-center `}
              >
                <div className="flex  justify-between flex-wrap mt-7 lg:flex-nowrap   ">
                  <div className="flex flex-col  ">
                    <span>Hi,</span>
                    <p className="text-gray-600  dark:text-slate-300 text-xl md:text-3xl capitalize font-semibold  ">
                      {/* {empInfo.first_name} {empInfo.last_name} */}
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`max-[320px]:grid min-[320px]:grid-cols-2  flex mx-3 m-3  flex-wrap  items-center ${
                  activeMenu === true
                    ? "justify-center gap-8"
                    : "justify-center gap-6 "
                }`}
              >
                {earningData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white h-28 w-28 min-[533px]:h-32 min-[533px]:w-32  md:h-40 drop-shadow-xl md:w-40  dark:text-gray-200 dark:bg-secondary-dark-bg flex flex-col items-center justify-center rounded-2xl"
                  >
                    <div className="">
                      <button
                        type="button"
                        name={item.title}
                        style={{
                          color: item.iconColor,
                          backgroundColor: item.iconBg,
                        }}
                        // onClick={() => handleToltal(item.title)}
                        className={`text-sm md:text-2xl opacity-0.9 rounded-full p-3  md:p-4 hover:drop-shadow-xl ${
                          !item.count && "-mt-4 relative "
                        }`}
                      >
                        {item.icon}
                      </button>
                    </div>

                    <p className={`flex flex-col mt-1 md:mt-3 text-center   `}>
                      <span className=" text-sm md:text-lg font-semibold">
                        {item.count}
                      </span>
                      <span
                        className={`md:mt-0 mt-1 text-xs font-medium md:text-lg md:font-semibold ${
                          !item.count && " pt-1 mt-4 "
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
                className={`bg-white overflow-hidden dark:text-gray-200 dark:bg-secondary-dark-bg h-40  ${
                  activeMenu === true
                    ? "w-[500px] ml-10 card dark:Skeletoncard "
                    : "w-[97%] card dark:Skeletoncard"
                } rounded-xl drop-shadow-xl  p-4 m-3   bg-cover bg-center `}
              >
                <div className="flex  justify-between flex-wrap mt-10 lg:flex-nowrap animate-pulse  ">
                  <div className="flex flex-col  ">
                    <div className="h-4 w-10 rounded mb-1 bg-gray-500 dark:bg-gray-700"></div>
                    <div className="h-4 w-32 rounded bg-gray-500 dark:bg-gray-700 text-xl md:text-3xl capitalize font-semibold  "></div>
                  </div>
                </div>
              </div>

              <div
                className={`max-[320px]:grid max-[320px]:grid-cols-2  flex mx-8 m-3  flex-wrap  items-center ${
                  activeMenu === true
                    ? "justify-center gap-8"
                    : "justify-center gap-6 "
                }`}
              >
                {earningData.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white h-24 w-24 min-[533px]:h-32 min-[533px]:w-32  md:h-40 drop-shadow-xl md:w-40  dark:text-gray-200 dark:bg-secondary-dark-bg flex flex-col items-center justify-center rounded-2xl "
                  >
                    <div className="animate-pulse">
                      <div className="text-sm md:text-2xl opacity-0.9 bg-slate-500 rounded-full p-4  md:p-5 hover:drop-shadow-xl"></div>
                    </div>

                    <p className="flex flex-col mt-3 text-center animate-pulse">
                      <span
                        className={` bg-gray-500 dark:bg-gray-700 rounded mx-auto my-0  ${
                          item.count ? "  mt-2 h-2 w-12" : "mt-2 h-4 w-16"
                        }`}
                      ></span>
                      <span
                        className={` bg-gray-500 dark:bg-gray-700 rounded mx-auto my-0  ${
                          item.count ? "  mt-2 h-2 w-12" : ""
                        }`}
                      ></span>
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default EmployeeProfile;
