import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class AuthorizedRoute extends React.Component {
  componentWillMount() {
    getLoggedUser();
  }

  render() {
    // the component is referred to as Component
    const { component: Component, pending, logged, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          if (pending) return <div>Loading...</div>;
          return logged ? <Component {...props} /> : <Redirect to="/login" />;
        }}
      />
    );
  }
}

const stateToProps = ({ loggedUserState }) => ({
  pending: loggedUserState.pending,
  logged: loggedUserState.logged
});

export default connect(stateToProps)(AuthorizedRoute);
