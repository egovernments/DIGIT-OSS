import { Card } from "components";
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import Screen from "egov-ui-kit/common/common/Screen";
import { toggleSnackbarAndSetText, fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { FETCHASSESSMENTS, PROPERTY } from "egov-ui-kit/utils/endPoints";
import { getLocale, localStorageSet } from "egov-ui-kit/utils/localStorageUtils";
import { generatePdfFromDiv, getQueryValue } from "egov-ui-kit/utils/PTCommon";
import WorkFlowContainer from "egov-workflow/ui-containers-local/WorkFlowContainer";
import get from "lodash/get";
import React, { Component } from "react";
import { connect } from "react-redux";
import PTHeader from "../../common/PTHeader";
import AssessmentInfo from "../Property/components/AssessmentInfo";
import DocumentsInfo from "../Property/components/DocumentsInfo";
import OwnerInfo from "../Property/components/OwnerInfo";
import PdfHeader from "../Property/components/PdfHeader";
import PropertyAddressInfo from "../Property/components/PropertyAddressInfo";
import "./index.css";


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

class ApplicationPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pathName: null,
      dialogueOpen: false,
      urlToAppend: "",
      showAssessmentHistory: false,
    };
  }

  componentDidMount = () => {
    this.setPropertyId();
    const { location, fetchGeneralMDMSData, fetchProperties, fetchLocalizationLabel } = this.props;
    const tenantId = getQueryValue(window.location.href, "tenantId");
    fetchLocalizationLabel(locale, tenantId, tenantId);
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
    
    const queryObject = [
      { key: "tenantId", value: tenantId },
      { key: "businessServices", value: this.getApplicationType().moduleName }
    ];
    this.setBusinessServiceDataToLocalStorage(queryObject);



    this.fetchApplication();
  };
  setBusinessServiceDataToLocalStorage = async (queryObject) => {
    const { toggleSnackbarAndSetText } = this.props;
    try {
      const payload = await httpRequest("egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
      localStorageSet("businessServiceData", JSON.stringify(get(payload, "BusinessServices")));
      return get(payload, "BusinessServices");
    } catch (e) {
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Not authorized to access Business Service!",
          labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
        },
        "error"
      );
    }
  };
  fetchApplication = async () => {
    const applicationType = this.getApplicationType();
    try {
      const payload = await httpRequest(applicationType.endpoint.GET.URL, applicationType.endpoint.GET.ACTION, applicationType.queryParams
      );

      const responseObject = payload[applicationType.responsePath] && payload[applicationType.responsePath].length > 0 && payload[applicationType.responsePath][0];
      if (!responseObject.workflow) {


        let workflow = {
          "id": null,
          "tenantId": getQueryArg(
            window.location.href,
            "tenantId"
          ),
          "businessService": applicationType.moduleName,
          "businessId": getQueryArg(
            window.location.href,
            "applicationNumber"
          ),
          "action": "",
          "moduleName": "PT",
          "state": null,
          "comment": null,
          "documents": null,
          "assignes": null
        }
        responseObject.workflow = workflow;
      }
      this.props.prepareFinalObject(applicationType.dataPath, payload[applicationType.responsePath] && responseObject)
    } catch (e) {
      console.log(e);

    }

  }


  setPropertyId = async () => {
    const tenantId = getQueryValue(window.location.href, "tenantId");
    const applicationNumber = getQueryValue(window.location.href, "applicationNumber");
    const propertyId = await this.getPropertyId(applicationNumber, tenantId);
    this.props.fetchProperties([
      { key: "propertyIds", value: propertyId },
      { key: "tenantId", value: tenantId },
    ]);
    this.props.prepareFinalObject('PTApplication.propertyId', propertyId);
    this.setState({ propertyId });

  }
  getPropertyId = async (applicationNumber, tenantId) => {
    const applicationType = getQueryValue(window.location.href, "type");
    if (applicationType == 'assessment') {
      const queryObject = [
        { key: "assessmentNumbers", value: applicationNumber },
        { key: "tenantId", value: tenantId }
      ];
      try {
        const payload = await httpRequest(
          "property-services/assessment/_search",
          "_search",
          queryObject
        );
        if (payload && payload.Assessments.length > 0) {
          return payload.Assessments[0].propertyId;
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      const queryObject = [
        { key: "acknowledgementIds", value: applicationNumber },
        { key: "tenantId", value: tenantId }
      ];
      try {
        const payload = await httpRequest(
          "property-services/property/_search",
          "_search",
          queryObject
        );
        if (payload && payload.Properties.length > 0) {
          return payload.Properties[0].propertyId;
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  getApplicationType = () => {
    const applicationType = getQueryValue(window.location.href, "type");
    let applicationObject = {}
    if (applicationType == "assessment") {
      applicationObject.dataPath = "Assessment";
      applicationObject.responsePath = "Assessments";
      applicationObject.moduleName = "ASMT";
      applicationObject.updateUrl = "/property-services/assessment/_update";
      applicationObject.queryParams = [
        {
          key: "assessmentNumbers", value: getQueryArg(
            window.location.href,
            "applicationNumber"
          )
        },
        {
          key: "tenantId", value: getQueryArg(
            window.location.href,
            "tenantId"
          )
        }
      ]
      applicationObject.endpoint = FETCHASSESSMENTS;
    } else if (applicationType == "property") {
      applicationObject.responsePath = "Properties";
      applicationObject.dataPath = "Property";
      applicationObject.moduleName = "PT.CREATE";
      applicationObject.updateUrl = "/property-services/property/_update";
      applicationObject.queryParams = [
        {
          key: "acknowledgementIds", value: getQueryArg(
            window.location.href,
            "applicationNumber"
          )
        },
        {
          key: "tenantId", value: getQueryArg(
            window.location.href,
            "tenantId"
          )
        }
      ]
      applicationObject.endpoint = PROPERTY;
    } else if (applicationType == "updateProperty") {
      applicationObject.responsePath = "Properties";
      applicationObject.dataPath = "Property";
      applicationObject.moduleName = "PT.UPDATE";
      applicationObject.updateUrl = "/property-services/property/_update";
      applicationObject.queryParams = [
        {
          key: "acknowledgementIds", value: getQueryArg(
            window.location.href,
            "applicationNumber"
          )
        },
        {
          key: "tenantId", value: getQueryArg(
            window.location.href,
            "tenantId"
          )
        }
      ]
      applicationObject.endpoint = PROPERTY;
    }else if (applicationType == "legacy") {
      applicationObject.responsePath = "Properties";
      applicationObject.dataPath = "Property";
      applicationObject.moduleName = "PT.LEGACY";
      applicationObject.updateUrl = "/property-services/property/_update";
      applicationObject.queryParams = [
        {
          key: "acknowledgementIds", value: getQueryArg(
            window.location.href,
            "applicationNumber"
          )
        },
        {
          key: "tenantId", value: getQueryArg(
            window.location.href,
            "tenantId"
          )
        }
      ]
      applicationObject.endpoint = PROPERTY;
    }
    return applicationObject;
  }
  getLogoUrl = (tenantId) => {
    const { cities } = this.props
    const filteredCity = cities && cities.length > 0 && cities.filter(item => item.code === tenantId);
    return filteredCity ? get(filteredCity[0], "logoId") : "";
  }

  render() {
    const { location, documentsUploaded } = this.props;
    const { search } = location;
    const applicationNumber = getQueryValue(search, "applicationNumber");
    const { generalMDMSDataById, properties, cities } = this.props;
    const applicationType = this.getApplicationType();
    const applicationDownloadObject = {
      label: { labelName: "PT Application", labelKey: "PT_APPLICATION" },
      link: () => {
        generatePdfFromDiv("download", applicationNumber, "#property-application-review-form")
      },
      leftIcon: "assignment"
    };
    const applicationPrintObject = {
      label: { labelName: "PT Application", labelKey: "PT_APPLICATION" },
      link: () => {
        generatePdfFromDiv("print", applicationNumber, "#property-application-review-form")

      },
      leftIcon: "assignment"
    };
    const downloadMenu = [applicationDownloadObject];
    const printMenu = [applicationPrintObject];
    let header = '';
    if (applicationType.dataPath == 'Property') {
      header = 'PT_APPLICATION_TITLE';
    } else {
      header = 'PT_ASSESS_APPLICATION_TITLE';
    }
    let logoUrl = "";
    let corpCity = "";
    let ulbGrade = "";
    if (get(properties, "tenantId")) {
      let tenantid = get(properties, "tenantId");
      // logoUrl = get(properties, "tenantId") ? this.getLogoUrl(get(properties, "tenantId")) : "";
      logoUrl = window.location.origin + `/${commonConfig.tenantId}-egov-assets/${tenantid}/logo.png`;
      corpCity = `TENANT_TENANTS_${get(properties, "tenantId").toUpperCase().replace(/[.:-\s\/]/g, "_")}`;
      const selectedCityObject = cities && cities.length > 0 && cities.filter(item => item.code === get(properties, "tenantId"));
      ulbGrade = selectedCityObject ? `ULBGRADE_${get(selectedCityObject[0], "city.ulbGrade")}` : "MUNICIPAL CORPORATION";
    }
    return <div>
      <Screen className={""}>
        <PTHeader header={header} subHeaderTitle='PT_PROPERTY_APPLICATION_NO' subHeaderValue={applicationNumber} />
        <div className="form-without-button-cont-generic" >
          <div>
            <WorkFlowContainer dataPath={applicationType.dataPath}
              moduleName={applicationType.moduleName}
              updateUrl={applicationType.updateUrl}></WorkFlowContainer>
            <Card
              textChildren={
                <div className="col-sm-12 col-xs-12" id="property-application-review-form" style={{ alignItems: "center" }}>
                  <PdfHeader header={{
                    logoUrl: logoUrl, corpCity: corpCity, ulbGrade: ulbGrade,
                    label: "PT_PDF_SUBHEADER"
                  }}
                    subHeader={{
                      label: "PT_PROPERTY_ID",
                      value: `: ${get(properties, "propertyId")}`
                    }}>
                  </PdfHeader>
                  <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
                  <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById} ></AssessmentInfo>
                  <OwnerInfo properties={properties} generalMDMSDataById={generalMDMSDataById} ></OwnerInfo>
                  <DocumentsInfo documentsUploaded={documentsUploaded}></DocumentsInfo>
                </div>
              }
            />
          </div>
        </div>
      </Screen>
    </div>
  }
}

const mapStateToProps = (state, ownProps) => {
  const { common = {}, screenConfiguration = {} } = state;
  const { generalMDMSDataById } = common || {};
  const { propertiesById, loading, } = state.properties || {};
  const { location } = ownProps;
  const { search } = location;

  const { preparedFinalObject = {} } = screenConfiguration;
  const { PTApplication = {} } = preparedFinalObject;
  const { propertyId = '' } = PTApplication;
  const { cities } = state.common || [];



  const properties = propertiesById[propertyId] || {};
  const { documentsUploaded } = properties || [];
  return {
    ownProps,
    generalMDMSDataById, properties, documentsUploaded, propertyId, cities
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
    fetchLocalizationLabel: (locale, moduleName, tenantId)=> dispatch(fetchLocalizationLabel(locale, moduleName, tenantId))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPreview);
