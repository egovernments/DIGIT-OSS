import React, { Component } from "react";
import { connect } from "react-redux";
import { getLatestPropertyDetails, getQueryValue } from "egov-ui-kit/utils/PTCommon";
import { Button, Card } from "components";
import Screen from "egov-ui-kit/common/common/Screen";
import { FETCHASSESSMENTS, PROPERTY } from "egov-ui-kit/utils/endPoints";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getQueryArg } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";
import WorkFlowContainer from "egov-workflow/ui-containers-local/WorkFlowContainer";
import { fetchProperties } from "egov-ui-kit/redux/properties/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
// import isEqual from "lodash/isEqual";
// import orderby from "lodash/orderBy";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import commonConfig from "config/common.js";
import { getTenantId, localStorageSet, localStorageGet, getLocalization, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import PropertyAddressInfo from "../Property/components/PropertyAddressInfo";
import AssessmentInfo from "../Property/components/AssessmentInfo";
import OwnerInfo from "../Property/components/OwnerInfo";
import PTHeader from "../../common/PTHeader";
import DocumentsInfo from "../Property/components/DocumentsInfo";

import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";

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
    const { location, fetchGeneralMDMSData, fetchProperties } = this.props;
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
    const tenantId = getQueryValue(window.location.href, "tenantId");
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

  // setBusinessServiceDataToLocalStorage = async (queryObject) => {
  //   const { toggleSnackbarAndSetText } = this.props;
  //   try {
  //     const payload = await httpRequest("egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
  //     localStorageSet("businessServiceData", JSON.stringify(get(payload, "BusinessServices")));
  //     return get(payload, "BusinessServices");
  //   } catch (e) {
  //     toggleSnackbarAndSetText(
  //       true,
  //       {
  //         labelName: "Not authorized to access Business Service!",
  //         labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
  //       },
  //       "error"
  //     );
  //   }
  // };


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


    }
    return applicationObject;
  }

  render() {
    const { location, documentsUploaded } = this.props;
    const { search } = location;
    const applicationNumber = getQueryValue(search, "applicationNumber");
    const { generalMDMSDataById, properties } = this.props;
    const applicationType = this.getApplicationType();


    let header = '';
    if (applicationType.dataPath == 'Property') {
      header = 'PT_APPLICATION_TITLE';
    } else {
      header = 'PT_ASSESS_APPLICATION_TITLE';
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
                <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
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

// getApplicationDetailsBasedOnWorkflow(applicationNumber){




// }


const mapStateToProps = (state, ownProps) => {
  const { common = {}, screenConfiguration = {} } = state;
  const { generalMDMSDataById } = common || {};
  const { propertiesById, loading, } = state.properties || {};
  const { location } = ownProps;
  const { search } = location;

  const { preparedFinalObject = {} } = screenConfiguration;
  const { PTApplication = {} } = preparedFinalObject;
  const { propertyId = '' } = PTApplication;




  const properties = propertiesById[propertyId] || {};
  const { documentsUploaded } = properties || [];
  return {
    ownProps,
    generalMDMSDataById, properties, documentsUploaded, propertyId
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPreview);
