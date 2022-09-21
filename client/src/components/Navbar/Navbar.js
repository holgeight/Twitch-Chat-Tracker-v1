import styles from './styles.module.css';
import { Link } from 'react-router-dom';
import React from 'react';

export const Navbar = () => {
  return (
    <div className={styles.main}>
      <div className={styles.navbar}>
        <Link to="/">
          <h1> Twitch Chat Analyzing Project </h1>
        </Link>
        <Link to="/about">
          <h3> About </h3>
        </Link>
        <div className={styles.text}></div>
      </div>
    </div>
  );
};
