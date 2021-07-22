import { htmlToText } from 'html-to-text';

export const getWordsCountFromHtml = (html) => {
  const plainText = htmlToText(html);

  return !plainText ? 0 : (
    plainText
      .trim()
      .replace(/(^\[?https?.+?\]?$|\*)/, '')
      .split(/\s+/)
      .length
  );
};

export const getSelectedText = (_editor) => {
  const formatNode = (node) => {
    switch (node.parent.name) {
      case 'heading1': return `<h1>${node.data}</h1>`;
      case 'heading2': return `<h2>${node.data}</h2>`;
      case 'heading3': return `<h3>${node.data}</h3>`;
      case 'paragraph': return `<p>${node.data}</p>`;
      default: return '';
    }
  };
  const items = _editor.model.document.selection.getFirstRange().getItems();
  return [...items].filter(node => node.data).map(formatNode).join('\n');
}

export const insertToolbar = (editor) => {
  editor.ui.getEditableElement().parentElement.insertBefore(
    editor.ui.view.toolbar.element,
    editor.ui.getEditableElement()
  );
};

export const insertWordCounter = (editor) => {
  const wordCountPlugin = editor.plugins.get( 'WordCount' );
  const wordCountWrapper = document.getElementById( 'word-count' );

  wordCountWrapper?.appendChild( wordCountPlugin.wordCountContainer );
};

export const insertImage = ({imageUrl, _editor}) => {
  const content = `<img src="${imageUrl}" />`;
  const viewFragment = _editor.data.processor.toView(content);
  const modelFragment = _editor.data.toModel(viewFragment);
  
  _editor.model.insertContent(modelFragment);
};

export const getImageUrlListFromText = (text) => {
  return text.match(/src=\\?".+?"/g)?.map(el => el.replace(/src=\\?"|"/g, ''));
};

export const replaceContentImagesUrls = ({oldUrlList, newUrlList, content}) => {
  let _content = content;
  oldUrlList.forEach((el, index) => {
    _content = _content.replace(el, newUrlList[index])
  });
};
