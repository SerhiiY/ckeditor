export const toggleCommentInput = (isShow) => {
  const commentInput = document.querySelector('.ck-comment__input-container');
  commentInput?.classList[isShow ? 'remove' : 'add']('hidden');
}

export const toggleCommentButtons = ({commentId, isShow}) => {
  const commentNode = document.querySelector(`[data-comment-id="${commentId}"]`);
  const commentButtonsNode = commentNode?.querySelector('.ck-comment__actions');
  const method = isShow ? 'remove' : 'add';

  commentButtonsNode?.classList[method]('hidden');
}

export const toggleThreadButtons = (isShow) => {
  // const threadButtons = document.querySelector('.ck-thread-top-bar');
  const editButton = document.querySelector('.edit-thread-btn');
  const removeButton = document.querySelector('.remove-thread-btn');
  const method = isShow ? 'remove' : 'add';

  editButton?.classList[method]('hidden');
  removeButton?.classList[method]('hidden');
}

export const toggleThreadResolved = (isResolved) => {
  const resolveBtn = document.querySelector('.resolve-thread-btn');
  const threadNode = document.querySelector('.ck-thread');

  if(resolveBtn) {
    resolveBtn.classList[isResolved ? 'add' : 'remove']('resolved');
    resolveBtn[`${isResolved ? 'set' : 'remove'}Attribute`]('disabled', 'true');
    resolveBtn.textContent = isResolved ? 'RESOLVED' : 'RESOLVE';
  }

  threadNode?.classList[isResolved ? 'add' : 'remove']('resolved');
}

export const toggleResolvedButton = (isShow) => {
  const resolveBtn = document.querySelector('.resolve-thread-btn');
  const method = isShow ? 'remove' : 'add';

  resolveBtn?.classList[method]('hidden');
}

export const toggleEditModeStyles = (isEditMode) => {
  const toolbar = document.querySelector('.ck-toolbar');
  toolbar?.classList[isEditMode ? 'remove' : 'add']('hidden');
  
  const content = document.querySelector('.ck-content');
  content.classList[!isEditMode ? 'remove' : 'add']('edit-mode');

  const ckeditorContainer = document.getElementById('ckeditorContainer');
  ckeditorContainer.classList[!isEditMode ? 'remove' : 'add']('edit-mode');
};

export const enableHeadingButton = () => {
  const heading = document.querySelector('.ck-heading_heading1');
  heading?.removeAttribute('disabled');
}

export const toggleCommentMarkers = (currentThreads) => {
  Object.keys(currentThreads).forEach(threadId => {
    if(currentThreads[threadId].isResolved) {
      toggleCommentMarkerResolved(threadId);
    }
  })
}

export const toggleCommentMarkerResolved = (threadId) => {
  const commentMarker = document.querySelector(`[data-comment="${threadId}"]`);

  commentMarker?.setAttribute('data-resolved', true);
}
