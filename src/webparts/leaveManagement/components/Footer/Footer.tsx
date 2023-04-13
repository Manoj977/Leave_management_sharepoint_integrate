import * as React from 'react';
import styles from './Footer.module.scss';

export const Footer: React.FunctionComponent = () => {
  return (
    <div className={styles.footer}>
      <p>Footer text here</p>
    </div>
  );
};

export default Footer;
