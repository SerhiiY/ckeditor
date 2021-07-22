import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  error as errorToast,
} from 'react-toastify-redux';

import { commentsStub, handleThunkError } from './utils/reducersUtils';
import { sleep } from 'utils/utils';
const initialState = {
  isDataReceived: false,
  threads:        {}, // {threadId: {comments: [], isResolved: bool}}
  currentThreads: {}, // threads currently used by CK
  usersList:      [], // list of obj with users data for comments
};

export const getCommentsData = createAsyncThunk(
  'comments/getCommentsData',
  async (args) => {
    try {
      await sleep(100) //imitate query

      const {threads, users} = commentsStub.data;
      const threadsObj = {};
      // const nonDeletedThreads = threads.filter(({comments}) => comments[0].state !== "deleted_by_customer");

      threads.forEach(({comments, threadId}) => {
        threadsObj[threadId] = {isResolved: comments[0].state === 'resolved_by_writer', comments};
      });

      return {threads: threadsObj, usersList: users, isDataReceived: true};
    }
    catch (error) {
      throw new Error(error.message);
    }
  }
);

export const resolveThread = createAsyncThunk(
  'comments/resolveThread',
  async ({threadId, onSuccess, onError}, {dispatch, getState}) => {
    try {
      await sleep(100); //imitate query
      onSuccess?.();
      return threadId;
    }
    catch (error) {
      throw new Error(error.message);
    }
  }
)

export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({comment, isUpdate, onSuccess, onError}, {dispatch, getState}) => {
    try {
      await sleep(100); //imitate query

      if(!isUpdate) {
        dispatch(setPostedComment({...comment, state: 'pending'}));
        onSuccess?.();
      } 
      else {
        dispatch(setUpdatedComment(comment));
      }
    }
    catch (error) {
      dispatch(errorToast(`Comment saving failed: ${error.message}`));
      onError?.();
      throw new Error(error.message);
    }
  }
)

export const removeThread = createAsyncThunk(
  'comments/removeThread',
  async (threadId, {dispatch, getState}) => {
    try {
      await sleep(100); //imitate query
      return threadId; 
    }
    catch (error) {
      dispatch(errorToast(`Comment removing failed: ${error.message}`));
      throw new Error(error.message);
    }
  }
)

export const removeAllCurrentThreads = createAsyncThunk(
  'comments/removeAllCurrentThreads',
  async ({onSuccess, onError} = {}, {dispatch, getState}) => {
    try {
      await sleep(100); //imitate query
      onSuccess?.();
    }
    catch (error) {
      onError?.(error.message);
      errorToast('Failed removing comments');
      throw new Error(error.message);
    }
  }
)

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setPostedComment(state, {payload: postedComment = {}}) {
      const {threadId} = postedComment;
      const thread = state.threads[threadId];

      if(!thread) {
        state.threads[threadId] = {comments: [postedComment]};
      }
      else {
        state.threads[threadId].comments = [...thread.comments, postedComment];
      }

      state.currentThreads[threadId] = state.threads[threadId];
    },

    setUpdatedComment(state, {payload: updatedComment = {}}) {
      const {commentId, threadId} = updatedComment;
      const {comments} = state.threads[threadId];

      const commentIndex = comments.findIndex(el => el.commentId === commentId);

      if(commentIndex > -1) {
        state.threads[threadId].comments[commentIndex] = {
          ...comments[commentIndex],
          ...updatedComment,
        };
      }

      state.currentThreads[threadId] = state.threads[threadId];
    },

    addCurrentThread(state, {payload: threadId}) {
      state.currentThreads[threadId] = state.threads[threadId];
    },  
  },

  extraReducers: {

    [getCommentsData.fulfilled]: (state, {payload}) => {
      return {...state, ...payload};
    },

    [resolveThread.fulfilled]: (state, {payload: threadId}) => {
      state.threads[threadId].isResolved = true;
      state.currentThreads[threadId].isResolved = true;
    },

    [removeThread.fulfilled]: (state, {payload: threadId}) => {
      state.threads[threadId].comments[0].state = 'deleted_by_customer';
      delete state.currentThreads[threadId];
    },

    [postComment.fulfilled]: (state, {payload}) => {},

    [getCommentsData.rejected]: handleThunkError,
    [removeThread.rejected]: handleThunkError,
    [postComment.rejected]: handleThunkError,
    [resolveThread.rejected]: handleThunkError,
  }
});

export const {
  setPostedComment,
  setUpdatedComment,
  addCurrentThread,
} = commentsSlice.actions;

export default commentsSlice.reducer;
