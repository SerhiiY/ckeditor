import { eventEmitter } from 'utils/utils';

class CustomCommentsAdapter {
  constructor(editor) {
    this.editor = editor;
  }

  init() {
    const commentsRepositoryPlugin = this.editor.plugins.get('CommentsRepository');
    
    // Set the adapter on the `CommentsRepository#adapter` property.
    commentsRepositoryPlugin.adapter = {
      addComment(data) {
        // Exec event to take comment for handling in react
        eventEmitter.dispatch('commentAdded', data); 

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        // When the promise resolves with the comment data object, it
        // will update the editor comment using the provided data.
        return Promise.resolve({
          createdAt: new Date(),
        });
      },

      updateComment(data) {
        eventEmitter.dispatch('commentUpdated', data); 

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      removeComment(data) {
        eventEmitter.dispatch('commentRemoved', data); 

        // Write a request to your database here. The returned `Promise`
        // should be resolved when the request has finished.
        return Promise.resolve();
      },

      removeCommentThread(data) {
        eventEmitter.dispatch('commentRemoved', data); 
        return Promise.resolve();
      },

      getCommentThread({threadId}) {  
        return new Promise((resolve, reject) => {
          eventEmitter.dispatch('getCommentThreadFromReduxForCK', {
            threadId,
            resolve,
            reject,
          });
        });
      },
    };
  };
};

export default CustomCommentsAdapter;
