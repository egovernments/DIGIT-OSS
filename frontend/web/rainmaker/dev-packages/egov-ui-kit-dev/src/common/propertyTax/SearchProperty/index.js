import React, { Component } from "react";
import formHoc from "egov-ui-kit/hocs/form";
import Label from "egov-ui-kit/utils/translationNode";
import Screen from "egov-ui-kit/common/common/Screen";
import YearDialogue from "../YearDialogue";
import { Button, BreadCrumbs ,Icon} from "egov-ui-kit/components";
import { addBreadCrumbs, toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import SearchPropertyForm from "./components/SearchPropertyForm";
import PropertyTable from "./components/PropertyTable";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { displayFormErrors, resetForm } from "egov-ui-kit/redux/form/actions";
import { connect } from "react-redux";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import get from "lodash/get";
import { getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";

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
    const { location, addBreadCrumbs, title } = this.props;
    const pathname = location && location.pathname;
    if (userType === "CITIZEN" && !(localStorageGet("path") === pathname)) {
      title && addBreadCrumbs({ title: title, path: window.location.pathname });
    }
  };
  onResetClick = () => {
    const { resetForm } = this.props;
    resetForm("searchProperty");
   
  };
  onSearchClick = (form, formKey) => {
    const { city, ids, oldpropertyids, mobileNumber } = form.fields || {};
    if (!validateForm(form)) {
      this.props.displayFormErrors(formKey);
    } else if (!oldpropertyids.value && !ids.value && !mobileNumber.value) {
      this.props.toggleSnackbarAndSetText(
        true,
        { labelName: "Please fill atleast one field along with city", labelKey: "ERR_FILL_ATLEAST_ONE_FIELD_WITH_CITY" },
        true
      );
    } else {
      const queryParams = [];
      if (city.value) {
        queryParams.push({ key: "tenantId", value: city.value });
      }
      if (ids.value) {
        queryParams.push({ key: "ids", value: ids.value });
      }
      if (oldpropertyids.value) {
        queryParams.push({ key: "oldpropertyids", value: oldpropertyids.value });
      }
      if (mobileNumber.value) {
        queryParams.push({ key: "mobileNumber", value: mobileNumber.value });
      }
      this.props.fetchProperties(queryParams);
      this.setState({ showTable: true });
    }
  };

  extractTableData = (properties) => {
    const { history } = this.props;
    const tableData = properties.reduce((tableData, property, index) => {
      let {
        propertyId,
        status,
        oldPropertyId,
        address,
        propertyDetails,
        tenantId
      } = property;
      const { doorNo, buildingName, street, locality } = address;
      let displayAddress = doorNo
        ? `${doorNo ? doorNo + "," : ""}` + `${buildingName ? buildingName + "," : ""}` + `${street ? street + "," : ""}`
        : `${locality.name ? locality.name : ""}`;

      const latestAssessment = getLatestPropertyDetails(propertyDetails);
      let name = latestAssessment.owners[0].name;
      let guardianName = latestAssessment.owners[0].fatherOrHusbandName || "";
      let assessmentNo = latestAssessment.assessmentNumber;
      const uuid = get(latestAssessment, "citizenInfo.uuid");
      // let button = (
      //   <Button
      //     onClick={
      //       userType === "CITIZEN"
      //         ? () => {
      //           // localStorageSet("draftId", "")
      //           this.setState({
      //             dialogueOpen: true,
      //             urlToAppend: `/property-tax/assessment-form?assessmentId=${assessmentNo}&isReassesment=true&uuid=${uuid}&propertyId=${propertyId}&tenantId=${tenantId}`,
      //           });
      //         }
      //         : (e) => {
      //           // localStorageSet("draftId", "")
      //           history.push(`/property-tax/property/${propertyId}/${property.tenantId}`);
      //         }
      //     }
      //     label={
      //       <Label buttonLabel={true} label={userType === "CITIZEN" ? "PT_PAYMENT_ASSESS_AND_PAY" : "PT_SEARCHPROPERTY_TABLE_VIEW"} fontSize="12px" />
      //     }
      //     value={propertyId}
      //     primary={true}
      //     style={{ height: 20, lineHeight: "auto", minWidth: "inherit" }}
      //   />
      // );
      let button = (
        <a
        onClick={
                userType === "CITIZEN"
                  ? () => {
                    // localStorageSet("draftId", "")
                    this.setState({
                      dialogueOpen: true,
                      urlToAppend: `/property-tax/assessment-form?assessmentId=${assessmentNo}&isReassesment=false&uuid=${uuid}&propertyId=${propertyId}&tenantId=${tenantId}`,
                    });
                  }
                  : (e) => {
                    // localStorageSet("draftId", "")
                    history.push(`/property-tax/property/${propertyId}/${property.tenantId}`);
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

      let item = {
        index: index + 1,
        propertyId: button,
        name: name,
        guardianName: guardianName,
        oldPropertyId: oldPropertyId,
        address: displayAddress,
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
            className="rainmaker-displayInline"
            onClick={this.onAddButtonClick}
          >
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
            {/* <Icon
              action="content"
              name="add"
              color="#fe7a51"
              style={{ height: 22 }}
            /> */}
            {/* <Label label="ADD NEW PROPERTY" color="#fe7a51" /> */}
          </div>
        </div>
        <PropertySearchFormHOC history={this.props.history} onSearchClick={this.onSearchClick} onResetClick={this.onResetClick} />
        {tableData.length > 0 && showTable ? <PropertyTable tableData={tableData} onActionClick={this.onActionClick} /> : null}
        {showTable && tableData.length === 0 && (
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
    resetForm: formKey => dispatch(resetForm(formKey))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchProperty);
