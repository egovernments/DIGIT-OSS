import React, { Component } from "react";
import { Tabs, Card, TextField, Icon, Button } from "components";
import FloatingActionButton from "material-ui/FloatingActionButton";
import { Complaints, SortDialog, Screen } from "modules/common";
import { fetchComplaints } from "egov-ui-kit/redux/complaints/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { handleFieldChange,setFieldProperty } from "egov-ui-kit/redux/form/actions";


import Label from "egov-ui-kit/utils/translationNode";
import { transformComplaintForComponent } from "egov-ui-kit/utils/commons";
import { httpRequest } from "egov-ui-kit/utils/api";
import { connect } from "react-redux";
import orderby from "lodash/orderBy";
import {
  toggleSnackbarAndSetText,
  fetchUiCommonConfig,
  fetchUiCommonConstants
} from "egov-ui-kit/redux/app/actions";
import isEmpty from "lodash/isEmpty";
import isEqual from "lodash/isEqual";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import CountDetails from "./components/CountDetails";
import { fetchComplaintCategories } from "egov-ui-kit/redux/complaints/actions";
import { fetchpgrConstants, prepareFormData } from "egov-ui-kit/redux/common/actions";
import "./index.css";



class AllComplaints extends Component {
  state = {
    complaintNo: "",
    mobileNo: "",
    complaints: [],
    search: false,
    value: 0,
    sortPopOpen: false,
    errorText: "",
  };
  style = {
    iconStyle: {
      height: "30px",
      width: "30px",
    },
  };

  componentDidMount = async () => {
    let {
      role,
      userInfo,
      numCSRComplaint,
      numEmpComplaint,
      renderCustomTitle,
      prepareFinalObject,
      form
    } = this.props;
    this.props.fetchpgrConstants();
    this.props.fetchUiCommonConfig();
    this.props.fetchComplaintCategories();
    this.props.resetCityFieldValue();
    this.props.resetMohallaFieldValue();
    this.props.resetFormData();
    let rawRole =
      userInfo && userInfo.roles && userInfo.roles[0].code.toUpperCase();
    //const numberOfComplaints = role === "employee" ? numEmpComplaint : role === "csr" ? numCSRComplaint : 0;
    if (rawRole === "PGR-ADMIN") {
      this.props.history.push("/report/rainmaker-pgr/DepartmentWiseReport");
    } else {
      let { fetchComplaints } = this.props;

      let complaintCountRequest = [
        { key: "tenantId", value: getTenantId() },
        {
          key: "status",
          value:
            role === "csr"
              ? "assigned,open,reassignrequested"
              : "assigned,reassignrequested",
        },
      ];
      let payloadCount = await httpRequest(
        "rainmaker-pgr/v1/requests/_count",
        "_search",
        complaintCountRequest
      );
      if (role === "csr") {
        payloadCount
          ? payloadCount.count
            ? renderCustomTitle(payloadCount.count)
            : renderCustomTitle("0")
          : renderCustomTitle("0");
      }

      complaintCountRequest = [
        { key: "tenantId", value: getTenantId() },
        {
          key: "status",
          value: "assigned",
        },
      ];
      let assignedTotalComplaints = await httpRequest(
        "rainmaker-pgr/v1/requests/_count",
        "_search",
        complaintCountRequest
      );
      complaintCountRequest = [
        { key: "tenantId", value: getTenantId() },
        {
          key: "status",
          value: "open,reassignrequested",
        },
      ];
      let unassignedTotalComplaints = await httpRequest(
        "rainmaker-pgr/v1/requests/_count",
        "_search",
        complaintCountRequest
      );
      prepareFinalObject("pgrComplaintCount", {
        assignedTotalComplaints: assignedTotalComplaints.count,
        unassignedTotalComplaints: unassignedTotalComplaints.count,
        employeeTotalComplaints: payloadCount.count,
      });

      if (role === "ao") {
        fetchComplaints(
          [
            { key: "tenantId", value: getTenantId() },
            {
              key: "status",
              value: "assigned",
            },
          ],
          true,
          false
        );
        fetchComplaints(
          [
            {
              key: "status",
              value: "open,reassignrequested",
            },
            { key: "tenantId", value: getTenantId() },
          ],
          true,
          false
        );
      } else {
        fetchComplaints(
          [
            { key: "tenantId", value: getTenantId() },
            {
              key: "status",
              value:
                rawRole === "EMPLOYEE"
                  ? "assigned,reassignrequested"
                  : "assigned,open,reassignrequested",
            },
          ],
          true,
          true
        );
      }
    }
    let inputType = document.getElementsByTagName("input");
    for (let input in inputType) {
      if (inputType[input].type === "number") {
        inputType[input].addEventListener("mousewheel", function () {
          this.blur();
        });
      }
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { role, renderCustomTitle } = this.props;
    if (
      !isEqual(
        this.props.transformedComplaints,
        nextProps.transformedComplaints
      )
    ) {
      const numberOfComplaints =
        role === "employee"
          ? 0
          : role === "csr"
          ? nextProps.numCSRComplaint
          : 0;
      renderCustomTitle(numberOfComplaints);
    }
  };

  closeSortDialog = () => {
    this.setState({
      sortPopOpen: false,
    });
  };

  onSortClick = () => {
    this.setState({
      sortPopOpen: true,
    });
  };

  onComplaintClick = (complaintNo) => {
    this.props.history.push(`/complaint-details/${complaintNo}`);
  };

  onComplaintChange = (e) => {
    const complaintNo = e.target.value;
    this.setState({ complaintNo });
    if (complaintNo.length < 6) {
      this.setState({
        errorText: "ERR_COMPLAINT_NUMBER_SEARCH",
      });
    } else {
      this.setState({ errorText: "" });
    }
  };

  onMobileChange = (e) => {
    const inputValue = e.target.value;
    this.setState({ mobileNo: inputValue });
  };

  onSearch = () => {
    const { complaintNo, mobileNo } = this.state;
    const { fetchComplaints, toggleSnackbarAndSetText } = this.props;
    let queryObj = [];
    if (complaintNo) {
      queryObj.push({ key: "serviceRequestId", value: complaintNo });
    }
    if (mobileNo) {
      queryObj.push({ key: "phone", value: mobileNo });
    }

    // if (complaintNo || mobileNo) {
    //   fetchComplaints(queryObj, true, true);
    // }

    if (complaintNo) {
      if (complaintNo.length >= 6) {
        fetchComplaints(queryObj, true, true);
      } else {
        toggleSnackbarAndSetText(
          true,
          {
            labelName: "Entered value is less than 6 characters in length.",
            labelKey: `ERR_VALUE_LESS_THAN_SIX_CHARACTERS`,
          },
          "error"
        );
      }
    } else if (mobileNo) {
      fetchComplaints(queryObj, true, true);
    }
    this.setState({ search: true });
  };

  clearSearch = () => {
    const { fetchComplaints } = this.props;
    fetchComplaints([
      { key: "status", value: "assigned,open,reassignrequested" },
    ]);
    this.setState({ mobileNo: "", complaintNo: "", search: false });
  };

  onChange = (value) => {
    this.setState({ value });
  };

  render() {
    const { loading,history } = this.props;
    const {
      mobileNo,
      complaintNo,
      search,
      sortPopOpen,
      errorText,
    } = this.state;
  
    const tabStyle = {
      letterSpacing: "0.6px",
    };

    const { onComplaintClick, onSortClick, closeSortDialog, style } = this;
    const {
      assignedComplaints,
      unassignedComplaints,
      csrComplaints,
      employeeComplaints,
      role,
      searchFilterEmployeeComplaints,
      assignedTotalComplaints,
      unassignedTotalComplaints,
      employeeTotalComplaints,
    } = this.props;
    const hintTextStyle = {
      letterSpacing: "0.7px",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: "90%",
      overflow: "hidden",
    };
   
    return role === "ao" ? (
      <div>
        <div
          className="sort-button rainmaker-displayInline"
          style={{ padding: "20px 20px 0px 0px", justifyContent: "flex-end" }}
        >
          <div
            className="rainmaker-displayInline"
            style={{ cursor: "pointer", marginRight: "20px" }}
            onClick={onSortClick}
          >
            <Label
              label="ES_SORT_BUTTON"
              color="rgba(0, 0, 0, 0.8700000047683716)"
              containerStyle={{ marginRight: 5 }}
              labelStyle={{ fontWeight: 500 }}
            />
            <Icon
              style={style.iconStyle}
              action="action"
              name="swap-vert"
              color="rgba(0, 0, 0, 0.8700000047683716)"
            />
          </div>
          <div
            className="rainmaker-displayInline"
            style={{ cursor: "pointer" }}
            onClick={() => history.push("search-complaint")}
          >
            <Label
              label="ES_SEARCH_BUTTON"
              color="rgba(0, 0, 0, 0.8700000047683716)"
              containerStyle={{ marginRight: 5 }}
              labelStyle={{ fontWeight: 500 }}
            />
            <Icon
              style={style.iconStyle}
              action="action"
              name="search"
              color="rgba(0, 0, 0, 0.8700000047683716)"
            />
          </div>
          <SortDialog
            sortPopOpen={sortPopOpen}
            closeSortDialog={closeSortDialog}
          />
        </div>
        <Tabs
          className="employee-complaints-tab"
          onChange={this.onChange}
          tabs={[
            {
              label: (
                <div className="inline-Localization-text">
                  <Label
                    //labelClassName = "unassigned-label-text"
                    labelClassName={
                      this.state.value === 0
                        ? "selected-tab-label-text"
                        : "unselected-tab-label-text"
                    }
                    //color={this.state.value === 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"}
                    bold={true}
                    label={`ES_ALL_COMPLAINTS_UNASSIGNED_TAB_LABEL`}
                    labelStyle={tabStyle}
                  />
                  {/*<Label
                    labelClassName={
                      this.state.value === 0
                        ? "selected-tab-label-text"
                        : "unselected-tab-label-text"
                    }
                    //color={this.state.value === 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"}
                    bold={true}
                    label={`(${unassignedComplaints.length})`}
                    labelStyle={tabStyle}
                  />*/}
                </div>
              ),
              children: (
                <Screen className="gro-screen" loading={loading}>
                  <div className="tab1-content form-without-button-cont-generic">
                    <CountDetails
                      count={unassignedComplaints.length}
                      total={unassignedTotalComplaints}
                      status="unassigned"
                    />
                    <Complaints
                      noComplaintMessage={
                        "ES_MYCOMPLAINTS_NO_COMPLAINTS_TO_ASSIGN"
                      }
                      onComplaintClick={onComplaintClick}
                      complaints={unassignedComplaints}
                      complaintLocation={true}
                      role={role}
                      heightOffset="116px"
                    />
                  </div>
                </Screen>
              ),
            },
            {
              label: (
                <div className="inline-Localization-text">
                  <Label
                    // labelClassName="assigned-label-text"
                    labelClassName={
                      this.state.value === 1
                        ? "selected-tab-label-text"
                        : "unselected-tab-label-text"
                    }
                    //color={this.state.value === 1 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"}
                    bold={true}
                    label={`ES_ALL_COMPLAINTS_ASSIGNED_TAB_LABEL`}
                    labelStyle={tabStyle}
                  />
                  {/*<Label
                    labelClassName={
                      this.state.value === 1
                        ? "selected-tab-label-text"
                        : "unselected-tab-label-text"
                    }
                    //color={this.state.value === 1 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.7)"}
                    bold={true}
                    label={`(${assignedComplaints.length})`}
                    labelStyle={tabStyle}
                  />*/}
                </div>
              ),
              children: (
                <Screen className="gro-screen" loading={loading}>
                  <div className="tab2-content form-without-button-cont-generic">
                    <CountDetails
                      count={assignedComplaints.length}
                      total={assignedTotalComplaints}
                      status="assigned"
                    />
                    <Complaints
                      noComplaintMessage={
                        "ES_MYCOMPLAINTS_NO_ASSIGNED_COMPLAINTS"
                      }
                      onComplaintClick={onComplaintClick}
                      complaints={assignedComplaints}
                      complaintLocation={true}
                      role={role}
                      heightOffset="116px"
                    />
                  </div>
                </Screen>
              ),
            },
          ]}
        />
      </div>
    ) : role === "csr" ? (
      <Screen loading={loading}>
        <div className="form-without-button-cont-generic">
          <Card
            id="complaint-search-card"
            className="complaint-search-main-card"
            textChildren={
              <div className="complaint-search-cont clearfix">
                <div className="col-xs-12" style={{ paddingLeft: 8 }}>
                  <Label
                    label="CORE_COMMON_SEARCH_COMPLAINT"
                    fontSize={16}
                    dark={true}
                    bold={true}
                  />
                </div>
                <div
                  className="col-sm-3 col-xs-12"
                  style={{ paddingLeft: 8, paddingRight: 40 }}
                >
                  <TextField
                    id="mobile-no"
                    name="mobile-no"
                    type="number"
                    value={mobileNo}
                    hintText={
                      <Label
                        label="CORE_COMMON_MOBILE_NUMBER_PLACEHOLDER"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    floatingLabelText={
                      <Label
                        key={0}
                        label="ES_CREATECOMPLAINT_MOBILE_NUMBER"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onMobileChange(e)}
                    underlineStyle={{ bottom: 7 }}
                    underlineFocusStyle={{ bottom: 7 }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-3 col-xs-12" style={{ paddingLeft: 8 }}>
                  <TextField
                    id="complaint-no"
                    name="complaint-no"
                    value={complaintNo}
                    hintText={
                      <Label
                        label="ES_MYCOMPLAINTS_COMPLAINT_NO"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="CS_COMPLAINT_SUBMITTED_COMPLAINT_NO"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onComplaintChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0",
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0",
                    }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div
                  className="col-sm-6 col-xs-12 csr-action-buttons"
                  style={{ marginTop: 10, paddingRight: 8 }}
                >
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        label="ES_MYCOMPLAINTS_SEARCH_BUTTON"
                      />
                    }
                    style={{ marginRight: 28, width: "36%" }}
                    backgroundColor="#fe7a51"
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fff",
                    }}
                    buttonStyle={{ border: 0 }}
                    onClick={() => this.onSearch()}
                  />
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        color="#fe7a51"
                        label="ES_MYCOMPLAINTS_CLEAR_SEARCH_BUTTON"
                      />
                    }
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fe7a51",
                    }}
                    buttonStyle={{ border: "1px solid #fe7a51" }}
                    style={{ width: "36%" }}
                    onClick={() => this.clearSearch()}
                  />
                </div>
              </div>
            }
          />
        </div>
        <div className="form-without-button-cont-generic">
          <Complaints
            noComplaintMessage={
              search
                ? "ES_NO_SEARCH_RESULTS"
                : "ES_MYCOMPLAINTS_NO_COMPLAINTS_ASSIGNED"
            }
            onComplaintClick={onComplaintClick}
            complaints={csrComplaints}
            role={role}
            complaintLocation={true}
          />
        </div>
        <div className="floating-button-cont csr-add-button">
          <FloatingActionButton
            id="mycomplaints-add"
            onClick={(e) => {
              history.push("/create-complaint");
            }}
            className="floating-button"
            backgroundColor="#fe7a51"
          >
            <Icon action="content" name="add" />
          </FloatingActionButton>
        </div>
      </Screen>
    ) : (
      <Screen loading={loading}>
        <div className="form-without-button-cont-generic">
          <Card
            id="complaint-search-card"
            className="complaint-search-main-card"
            textChildren={
              <div className="complaint-search-cont clearfix">
                <div className="col-xs-12" style={{ paddingLeft: 8 }}>
                  <Label
                    label="CORE_COMMON_SEARCH_COMPLAINT"
                    fontSize={16}
                    dark={true}
                    bold={true}
                  />
                </div>
                <div
                  className="col-sm-3 col-xs-12"
                  style={{ paddingLeft: 8, paddingRight: 40 }}
                >
                  <TextField
                    id="mobile-no"
                    name="mobile-no"
                    type="number"
                    value={mobileNo}
                    hintText={
                      <Label
                        label="CORE_COMMON_MOBILE_NUMBER_PLACEHOLDER"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    floatingLabelText={
                      <Label
                        key={0}
                        label="ES_CREATECOMPLAINT_MOBILE_NUMBER"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onMobileChange(e)}
                    underlineStyle={{ bottom: 7 }}
                    underlineFocusStyle={{ bottom: 7 }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div className="col-sm-3 col-xs-12" style={{ paddingLeft: 8 }}>
                  <TextField
                    id="complaint-no"
                    name="complaint-no"
                    value={complaintNo}
                    hintText={
                      <Label
                        label="ES_MYCOMPLAINTS_COMPLAINT_NO"
                        color="rgba(0, 0, 0, 0.3799999952316284)"
                        fontSize={16}
                        labelStyle={hintTextStyle}
                      />
                    }
                    errorText={<Label label={errorText} color="red" />}
                    floatingLabelText={
                      <Label
                        key={1}
                        label="CS_COMPLAINT_SUBMITTED_COMPLAINT_NO"
                        color="rgba(0,0,0,0.60)"
                        fontSize="12px"
                      />
                    }
                    onChange={(e, value) => this.onComplaintChange(e)}
                    underlineStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0",
                    }}
                    underlineFocusStyle={{
                      bottom: 7,
                      borderBottom: "1px solid #e0e0e0",
                    }}
                    hintStyle={{ width: "100%" }}
                  />
                </div>
                <div
                  className="col-sm-6 col-xs-12 csr-action-buttons"
                  style={{ marginTop: 10, paddingRight: 8 }}
                >
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        label="ES_MYCOMPLAINTS_SEARCH_BUTTON"
                      />
                    }
                    style={{ marginRight: 28, width: "36%" }}
                    backgroundColor="#fe7a51"
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fff",
                    }}
                    buttonStyle={{ border: 0 }}
                    onClick={() => this.onSearch()}
                  />
                  <Button
                    label={
                      <Label
                        buttonLabel={true}
                        color="#fe7a51"
                        label="ES_MYCOMPLAINTS_CLEAR_SEARCH_BUTTON"
                      />
                    }
                    labelStyle={{
                      letterSpacing: 0.7,
                      padding: 0,
                      color: "#fe7a51",
                    }}
                    buttonStyle={{ border: "1px solid #fe7a51" }}
                    style={{ width: "36%" }}
                    onClick={() => this.clearSearch()}
                  />
                </div>
              </div>
            }
          />
        </div>
        <div className="form-without-button-cont-generic">
          <CountDetails
            count={
              search
                ? searchFilterEmployeeComplaints.length
                : employeeComplaints.length
            }
            total={employeeTotalComplaints}
            status="open"
          />
          <Complaints
            noComplaintMessage={"ES_MYCOMPLAINTS_NO_COMPLAINTS_ASSIGNED"}
            onComplaintClick={onComplaintClick}
            complaints={
              search ? searchFilterEmployeeComplaints : employeeComplaints
            }
            role={role}
            complaintLocation={true}
          />
        </div>
      </Screen>
    );
  }
}

const roleFromUserInfo = (roles = [], role) => {
  const roleCodes = roles.map((role) => {
    return role.code;
  });
  return roleCodes && roleCodes.length && roleCodes.indexOf(role) > -1
    ? true
    : false;
};

const displayStatus = (status = "") => {
  let statusObj = {};
  if (status.toLowerCase().includes("overdue")) {
    statusObj.status = status; //Replace by localisation label
    statusObj.statusMessage = "";
  }
  if (status.toLowerCase().includes("left")) {
    statusObj.status = status; //Replace by localisation label
    statusObj.statusMessage = "";
  }
  return statusObj;
};

const mapStateToProps = (state) => {
  const { complaints, common, screenConfiguration = {} } = state || {};
  const { categoriesById, byId, order } = complaints;
  const { fetchSuccess } = complaints;
  const { preparedFinalObject = {} } = screenConfiguration;
  const { pgrComplaintCount = {} } = preparedFinalObject;
  const {
    assignedTotalComplaints = 0,
    unassignedTotalComplaints = 0,
    employeeTotalComplaints = 0,
  } = pgrComplaintCount;
  const loading = !isEmpty(categoriesById)
    ? fetchSuccess
      ? false
      : true
    : true;
  const { citizenById, employeeById } = common || {};
  const { userInfo } = state.auth;
  const role =
    roleFromUserInfo(userInfo.roles, "GRO") ||
    roleFromUserInfo(userInfo.roles, "DGRO")
      ? "ao"
      : roleFromUserInfo(userInfo.roles, "CSR")
      ? "csr"
      : "employee";
  let transformedComplaints = transformComplaintForComponent(
    complaints,
    role,
    employeeById,
    citizenById,
    categoriesById,
    displayStatus
  );
  let assignedComplaints = [],
    unassignedComplaints = [],
    employeeComplaints = [],
    csrComplaints = [];
  let filteredEmployeeComplaints = transformedComplaints.filter(
    (complaint) =>
      complaint.complaintStatus === "ASSIGNED" ||
      complaint.rawStatus === "reassignrequested"
  );

  let searchFilterEmployeeComplaints = transformedComplaints.filter(
    (complaint) =>
      complaint.complaintStatus === "ASSIGNED" ||
      complaint.rawStatus === "reassignrequested" ||
      complaint.complaintStatus === "CLOSED"
  );

  let filteredAssignedComplaints = transformedComplaints.filter(
    (complaint) => complaint.complaintStatus === "ASSIGNED"
  );
  let filteredUnassignedComplaints = transformedComplaints.filter(
    (complaint) => complaint.complaintStatus === "UNASSIGNED"
  );

  if (role === "ao") {
    if (order === "Old to New") {
      assignedComplaints = orderby(
        filteredAssignedComplaints,
        ["latestCreationTime"],
        ["asc"]
      );
      unassignedComplaints = orderby(
        filteredUnassignedComplaints,
        ["latestCreationTime"],
        ["asc"]
      );
    } else if (order === "SLA") {
      assignedComplaints = orderby(
        filteredAssignedComplaints,
        ["SLA"],
        ["asc"]
      );
      unassignedComplaints = orderby(
        filteredUnassignedComplaints,
        ["SLA"],
        ["asc"]
      );
    } else {
      assignedComplaints = orderby(
        filteredAssignedComplaints,
        ["latestCreationTime"],
        ["desc"]
      );
      unassignedComplaints = orderby(
        filteredUnassignedComplaints,
        ["latestCreationTime"],
        ["desc"]
      );
    }
  } else if (role === "csr") {
    if (order === "Old to New") {
      csrComplaints = orderby(
        transformedComplaints,
        ["latestCreationTime"],
        ["asc"]
      );
    } else if (order === "SLA") {
      csrComplaints = orderby(transformedComplaints, ["SLA"], ["asc"]);
    } else {
      csrComplaints = orderby(
        transformedComplaints,
        ["latestCreationTime"],
        ["desc"]
      );
    }
  } else {
    if (order === "Old to New") {
      employeeComplaints = orderby(
        filteredEmployeeComplaints,
        ["latestCreationTime"],
        ["asc"]
      );
    } else if (order === "SLA") {
      employeeComplaints = orderby(
        filteredEmployeeComplaints,
        ["SLA"],
        ["asc"]
      );
    } else {
      employeeComplaints = orderby(
        filteredEmployeeComplaints,
        ["latestCreationTime"],
        ["desc"]
      );
    }
  }
  transformedComplaints = orderby(
    transformedComplaints,
    ["latestCreationTime"],
    ["desc"]
  );
  const numEmpComplaint = employeeComplaints.length;
  const numCSRComplaint = transformedComplaints.length;
  return {
    assignedComplaints,
    unassignedComplaints,
    csrComplaints,
    numEmpComplaint,
    numCSRComplaint,
    employeeComplaints,
    role,
    loading,
    transformedComplaints,
    searchFilterEmployeeComplaints,
    assignedTotalComplaints,
    unassignedTotalComplaints,
    employeeTotalComplaints,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchComplaints: (criteria, hasUsers, overWrite) =>
      dispatch(fetchComplaints(criteria, hasUsers, overWrite)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    prepareFinalObject: (jsonPath, value) =>
      dispatch(prepareFinalObject(jsonPath, value)),
    resetCityFieldValue:()=>dispatch(setFieldProperty("complaint","city","value","")), 
    resetMohallaFieldValue:()=>dispatch(setFieldProperty("complaint","mohalla","value","")), 
    resetFormData:()=>dispatch(prepareFormData("services",[{}])), 
    fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
    fetchpgrConstants: () => dispatch(fetchpgrConstants()),
    fetchUiCommonConfig: () => dispatch(fetchUiCommonConfig()),
    fetchUiCommonConstants: () => dispatch(fetchUiCommonConstants()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AllComplaints);
