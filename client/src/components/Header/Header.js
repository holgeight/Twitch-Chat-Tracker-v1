import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  getUserListAsync,
  showUserList,
  addUserAsync,
} from 'features/usersSlice';
import { Userlist } from 'components';

export const Header = () => {
  const dispatch = useDispatch();
  let currentUsers = useSelector(state => state.users.userList);

  useEffect(() => {
    dispatch(getUserListAsync());
  }, []);

  const [typedUser, setTypedUser] = useState('');

  return (
    <div className={styles.main}>
      <h1>
        {' '}
        You are currently tracking{' '}
        {currentUsers.length > 0 ? currentUsers.length : 0} users
      </h1>
      <div className={styles.text}>
        <h2>
          {' '}
          Please enter the Twitch account you'd like to track below{' '}
        </h2>
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Enter Twitch Username"
            onChange={event => {
              setTypedUser(event.target.value);
            }}
          />
          <button
            onClick={() => {
              dispatch(addUserAsync(typedUser));
            }}
          >
            {' '}
            Track User
          </button>
        </div>
      </div>
      {currentUsers.length > 0 ? (
        <Userlist />
      ) : (
        'Please enter a user to track'
      )}
    </div>
  );
};
