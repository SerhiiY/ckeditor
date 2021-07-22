
import { combineReducers } from 'redux';
import { toastsReducer as toasts } from 'react-toastify-redux';

import ckeditor from './ckeditor';
import currentUser from './currentUser';
import comments from './comments';

export default combineReducers({
  toasts,
  ckeditor,
  currentUser,
  comments,
});
