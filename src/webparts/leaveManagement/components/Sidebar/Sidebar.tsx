/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from 'react';

import { MyContext } from '../../context/contextProvider';

import styles from './Sidebar.module.scss';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { GiCancel } from 'react-icons/gi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Sidebar = ({ loggedUserRole }: any) => {
  // eslint-disable-next-line no-unused-vars
  const { activeMenu, links, currentColor, setSideBarActive, sidebarActive } =
    React.useContext(MyContext);
  const location =
    useLocation().pathname === '/' ? '/Profile' : useLocation().pathname;

  const handleCloseSideBar = () => {
    setSideBarActive(!sidebarActive);
  };
  const handleSidebar = () => {
    setSideBarActive(!sidebarActive);
  };
  const activeLink = styles.activeLink;
  const normalLink = styles.normalLink;
  const navigate = useNavigate();

  return (
    <>
      {activeMenu && (
        <div className={styles.sidebarScroll}>
          <div className={styles.sidebar}>
            <>
              <div className={styles.sidebarHeading}>
                <div
                  onClick={() => {
                    navigate('/Profile');
                  }}
                >
                  <img
                    src={require('../../assets/logo/Logo.png')}
                    className={styles.sidebarImage}
                    alt='zlendo'
                  />
                </div>
                <div>
                  <button
                    type='button'
                    onClick={() => handleCloseSideBar()}
                    className={styles.Cancel}
                  >
                    <GiCancel
                      style={{
                        color: '#ff4400',
                        filter: 'drop-shadow(3px 1px 3px #ccc)',
                      }}
                    />
                  </button>
                </div>
              </div>
              <div className={styles.sidebarLinks}>
                {links.map((item) => (
                  <div key={item.title}>
                    <p className={styles.sidebarTitle}>
                      {loggedUserRole !== 'Admin' && item.title !== 'Admin'
                        ? item.title
                        : ''}
                      {loggedUserRole === 'Admin' ? item.title : ''}
                    </p>

                    {item.links
                      .filter((link) => {
                        if (link.role === 'Admin') {
                          return loggedUserRole === 'Admin';
                        } else {
                          return true;
                        }
                      })
                      .map((link) => (
                        <div className={styles.sidebarDetail} key={link.name}>
                          <NavLink
                            to={`/${encodeURIComponent(link.name)}`}
                            onClick={() => {
                              handleSidebar();
                            }}
                            style={({ isActive }) => ({
                              backgroundColor:
                                isActive ||
                                location === `/${encodeURIComponent(link.name)}`
                                  ? currentColor
                                  : '',
                            })}
                            className={({ isActive }) =>
                              isActive ||
                              location === `/${encodeURIComponent(link.name)}`
                                ? activeLink
                                : normalLink
                            }
                          >
                            {link.icon}

                            <span className={styles.linkName}>{link.name}</span>
                          </NavLink>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </>
          </div>
        </div>
      )}

      {sidebarActive && (
        <div className={styles.sidebarScroll}>
          <div className={styles.sidebar}>
            <>
              <div className={styles.sidebarHeading}>
                <div
                  onClick={() => {
                    navigate('/Profile');
                    handleCloseSideBar();
                  }}
                >
                  <img
                    src={require('../../assets/logo/Logo.png')}
                    className={styles.sidebarImage}
                    alt='zlendo'
                  />
                </div>
                <div>
                  <button type='button' className={styles.Cancel}>
                    <GiCancel
                      style={{
                        color: '#ff4400',
                        filter: 'drop-shadow(3px 1px 3px #ccc)',
                      }}
                      onClick={() => handleCloseSideBar()}
                    />
                  </button>
                </div>
              </div>
              <div className={styles.sidebarLinks}>
                {links.map((item) => (
                  <div key={item.title}>
                    <p className={styles.sidebarTitle}>
                      {' '}
                      {loggedUserRole !== 'Admin' && item.title !== 'Admin'
                        ? item.title
                        : ''}
                      {loggedUserRole === 'Admin' ? item.title : ''}
                    </p>
                    {item.links
                      .filter((link) => {
                        if (link.role === 'Admin') {
                          return loggedUserRole === 'Admin';
                        } else {
                          return true;
                        }
                      })
                      .map((link) => (
                        <div className={styles.sidebarDetail} key={link.name}>
                          <NavLink
                            to={`/${encodeURIComponent(link.name)}`}
                            onClick={() => {
                              handleSidebar();
                            }}
                            style={({ isActive }) => ({
                              backgroundColor:
                                isActive ||
                                location === `/${encodeURIComponent(link.name)}`
                                  ? currentColor
                                  : '',
                            })}
                            className={({ isActive }) =>
                              isActive ||
                              location === `/${encodeURIComponent(link.name)}`
                                ? activeLink
                                : normalLink
                            }
                          >
                            {link.icon}

                            <span className='capitalize'>{link.name}</span>
                          </NavLink>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            </>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
