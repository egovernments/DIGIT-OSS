import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { getCommaSeperatedAddress, getTranslatedLabel } from "egov-ui-kit/utils/commons";
import { getLatestPropertyDetails, getQueryValue } from "egov-ui-kit/utils/PTCommon";
import { Button, Card } from "components";
import Screen from "egov-ui-kit/common/common/Screen";
import { Icon, BreadCrumbs } from "egov-ui-kit/components";
import { addBreadCrumbs } from "egov-ui-kit/redux/app/actions";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import WorkFlowContainer from "egov-workflow/ui-containers-local/WorkFlowContainer";
import { fetchProperties, getSingleAssesmentandStatus, fetchTotalBillAmount, fetchReceipt } from "egov-ui-kit/redux/properties/actions";
import { getCompletedTransformedItems } from "egov-ui-kit/common/propertyTax/TransformedAssessments";
import isEqual from "lodash/isEqual";
import orderby from "lodash/orderBy";
import { initLocalizationLabels } from "egov-ui-kit/redux/app/utils";
import { getLocale, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import commonConfig from "config/common.js";

import "./index.css";
import PropertyAddressInfo from "../Property/components/PropertyAddressInfo";
import AssessmentInfo from "../Property/components/AssessmentInfo";
import OwnerInfo from "../Property/components/OwnerInfo";
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

    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const tenantId = getQueryValue(search, "tenantId");
    fetchProperties([
      { key: "ids", value: propertyId },
      { key: "tenantId", value: tenantId },
    ]);
  };
  render() {
    const { location } = this.props;
    const { search } = location;
    const propertyId = getQueryValue(search, "propertyId");
    const { generalMDMSDataById, properties } = this.props;
    return <div>
      <Screen className={""}>
        <PTHeader header='PT_APPLICATION_TITLE' subHeaderTitle='PT_PROPERTY_APPLICATION_NO' subHeaderValue={propertyId} />
        <div className="form-without-button-cont-generic" >
          <div>
            <WorkFlowContainer dataPath={"FireNOCs"}
              moduleName={"FIRENOC"}
              updateUrl={"/firenoc-services/v1/_update"}></WorkFlowContainer>
            <Card
              textChildren={
                <div className="col-sm-12 col-xs-12" style={{ alignItems: "center" }}>
                  <PropertyAddressInfo properties={properties} generalMDMSDataById={generalMDMSDataById}></PropertyAddressInfo>
                  <AssessmentInfo properties={properties} generalMDMSDataById={generalMDMSDataById} ></AssessmentInfo>
                  <OwnerInfo properties={properties} generalMDMSDataById={generalMDMSDataById} ></OwnerInfo>
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
  const { common = {} } = state;
  const { generalMDMSDataById } = common || {};
  const { propertiesById, loading, } = state.properties || {};
  const { location } = ownProps;
  const { search } = location;
  const propertyId = getQueryValue(search, "propertyId");

  const properties = propertiesById[propertyId] || {};
  return {
    ownProps,
    generalMDMSDataById, properties
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    fetchProperties: (queryObjectProperty) => dispatch(fetchProperties(queryObjectProperty)),

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationPreview);
