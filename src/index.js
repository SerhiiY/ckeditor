import ReactDOM from 'react-dom';
import App from './components/App/App';
import store from 'redux/store';
import { Provider } from 'react-redux';
import './index.scss';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
	document.getElementById('root')
);
