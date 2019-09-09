import React, { Component } from "react";
import ListCard from "../AssignComplaint/components/ListCard";
import "./index.css";
import { connect } from "react-redux";
import { handleFieldChange, submitForm, initForm } from "redux/form/actions";
import { fetchEmployees } from "redux/common/actions";

class EmployeeDirectory extends Component {
  componentDidMount = () => {
    let { fetchEmployees } = this.props;
    fetchEmployees();
  };
  render() {
    let { ...rest } = this.props;
    return (
      <div className="employee-directory-main-card">
        <ListCard {...rest} />
      </div>
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
  const { departmentById, designationsById, employeeById } = state.common;
  const APIData =
    employeeById &&
    Object.keys(employeeById).map((item, index) => {
      return employeeById[item];
    });

  return { designationsById, departmentById, APIData };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeDirectory);
