import Hidden from "@material-ui/core/Hidden";
import Screen from "egov-ui-kit/common/common/Screen";
import { Button, Icon } from "egov-ui-kit/components";
import formHoc from "egov-ui-kit/hocs/form";
import { addBreadCrumbs, fetchLocalizationLabel, toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { displayFormErrors, resetForm } from "egov-ui-kit/redux/form/actions";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import { getLocale, getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component } from "react";
import { connect } from "react-redux";
import SingleProperty from "../SingleProperty";
import YearDialogue from "../YearDialogue";
import PropertyTable from "./components/PropertyTable";
import SearchPropertyForm from "./components/SearchPropertyForm";
import "./index.css";


const userType = getUserInfo() && JSON.parse(getUserInfo()).type;

const PropertySearchFormHOC = formHoc({ formKey: "searchProperty", path: "PropertyTaxPay", isCoreConfiguration: true })(SearchPropertyForm);

class SearchProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogueOpen: false,
      searchResult: [],
      showTable: false,
      urlToAppend: "",
    };
  }

  componentDidMount = () => {
    const { location, addBreadCrumbs, title, resetForm } = this.props;
    const pathname = location && location.pathname;
    if (userType === "CITIZEN" && !(localStorageGet("path") === pathname)) {
      title && addBreadCrumbs({ title: title, path: window.location.pathname });
    }
    resetForm("searchProperty");
  };
  onResetClick = () => {
    const { resetForm } = this.props;
    resetForm("searchProperty");

  };
  onSearchClick = (form, formKey) => {
    const { fetchLocalizationLabel } = this.props
    const { city, ids, oldpropertyids, mobileNumber, applicationNumber } = form.fields || {};
    if (!validateForm(form)) {
      this.props.displayFormErrors(formKey);
    } else if (!oldpropertyids.value && !ids.value && !mobileNumber.value) {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Please fill atleast one field along with city", labelKey: "ERR_FILL_ATLEAST_ONE_FIELD_WITH_CITY" },
        "error"
      );
    } else {
      const queryParams = [];
      if (city && city.value) {
        queryParams.push({ key: "tenantId", value: city.value });
      }
      if (ids && ids.value) {
        queryParams.push({ key: "propertyIds", value: ids.value });
      }
      if (oldpropertyids && oldpropertyids.value) {
        queryParams.push({ key: "oldpropertyids", value: oldpropertyids.value });
      }
      if (mobileNumber && mobileNumber.value) {
        queryParams.push({ key: "mobileNumber", value: mobileNumber.value });
      }
      if (applicationNumber && applicationNumber.value) {
        queryParams.push({ key: "applicationNumber", value: applicationNumber.value });
      }
      this.props.fetchProperties(queryParams);
      this.setState({ showTable: true });
    }
    // fetchLocalizationLabel(getLocale(), city.value, city.value);
  };



  getLink = (userType, history, propertyId, tenantId) => {
    return (
      <a
        onClick={
          (e) => {
            // localStorageSet("draftId", "")
            history.push(`/property-tax/property/${propertyId}/${tenantId}`);
          }
        }
        style={{
          height: 20,
          lineHeight: "auto",
          minWidth: "inherit",
          cursor: "pointer",
          textDecoration: "underline"
        }}>
        {propertyId}
      </a>);
  }

  extractTableData = (properties) => {
    const { history } = this.props;
    const tableData = properties.reduce((tableData, property, index) => {
      let {
        propertyId,
        status,
        applicationNo,
        applicationType,
        date,
        propertyDetails,
        tenantId,
      } = property;

      if (!applicationNo) applicationNo = property.acknowldgementNumber;
      if (!date) date = getDateFromEpoch(property.auditDetails.createdTime);
      applicationType = history.location.pathname.includes('property-tax') ? 'PT' : applicationType;
      const latestAssessment = getLatestPropertyDetails(propertyDetails);
      let name = latestAssessment.owners[0].name;
      // let guardianName = latestAssessment.owners[0].fatherOrHusbandName || "";
      // let assessmentNo = latestAssessment.assessmentNumber;
      // const uuid = get(latestAssessment, "citizenInfo.uuid");

      // let button = (
      //   <a
      //     onClick={
      //       userType === "CITIZEN"
      //         ? () => {
      //           // localStorageSet("draftId", "")
      //           this.setState({
      //             dialogueOpen: true,
      //             urlToAppend: `/property-tax/assessment-form?assessmentId=${assessmentNo}&isReassesment=false&uuid=${uuid}&propertyId=${propertyId}&tenantId=${tenantId}`,
      //           });
      //         }
      //         : (e) => {
      //           // localStorageSet("draftId", "")
      //           history.push(`/property-tax/property/${propertyId}/${property.tenantId}`);
      //         }
      //     }
      //     style={{
      //       height: 20,
      //       lineHeight: "auto",
      //       minWidth: "inherit",
      //       cursor: "pointer",
      //       textDecoration: "underline",
      //       fontWeight: '400',
      //       fontSize: "14px",
      //       color: 'rgba(0, 0, 0, 0.87)',
      //       lineHeight: '30px'
      //     }}>
      //     {propertyId}
      //   </a>);

      let item = {
        // applicationNo: this.getLink(userType, history, applicationNo, tenantId),
        applicationNo: <a>{applicationNo}</a>,
        propertyId: this.getLink(userType, history, propertyId, tenantId),
        name: name,
        applicationType: applicationType,
        date: date,
        status: status

      };
      tableData.push(item);
      return tableData;
    }, []);
    return tableData;
  };

  onActionClick = (e) => {
    console.log(e);
  };

  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };
  onAddButtonClick = () => {
    this.setState({
      dialogueOpen: true
    });

  };
  onNewPropertyButtonClick = () => {
    this.setState({
      dialogueOpen: true,
    });
  };

  render() {
    const { urls, location, history, propertiesFound, loading } = this.props;
    const { showTable, urlToAppend } = this.state;
    const { closeYearRangeDialogue } = this;
    let urlArray = [];
    const pathname = location && location.pathname;
    const tableData = this.extractTableData(propertiesFound);
    if (userType === "CITIZEN" && urls.length == 0 && localStorageGet("path") === pathname) {
      urlArray = JSON.parse(localStorageGet("breadCrumbObject"));
    }
    return (
      <Screen loading={loading}>
        {/* {userType === "CITIZEN" ? <BreadCrumbs url={urls.length > 0 ? urls : urlArray} history={history} /> : []} */}
        <div className="rainmaker-displayInline inner-header-style">
          <Label
            label="PT_PROPERTY_TAX"
            dark={true}
            fontSize={18}
            fontWeight={500}
            bold={true}
            labelStyle={{ marginTop: "20px" }}
          />
          <div
            className="rainmaker-displayInline"  >
            <Button
              Icon={
                <Icon
                  action="content"
                  name="add"
                  color="#fe7a51"
                  style={{ height: 22 }}
                />
              }
              label={
                <Label
                  label="PT_ADD_ASSESS_PROPERTY"
                  buttonLabel={true}
                  fontSize="16px"
                  color="white"
                />
              }
              labelStyle={{ fontSize: 12 }}
              className="new-property-assessment"
              onClick={() => this.onAddButtonClick()}
              primary={true}
              fullWidth={true}
            />
          </div>
        </div>
        <PropertySearchFormHOC history={this.props.history} onSearchClick={this.onSearchClick} onResetClick={this.onResetClick} />
        <Hidden xsDown>
          {!loading && showTable && tableData.length > 0 ?
            <PropertyTable tableData={tableData} sortOnObject="propertyId" onActionClick={this.onActionClick} /> : null}
        </Hidden>
        <Hidden smUp>
          {tableData && tableData.length > 0 && showTable && (

            <Label
              secondaryText={'(' + tableData.length + ')'}
              label="PT_SEARCH_PROPERTY_TABLE_HEADERS"
              className="property-search-table-heading"
              fontSize={16}
              labelStyle={{
                fontFamily: "Roboto",
                fontSize: "16px",
                fontWeight: 500,
                letterSpacing: "0px",
                textAlign: "left",
                color: "#484848"
              }}
            />
          )}
          <SingleProperty
            data={tableData}
            action={"PT_PAYMENT_ACCESSANDPAY"}
            onActionClick={this.onAddButtonClick}
          />
        </Hidden>
        {!loading && showTable && !tableData.length && (
          <div className="search-no-property-found">
            <div className="no-search-text">
              <Label label="PT_NO_PROPERTY_RECORD" />
            </div>
            <div className="new-assess-btn">
              <Button
                label={<Label label="PT_ADD_ASSESS_PROPERTY" buttonLabel={true} />}
                labelStyle={{ fontSize: 12 }}
                className="new-property-assessment"
                onClick={() => this.onAddButtonClick()}
                primary={true}
                fullWidth={true}
              />
            </div>
          </div>
        )}
        <YearDialogue open={this.state.dialogueOpen} history={history} urlToAppend={urlToAppend} closeDialogue={closeYearRangeDialogue} />
      </Screen>
    );
  }
}

const mapStateToProps = (state) => {
  const { properties } = state;
  const { urls } = state.app;
  const { propertiesById, loading } = properties && properties;
  const propertiesFound = Object.values(propertiesById);
  return { propertiesFound, urls, loading };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBreadCrumbs: (url) => dispatch(addBreadCrumbs(url)),
    displayFormErrors: (formKey) => dispatch(displayFormErrors(formKey)),
    fetchProperties: (queryObject) => dispatch(fetchProperties(queryObject)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    resetForm: formKey => dispatch(resetForm(formKey)),
    fetchLocalizationLabel: (locale, tenantId, moduleValue) => dispatch(fetchLocalizationLabel(locale, tenantId, moduleValue))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchProperty);
