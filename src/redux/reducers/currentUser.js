import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { sleep } from 'utils/utils';
import {currentUserStub, handleThunkError} from './utils/reducersUtils';

const initialState = {
  id:                     '',
  role:                   '',
  firstName:              '',
  lastName:               '',
  avatarPath:             '',
  dashboardNotifications: [],
};

export const getCurrentUser = createAsyncThunk(
  'currentUser/getCurrentUser',
  async () => {
    try {
      await sleep(100); //imitate query
      return currentUserStub;
    }
    catch (error) {
      throw new Error(error.message);
    }
  },
);

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {},
  extraReducers: {
    [getCurrentUser.fulfilled]: (state, {payload = {}}) => {
      return {...state, ...payload};
    },
    [getCurrentUser.rejected]: handleThunkError,
  }
});

export default currentUserSlice.reducer;
