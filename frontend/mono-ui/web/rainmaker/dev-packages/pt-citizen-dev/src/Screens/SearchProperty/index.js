import Hidden from "@material-ui/core/Hidden";
import { Button, Icon } from "components";
import formHoc from "egov-ui-kit/hocs/form";
import { addBreadCrumbs, fetchLocalizationLabel, toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { displayFormErrors, resetForm } from "egov-ui-kit/redux/form/actions";
import { validateForm } from "egov-ui-kit/redux/form/utils";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { getDateFromEpoch } from "egov-ui-kit/utils/commons";
import { getLocale, getUserInfo, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import { getRowData } from "egov-ui-kit/utils/PTCommon";
import Label from "egov-ui-kit/utils/translationNode";
import { Screen, SingleProperty } from "modules/common";
import React, { Component } from "react";
import { connect } from "react-redux";
import YearDialogue from "../common/YearDialogue";
import PropertyTable from "./components/PropertyTable";
import SearchPropertyForm from "./components/SearchPropertyForm";
import "./index.css";

const PropertySearchFormHOC = formHoc({
  formKey: "searchProperty",
  path: "PropertyTaxPay",
  isCoreConfiguration: true
})(SearchPropertyForm);



class SearchProperty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogueOpen: false,
      searchResult: [],
      showTable: false,
      urlToAppend: ""
    };
  }
  componentWillMount = () => {
    const { history } = this.props;
    history.push('/pt-mutation/propertySearch');
  }
  componentDidMount = () => {
    const { location, addBreadCrumbs, title, resetForm } = this.props;
    const { pathname } = location;
    resetForm("searchProperty");
    if (!(localStorageGet("path") === pathname)) {
      title && addBreadCrumbs({ title: title, path: window.location.pathname });
    }
    this.setState({ searchResult: [] });
  };
  onResetClick = () => {
    const { resetForm } = this.props;
    resetForm("searchProperty");
  };
  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  onSearchClick = (form, formKey) => {
    const { propertiesFound, fetchLocalizationLabel } = this.props;
    const { city, ids, oldpropertyids, mobileNumber, applicationNumber } = form.fields || {};
    const tableData = this.extractTableData(propertiesFound);
    // fetchLocalizationLabel(getLocale(), city.value, city.value);

    if (!validateForm(form)) {
      this.props.displayFormErrors(formKey);
    } else if (!oldpropertyids.value && !ids.value && !mobileNumber.value && !applicationNumber.value) {
      this.props.toggleSnackbarAndSetText(
        true,
        {
          labelName: "Please fill atleast one field along with city",
          labelKey: "ERR_FILL_ATLEAST_ONE_FIELD_WITH_CITY"
        },
        "error"
      );
    } else {
      const queryParams = [];
      if (city.value) {
        queryParams.push({ key: "tenantId", value: city.value });
      }
      if (ids.value) {
        queryParams.push({ key: "propertyIds", value: ids.value });
      }
      if (oldpropertyids.value) {
        queryParams.push({ key: "oldpropertyids", value: oldpropertyids.value });
      }
      if (mobileNumber.value) {
        queryParams.push({ key: "mobileNumber", value: mobileNumber.value });
      }
      if (applicationNumber.value) {
        queryParams.push({ key: "acknowledgementIds", value: applicationNumber.value });
      }
      this.setState({
        searchResult: tableData
      });
      this.props.fetchProperties(queryParams, "citizen_search");
      this.setState({ showTable: true });
    }
  };







  extractTableData = properties => {
    const { history } = this.props;
    const userType = JSON.parse(getUserInfo()).type;
    const tableData = properties.reduce((tableData, property, index) => {
      let {
        propertyId,
        status,
        applicationNo,
        applicationType,
        date,
        propertyDetails,
        tenantId
      } = property;
      if (!applicationNo) applicationNo = property.acknowldgementNumber;
      if (!date) date = getDateFromEpoch(property.auditDetails.createdTime);
      applicationType = history.location.pathname.includes('property-tax') ? 'PT' : applicationType;
      // const latestAssessment = getLatestPropertyDetails(propertyDetails);
      let name = property.owners[0].name;
      // const guardianName = latestAssessment.owners[0].fatherOrHusbandName;
      // let assessmentNo = latestAssessment.assessmentNumber;
      // const uuid = get(latestAssessment, "citizenInfo.uuid");

      let item = getRowData(property, history);
      tableData.push(item);
      return tableData;
    }, []);
    return tableData;
  };

  onActionClick = e => {
  };

  onAddButtonClick = () => {
    // this.setState({
    //   dialogueOpen: true
    // });
    // const { history } = this.props;
    // history.push('/property-tax/assessment-form');

    let link = `/property-tax/assessment-form`;
    let moduleName = process.env.REACT_APP_NAME === "Citizen" ? '/citizen' : '/employee';
    window.location.href = process.env.NODE_ENV === "production" ? moduleName + link : link;
  };

  render() {
    const { urls, location, history, propertiesFound, loading } = this.props;
    const { showTable, urlToAppend } = this.state;
    const { closeYearRangeDialogue } = this;
    let urlArray = [];
    const { pathname } = location;
    const tableData = this.extractTableData(propertiesFound);
    const { searchResult } = this.state;
    if (urls.length == 0 && localStorageGet("path") === pathname) {
      urlArray = JSON.parse(localStorageGet("breadCrumbObject"));
    }
    return (
      <Screen loading={loading} className="screen-with-bredcrumb">
        {/* <BreadCrumbs
          url={urls.length > 0 ? urls : urlArray}
          history={history}
        /> */}
        {/* <br /> */}
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

        <PropertySearchFormHOC
          history={this.props.history}
          onSearchClick={this.onSearchClick}
          onResetClick={this.onResetClick}
        />
        <Hidden xsDown>
          {/* {showTable && tableData.length === 0 && loading==false&&  */}
          {tableData && tableData.length > 0 && showTable ? (
            <PropertyTable
              sortOnObject="propertyId"
              tableData={tableData}
              onActionClick={this.onActionClick}
            />
          ) : null}
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

        {showTable && tableData.length === 0 && loading == false && (
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
        <YearDialogue
          open={this.state.dialogueOpen}
          history={history}
          urlToAppend={urlToAppend}
          closeDialogue={closeYearRangeDialogue}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => {
  const { properties } = state;
  const { urls } = state.app;
  const { propertiesById, loading } = properties && properties;
  const propertiesFound = Object.values(propertiesById);
  return { propertiesFound, urls, loading };
};

const mapDispatchToProps = dispatch => {
  return {
    addBreadCrumbs: url => dispatch(addBreadCrumbs(url)),
    displayFormErrors: formKey => dispatch(displayFormErrors(formKey)),
    fetchProperties: (queryObject, searchType) => dispatch(fetchProperties(queryObject, searchType)),
    toggleSnackbarAndSetText: (open, message, error) =>
      dispatch(toggleSnackbarAndSetText(open, message, error)),
    resetForm: formKey => dispatch(resetForm(formKey)),
    fetchLocalizationLabel: (locale, tenantId, moduleValue) => dispatch(fetchLocalizationLabel(locale, tenantId, moduleValue))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchProperty);
