import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { User } from 'components';
import { useSelector, useDispatch } from 'react-redux';
import { getUserListAsync, showUserList } from 'features/usersSlice';

export const Userlist = () => {
  // const users = useSelector(state => state.users.userList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserListAsync());
  }, []);
  let currentUsers = useSelector(showUserList);
  return (
    <div>
      <User users={currentUsers} />
    </div>
  );
};
