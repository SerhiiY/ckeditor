import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import WordCounter from 'components/WordCounter/WordCounter';
import { setCKEditorCurrentProjectTitle } from 'redux/reducers/ckeditor';

import styles from '../styles/CKEditorTopBar.module.scss';

const CKEditorTopBar = ({isEditMode, isHistoryMode, currentTitle}) => {
  const dispatch = useDispatch();

  const handleTitleChange = useCallback((e) => {
    dispatch(setCKEditorCurrentProjectTitle(e.target.value));
  }, []); // eslint-disable-line

  return !isEditMode ? (
    <>
      <header id={styles.header}>
        <div id={styles.tools}>
          <WordCounter />
        </div>
      </header>

      <h1 className="m-b-10 m-t-10">{currentTitle}</h1>
    </>
  ) : (
    <div className="d-flex content-space-between w-100 p-t-15 p-b-15">
      <div className={styles.titleContainer}>
        <div>
          <span className={styles['suggested-title']}>Suggested Title </span>
          <span className={styles['suggested-subtitle']}>(remember to include focus keyword)</span>
        </div>
        <input
          className={styles.titleInput}
          type="text"
          value={currentTitle}
          onChange={handleTitleChange}
        />
      </div>

      <WordCounter />
    </div>
  );
};

export default CKEditorTopBar;
