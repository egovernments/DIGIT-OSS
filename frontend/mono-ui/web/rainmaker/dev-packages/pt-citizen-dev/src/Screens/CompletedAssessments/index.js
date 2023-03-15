import React, { Component } from "react";
import { Icon } from "components";
import { AssessmentList } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import { Screen } from "modules/common";
import { connect } from "react-redux";
import { BreadCrumbs } from "components";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { removeForm } from "egov-ui-kit/redux/form/actions";
import { resetFormWizard } from "egov-ui-kit/utils/PTCommon";
import { getCompletedTransformedItems } from "../common/TransformedAssessments";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import { getAssesmentsandStatus } from "egov-ui-kit/redux/properties/actions";
import commonConfig from "config/common.js";
import orderby from "lodash/orderBy";
import "./index.css";

const innerDivStyle = {
  padding: "0px",
  borderBottom: "1px solid #e0e0e0"
};

const secondaryTextLabelStyle = {
  letterSpacing: 0.5
};

const primaryTextLabelStyle = {
  letterSpacing: 0.6
};

const secondaryTextContainer = {
  marginTop: 5
};
class CompletedAssessments extends Component {
  iconStyle = {
    marginLeft: "10px",
    height: "20px"
  };
  state = {
    dialogueOpen: false,
    items: [
      {
        primaryText: (
          <Label
            label="INR 1300.00"
            fontSize="16px"
            color="#484848"
            bold={true}
            labelStyle={primaryTextLabelStyle}
          />
        ),
        secondaryText: (
          <div style={{ height: "auto" }}>
            <Label
              label="2016-2017"
              containerStyle={secondaryTextContainer}
              labelStyle={secondaryTextLabelStyle}
            />
            <Label
              label="P-9/2, Banwinder Colony, alwal Road, Indirapuram"
              containerStyle={secondaryTextContainer}
              labelStyle={secondaryTextLabelStyle}
            />
            <Label
              label="Assessment No.: ZRN-453-98"
              containerStyle={secondaryTextContainer}
              labelStyle={secondaryTextLabelStyle}
            />
          </div>
        ),
        date: "12-06-2018",
        status: "Paid",
        statusIcon: (
          <Icon
            action="navigation"
            name="check"
            style={this.iconStyle}
            color={"#22b25f"}
          />
        ),
        receipt: true
      }
    ]
  };

  componentDidMount = () => {
    const {
      addBreadCrumbs,
      title,
      userInfo,
      fetchGeneralMDMSData,
      getAssesmentsandStatus,
      form,
      removeForm
    } = this.props;
    title && addBreadCrumbs({ title: title, path: window.location.pathname });
    //getFetchGeneralMDMSData(fetchGeneralMDMSData);
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              {
                name: "Floor"
              },
              {
                name: "UsageCategoryMajor"
              },
              {
                name: "UsageCategoryMinor"
              },
              {
                name: "UsageCategorySubMinor"
              },
              {
                name: "OccupancyType"
              },
              {
                name: "PropertyType"
              },
              {
                name: "PropertySubType"
              },
              {
                name: "OwnerType"
              },
              {
                name: "UsageCategoryDetail"
              }
            ]
          }
        ]
      }
    };
    fetchGeneralMDMSData(requestBody, "PropertyTax", [
      "Floor",
      "UsageCategoryMajor",
      "UsageCategoryMinor",
      "UsageCategorySubMinor",
      "OccupancyType",
      "PropertyType",
      "PropertySubType",
      "OwnerType",
      "UsageCategoryDetail"
    ]);
    getAssesmentsandStatus([{ key: "accountId", value: userInfo.uuid }]);
    resetFormWizard(form, removeForm);
  };

  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  onNewPropertyButtonClick = () => {
    this.setState({
      dialogueOpen: true
    });
  };

  render() {
    const {
      urls,
      history,
      loading,
      sortedProperties,
      generalMDMSDataById
    } = this.props;
    return (
      <Screen loading={loading} className="screen-with-bredcrumb">
        <BreadCrumbs url={urls} history={history} />
        {sortedProperties && (
          <AssessmentList
            innerDivStyle={innerDivStyle}
            items={sortedProperties}
            noAssessmentMessage="PT_NO_ASSESSMENT_MESSAGE1"
            button={true}
            history={history}
            yearDialogue={this.state.dialogueOpen}
            closeDialogue={this.closeYearRangeDialogue}
            onNewPropertyButtonClick={this.onNewPropertyButtonClick}
            hoverColor="#fff"
            generalMDMSDataById={generalMDMSDataById && generalMDMSDataById}
          />
        )}
      </Screen>
    );
  }
}
const mapStateToProps = state => {
  const { properties, common, app, form } = state;
  const { localizationLabels } = app;
  const { cities, generalMDMSDataById } = common;
  const { urls } = state.app;
  const { assessmentsByStatus, loading } = properties || {};
  const completedAssessments = getCompletedTransformedItems(
    assessmentsByStatus,
    cities,
    localizationLabels
  );
  const sortedProperties =
    completedAssessments &&
    orderby(completedAssessments, ["epocDate"], ["desc"]);
  return { sortedProperties, urls, loading, form, generalMDMSDataById };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url)),
    getAssesmentsandStatus: queryObj =>
      dispatch(getAssesmentsandStatus(queryObj)),
    removeForm: formkey => dispatch(removeForm(formkey)),
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) =>
      dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompletedAssessments);
