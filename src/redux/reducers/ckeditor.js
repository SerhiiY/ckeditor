import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  error as errorToast,
  // success as successToast,
} from 'react-toastify-redux';
import { sleep } from 'utils/utils';
import { contentStub, handleThunkError } from './utils/reducersUtils';
import { getCommentsData } from './comments';

const initialState = {
  isEditMode: false,
  isCKEditorDataFetching: false,
  isCKEditorDataReceived: false,

  title: '',
  content: '',
  rawData: {},

  currentTitle: '',
  currentContent: '',
  currentWordsCount: 0,
};

// Async reducers (actions) //
export const fetchCKEditorData = createAsyncThunk(
  'ckeditor/fetchCKEditorData', // action name (type)
  async (args, {dispatch}) => {
    try {
      dispatch(toggleCKEditorDataFetching(true));
      await sleep(100); // imitate query
      dispatch(toggleCKEditorDataFetching(false));
      dispatch(getCommentsData());
      dispatch(toggleCKEditorDataReceived(true));

      return {
        content: contentStub,
        currentContent: contentStub,
        title: 'Some title',
        currentTitle: 'Some title',
      }; // [fetchCKEditorData.fulfilled] - set EDITOR DATA to ckeditor reducer
    }
    catch (error) {
      dispatch(toggleCKEditorDataFetching(false));
      dispatch(errorToast('Failed to fetch ckeditor data'));
      throw new Error(error.message); // [fetchCKEditorData.rejected]
    }
  },
);


// REDUCER //
const ckeditorSlice = createSlice({
  name: 'ckeditor', // actions names (types) prefix
  initialState,

  reducers: {

    toggleCKEditorEditMode(state, {payload}) {
      state.isEditMode = payload;
    },

    toggleCKEditorDataFetching(state, {payload}) {
      state.isCKEditorDataFetching = payload;
    },

    toggleCKEditorDataReceived(state, {payload}) {
      state.isCKEditorDataReceived = payload;
    },

    setCKEditorCurrentProjectTitle(state, { payload = '' }) {
      state.currentTitle = payload;
    },

    setCKEditorCurrentContent(state, { payload = '' }) {
      state.currentContent = payload;
    },

    setCKEditorCurrentWordsCount(state, { payload = 0 }) {
      state.currentWordsCount = payload;
    },

    setCKEditorRawData(state, payload = {}) {
      state.rawData = {...state.rawData, ...payload};
    }
  },

  extraReducers: {

    [fetchCKEditorData.fulfilled]: (state, { payload }) => {
      return { ...state, ...payload };
    },
    [fetchCKEditorData.rejected]: handleThunkError,
  }
});

export const {
  toggleCKEditorEditMode,
  setCKEditorCurrentProjectTitle,
  setCKEditorCurrentContent,
  setCKEditorCurrentWordsCount,
  toggleCKEditorDataFetching,
  toggleCKEditorDataReceived,
  setCKEditorRawData,
} = ckeditorSlice.actions;

export default ckeditorSlice.reducer;
