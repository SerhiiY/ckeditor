import BaseCommentThreadView from '@ckeditor/ckeditor5-comments/src/comments/ui/view/basecommentthreadview.js';
import { eventEmitter } from 'utils/utils';
import { ButtonView } from 'ckeditor5/src/ui';

export default class CustomCommentThreadView extends BaseCommentThreadView {
    constructor( ...args ) {
        super( ...args );

        eventEmitter.on('removeCommentThread', (threadId) => {
            if(!threadId || (threadId && this._model.id === threadId)) {
                this.fire('removeCommentThread');
            }
        });


        // The template definition is partially based on the default comment thread view.
        const templateDefinition = {
            tag: 'div',

            attributes: {
                class: [
                    'ck-thread',
                    this.bindTemplate.if( 'isActive', 'ck-thread--active' )
                ],
                // Needed for managing focus after adding a new comment.
                tabindex: -1
            },

            children: [
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-thread__container'
                    },
                    children: [
                        this.commentsListView,
                        this.commentThreadInputView
                    ]
                }
            ]
        };

        // const isNewThread = this.length === 0;
        // const isAuthor = isNewThread || this._localUser === this._model.comments.get( 0 ).author;

        // Add the actions dropdown only if the local user is the author of the comment thread.
        // if ( isAuthor ) {
            templateDefinition.children.push(
                {
                    tag: 'div',
                    attributes: {
                        class: 'ck-thread-top-bar d-flex'
                    },

                    children: [
                        this._createRemoveButton(),
                        this._createEditButton(),
                        this._createResolveButton(),
                    ]
                }
            );
        // }

        this.setTemplate( templateDefinition );

        if ( this.length > 0 ) {
            this._modifyFirstCommentView();
        } else {
            this.listenTo( this.commentsListView.commentViews, 'add', evt => {
                this._modifyFirstCommentView();
                evt.off();
            } );
        }
    }

    _createResolveButton() {
        const resolveButtonModel = new ButtonView( this.locale );

        resolveButtonModel.set({
            class: 'resolve-thread-btn hidden',
            withText: true,
            label: 'Resolve',
            // icon: '<svg fill="#888" width="14" height="15" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M15.22 18.36c.18-.02.35-.1.46-.25a.6.6 0 00.11-.5l-1.12-5.32 4.12-3.66a.6.6 0 00.18-.65.63.63 0 00-.54-.42l-5.54-.6L10.58 2a.64.64 0 00-.58-.37.64.64 0 00-.58.37l-2.3 4.94-5.55.6a.63.63 0 00-.54.43.6.6 0 00.18.65l4.12 3.66-1.12 5.32c-.05.24.04.49.25.63.2.14.47.16.68.04L10 15.59l4.86 2.69c.1.06.23.09.36.08zm-.96-1.83l-3.95-2.19a.65.65 0 00-.62 0l-3.95 2.19.91-4.33a.6.6 0 00-.2-.58L3.1 8.64l4.51-.5a.64.64 0 00.51-.36L10 3.76l1.88 4.02c.09.2.28.34.5.36l4.52.5-3.35 2.98a.6.6 0 00-.2.58l.91 4.33z"/></svg>',
        })

        resolveButtonModel.bind( 'isEnabled' )
            .to( this._model, 'isReadOnly', isReadOnly => !isReadOnly );

    
        resolveButtonModel.on('execute', evt => {
            eventEmitter.dispatch('commentThreadResolved', this._model.id);
        }) 

        return resolveButtonModel;
    }

    _createEditButton() {
        const editButtonModel = new ButtonView( this.locale );

        editButtonModel.set({
            class: 'edit-thread-btn hidden',
            withText: true,
            // label: 'Edit',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15">
                <g fill="#888" fill-rule="evenodd">
                    <path d="M10.4 0L.948 9.455l2.834 2.837 9.454-9.455L10.401 0zM0 13.235h2.836L0 10.401v2.834zM0 15h9.706v-.882H0z"/>
                </g>
            </svg>`,
        })

        editButtonModel.bind( 'isEnabled' )
            .to( this._model, 'isReadOnly', isReadOnly => !isReadOnly );
    
            editButtonModel.on('execute', evt => {
            this.commentsListView.commentViews.get( 0 ).switchToEditMode();
        })

        return editButtonModel;
    }

    _createRemoveButton() {
        const removeButtonModel = new ButtonView( this.locale );

        removeButtonModel.set({
            class: 'remove-thread-btn hidden',
            withText: true,
            // label: 'Delete',
            icon: `<svg fill="#888" id="Layer_1" enable-background="new 0 0 510 510" height="15" viewBox="0 0 510 510" width="15" xmlns="http://www.w3.org/2000/svg"><g><path d="m240 240h30v165h-30z"/><path d="m180 240h30v165h-30z"/><path d="m300 240h30v165h-30z"/><path d="m450 60h-120v-15c0-24.813-20.186-45-45-45h-60c-24.814 0-45 20.187-45 45v15h-120v90h31.248l27.584 317.243c1.191 24.007 20.863 42.757 44.944 42.757h182.447c24.081 0 43.753-18.75 44.944-42.757l27.585-317.243h31.248zm-240-15c0-8.271 6.729-15 15-15h60c8.272 0 15 6.729 15 15v15h-90zm-120 45h330v30h-330zm271.211 375.624c-.336 8.061-6.919 14.376-14.987 14.376h-182.448c-8.068 0-14.651-6.314-14.987-14.376-29.348-337.707-27.341-314.616-27.429-315.624h267.28c-.08.905 1.788-20.569-27.429 315.624z"/></g></svg>`,
        })

        removeButtonModel.bind( 'isEnabled' )
            .to( this._model, 'isReadOnly', isReadOnly => !isReadOnly );

    
        removeButtonModel.on('execute', evt => {
            this.fire('removeCommentThread');
            eventEmitter.dispatch('commentThreadRemoved', this._model.id);
        })

        return removeButtonModel;
    }

    _modifyFirstCommentView() {
        // Get the first comment.
        const commentView = this.commentsListView.commentViews.get( 0 );

        // By default, the comment button is bound to the model state
        // and the buttons are visible only if the current local user is the author.
        // You need to remove this binding and make buttons for the first
        // comment always invisible.
        commentView.removeButton.unbind('isVisible');
        commentView.removeButton.isVisible = false;

        commentView.editButton.unbind('isVisible');
        commentView.editButton.isVisible = false;
    }
}
