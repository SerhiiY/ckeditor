import React from 'react';
import ReactTooltip from 'react-tooltip';
import { useSelector } from 'react-redux';

import {ReactComponent as DownloadSvg} from '../images/download.svg';
// import DownloadHoverSvg from 'assets/images/download-reverse.svg'
import WordCounter from 'components/WordCounter/WordCounter';

import styles from '../styles/CKEditorHeader.module.scss';

const CKEditorHeader = () => {
  return (
    <header id={styles.header}>
      <div id={styles.tools}>
        <WordCounter />
      </div>
    </header>
  );
};

export default CKEditorHeader;
