import React, { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { error as errorToast } from 'react-toastify-redux';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import { DecoupledEditor } from '@ckeditor/ckeditor5-editor-decoupled/src/';

import { getEditorConfig } from '../config/ckeditorConfig';
import { eventEmitter, sleep } from 'utils/utils';
import {
  postComment,
  removeThread,
  resolveThread,
  addCurrentThread,
} from 'redux/reducers/comments';

import {
  getSelectedText, insertToolbar,
} from '../utils/CKEditorUtils';

import {
  setCKEditorCurrentContent,
  setCKEditorCurrentWordsCount,
} from 'redux/reducers/ckeditor';

import {
  toggleThreadResolved,
  toggleThreadButtons,
  toggleCommentInput,
  toggleEditModeStyles,
  toggleResolvedButton,
} from '../utils/handleCKEditorStyles';

import {
  mapComments,
  initCurrentUser,
  initUsers,
  removeCommentThreadFromContent,
  changeActiveCommentThread,
  updateMarker,
} from '../utils/handleCKEditorComments';

let wordsCount = 0;
let commentThreads = {};

const CKEditorRoot = ({
  _editor, set_editor,
  isEditorError, setIsEditorError,
  currentUser,
  commentsSelector: {usersList, threads, currentThreads},
  content,
  isEditMode,
}) => {
  const dispatch = useDispatch();


  /* TOGGLE CKEDITOR EDIT MODE */
  useEffect(() => {
    if (!_editor) return;

    if(Object.keys(currentThreads).length) {
      _editor.plugins.get('CommentsOnly').isEnabled = !isEditMode;
      _editor.isReadOnly = false;
    }
    else {
      _editor.isReadOnly = !isEditMode;
    }
  }, [_editor, isEditMode, currentThreads]);


  /** ------------------ COMMENTS -------------------
  Init events for dialog between CK and react/redux */

  /* INIT COMMENT THREAD DATA */
  useEffect(() => {
    const getCommentThreadFromReduxForCK = async ({threadId, resolve, reject}) => {        
      await sleep(1000); // wait for users inited
      dispatch(addCurrentThread(threadId));
      resolve({threadId, comments: mapComments(threads[threadId].comments)});
    };

    eventEmitter.on('getCommentThreadFromReduxForCK', getCommentThreadFromReduxForCK);
    return () => eventEmitter.off('getCommentThreadFromReduxForCK');
  }, []); //eslint-disable-line


  /* CHANGE ACTIVE COMMENT THREAD */
  useEffect(() => {
    if(!Object.keys(currentThreads)?.length || !_editor) return;

    const onChangeActiveCommentThread = async (evt, propName, activeThread) => {
      changeActiveCommentThread({activeThread, currentThreads, isEditMode, currentUser});
    };
  
    const commentsRepository = _editor.plugins.get('CommentsRepository');

    const subscribe = (method) => {
      commentsRepository[method]('change:activeCommentThread', onChangeActiveCommentThread);
    }

    subscribe('on');
    return () => subscribe('off');
  }, [_editor, currentThreads, isEditMode]); //eslint-disable-line


  /* COMMENT/THREAD ACTIONS */
  useEffect(() => {
    if(!_editor) return;
    
    const onCommentUpdated = (comment) => {
      dispatch(postComment({comment, isUpdate: true}))
    };

    const onCommentThreadRemoved = async (threadId) => {
      await sleep(500); // wait for comment marker to be removed from content
      const data = await _editor.getData();
      dispatch(setCKEditorCurrentContent(data));
      dispatch(removeThread(threadId));
    };

    const onCommentThreadResolved = (threadId) => {
      dispatch(resolveThread({
        threadId,
        onSuccess: () => {
          toggleThreadResolved(true);
          const thread = {...commentThreads[threadId]};
          thread.isResolved = true;
          commentThreads = {...commentThreads, [threadId]: thread};
          updateMarker({_editor, threadId});
        },
        onError: () => removeCommentThreadFromContent(threadId)
      }));
    };

    const onCommentAdded = async (comment) => {
      toggleCommentInput(false);
      await sleep(500); // wait for comment marker to be set to content
      const data = await _editor.getData();
      dispatch(setCKEditorCurrentContent(data));
      dispatch(postComment({
        comment: {...comment, selection: getSelectedText(_editor), data},
        onSuccess: () => {
          toggleThreadButtons(true);
          toggleResolvedButton(true);
          updateMarker({_editor, threadId: comment.threadId});
        },
        onError: () => eventEmitter.dispatch('removeCommentThread', comment.threadId),
      }));
    };

    // const onPaste = async (e) => {
      // const text = e.clipboardData.getData('text/html');
      // const urlList = getImageUrlListFromText(text);
      // const fileList = await urlListToFileList(urlList);
      // dispatch(setUploadingFiles(fileList));
      // dispatch(uploadFiles({
      //   onSuccess: (uploadedFileList) => {
      //     const uploadedUrlList = uploadedFileList.map(el => el.imageUrl);
      //     const newContent = replaceContentImagesUrls({
      //       oldUrlList: urlList,
      //       newUrlList: uploadedUrlList,
      //       content: currentContent,
      //     });

      //     dispatch(setCKEditorCurrentContent(newContent));
      //     _editor.setData(newContent);
      //   },
      //   onError: (err) => dispatch(errorToast(`Filed to load some images: ${err}`))
      // }));
    // }
  
    const subscribe = (method) => {
      eventEmitter[method]('commentUpdated', onCommentUpdated);
      eventEmitter[method]('commentThreadRemoved', onCommentThreadRemoved);
      eventEmitter[method]('commentThreadResolved', onCommentThreadResolved);
      eventEmitter[method]('commentAdded', onCommentAdded);
      
      // const ckContent = document.querySelector('.ck-content');
      // ckContent?.[`${method === 'on' ? 'add' : 'remove'}EventListener`]('paste', onPaste);
    };
    
    subscribe('on');
    return () => subscribe('off');
  }, [dispatch, _editor]);
  /*------------------ end comments -------------------*/


  const onCKError = useCallback(({ willEditorRestart, data }) => {
    setIsEditorError(true);
    dispatch(errorToast('CKEditor internal error'));
    console.log('CKEditor internal error', data);
    if (willEditorRestart) _editor?.ui.view.toolbar.element.remove();
  }, [_editor]); //eslint-disable-line


  const onCKReady = useCallback(editor => {
    if (_editor || isEditorError) return;
    initUsers({usersList, _editor: editor});         // for comments
    initCurrentUser({currentUser, _editor: editor}); // for comments
    insertToolbar(editor);
    // document.querySelector('#toolbarContainer').appendChild(editor.ui.view.toolbar.element);
    toggleEditModeStyles(isEditMode);

    commentThreads = threads;
    
    editor.conversion.for('editingDowncast').markerToHighlight({
      model: 'comment',
      view: ({markerName}) => { 
        const [, id] = markerName.split(':');

        return !commentThreads[id] ? null : {
          classes: `ck-comment-marker`,
          attributes: {
            'data-resolved': !!commentThreads[id].isResolved,
            'data-comment': id,
          }
        }
      },
      converterPriority: 'high',
    });

    if(content) editor.setData(content);  // Set saved content
    set_editor(editor);                   // set editor's instance
  }, [dispatch, _editor, isEditorError]); //eslint-disable-line


  // useEffect(() => {
  //   DecoupledEditor
  //     .create(document.getElementById('decoupledEditor'), 
  //       getEditorConfig({
  //         isCommentBtn: currentUser.role !== 'writer', 
  //         onUpdateWordCount: (e) => {
  //           if(wordsCount === e.words) return;
  //           wordsCount = e.words;
  //           dispatch(setCKEditorCurrentWordsCount(e.words));
  //         }
  //       })
  //     )
  //     .then(editor => {
  //       onCKReady(editor);
  //     })
  //     .catch( error => {
  //       setIsEditorError(true);
  //       dispatch(errorToast('CKEditor internal error'));
  //       console.log('CKEditor internal error', error.message);
  //     });
  // }, []); //eslint-disable-line


  return (
    // <div>
    //   <div id="toolbarContainer"></div>
    //   <div id="decoupledEditor"></div>
    // </div>

    <CKEditor
      editor={DecoupledEditor}
      config={getEditorConfig({
        isCommentBtn: currentUser.role !== 'writer',
        onUpdateWordCount: (e) => {
          if(wordsCount === e.words) return;
          wordsCount = e.words;
          dispatch(setCKEditorCurrentWordsCount(e.words));
        }
      })}
      data={content}
      onReady={onCKReady}
      onError={onCKError}
    />
  );
};

export default CKEditorRoot;
