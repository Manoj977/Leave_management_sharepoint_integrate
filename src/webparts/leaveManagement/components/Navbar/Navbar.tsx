/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useContext } from 'react';
// import { AiOutlineMenu } from 'react-icons/ai';
import styles from './Navbar.module.scss';
import { MyContext } from '../../context/contextProvider';
import { debounce } from '@syncfusion/ej2-base';
import { AiOutlineMenu } from 'react-icons/ai';

interface NavButtonProps {
  title: string;
  customFunc: () => void;
  icon: JSX.Element;
  color: string;
  dotColor: string;
}

const NavButton: React.FC<NavButtonProps> = ({
  title,
  customFunc,
  icon,
  color,
  dotColor,
}) => (
  <>
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className={styles.navbarButton}
      data-tip={title}
      data-for="navButtonTooltip"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </>
);

const Navbar: React.FC = () => {
  const { screenSize, setScreenSize, activeMenu, setActiveMenu } =
    useContext(MyContext);

  //Screen Size Handler
  useEffect(() => {
    const handleResize = () =>
      debounce(() => {
        setScreenSize(window.innerWidth);
      }, 500);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    setScreenSize(window.innerWidth);
    console.log(activeMenu);
  }, [screenSize, setScreenSize, activeMenu]);
  //Screen Size Changes

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, []);
  //Handle Togggle button
  const handleActiveMenu = () => {
    setActiveMenu(!activeMenu);
    console.table('done');
  };

  return (
    <div className={styles.navbarHeader}>
      <div>
        <NavButton
          title="Menu"
          customFunc={handleActiveMenu}
          icon={<AiOutlineMenu />}
          color=""
          dotColor=""
        />
      </div>
      {/* <div>
        {shown}
        {screenSize}
      </div> */}
      <div className={styles.navbarSection}>
        <div className={styles.navbarSectionOne}>
          <img
            className={styles.profile_photo}
            src="https://ui-avatars.com/api/?name=Manojpa"
            alt="profile_photo"
          />
          <p className={styles.info}>
            <span className={styles.email}>********@zlendo.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
