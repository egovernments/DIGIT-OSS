import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { applyUserJobFilters, resetUserJobFilters } from "../jobs/actions";
import View from "./view";

class Filters extends Component {
  static propTypes = {
    applyUserJobFilters: PropTypes.func.isRequired,
    resetUserJobFilters: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired
  };

  handleApplyFilter = e => {
    this.props.applyUserJobFilters(this.props.filter);
  };

  handleResetFilter = e => {
    this.props.resetUserJobFilters();
  };

  render() {
    const { handleApplyFilter, handleResetFilter } = this;
    return (
      <View
        handleApplyFilter={handleApplyFilter}
        handleResetFilter={handleResetFilter}
      />
    );
  }
}

const mapDispatchToProps = dispatch => ({
  applyUserJobFilters: filter => dispatch(applyUserJobFilters(filter)),
  resetUserJobFilters: () => dispatch(resetUserJobFilters())
});

const mapStateToProps = state => {
  const { userJobs } = state;
  const { filter } = userJobs;
  return { filter };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Filters);
