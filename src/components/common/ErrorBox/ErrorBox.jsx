import React from 'react';
import styles from './ErrorBox.module.scss';
import {ReactComponent as WarningSvg} from 'assets/images/warning-material.svg';

const ErrorBox = ({text}) => {
  return (
    <div className={styles.errorBox}>
      <div className="centered">
        <WarningSvg width="50" height="50"/>
        <p>{text}</p>
      </div>
    </div>
  )
}

export default ErrorBox;
