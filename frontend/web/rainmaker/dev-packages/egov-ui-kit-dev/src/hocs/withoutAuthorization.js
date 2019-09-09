import React from "react";
import { connect } from "react-redux";

const withoutAuthorization = (redirectionUrl) => (Component) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      if (this.props.authenticated) {
        this.props.history.push(redirectionUrl);
      }
    }
    render() {
      return <Component {...this.props} />;
    }
  }
  const mapStateToProps = (state) => {
    const { authenticated } = state.auth;
    let { stateInfoById } = state.common || [];
    let hasLocalisation = false;
    let defaultUrl = process.env.REACT_APP_NAME === "Citizen" ? "/user/register" : "/user/login";
    if (stateInfoById && stateInfoById.length > 0) {
      hasLocalisation = stateInfoById[0].hasLocalisation;
      defaultUrl = stateInfoById[0].defaultUrl;
    }
    return { authenticated, hasLocalisation, defaultUrl };
  };
  return connect(mapStateToProps)(Wrapper);
};

export default withoutAuthorization;
