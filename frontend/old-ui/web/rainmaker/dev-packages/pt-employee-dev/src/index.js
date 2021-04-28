// support for older browsers
import "babel-polyfill";
import "url-search-params-polyfill";
import "rainmaker-employee/src/webview/web-share-shim.bundle.min";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";

// sms listener
import "rainmaker-employee/src/webview/sms";

import App from "./App";
import store from "redux/store";
import theme from "rainmaker-employee/src/config/theme";
import themeNew from "rainmaker-employee/src/config/themeNew";

// import injectTapEventPlugin from "react-tap-event-plugin";
//Web font loader
import WebFont from "webfontloader";
// styles
import "egov-ui-kit/assets/styles/bootstrap-customized.css";
import "egov-ui-kit/assets/styles/app.css";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles"; // v1.x
import { MuiThemeProvider as V0MuiThemeProvider } from "material-ui";

const muiThemeV0 = getMuiTheme(theme);
const themeVX = createMuiTheme(themeNew);
// to eliminate the click delay
// injectTapEventPlugin();

// load material icons
WebFont.load({
  google: {
    families: ["Material+Icons", "Roboto"]
  }
});

// move it to a env file
window.basename = process.env.NODE_ENV === "production" ? "/employee" : "";
// hardcoded the base; to be changed soon!!!!!
render(
  <Provider store={store}>
    <MuiThemeProvider theme={themeVX}>
      <V0MuiThemeProvider muiTheme={muiThemeV0}>
        <Router basename={window.basename}>
          <App />
        </Router>
      </V0MuiThemeProvider>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
