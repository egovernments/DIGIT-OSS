import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "egov-ui-kit/components/Icon";
import { Screen, ModuleLandingPage } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import NewAndOldComplaints from "./components/NewAndOldComplaints";
import Notifications from "./components/Notifications";
import { fetchComplaints,fetchComplaintCategories } from "egov-ui-kit/redux/complaints/actions";
import { resetFiles, removeForm ,setFieldProperty} from "egov-ui-kit/redux/form/actions";
import { mapCompIDToName } from "egov-ui-kit/utils/commons";
import { prepareFormData } from "egov-ui-kit/redux/common/actions";

import { Image } from "components";
import logo from "egov-ui-kit/assets/images/punjab-logo.png";
import orderby from "lodash/orderBy";
import "./index.css";

const iconStyle = {
  color: "#fe7a51",
  height: 45,
  width: 45,
  overflow: "visible"
};

class Home extends Component {
  componentDidMount = () => {
    const { fetchComplaints, resetFiles, removeForm } = this.props;
    this.props.fetchpgrConstants();
    this.props.fetchUiCommonConfig();
    this.props.fetchComplaintCategories();
    this.props.resetCityFieldValue();
    this.props.resetMohallaFieldValue();
    this.props.resetFormData();
    fetchComplaints([], false);
    if (this.props.form && this.props.form.complaint) {
      resetFiles("reopenComplaint");
      removeForm("complaint");
    }
  };

  getCardItems = () => {
    const { updates } = this.props;
    return [
      {
        label: "CS_HOME_FILE_COMPLAINT",
        icon: <Icon style={iconStyle} action="custom" name="comment-plus" />,
        route: "/add-complaint"
      },
      {
        label: "CS_HOME_MY_COMPLAINTS_CARD_LABEL",
        dynamicArray: [updates.length],
        icon: <Icon style={iconStyle} action="custom" name="account-alert" />,
        route: "/my-complaints"
      }
    ];
  };

  render() {
    const { updates, history, loading } = this.props;
    const { getCardItems } = this;
    return (
      <Screen className="homepage-screen" loading={loading}>
        <ModuleLandingPage items={getCardItems()} history={history} />
        <Label
          label="CS_HOME_UPDATES"
          dark={true}
          fontSize={16}
          fontWeight={900}
          bold={true}
          containerStyle={{ paddingLeft: 8, paddingTop: 16, paddingBottom: 8 }}
        />
        <div style={{ padding: "0px 8px" }}>
          <Notifications updates={updates} history={history} />
        </div>
      </Screen>

      // <Screen className="homepage-screen">
      //   {/* <div className="home-page-top-banner-cont">
      //     <div className="banner-image">
      //       <div className="banner-overlay" />
      //       <div className="logo-wrapper user-logo-wrapper">
      //         <Image className="mseva-logo" source={`${logo}`} />
      //       </div>
      //     </div>
      //   </div> */}
      //   <div className="home-page-cont">
      //     <div>
      //       <NewAndOldComplaints history={history} />
      //       <Notifications updates={updates} history={history} />
      //     </div>
      //   </div>
      // </Screen>
    );
  }
}
const mapStateToProps = state => {
  const complaints = state.complaints || {};
  const { fetchSuccess } = complaints;
  const loading = fetchSuccess ? false : true;
  const { form } = state || {};
  let updates = [];
  Object.keys(complaints.byId).forEach((complaintKey, index) => {
    let complaintObj = {};
    let complaintactions =
      complaints.byId[complaintKey].actions &&
      complaints.byId[complaintKey].actions.filter(
        complaint => complaint.status
      );
    complaintObj.status = complaints.byId[complaintKey].status;
    complaintObj.action = complaintactions && complaintactions[0].action;
    complaintObj.title = mapCompIDToName(
      complaints.categoriesById,
      complaints.byId[complaintKey].serviceCode
    );
    complaintObj.date = complaints.byId[complaintKey].auditDetails.createdTime;
    complaintObj.number = complaintKey;
    updates.push(complaintObj);
  });
  var closedComplaints = orderby(
    updates.filter(
      complaint =>
        complaint.status && complaint.status.toLowerCase() === "closed"
    ),
    ["date"],
    ["desc"]
  );

  var nonClosedComplaints = orderby(
    updates.filter(
      complaint =>
        complaint.status && complaint.status.toLowerCase() != "closed"
    ),
    ["date"],
    ["desc"]
  );

  return {
    form,
    updates: [...nonClosedComplaints, ...closedComplaints],
    loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchComplaints: (criteria, hasUsers) =>
      dispatch(fetchComplaints(criteria, hasUsers)),
    resetFiles: formKey => dispatch(resetFiles(formKey)),
    removeForm: formKey => dispatch(removeForm(formKey)),
    fetchComplaintCategories: () => dispatch(fetchComplaintCategories()),
    resetCityFieldValue:()=>dispatch(setFieldProperty("complaint","city","value","")), 
    resetMohallaFieldValue:()=>dispatch(setFieldProperty("complaint","mohalla","value","")), 
    resetFormData:()=>dispatch(prepareFormData("services",[{}])),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
