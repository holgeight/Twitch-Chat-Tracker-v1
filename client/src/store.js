import { configureStore } from '@reduxjs/toolkit';
import messagesSlice from 'features/messagesSlice';
import usersSlice from 'features/usersSlice';

export const store = configureStore({
  reducer: {
    users: usersSlice,
    messages: messagesSlice,
  },
});
