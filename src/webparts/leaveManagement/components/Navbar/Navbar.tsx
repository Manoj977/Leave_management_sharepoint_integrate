/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useContext, useState } from 'react';
import styles from './Navbar.module.scss';
import { MyContext } from '../../context/contextProvider';
import { AiOutlineMenu } from 'react-icons/ai';
import { sp } from '@pnp/sp/presets/all';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const Navbar: React.FC = () => {
  const { sidebarActive, setSideBarActive } = useContext(MyContext);
  const [, setUserName] = useState('');
  const [, setUserEmail] = useState('');

  void sp.web.currentUser.get().then((user) => {
    setUserEmail(user.Email);
    setUserName(user.Title);
  });

  return (
    <div className={styles.navbarHeader}>
      <div>
        <button
          type='button'
          onClick={() => {
            setSideBarActive(!sidebarActive);
          }}
          className={styles.navbarButton}
          data-tip='Menu'
        >
          <span className={styles.navbarButtonIcon} />
          <AiOutlineMenu />
        </button>
      </div>
      <div className={styles.navbarSection}>
        <div className={styles.navbarSectionOne} />
      </div>
    </div>
  );
};

export default Navbar;
