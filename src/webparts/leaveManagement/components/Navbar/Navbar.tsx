/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useEffect, useContext, useState } from 'react';
import styles from './Navbar.module.scss';
import { MyContext } from '../../context/contextProvider';
import { AiOutlineMenu } from 'react-icons/ai';
import { sp } from '@pnp/sp/presets/all';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const Navbar: React.FC = () => {
  const { screenSize, setScreenSize, activeMenu, sidebarActive,setSideBarActive } =
    useContext(MyContext);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const handleResize = () => {
      setScreenSize(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    setScreenSize(window.innerWidth);
    console.log(activeMenu, screenSize);
  }, [screenSize, setScreenSize, activeMenu]);

  void sp.web.currentUser.get().then((user) => {
    setUserEmail(user.Email);
    setUserName(user.Title);
  });

  console.log(userName, userEmail);
  const initials = userName
    .split(' ')
    .map((word) => word.charAt(0))
    .join('');
  console.log(initials);

  return (
    <div className={styles.navbarHeader}>
      <div>
        <button
          type="button"
          onClick={() => {
            setSideBarActive(!sidebarActive)
          }}
          style={{ color: '', background: ''}}
          className={styles.navbarButton}
          data-tip="Menu"
          data-for="navButtonTooltip"
        >
          <span
            style={{ background: '' }}
            className={styles.navbarButtonIcon}
          />
          <AiOutlineMenu />
        </button>
      </div>
      <div className={styles.navbarSection}>
        <div className={styles.navbarSectionOne}>
          {/* <img
            className={styles.profile_photo}
            src="https://ui-avatars.com/api/?name=Manojpa"
            alt="profile_photo"
          /> */}
          {/* <p className={styles.info}>
            <span className={styles.circle}>
              <span className={styles.initials}>{initials}</span>
            </span>
            <span className={styles.email}>{userEmail}</span>
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
