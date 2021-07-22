import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './WordCounter.module.scss';

const wordCountMin = 250;

const WordCounter = ({
  radius                = 20,
  strokeWidth           = 3,
}) => {
  const { currentWordsCount: wordsCount, isEditMode } = useSelector(state => state.ckeditor);
  
  const [currentWordsCount, setCurrentWordsCount] = useState(wordsCount);
  const [isBouncy, setIsBouncy] = useState(false);

  useEffect(() => {
    const diff = Math.abs(wordsCount - currentWordsCount);
    setIsBouncy(diff < wordCountMin && diff > (wordCountMin / 4));
    setCurrentWordsCount(wordsCount);
  }, [wordsCount]) // eslint-disable-line


  const svgSize = 2 * (radius + strokeWidth);
  const circumference = 2 * radius * Math.PI;
  const dashOffset = (1 - wordsCount / wordCountMin) * circumference;
  const bouncyStyle = isBouncy ? styles.bouncy : "";
  const alertStyle = wordsCount > wordCountMin ? styles.alert : "";

  return (
    <div
      id={styles.default}
      className={`${styles.default} ${bouncyStyle} ${alertStyle}`}
    >
      {/* <div id="word-count"></div> */}

      <div className={styles.container}>
        <div className={styles.circles}>
          {isEditMode &&
            <svg height={svgSize} width={svgSize}>
              <circle
                className={styles['background-circle']}
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                strokeWidth={strokeWidth}
              />

              <circle
                className={styles['dynamic-circle']}
                cx={radius + strokeWidth}
                cy={radius + strokeWidth}
                r={radius}
                strokeDasharray={circumference}
                strokeDashoffset={alertStyle ? 0 : dashOffset}
                strokeWidth={strokeWidth}
              />
            </svg>
          }
        </div>

        <div className={styles.counter}>
          <span className={styles.words}>{wordsCount}/{wordCountMin}</span>
          <span className={styles.text}>Words</span>
        </div>
      </div>
    </div>
  );
};

WordCounter.propTypes = {
  maxWords:         PropTypes.number,
  radius:           PropTypes.number,
  strokeWidth:      PropTypes.number,
  wordsCount:       PropTypes.number,
  roundProgressBar: PropTypes.bool,
};

export default WordCounter;
