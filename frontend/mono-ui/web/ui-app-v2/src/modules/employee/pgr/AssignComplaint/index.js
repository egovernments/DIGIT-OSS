import React, { Component } from "react";
import { connect } from "react-redux";
import Screen from "modules/common/common/Screen";
import formHoc from "hocs/form";
import AssignComplaintForm from "./components/AssignComplaintForm";
import { fetchEmployees } from "redux/common/actions";

const AssignComplaintFormHOC = formHoc({ formKey: "assignComplaint" })(AssignComplaintForm);

class AssignComplaint extends Component {
  componentDidMount = () => {
    let { fetchEmployees } = this.props;
    fetchEmployees();
  };
  render() {
    const { transformedComplaint, ...rest } = this.props;
    return (
      <Screen>
        <AssignComplaintFormHOC complaint={transformedComplaint} {...rest} />
      </Screen>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEmployees: () => dispatch(fetchEmployees()),
  };
};

const mapStateToProps = (state, ownProps) => {
  const { complaints } = state;
  const { history } = ownProps;
  const serviceRequestId = ownProps.match.params.serviceRequestId;
  const { departmentById, designationsById, employeeById } = state.common;
  const APIData =
    employeeById &&
    Object.keys(employeeById).map((item, index) => {
      return employeeById[item];
    });
  let selectedComplaint = complaints["byId"][decodeURIComponent(window.location.href.split("/").pop())];
  const transformedComplaint = {
    header: selectedComplaint && selectedComplaint.serviceCode,
    address: selectedComplaint && selectedComplaint.address,
  };
  return { designationsById, departmentById, APIData, transformedComplaint, history, serviceRequestId };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssignComplaint);
