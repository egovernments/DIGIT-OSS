import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { getCommaSeperatedAddress, getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLatestPropertyDetails } from "egov-ui-kit/utils/PTCommon";
import AssessmentList from "../AssessmentList";
import YearDialogue from "../YearDialogue";
import Screen from "egov-ui-kit/common/common/Screen";
import { Icon, BreadCrumbs } from "egov-ui-kit/components";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import PropertyInformation from "./components/PropertyInformation";
import { fetchProperties, getSingleAssesmentandStatus } from "egov-ui-kit/redux/properties/actions";
import { getCompletedTransformedItems } from "egov-ui-kit/common/propertyTax/TransformedAssessments";
import isEqual from "lodash/isEqual";
import orderby from "lodash/orderBy";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";
import { Button, Card } from "components";
import "./index.css";
import PTHeader from "../../common/PTHeader";


const innerDivStyle = {
  padding: "0",
  // borderBottom: "1px solid #e0e0e0",
  marginLeft: 0,
};

const IconStyle = {
  margin: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  height: "inherit",
};

const listItemStyle = {
  padding: "0px 20px",
  borderWidth: "10px 10px 0px",
};

const appName = process.env.REACT_APP_NAME;

const locale = getLocale() || "en_IN";
const localizationLabelsData = initLocalizationLabels(locale);

class Property extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathName: null,
      dialogueOpen: false,
      urlToAppend: "",
    };
  }

  componentDidMount = () => {
    const { location, addBreadCrumbs, fetchGeneralMDMSData, renderCustomTitleForPt, customTitle, fetchProperties } = this.props;
    const requestBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "PropertyTax",
            masterDetails: [
              {
                name: "Floor",
              },
              {
                name: "UsageCategoryMajor",
              },
              {
                name: "UsageCategoryMinor",
              },
              {
                name: "UsageCategorySubMinor",
              },
              {
                name: "OccupancyType",
              },
              {
                name: "PropertyType",
              },
              {
                name: "PropertySubType",
              },
              {
                name: "OwnerType",
              },
              {
                name: "UsageCategoryDetail",
              },
              {
                name: "SubOwnerShipCategory",
              },
            ],
          },
        ],
      },
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
      "UsageCategoryDetail",
      "SubOwnerShipCategory",
    ]);
    fetchProperties([
      { key: "ids", value: decodeURIComponent(this.props.match.params.propertyId) },
      { key: "tenantId", value: this.props.match.params.tenantId },
    ]);
    const { pathname } = location;
    if (appName === "Citizen" && !(localStorageGet("path") === pathname)) {
      customTitle && addBreadCrumbs({ title: customTitle, path: window.location.pathname });
    }
    renderCustomTitleForPt(customTitle);
  };

  onListItemClick = (item) => {
    const { getSingleAssesmentandStatus } = this.props;
    const { route } = item;
    route && getSingleAssesmentandStatus(route);
  };

  onAssessPayClick = () => {
    const { latestPropertyDetails, propertyId, tenantId } = this.props;
    const assessmentNo = latestPropertyDetails && latestPropertyDetails.assessmentNumber;
    //const uuid = get(latestPropertyDetails, "citizenInfo.uuid");
    // localStorage.removeItem("draftId");
    this.setState({
      dialogueOpen: true,
      urlToAppend: `/property-tax/assessment-form?assessmentId=${assessmentNo}&isReassesment=true&isAssesment=true&propertyId=${propertyId}&tenantId=${tenantId}`,
    });
  };

  getAssessmentListItems = (props) => {
    const { propertyItems, propertyId, history, sortedAssessments, selPropertyDetails, tenantId } = props;
    return [
      {
        primaryText: (
          <PropertyInformation
            items={propertyItems}
            propertyTaxAssessmentID={propertyId}
            history={history}
            tenantId={tenantId}
            onButtonClick={this.onAssessPayClick}
          />
        ),
        initiallyOpen: true,
      },
      {
        primaryText: <Label label="PT_PROPERTY_ASSESSMENT_HISTORY" labelClassName="property-info-title" />,
        route: selPropertyDetails,
        nestedItems: sortedAssessments && sortedAssessments,
        rightIcon: (
          <div style={IconStyle}>
            <Icon action="hardware" name="keyboard-arrow-down" color="#484848" />
          </div>
        ),
        initiallyOpen: true,
      },
    ];
  };

  componentWillReceiveProps = (nextProps) => {
    const { customTitle, renderCustomTitleForPt } = this.props;
    if (!isEqual(customTitle, nextProps.customTitle)) {
      renderCustomTitleForPt(nextProps.customTitle);
    }
  };

  closeYearRangeDialogue = () => {
    this.setState({ dialogueOpen: false });
  };

  render() {
    const { urls, location, history, generalMDMSDataById, latestPropertyDetails, propertyId, selPropertyDetails } = this.props;
    const { closeYearRangeDialogue } = this;
    const { dialogueOpen, urlToAppend } = this.state;
    let urlArray = [];
    const { pathname } = location;
    if (urls.length === 0 && localStorageGet("path") === pathname) {
      urlArray = JSON.parse(localStorageGet("breadCrumbObject"));
    }
    //const uuid = get(latestPropertyDetails, "citizenInfo.uuid");
    let clsName = appName === "Citizen" ? "screen-with-bredcrumb" : "";

    return (
      <Screen className={clsName}>
        {/* <div>
            <Label
              label="PT_PROPERTY_INFORMATION"
              containerStyle={{ padding: "24px 0px 0px 0px", marginLeft: "16px", display: "inline-block" }}
              dark={true}
              bold={true}
              labelStyle={{ letterSpacing: 0 }}
              fontSize={"20px"}
            />
            <Label
              bold={true}
              label={`${getTranslatedLabel("PT_PROPERTY_PTUID", localizationLabelsData)} ${propertyId}`}
              containerStyle={{ marginLeft: "13px", display: "inline-block" }}
              labelStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                color: "rgba(255, 255, 255, 0.87)",
                marginLeft: "8px",
                paddingLeft: "19px",
                paddingRight: "19px",
                textAlign: "center",
                verticalAlign: "middle",
                lineHeight: "35px",
                fontSize: "16px",
              }}
              fontSize={"16px"}
            />
          </div> */}
        <PTHeader header='PT_PROPERTY_INFORMATION' subHeaderTitle='PT_PROPERTY_PTUID' subHeaderValue={propertyId} />
        {

          <AssessmentList
            onItemClick={this.onListItemClick}
            items={this.getAssessmentListItems(this.props)}
            innerDivStyle={innerDivStyle}
            listItemStyle={listItemStyle}
            history={history}
            hoverColor="#fff"
            properties={selPropertyDetails}
            generalMDMSDataById={generalMDMSDataById && generalMDMSDataById}
          // citizenUserId={uuid}
          />
        }

        {/* <div className="flex-container">
          <div className="property-info-access-btn" onClick={this.onAssessPayClick}>
            <Button
              onClick={() => this.onAssessPayClick()}
              label={<Label buttonLabel={true} label="PT_PAYMENT_ASSESS_AND_PAY" fontSize="16px" />}
              primary={true}
              style={{ lineHeight: "auto", minWidth: "inherit" }}
            />
          </div>
        </div> */}
        <div
          id="tax-wizard-buttons"
          className="wizard-footer col-sm-12"
          style={{ textAlign: "right" }}
        >
          <div className="button-container col-xs-6 property-info-access-btn" style={{ float: "right" }}>
            <Button
              onClick={() => this.onAssessPayClick()}
              label={<Label buttonLabel={true} label="PT_ASSESS_PROPERTY" fontSize="16px" />}
              primary={true}
              style={{ lineHeight: "auto", minWidth: "inherit" }}
            />
          </div>
        </div>

        <div  >

        </div>

        {dialogueOpen && <YearDialogue open={dialogueOpen} history={history} urlToAppend={urlToAppend} closeDialogue={closeYearRangeDialogue} />}
      </Screen>
    );
  }
}
const getYearlyAssessments = (propertiesArray) => {
  let yearlyAssessments = [];
  propertiesArray.map((property) => {
    console.log(property.assessmentNumber, property.financialYear, property.auditDetails.lastModifiedTime);
    if (yearlyAssessments.length == 0) {
      yearlyAssessments[0] = [property];
    } else {
      let bool = true;
      for (let pty of yearlyAssessments) {
        if (pty[0].financialYear == property.financialYear) {
          pty.push(property)
          bool = false;
        }
      }
      if (bool) {
        yearlyAssessments.push([property]);
      }
    }
  })
  console.log(yearlyAssessments, 'bef-yearlyAssessments');
  for (let eachYrAssessments of yearlyAssessments) {
    eachYrAssessments.sort((x, y) => y.assessmentDate - x.assessmentDate);
  }
  console.log(yearlyAssessments, 'aft-yearlyAssessments');
  yearlyAssessments.sort((x, y) => x[0].financialYear.localeCompare(y[0].financialYear));
  return yearlyAssessments;
}
const getPendingAssessments = (selPropertyDetails, singleAssessmentByStatus = []) => {
  let pendingAssessments = [];
  if (singleAssessmentByStatus.length === 0) {
    return pendingAssessments;
  }
  console.log(selPropertyDetails, singleAssessmentByStatus, '(selPropertyDetails,singleAssessmentByStatus)');
  let propertiesArray = selPropertyDetails.propertyDetails || [];
  console.log("assessmentNumber,financialYear,lastModifiedTime");
  let yearlyAssessments = [];
  yearlyAssessments = getYearlyAssessments(propertiesArray);
  console.log(yearlyAssessments, 'yearlyAssessments');
  let paidAssessments = [];
  paidAssessments = getYearlyAssessments(singleAssessmentByStatus);
  console.log(paidAssessments, 'paidAssessments');
  for (let eachYrAssessments of yearlyAssessments) {
    // eachYrAssessments.sort((x,y)=>y.assessmentDate-x.assessmentDate);
    // if(checkPaid(eachYrAssessments[0],singleAssessmentByStatus)){
    //   pendingAssessments.push(eachYrAssessments[0]);
    // }
    let bol=true;
    for (let paidAssessment of paidAssessments) {
      if (eachYrAssessments[0].financialYear === paidAssessment[0].financialYear) {
        bol=false;
        pendingAssessments.push(paidAssessment[0]);
        if (eachYrAssessments[0].assessmentNumber !== paidAssessment[0].assessmentNumber) {
          pendingAssessments.push(eachYrAssessments[0]);
        }
      }
    }
    if(bol){
      pendingAssessments.push(eachYrAssessments[0]);
    }


  }
  return pendingAssessments;
}
const checkPaid = (property, ptList = []) => {
  let status = true;
  for (let pt of ptList) {
    if (pt.assessmentNumber == property.assessmentNumber) {
      status = false;
    }
  }
  return status;
}
const getAddressInfo = (addressObj, extraItems) => {
  return (
    addressObj && [
      {
        heading: getTranslatedLabel("PT_PROPERTY_ADDRESS_SUB_HEADER", localizationLabelsData),
        // iconAction: "action",
        iconName: "home",
        items: [
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_CITY", localizationLabelsData),
            value: addressObj.city || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_HOUSE_NO", localizationLabelsData),
            value: addressObj.doorNo || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_COLONY_NAME", localizationLabelsData),
            value: addressObj.buildingName || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_STREET_NAME", localizationLabelsData),
            value: addressObj.street || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_MOHALLA", localizationLabelsData),
            value: addressObj.locality.name || "NA",
          },
          {
            key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PINCODE", localizationLabelsData),
            value: addressObj.pincode || "NA",
          },
          ...extraItems,
        ],
      },
    ]
  );
};

const transform = (floor, key, generalMDMSDataById, propertyDetails) => {
  const { propertySubType, usageCategoryMajor } = propertyDetails;
  const { masterName, dataKey } = key;
  if (!masterName) {
    return floor["occupancyType"] === "RENTED" ? `INR ${floor["arv"]}` : `${Math.round(floor[dataKey] * 100) / 100} sq yards`;
  } else {
    if (floor[dataKey]) {
      if (dataKey === "usageCategoryDetail") {
        return generalMDMSDataById["UsageCategoryDetail"]
          ? generalMDMSDataById["UsageCategoryDetail"][floor[dataKey]].name
          : generalMDMSDataById["UsageCategorySubMinor"]
            ? generalMDMSDataById["UsageCategorySubMinor"][floor["usageCategorySubMinor"]].name
            : "NA";
      }
      // if (usageCategoryMajor === "RESIDENTIAL" && propertySubType === "SHAREDPROPERTY" && dataKey === "floorNo") {
      //   return "NA";
      // }
      if (floor[dataKey] === "NONRESIDENTIAL") {
        return generalMDMSDataById["UsageCategoryMinor"] ? generalMDMSDataById["UsageCategoryMinor"][floor["usageCategoryMinor"]].name : "NA";
      } else {
        return generalMDMSDataById[masterName] ? generalMDMSDataById[masterName][floor[dataKey]].name : "NA";
      }
    } else {
      return "NA";
    }
  }
};

const getAssessmentInfo = (propertyDetails, keys, generalMDMSDataById) => {
  const { units } = propertyDetails || {};
  return (
    propertyDetails && [
      {
        heading: getTranslatedLabel("PT_ASSESMENT_INFO_SUB_HEADER", localizationLabelsData),
        iconAction: "action",
        iconName: "assignment",
        showTable: true,
        tableHeaderItems: [
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
            value: propertyDetails.usageCategoryMajor ? propertyDetails.usageCategoryMajor : "NA", //noOfFloors
          },
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_TYPE_OF_BUILDING", localizationLabelsData),
            value: generalMDMSDataById
              ? propertyDetails.propertySubType
                ? generalMDMSDataById["PropertySubType"]
                  ? generalMDMSDataById["PropertySubType"][propertyDetails.propertySubType].name
                  : "NA"
                : generalMDMSDataById["PropertyType"]
                  ? generalMDMSDataById["PropertyType"][propertyDetails.propertyType].name
                  : "NA"
              : "NA",
          },
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_PLOT_SIZE", localizationLabelsData),
            value:
              propertyDetails.propertySubType === "SHAREDPROPERTY"
                ? "NA"
                : propertyDetails.uom
                  ? `${propertyDetails.landArea} ${propertyDetails.uom}`
                  : `${Math.round(propertyDetails.landArea * 100) / 100} sq yards`,
          },
          {
            key: getTranslatedLabel("PT_ASSESMENT_INFO_NO_OF_FLOOR", localizationLabelsData),
            value: propertyDetails.noOfFloors ? `${propertyDetails.noOfFloors}` : "NA", //noOfFloors
          },
        ],
        items: {
          header: units
            ? [
              getTranslatedLabel("PT_ASSESMENT_INFO_FLOOR", localizationLabelsData),
              getTranslatedLabel("PT_ASSESMENT_INFO_USAGE_TYPE", localizationLabelsData),
              // getTranslatedLabel("PT_ASSESMENT_INFO_SUB_USAGE_TYPE", localizationLabelsData),
              getTranslatedLabel("PT_ASSESMENT_INFO_OCCUPLANCY", localizationLabelsData),
              getTranslatedLabel("PT_ASSESMENT_INFO_AREA_RENT", localizationLabelsData),
            ]
            : [],
          values: units
            ? units.map((floor) => {
              return {
                value: keys.map((key) => {
                  return transform(floor, key, generalMDMSDataById, propertyDetails);
                }),
              };
            })
            : [],
        },
      },
    ]
  );
};

const getOwnerInfo = (latestPropertyDetails, generalMDMSDataById) => {
  const isInstitution =
    latestPropertyDetails.ownershipCategory === "INSTITUTIONALPRIVATE" || latestPropertyDetails.ownershipCategory === "INSTITUTIONALGOVERNMENT";
  const { institution, owners: ownerDetails } = latestPropertyDetails || {};
  return (
    ownerDetails && [
      {
        heading: getTranslatedLabel("PT_OWNERSHIP_INFO_SUB_HEADER", localizationLabelsData),
        iconAction: "social",
        iconName: "person",
        nestedItems: true,
        items: ownerDetails.map((owner) => {
          console.log("jagan--<?", owner.dob);

          return {
            items: [
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_INSTI", localizationLabelsData),
                  value: (institution && institution.name) || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME", localizationLabelsData),
                  value: owner.name || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_DESIGNATION", localizationLabelsData),
                  value: institution.designation || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_SEARCHPROPERTY_TABEL_GUARDIANNAME", localizationLabelsData),
                  value: owner.fatherOrHusbandName || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
                  value:
                    (institution &&
                      institution.type &&
                      generalMDMSDataById &&
                      generalMDMSDataById["SubOwnerShipCategory"] &&
                      generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                    "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_GENDER", localizationLabelsData),
                  value: owner.gender || "NA",
                },
              isInstitution
                ? {
                  // key: getTranslatedLabel("PT_OWNERSHIP_INFO_TYPE_INSTI", localizationLabelsData),
                  // value:
                  //   (institution &&
                  //     institution.type &&
                  //     generalMDMSDataById &&
                  //     generalMDMSDataById["SubOwnerShipCategory"] &&
                  //     generalMDMSDataById["SubOwnerShipCategory"][institution.type].name) ||
                  //   "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_DOB", localizationLabelsData),
                  value: owner.dob || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_NAME_OF_AUTH", localizationLabelsData),
                  value: owner.name || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                  value: owner.mobileNumber || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_TEL_NO", localizationLabelsData),
                  value: owner.altContactNumber || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_EMAIL_ID", localizationLabelsData),
                  value: owner.emailId || "NA",
                },
              isInstitution
                ? {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_MOBILE_NO", localizationLabelsData),
                  value: owner.mobileNumber || "NA",
                }
                : {
                  key: getTranslatedLabel("PT_OWNERSHIP_INFO_USER_CATEGORY", localizationLabelsData),
                  value:
                    (owner &&
                      owner.ownerType &&
                      generalMDMSDataById &&
                      generalMDMSDataById["OwnerType"] &&
                      generalMDMSDataById["OwnerType"][owner.ownerType].name) ||
                    "NA",
                },
              {
                key: getTranslatedLabel("PT_OWNERSHIP_INFO_CORR_ADDR", localizationLabelsData),
                value: owner.permanentAddress || "NA",
              },
            ],
          };
        }),
      },
    ]
  );
};

const mapStateToProps = (state, ownProps) => {
  const { app, common } = state;
  const { urls, localizationLabels } = app;
  const { cities } = common;
  const { generalMDMSDataById } = state.common || {};
  const { propertiesById, singleAssessmentByStatus = [], loading } = state.properties || {};
  const tenantId = ownProps.match.params.tenantId;
  const propertyId = decodeURIComponent(ownProps.match.params.propertyId);
  const selPropertyDetails = propertiesById[propertyId] || {};
  const latestPropertyDetails = getLatestPropertyDetails(selPropertyDetails.propertyDetails);

  console.log("Jagan-singleAssessmentByStatus", singleAssessmentByStatus);
  const pendingAssessments = getPendingAssessments(selPropertyDetails, singleAssessmentByStatus);
  console.log(pendingAssessments, 'pendingAssessments');

  const addressInfo =
    getAddressInfo(selPropertyDetails.address, [
      { key: getTranslatedLabel("PT_PROPERTY_ADDRESS_PROPERTY_ID", localizationLabels), value: selPropertyDetails.propertyId },
      // ],[
      //  , { key: getTranslatedLabel("PT_SEARCHPROPERTY_TABEL_EPID", localizationLabels), value : existingPropertyId}
    ]) || [];
  const assessmentInfoKeys = [
    { masterName: "Floor", dataKey: "floorNo" },
    { masterName: "UsageCategoryMajor", dataKey: "usageCategoryMajor" },
    // { masterName: "UsageCategoryDetail", dataKey: "usageCategoryDetail" },
    { masterName: "OccupancyType", dataKey: "occupancyType" },
    { masterName: "", dataKey: "unitArea" },
  ];
  const assessmentInfo = generalMDMSDataById
    ? latestPropertyDetails
      ? getAssessmentInfo(latestPropertyDetails, assessmentInfoKeys, generalMDMSDataById)
      : []
    : [];
  const ownerInfo = (latestPropertyDetails && getOwnerInfo(latestPropertyDetails, generalMDMSDataById)) || [];
  const propertyItems = [...addressInfo, ...assessmentInfo, ...ownerInfo];
  const customTitle = selPropertyDetails && selPropertyDetails.address && getCommaSeperatedAddress(selPropertyDetails.address, cities);
  const completedAssessments = getCompletedTransformedItems(pendingAssessments, cities, localizationLabels, propertyId);
  // const completedAssessments = getCompletedTransformedItems(singleAssessmentByStatus, cities, localizationLabels);
  const sortedAssessments = completedAssessments && orderby(completedAssessments, ["epocDate"], ["desc"]);
  return {
    urls,
    propertyItems,
    propertyId,
    tenantId,
    customTitle,
    latestPropertyDetails,
    selPropertyDetails,
    sortedAssessments,
    generalMDMSDataById,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addBreadCrumbs: (url) => dispatch(addBreadCrumbs(url)),
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
    getSingleAssesmentandStatus: (queryObj) => dispatch(getSingleAssesmentandStatus(queryObj)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Property);
