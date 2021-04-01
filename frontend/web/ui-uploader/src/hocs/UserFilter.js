import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUserJobFilters } from "../jobs/actions";
import TextFieldUi from "../components/TextFieldUINew";

const userFilters = (filterKey, label, placeholder = "placeholder") => {
  class UserFilters extends Component {
    onChange = e => {
      this.props.updateUserJobFilters({
        [filterKey]: e.target.value
          .trim()
          .split(",")
          .filter(value => {
            return value.trim();
          })
      });
    };

    render() {
      const { onChange } = this;
      const { codes } = this.props;
      return (
        <TextFieldUi
          value={codes}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
        />
      );
    }
  }

  const mapStateToProps = state => ({
    [filterKey]: state.userJobs.filter[filterKey]
      ? state.userJobs.filter[filterKey].join(",")
      : ""
  });

  const mapDispatchToProps = dispatch => ({
    updateUserJobFilters: filter => dispatch(updateUserJobFilters(filter))
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(UserFilters);
};

export default userFilters;
