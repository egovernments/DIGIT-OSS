import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import themeObject from "ui-config/themes";
import { Provider } from 'react-redux';
import store from 'ui-redux/store';
import './index.css';
import App from 'ui-views/App';
// import registerServiceWorker from './registerServiceWorker';
import Amplify from "aws-amplify";
import config from "./awsConfig";

const theme = createMuiTheme(themeObject);



Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "notes",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});


ReactDOM.render(<MuiThemeProvider theme={theme}><Provider store={store}><Router><App /></Router></Provider></MuiThemeProvider>, document.getElementById('root'));
// registerServiceWorker();
