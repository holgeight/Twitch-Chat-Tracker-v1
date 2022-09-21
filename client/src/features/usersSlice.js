import { createSlice } from '@reduxjs/toolkit';

import Axios from 'axios';
const API_GET_USER = 'http://localhost:3001/users';
const API_ADD_USER = 'http://localhost:3001/create';
const API_DEL_USER = 'http://localhost:3001/delete';

export const usersSlice = createSlice({
  name: 'user',
  initialState: {
    userList: [],
  },

  reducers: {
    getUserList: (state, action) => {
      state.userList = action.payload;
    },
    addUser: (state, action) => {
      state.userList.push(action.payload);
    },
  },
});

export const getUserListAsync = data => async dispatch => {
  try {
    const response = await Axios.get(API_GET_USER);
    console.log('GetUserList Async', response);
    if (response.status === 200) {
      console.log('async GETUSER success');
      dispatch(getUserList(response.data));
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const addUserAsync = data => async dispatch => {
  try {
    const response = await Axios.post(API_ADD_USER, {
      userName: data,
    });
    if (response.status === 200) {
      console.log('async ADDUSER success', response);
      dispatch(addUser(response.data));
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err);
  }
};

export const delUserAsync = (user, id) => async dispatch => {
  try {
    console.log('Usersslice DEL', user, id);
    const response = await Axios.delete(API_DEL_USER, {
      params: {
        userName: user,
        id: id,
      },
    });
    if (response.status === 200) {
      console.log('async DELUSER success', response);
      dispatch(getUserListAsync);
      return true;
    }
    return false;
  } catch (err) {
    throw new Error(err);
  }
};

export const { getUserList, addUser } = usersSlice.actions;
export const showUserList = state => state.users.userList;
export default usersSlice.reducer;
