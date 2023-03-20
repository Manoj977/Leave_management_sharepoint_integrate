/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';

import { MyContext } from '../../context/contextProvider';

import styles from './Sidebar.module.scss';
import { NavLink } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';

const Sidebar = () => {
  // eslint-disable-next-line no-unused-vars
  const { activeMenu, currentColor, links, setActiveMenu, screenSize } =
    React.useContext(MyContext);

  const handleCloseSideBar = () => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  };

  const activeLink = styles.activeLink;
  const normalLink = styles.normalLink;

  return (
    <>
      {activeMenu && (
        <div className={styles.sidebarScroll}>
          <div className={styles.sidebar}>
            <>
              <div className={styles.sidebarHeading}>
                <div>
                  <img
                    src={require('../../assets/logo/logo-1-180x180.png')}
                    className={styles.sidebarImage}
                    alt="zlendo"
                  />
                  <span className={styles.sidebarSpan}>Zlendo</span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleCloseSideBar()}
                    className={styles.Cancel}
                  >
                    <MdOutlineCancel />
                  </button>
                </div>
              </div>
              <div className={styles.sidebarLinks}>
                {links.map((item) => (
                  <div key={item.title}>
                    <p className={styles.sidebarTitle}>{item.title}</p>
                    {item.links.map((link) => (
                      <div className={styles.sidebarDetail} key={link.name}>
                        <NavLink
                          to={`/${link.name}`}
                          onClick={handleCloseSideBar}
                          style={({ isActive }) => ({
                            backgroundColor: isActive ? currentColor : '',
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
      )}
    </>
  );
};

export default Sidebar;
