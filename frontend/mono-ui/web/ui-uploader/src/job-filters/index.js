import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { applyUserJobFilters, resetUserJobFilters } from "../jobs/actions";
import View from "./view";
import { convertDateToEpoch } from "../utils";

class Filters extends Component {
  static propTypes = {
    applyUserJobFilters: PropTypes.func.isRequired,
    resetUserJobFilters: PropTypes.func.isRequired,
    filter: PropTypes.object.isRequired
  };

  state = {
    message: "",
    messageBarOpen: false,
    errorMessage: ""
  };

  handleApplyFilter = e => {
    let filter = this.props.filter;
    const startDate = filter.startDate && convertDateToEpoch(filter.startDate);
    const endDate = filter.endDate && convertDateToEpoch(filter.endDate);

    if (startDate > endDate) {
      const errorMessage = "End Date should not be less than start date";
      this.setState({ messageBarOpen: true, errorMessage });
      return;
    }
    this.props.applyUserJobFilters(this.props.filter);
  };

  handleResetFilter = e => {
    this.props.resetUserJobFilters();
  };

  render() {
    const { handleApplyFilter, handleResetFilter } = this;
    const { message, messageBarOpen, errorMessage } = this.state;

    return (
      <View
        handleApplyFilter={handleApplyFilter}
        handleResetFilter={handleResetFilter}
        message={message}
        messageBarOpen={messageBarOpen}
        errorMessage={errorMessage}
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
