import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { eventEmitter } from 'utils/utils';

export default class InsertImageButton extends Plugin {
  init() {
    const editor = this.editor;

    editor.ui.componentFactory.add('insertImageButton', locale => {
      const button = new ButtonView(locale);

      const isReadOnly = this.editor.plugins.get( 'CommentsOnly' ).isEnabled;

      button.set({
        class: isReadOnly ? 'disabled' : '',
        id: 'image-button',
        label: 'Insert image',
        icon: `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
            <path fill="#484B4C" fill-rule="evenodd" d="M13.107 3.393c.167.167.31.393.429.678.119.286.178.548.178.786v10.286c0 .238-.083.44-.25.607a.827.827 0 0 1-.607.25h-12a.827.827 0 0 1-.607-.25.827.827 0 0 1-.25-.607V.857C0 .62.083.417.25.25A.827.827 0 0 1 .857 0h8c.238 0 .5.06.786.179.286.119.512.261.678.428l2.786 2.786zM9.143 1.214v3.357H12.5c-.06-.172-.125-.294-.196-.366L9.509 1.411c-.072-.072-.194-.137-.366-.197zm3.428 13.643V5.714H8.857a.827.827 0 0 1-.607-.25.827.827 0 0 1-.25-.607V1.143H1.143v13.714H12.57zm-1.142-4v2.857H2.286V12L4 10.286l1.143 1.143L8.57 8l2.858 2.857zM4 9.143c-.476 0-.881-.167-1.214-.5a1.653 1.653 0 0 1-.5-1.214c0-.477.166-.881.5-1.215.333-.333.738-.5 1.214-.5s.881.167 1.214.5c.334.334.5.738.5 1.215 0 .476-.166.88-.5 1.214-.333.333-.738.5-1.214.5z"/>
          </svg>
        `,
        tooltip: true
      });

      // Callback executed once the image is clicked.
      button.on('execute', () => {
        eventEmitter.dispatch('openImageBrowser');
      });

      return button;
    });
  };
};
