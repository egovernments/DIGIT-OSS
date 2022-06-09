import React, { Component } from "react";
import { connect } from "react-redux";
import { Screen } from "modules/common";
import formHoc from "egov-ui-kit/hocs/form";
import AssignComplaintForm from "./components/AssignComplaintForm";
import { fetchEmployeeToAssign } from "egov-ui-kit/redux/common/actions";
import filter from "lodash/filter";
import isEmpty from "lodash/isEmpty";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";


const AssignComplaintFormHOC = formHoc({
  formKey: "assignComplaint",
  isCoreConfiguration: true,
  path: "pgr/pgr-employee"
})(AssignComplaintForm);

class AssignComplaint extends Component {
  componentDidMount = () => {
    let { fetchEmployeeToAssign } = this.props;
    const queryParams = [
      { key: "roles", value: "EMPLOYEE" }, 
      { key: "tenantId", value: getTenantId()}
    ];
    fetchEmployeeToAssign(queryParams);
  };
  render() {
    const { transformedComplaint, loading, ...rest } = this.props;
    return (
      <Screen loading={loading}>
        <AssignComplaintFormHOC complaint={transformedComplaint} {...rest} />
      </Screen>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchEmployeeToAssign: (queryParams, requestBody) =>
      dispatch(fetchEmployeeToAssign(queryParams, requestBody))
  };
};

const mapStateToProps = (state, ownProps) => {
  const { complaints, common } = state;
  const { fetchEmployeeToAssignSuccess } = common;
  const loading = !fetchEmployeeToAssignSuccess;
  const { history } = ownProps;
  const serviceRequestId = ownProps.match.params.serviceRequestId;
  const {
    departmentById,
    designationsById,
    employeeToAssignById
  } = state.common;
  const rawAPIData =
    employeeToAssignById &&
    Object.keys(employeeToAssignById).map((item, index) => {
      return employeeToAssignById[item];
    });
  let selectedComplaint =
    complaints["byId"][
      decodeURIComponent(window.location.href.split("/").pop())
    ];
  const complaintTenantId = selectedComplaint && selectedComplaint.tenantId;
  const APIData = filter(rawAPIData, item => {
    return item.tenantId === complaintTenantId;
  });
  const transformedComplaint = {
    header: selectedComplaint && selectedComplaint.serviceCode,
    address: selectedComplaint
      ? selectedComplaint.addressDetail &&
        !isEmpty(selectedComplaint.addressDetail)
        ? selectedComplaint.addressDetail
        : selectedComplaint.address
      : ""
  };
  return {
    designationsById,
    departmentById,
    APIData,
    transformedComplaint,
    history,
    serviceRequestId,
    loading
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignComplaint);
