import React, { Component } from "react";
import ListCard from "../AssignComplaint/components/ListCard";
import "./index.css";
import { connect } from "react-redux";
import { handleFieldChange, submitForm, initForm } from "egov-ui-kit/redux/form/actions";
import { fetchEmployees } from "egov-ui-kit/redux/common/actions";
import { Screen } from "modules/common";

class EmployeeDirectory extends Component {
  componentDidMount = () => {
    let { fetchEmployees } = this.props;
    fetchEmployees();
  };
  render() {
    let { loading, ...rest } = this.props;
    return (
      <Screen loading={loading} className="employee-directory-main-card">
        <ListCard {...rest} />
      </Screen>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
    submitForm: (formKey) => dispatch(submitForm(formKey)),
    initForm: (form) => dispatch(initForm(form)),
    fetchEmployees: () => dispatch(fetchEmployees()),
  };
};

const mapStateToProps = (state, ownProps) => {
  const { departmentById, designationsById, employeeById, employeeFetchSuccess } = state.common;
  const loading = !employeeFetchSuccess;
  const APIData =
    employeeById &&
    Object.keys(employeeById).map((item, index) => {
      return employeeById[item];
    });

  return { designationsById, departmentById, APIData, loading };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EmployeeDirectory);
