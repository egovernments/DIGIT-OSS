import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserJobFilters } from "../jobs/actions";
import DatePickerUi from "../components/DatePickerUINew";
import Grid from "@material-ui/core/Grid";

class UserJobsDateFilterContainer extends Component {
  static propTypes = {
    updateUserJobFilters: PropTypes.func.isRequired
  };

  maxDate = new Date();
  render() {
    const { updateUserJobFilters, startDate, endDate } = this.props;
    const { maxDate } = this;

    return (
      <React.Fragment>
        <Grid item sm="4">
          <DatePickerUi
            value={startDate}
            onChange={(event, date) => {
              updateUserJobFilters({ startDate: event.target.value });
            }}
            label="From Date"
            maxDate={maxDate}
          />
        </Grid>
        <Grid item sm="4">
          <DatePickerUi
            value={endDate}
            onChange={(event, date) => {
              updateUserJobFilters({ endDate: event.target.value });
            }}
            label="To Date"
          />
        </Grid>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  startDate: state.userJobs.filter.startDate,
  endDate: state.userJobs.filter.endDate
});

const mapDispatchToProps = dispatch => ({
  updateUserJobFilters: filter => dispatch(updateUserJobFilters(filter))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserJobsDateFilterContainer);
