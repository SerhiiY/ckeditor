import {Essentials} from '@ckeditor/ckeditor5-essentials/src/';
import {
  Bold, Italic, Strikethrough, Subscript, Superscript, Underline,
} from '@ckeditor/ckeditor5-basic-styles/src/';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph.js';
import {AutoLink, Link, LinkImage} from '@ckeditor/ckeditor5-link/src/';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote.js';
import {FontColor, FontSize} from '@ckeditor/ckeditor5-font/src/';
import {Heading} from '@ckeditor/ckeditor5-heading/src/';
import {
  ImageCaption, ImageResize, ImageStyle, ImageToolbar, AutoImage, ImageEditing,
} from '@ckeditor/ckeditor5-image/src/';
import ImageBlockEditing from '@ckeditor/ckeditor5-image/src/image/imageblockediting';
import ImageBlock from '@ckeditor/ckeditor5-image/src/imageblock';
import {List, ListStyle} from '@ckeditor/ckeditor5-list/src/';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import {
  Table, TableCellProperties, TableProperties, TableToolbar,
} from '@ckeditor/ckeditor5-table/src/';
import FindAndReplace from  '@ckeditor/ckeditor5-find-and-replace/src/findandreplace';
import Comments from '@ckeditor/ckeditor5-comments/src/comments.js';
import CommentsOnly from '@ckeditor/ckeditor5-comments/src/commentsonly';
import Users from '@ckeditor/ckeditor5-collaboration-core/src/users';
import {Alignment} from '@ckeditor/ckeditor5-alignment/src/';
import Indent from '@ckeditor/ckeditor5-indent/src/indent.js';
import IndentBlock from '@ckeditor/ckeditor5-indent/src/indentblock.js';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat.js';
import {
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersText,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
} from '@ckeditor/ckeditor5-special-characters/src/';
import {WordCount} from '@ckeditor/ckeditor5-word-count/src/';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';

import InsertImageButton from './buttons/InsertImageButton';
import CustomCommentsAdapter from './comments/CustomCommentsAdapter';
import CustomCommentView from './comments/CustomCommentView';
import CustomCommentThreadView from './comments/CustomCommentThreadView';


const plugins = [
  /* Default plugins */
  Essentials, Bold, Italic, Paragraph,

  /* Text styling */
  Underline, Strikethrough, Subscript, Superscript,

  /* Images */
  ImageEditing,
  ImageBlockEditing,
  ImageBlock,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageCaption,
  AutoImage,

  /* Links */
  LinkImage, Link, AutoLink,

  /* Font */
  FontColor, FontSize,

  /* Lists*/
  List, ListStyle,

  /* Premium features */
  /* Comments */
  CommentsOnly, Comments, Users, FileRepository,

  /* Other */
  WordCount, FindAndReplace,

  /* Characters (symbols) */
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersText,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,

  /* Tables */
  Table, TableCellProperties, TableProperties, TableToolbar,

  /* Other */
  Heading,
  Indent,
  IndentBlock,
  PasteFromOffice,
  RemoveFormat,
  Alignment,
  BlockQuote,

  /** Cutom plugins */
  InsertImageButton,
];

export const getEditorConfig = ({isCommentBtn, onUpdateWordCount}) => {
  const toolbarItems = [
    'heading', 'bold', 'italic', 'underline', 'strikethrough', 
    'subscript', 'superscript', 'fontcolor', 'fontsize',
    'bulletedList', 'numberedList',
    'insertTable', 'link', 'blockQuote', 'findAndReplace',
    'pasteFromOffice', 'indent', 'indentBlock', 'alignment',
    'specialCharacters', 'insertImageButton',
  ];

  if(isCommentBtn) toolbarItems.push('comment');

  return ({
    plugins,
    extraPlugins: [CustomCommentsAdapter],
    toolbar: {
      items: toolbarItems,
    },
    table: {
      contentToolbar: [ 'tableColumn', 'tableRow', 'mergeTableCells' ],
    },
    image: {
      styles: {
        options: [
          'alignLeft', 'alignCenter', 'alignRight', 'imageBlock'
        ],
      },
      toolbar: [
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        'imageResize', 'imageStyle', 'linkImage',
      ],
    },
    sidebar: [ 'bold', 'italic' ],
    licenseKey: '2ZMityaUcZFTNlt6wxB+Qe4dP9yf1nOuDevwTTmBrlhY+44G5ssmToQ=',
    cloudServices: {
      tokenUrl: process.env.REACT_APP_CKEDITOR_TOKEN_API,
    },
    comments: {
      CommentView: CustomCommentView,
      CommentThreadView: CustomCommentThreadView,
      editorConfig: {
        extraPlugins: [Link],
      }
    },
    wordCount: {
      onUpdate: onUpdateWordCount,
    },
    heading: {
      options: [
        { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1'},
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2'},
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
      ],
    },
  });
};
