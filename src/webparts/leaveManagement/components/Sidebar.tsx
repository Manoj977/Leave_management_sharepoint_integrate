import * as React from "react";

import { MyContext } from "../../Context/contextProvide";

import styles from "./LeaveManagement.module.scss";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // eslint-disable-next-line no-unused-vars
  const { activeMenu, currentColor, links } = React.useContext(MyContext);
  // const handleCloseSideBar = () => {
  //   if (activeMenu && screenSize <= 900) {
  //     setActiveMenu(false);
  //   }
  // };

  const activeLink = styles.activeLink;
  const normalLink = styles.normalLink;

  return (
    <>
      {activeMenu ? (
        <div
          className=" 
          scrollbar-thin scrollbar-h-[10px] scrollbar-none  
        "
        >
          <div className={styles.sidebar}>
            <>
              <div className={styles.sidebarHeading}>
                <img
                  src={require("../assets/logo/logo-1-180x180.png")}
                  className={styles.sidebarImage}
                  // className="w-5 h-5 rounded-tr-md rounded-bl-md drop-shadow-lg hover:scale-105 duration-100 ease-in-out"
                  alt="zlendo"
                />
                <span className={styles.sidebarSpan}>Zlendo</span>
              </div>
              <div className={styles.sidebarLinks}>
                {links.map((item) => (
                  <div key={item.title}>
                    <p className={styles.sidebarTitle}>{item.title}</p>
                    {item.links.map((link) => (
                      <div className={styles.sidebarDetail} key={link.name}>
                        <NavLink
                          to={`/${link.name}`}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : "",
                          })}
                          className={({ isActive }) =>
                            isActive ? activeLink : normalLink
                          }
                        >
                          {link.icon}

                          <span className="capitalize">{link.name}</span>
                        </NavLink>
                      </div>
                    ))}
                  </div>
                ))}

                {/* <div>
                  <button
                    type="button"
                    onClick={() => {
                      setThemeSettings(!themeSettings);
                      setActiveMenu(false);
                    }}
                    // style={{ background: '#ff4500', borderRadius: '50%' }}
                    className=" min-[900px]:hidden text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase"
                  >
                    <span className="capitalize">Settings</span>
                  </button>
                </div> */}
              </div>
            </>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Sidebar;
