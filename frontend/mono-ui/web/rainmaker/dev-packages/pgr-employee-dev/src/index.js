// support for older browsers
import "babel-polyfill";
import "url-search-params-polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
// sms listener
// import "./webview/sms";

import App from "./App";
import store from "./redux/store";
import theme from "./config/theme";
import injectTapEventPlugin from "react-tap-event-plugin";
//Web font loader
import WebFont from "webfontloader";
// styles
import "egov-ui-kit/assets/styles/bootstrap-customized.css";
import "egov-ui-kit/assets/styles/app.css";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

const muiTheme = getMuiTheme(theme);

// to eliminate the click delay
// injectTapEventPlugin();

// load material icons
WebFont.load({
  google: {
    families: ["Material+Icons", "Roboto"]
  }
});

// move it to a env file
window.basename = process.env.NODE_ENV === "production" ? "/citizen" : "";
// hardcoded the base; to be changed soon!!!!!
render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={muiTheme}>
      <Router basename={window.basename}>
        <App />
      </Router>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
