import React from 'react';
import ReactDOM from 'react-dom';
import initLibraries from "@egovernments/digit-ui-libraries";

import "./index.css";
import App from './App';

initLibraries();

const citAuth = "c54c09cd-56c5-4193-a59d-76c3867500c8";

window.Digit.SessionStorage.set("citizen.token", citAuth);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

