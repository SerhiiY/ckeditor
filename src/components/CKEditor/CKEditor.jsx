import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CKEditorTopBar from './components/CKEditorTopBar';
import CKEditorRoot from './components/CKEditorRoot';
import Spinner from 'components/common/Spinner/Spinner';
import {
  fetchCKEditorData, toggleCKEditorEditMode,
} from 'redux/reducers/ckeditor';
import { getCurrentUser } from 'redux/reducers/currentUser';

import styles from './styles/CKEditor.module.scss';
import './styles/CKEditor.scss';
import ErrorBox from 'components/common/ErrorBox/ErrorBox';

const CKEditor = () => {
  const dispatch = useDispatch();

  /* CKEditor instance */
  const [_editor, set_editor] = useState(null);
  const [isEditorError, setIsEditorError] = useState(false);

  const { 
    content,
    currentTitle,
    isCKEditorDataFetching,
    isCKEditorDataReceived,
    isEditMode,
  } = useSelector(state => state.ckeditor);

  const commentsSelector = useSelector(state => state.comments);
  const currentUser = useSelector(state => state.currentUser)

  useEffect(() => {
    dispatch(fetchCKEditorData());
    dispatch(getCurrentUser());
    dispatch(toggleCKEditorEditMode(true));
  }, []); // eslint-disable-line

  const isRenderCK = commentsSelector.isDataReceived && !!currentUser.id && isCKEditorDataReceived;

  return (
    <div id="ckeditorContainer" className="reactContainer">        
      <CKEditorTopBar
        currentTitle={currentTitle}
        isEditMode={isEditMode}
      />

      <div className={styles.ckeditorWrapper}>        
        {isRenderCK && 
          <CKEditorRoot
            currentUser={currentUser}
            commentsSelector={commentsSelector}
            _editor={_editor}
            set_editor={set_editor}
            isEditorError={isEditorError}
            setIsEditorError={setIsEditorError}
            content={content}
            isEditMode={isEditMode}
          />
        }

        {(isCKEditorDataFetching || !_editor) && !isEditorError && 
          <Spinner className={styles.fetchingSpinner}/>
        }

        {isEditorError &&
          <ErrorBox text="Internal CKEditor error" />
        }
      </div>
    </div>
  );
};

export default CKEditor;
