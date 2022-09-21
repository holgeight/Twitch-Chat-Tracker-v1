import styles from './styles.module.css';
import React, { useState } from 'react';
import Axios from 'axios';

import { useNavigate, Link } from 'react-router';
import {
  delUserAsync,
  getUserList,
  showUserList,
} from 'features/usersSlice';
import { useDispatch, useSelector } from 'react-redux';

export const User = users => {
  const navigate = useNavigate();

  let currentUsers = useSelector(showUserList);
  return (
    <div className={styles.displayUsers}>
      {currentUsers.length
        ? currentUsers.map((val, key) => {
            return (
              <div key={val.id}>
                <h2>{val.username}</h2>

                <button
                  onClick={() => {
                    // if (
                    //   window.confirm(
                    //     'Are you sure you wish to delete this item?',
                    //   )
                    // )
                    //   console.log('ok');
                    console.log(
                      delUserAsync(val.username, val.id),
                      'func cons log on button click',
                    );
                    delUserAsync(val.username, val.id);
                    console.log('delete onclick', val.username, val.id);
                  }}
                >
                  Delete User
                </button>
                <button
                  onClick={() =>
                    navigate(`/${val.username}/messages`, {
                      state: { id: val.id, name: val.username },
                    })
                  }
                >
                  View Chat
                </button>
              </div>
            );
          })
        : 'coom'}
    </div>
  );
};
