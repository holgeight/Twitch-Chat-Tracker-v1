import { createSlice } from '@reduxjs/toolkit';

import Axios from 'axios';
const API_GET_MSG = 'http://localhost:3001/messages';
const API_ONE_MSG = 'http://localhost:3001/singlemessage';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messageList: [],
  },

  reducers: {
    getMessageList: (state, action) => {
      state.messageList = action.payload;
    },
    liveMessageUpdate: (state, action) => {
      state.messageList.push(...action.payload);
    },
    // new reducer, liveMessageUpdate?
    // state.messageList.push? action.payload
  },
});

export const getMessageListAsync = (name, id) => async dispatch => {
  try {
    const response = await Axios.get(API_GET_MSG, {
      params: {
        user: name,
        id: id,
      },
    });
    console.log('GetMSGList Async', response);
    if (response.status === 200) {
      console.log('async GETUSER success');
      dispatch(getMessageList(response.data));
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const liveMessageUpdateAsync = (name, id) => async dispatch => {
  try {
    const response = await Axios.get(API_ONE_MSG, {
      params: {
        user: name,
        id: id,
      },
    });
    console.log('liveMSGUpdate Async', response);
    if (response.status === 200) {
      console.log('async GETUSER success');
      dispatch(liveMessageUpdate(response.data));
      return true;
    }
    return false;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const { getMessageList, liveMessageUpdate } = messagesSlice.actions;
export const showMessageList = state => state.messages.messageList;
export default messagesSlice.reducer;
