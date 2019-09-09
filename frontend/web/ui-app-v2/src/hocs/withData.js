import React from "react";
import { connect } from "react-redux";
import { searchUser } from "redux/auth/actions";
import { fetchComplaintCategories } from "redux/complaints/actions";

const withData = (Component) => {
  class Wrapper extends React.Component {
    componentDidMount() {
      const { searchUser, fetchComplaintCategories } = this.props;
      fetchComplaintCategories();
      searchUser();
    }

    render() {
      const { searchUser, fetchCurrentLocation, fetchComplaintCategories, ...rest } = this.props;
      return <Component {...rest} />;
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {
      fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
      searchUser: () => dispatch(searchUser()),
    };
  };

  return connect(null, mapDispatchToProps)(Wrapper);
};

export default withData;
