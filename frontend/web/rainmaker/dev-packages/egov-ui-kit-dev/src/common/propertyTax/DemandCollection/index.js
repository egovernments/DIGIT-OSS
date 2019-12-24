import React from "react";
import { Card } from "components";
import { Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { fetchGeneralMDMSData } from "egov-ui-kit/redux/common/actions";
import { prepareFormData, loadMDMSData } from "egov-ui-kit/redux/common/actions";
import { toggleSpinner } from "egov-ui-kit/redux/common/actions";
import commonConfig from "config/common.js";
import { TextField } from "components";
import Field from "egov-ui-kit/utils/field";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
class DemandCollection extends React.Component {
  state = {
    data: [
      {
        fromDate: 1554076800000,
        toDate: 1585699199000,
        periodCycle: "ANNUAL",
        service: "PT",
        code: "PTAN2019",
        financialYear: "2019-20",
        taxHead: [
          {
            category: "TAX",
            service: "PT",
            name: "propertytax",
            code: "PT_TAX",
            isDebit: false,
            isActualDemand: true,
            order: 3,
            legacy: true,
          },
          {
            category: "PENALTY",
            service: "PT",
            name: "Pt time penalty",
            code: "PT_TIME_PENALTY",
            isDebit: false,
            isActualDemand: true,
            order: 2,
            legacy: true,
          },
          {
            category: "TAX",
            service: "PT",
            name: "Swachatha Tax",
            code: "SWATCHATHA_TAX",
            isDebit: false,
            isActualDemand: true,
            order: 1,
            legacy: true,
          },
        ],
      },
      {
        fromDate: 1522540800000,
        toDate: 1554076799000,
        periodCycle: "ANNUAL",
        service: "PT",
        code: "PTAN2018",
        financialYear: "2018-19",
        taxHead: [
          {
            category: "TAX",
            service: "PT",
            name: "propertytax",
            code: "PT_TAX",
            isDebit: false,
            isActualDemand: true,
            order: 3,
            legacy: true,
          },
          {
            category: "PENALTY",
            service: "PT",
            name: "Pt time penalty",
            code: "PT_TIME_PENALTY",
            isDebit: false,
            isActualDemand: true,
            order: 2,
            legacy: true,
          },
          {
            category: "TAX",
            service: "PT",
            name: "Swachatha Tax",
            code: "SWATCHATHA_TAX",
            isDebit: false,
            isActualDemand: true,
            order: 1,
            legacy: true,
          },
        ],
      },
    ]
  };

  render() {
    const { data = [], storedData } = this.state;
    const { name } = storedData;
    const { prepareFinalObject, preparedFinalObject,Properties = [] } = this.props;

    console.log("this.props:", this.props);
    const getYear =
      data && data.length ? (
        data.map((data1, index) => {
          return (
            <div>
              <div key={index}>{data1.financialYear}</div>
              <Card
                key={index}
                style={{ backgroundColor: "white" }}
                textChildren={
                  <div className="pt-owner-info">
                    <div className={` col-sm-12`} key={index}>
                      <div className={`col-sm-6`}>
                        <div className={`col-sm-12`} style={{ textAlign: "center" }}>
                          Demand
                        </div>
                        {data1.taxHead.map((data, index1) => {
                          return (
                            <div className={`col-xs-12`}>
                              <TextField
                                label={data.name}
                                floatingLabelText={data.name}
                                type="number"
                                value={get(preparedFinalObject,`Properties[0].propertyDetails[0].demand[${index}].demand[${data1.financialYear}][${index1}].Demand`)}
                                onChange={(e) => {
                                  let value = "";
                                  value = e.target.value;
                                  prepareFinalObject(`Properties[0].propertyDetails[0].demand[${index}].demand[${data1.financialYear}][${index1}].Demand`, value)
                                  prepareFinalObject(`Properties[0].propertyDetails[0].demand[${index}].demand[${data1.financialYear}][${index1}].taxHead`, data.name)
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className={`col-sm-6`}>
                        <div className={`col-sm-12`} style={{ textAlign: "center" }}>
                          Collected{" "}
                        </div>
                        {data1.taxHead.map((data, index1) => {
                          return (
                            <div className={`col-xs-12`} key={index1}>
                              <TextField
                                key={index1}
                                label={data.name}
                                type="number"
                                value={get(preparedFinalObject,`Properties[0].propertyDetails[0].demand[${index}].demand[${data1.financialYear}][${index1}].collected`)}
                                floatingLabelText={data.name}
                                onChange={(e) => {
                                  prepareFinalObject(`Properties[0].propertyDetails[0].demand[${index}].demand[${data1.financialYear}][${index1}].collected`, e.target.value)
                                  prepareFinalObject(`Properties[0].propertyDetails[0].demand[${index}].demand[${data1.financialYear}][${index1}].taxHead`, data.name);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                }
              />
              <br />
            </div>
          );
        })
      ) : (
        <div>error </div>
      );
    const textdata = () => {};

    return <div>{getYear}</div>;
  }
}
const mapStateToProps = (state) => {
  const { common, form, screenConfiguration } = state;
  const { generalMDMSDataById, loadMdmsData } = common;
  let { preparedFinalObject = {} } = screenConfiguration;
  preparedFinalObject={...preparedFinalObject};
  const { Properties } = preparedFinalObject || {};
  const FinancialYear = generalMDMSDataById && generalMDMSDataById.FinancialYear;
  const getYearList = FinancialYear && Object.keys(FinancialYear);

  return { getYearList, form, Properties,preparedFinalObject };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    removeForm: (formkey) => dispatch(removeForm(formkey)),
    toggleSpinner: () => dispatch(toggleSpinner()),
    prepareFormData: (path, value) => dispatch(prepareFormData(path, value)),
    loadMDMSData: (requestBody, moduleName, masterName) => dispatch(loadMDMSData(requestBody, moduleName, masterName)),
    reset_property_reset: () => dispatch(reset_property_reset()),
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DemandCollection);
