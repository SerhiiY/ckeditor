import React from 'react';
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CKEditor from 'components/CKEditor/CKEditor';
import styles from './App.module.scss';
import './App.scss';

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route component={CKEditor} path='/' />
        </Switch>
      </Router>

      <ToastContainer
        position={toast.POSITION.BOTTOM_LEFT}
        className={styles.toastContainer} 
        toastClassName={styles.toast}
        limit={2}
      />
    </div>
  );
}

export default App;
