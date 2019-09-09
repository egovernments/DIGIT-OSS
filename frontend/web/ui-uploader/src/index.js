import React from "react";
import ReactDOM from "react-dom";
// import "./styles/bootstrap-grid.css";
import "./styles/app.css";
import "./index.css";
import App from "./app";
import store from "./redux/store";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { grey300 } from "material-ui/styles/colors";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import MuiThemeProvider0 from "material-ui/styles/MuiThemeProvider";
import themeObject from "./themes";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme(themeObject);

// let themeObject = {
//   fontFamily: "Lato, sans",
//   textColor: "rgba(0, 0, 0, 0.68)",
//   backgroundcolor: "#F7F7F7",
//   palette: {
//     primary1Color: "#009688",
//     primary2Color: "#f58720",
//     textColor: "#5f5c62",
//     canvasColor: "#F7F7F7",
//     borderColor: grey300
//   },
//   raisedButton: {
//     primaryColor: "#607D8B"
//   },
//   floatingActionButton: {
//     color: "#f58720"
//   }
// };

// const themeObject = {
//   palette: {
//     primary: {
//       main: "#FE7A51",
//       dark: "#DB6844",
//       contrastText: "#fff"
//     },
//     secondary: {
//       main: "#fff",
//       contrastText: "#000"
//     },
//     background: {
//       default: "#F4F7FB"
//     }
//   },
//   overrides: {
//     MuiDivider: {
//       root: {
//         marginBottom: "24px",
//         marginTop: "8px"
//       }
//     },
//     MuiStepper: {
//       root: {
//         paddingBottom: "0px"
//       }
//     },
//     MuiCard: {
//       root: {
//         marginTop: "24px"
//       }
//     },
//     MuiFormControl: {
//       root: {
//         paddingBottom: "16px",
//         marginTop: "8px"
//       },
//       fullWidth: {
//         width: "80% !important"
//       }
//     },
//     MuiTypography: {
//       title: {
//         color: "rgba(0, 0, 0, 0.87)",
//         fontFamily: "Roboto",
//         fontSize: "20px",
//         fontWeight: 400,
//         letterSpacing: "0.83px",
//         lineHeight: "24px"
//       },
//       body1: {
//         color: "rgba(0, 0, 0, 0.60)",
//         fontFamily: "Roboto",
//         fontSize: "14px",
//         fontWeight: 400,
//         lineHeight: "20px",
//         marginBottom: "12px"
//       },
//       body2: {
//         color: "rgba(0, 0, 0, 0.87)",
//         fontFamily: "Roboto",
//         fontSize: "16px",
//         fontWeight: 400,
//         letterSpacing: "0.67px",
//         lineHeight: "19px"
//       },
//       subheading: {
//         color: "rgba(0, 0, 0, 0.87)",
//         fontFamily: "Roboto",
//         fontSize: "18px",
//         letterSpacing: "0.75px",
//         fontWeight: 400,
//         lineHeight: "20px"
//       }
//     }
//   }
// };

const muiTheme = getMuiTheme(themeObject);

window.basename =
  process.env.NODE_ENV === "production" ? "/app/v2/uploader" : "";

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <MuiThemeProvider0 muiTheme={muiTheme}>
        <Router basename={window.basename}>
          <App />
        </Router>
      </MuiThemeProvider0>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById("root")
);
