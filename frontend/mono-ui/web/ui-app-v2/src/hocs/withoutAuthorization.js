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
    return { authenticated };
  };
  return connect(mapStateToProps)(Wrapper);
};

export default withoutAuthorization;
