import styles from './styles.module.css';

import React from 'react';

export const Navbar = () => {
  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <h1> Twitch Chat Analyzing Project </h1>

        <div className={styles.text}></div>
      </div>
    </div>
  );
};
