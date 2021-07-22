import PropTypes from 'prop-types';
import React from 'react';
import Spinner from '../Spinner/Spinner';
import './Button.scss';

const Button = ({
  isHidden  = false,
  className = 'fe-editor-btn-save',
  onClick   = () => {},
  disabled  = false,
  text,
  children,
  style,
  isLoading,
}) => {
  return isHidden ? null : (
    <button
      className={className}
      onClick={onClick}
      type="button"
      disabled={disabled || isLoading}
      style={style}
    >
      {!isLoading && children}
      {!isLoading && text}
      {isLoading && <Spinner color='#fff'/>}
    </button>
  );
};

export default Button;

Button.propTypes = {
  hide:      PropTypes.bool,
  className: PropTypes.string,
  onClick:   PropTypes.func,
  disabled:  PropTypes.bool,
};
