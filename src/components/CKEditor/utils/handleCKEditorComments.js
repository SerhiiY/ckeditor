import { eventEmitter } from "utils/utils";
import {
  toggleCommentButtons,
  toggleCommentInput,
  toggleResolvedButton,
  toggleThreadButtons,
  toggleThreadResolved,
} from "./handleCKEditorStyles";

export const mapComments = (comments) => {
  return comments?.map(comment => ({
    ...comment,
    authorId: String(comment.authorId),
    commentId: comment.id,
    createdAt: comment.updatedAt
  }));
};

export const initCurrentUser = ({currentUser, _editor}) => {
  if(!currentUser?.id || !_editor) return;

  const {id, firstName, lastName, avatarPath, defaultAvatar} = currentUser;
  const userId = String(id);
  const usersPlugin = _editor.plugins.get('Users');

  if(!usersPlugin.getUser(userId)) { // if user not added yet
    usersPlugin.addUser({
      id: userId,
      name: `${firstName} ${lastName}`.trim(),
      avatar: avatarPath ? `${window.location.origin}${avatarPath}` : defaultAvatar
    }); // Add current user data to be able create thread/comment  
  }

  if(!usersPlugin.me) { // if current user not added yet  
    usersPlugin.defineMe(userId); // Define current user
  }
};

export const initUsers = ({usersList, _editor}) => {
  if (!usersList?.length || !_editor) return;

  const usersPlugin = _editor.plugins.get('Users');

  usersList.forEach(user => {
    const userId = String(user.id);

    if(!usersPlugin.getUser(userId)) { // if user not added yet
      usersPlugin.addUser({...user, id: userId});
    }
  });
};

/** threads: <{threadId: [...commentsList]}> */
export const checkCommentsState = ({isEditMode, commentList}) => {
  /* Check all comments state to show/hide action buttons 
  ** If project was submitted, all comments state changes from 'pending' to 'submitted_by_...'
  ** In this case, we find comment node by data-comment-id and hide all action buttons inside
  */
  commentList.forEach(comment => {
    toggleCommentButtons({
      commentId: comment.id,
      isShow: (comment.state === 'pending' && isEditMode)
    });
  });
};

export const removeCommentThreadFromContent = (threadId) => {
  eventEmitter.dispatch('removeCommentThread', threadId);
}

export const updateMarker = ({_editor, threadId}) => {
  _editor?.model.change(writer => {
    const marker = [..._editor.model.markers._markers.keys()].find(el => el.match(String(threadId)));
    writer.updateMarker(marker);
  })      
}

export const changeActiveCommentThread = ({activeThread, currentThreads, isEditMode, currentUser}) => {
  if(!activeThread) return;

  // const isWriter = currentUser.role === 'writer';
  const {isResolved, comments} = currentThreads[activeThread.id] || {};
  const {state: firstCommentState} = comments?.[0] || {};
  const firstComment = activeThread.comments._items[0];
  console.log('comments?.[0]', comments?.[0])
  toggleThreadResolved(isResolved);
  toggleResolvedButton(!!firstComment);
  toggleCommentInput(!firstComment);
  toggleThreadButtons(firstCommentState === 'pending' && isEditMode);
};
