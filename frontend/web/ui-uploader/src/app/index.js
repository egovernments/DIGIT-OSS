import React, { Component } from "react";
import { connect } from "react-redux";
import Main from "./Main";
import { loginUser, userLoginSuccess } from "./actions";

// component
const App = () => {
  return (
    <div className="App">
      <Main />
    </div>
  );
};

class AppContainer extends Component {
  componentDidMount() {
    // this listener is setup when the parent application sends a message via postMessage API
    window.addEventListener("message", this.handleFrameTasks);

    // if (process.env.NODE_ENV === "development") {
    //   const username = process.env.REACT_APP_USERNAME;
    //   const password = process.env.REACT_APP_PASSWORD;
    //   const usertype = process.env.REACT_APP_USERTYPE;
    //   this.props.loginUser(username, password, usertype);
    // }
  }

  handleFrameTasks = e => {
    // if the iframe and the origin are in different domains this is important
    if (e.origin !== window.origin) {
      const token = e.token;
      const tenantId = e.tenantId;
      const userInfo = e.userInfo;
      //persist these in the localstorage
    }
  };

  render() {
    return <App />;
  }
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
  userInfo: state.auth.userInfo
});

const mapDispatchToProps = dispatch => ({
  loginUser: (username, password, usertype) =>
    dispatch(loginUser(username, password, usertype)),
  userLoginSuccess: () => dispatch(userLoginSuccess())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppContainer);
