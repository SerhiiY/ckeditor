import Loader from "react-loader-spinner";
import styles from './Spinner.module.scss';

const Spinner = ({
  className = '',
  style = {},
  text = '',
  width = 38,
  height = 38,
  color = "#896ca8",
  ...rest
}) => {

  return (
    <div className={`${styles.spinnerContainer} ${className}`} style={style}>
      <Loader
        className={styles.spinner}
        type="Oval"
        color={color}
        height={height}
        width={width}
        {...rest}
      />
      {text && <span className="m-l-10 color-purple">{text}</span>}
    </div>
  );
};

export default Spinner;
