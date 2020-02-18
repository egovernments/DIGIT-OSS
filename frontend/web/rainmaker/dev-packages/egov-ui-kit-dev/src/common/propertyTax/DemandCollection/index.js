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
import { getTenantId, getFinalData } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import Label from "egov-ui-kit/utils/translationNode";
class DemandCollection extends React.Component {
  componentDidMount() {
    // var input = document.getElementById("input");
    // input &&
    //   input.addEventListener("mousewheel", function(event) {
    //     this.blur();
    //   });

    // input &&
    //   input.addEventListener("keydown", function(event) {
    //     var key = e.charCode || e.keyCode;
    //     // Disable Up and Down Arrows on Keyboard
    //     if (key == 38 || key == 40) {
    //       e.preventDefault();
    //     } else {
    //       return;
    //     }
    //   });
    // console.log("Mouse wheel disabled!");
  }
  render() {
    const { prepareFinalObject, preparedFinalObject, Properties = [] } = this.props;
    const finalData = getFinalData();
    const getYear =
      finalData && finalData.length ? (
        finalData.map((data, index) => {
          return (
            <div>
              <div key={index}>{data.financialYear}</div>
              <Card
                key={index}
                style={{ backgroundColor: "white" }}
                textChildren={
                  <div className="pt-owner-info">
                    <div className={` col-sm-12`} key={index}>
                      <div className={`col-sm-6`}>
                        <div className={`col-sm-12`} style={{ textAlign: "center" }}>
                          <Label
                            labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                            label={"PT_DEMAND" ? "PT_DEMAND" : "NA"}
                            fontSize="16px"
                          />
                        </div>
                        {data.taxHead.map((taxData, index1) => {
                          return (
                            <div className={`col-xs-12`}>
                              <TextField
                                floatingLabelText={<Label label={taxData.code} />}
                                hintText={<Label label="PT_ENTER_AN_AMOUNT" />}
                                min={taxData.isDebit ? -99999 : 0}
                                max={taxData.isDebit ? -1 : 0}
                                type="number"
                                value={get(
                                  preparedFinalObject,
                                  `DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_DEMAND`
                                )}
                                onChange={(e) => {
                                  let value = "";
                                  value = e.target.value;
                                  prepareFinalObject(
                                    `DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_TAXHEAD`,
                                    taxData.code
                                  );
                                  prepareFinalObject(
                                    `DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_DEMAND`,
                                    taxData.isDebit ? (Math.sign(value) === -1 ? value : -value) : value
                                  );
                                }}
                                onMouseWheel={(event) => {
                                  event.preventDefault();
                                }}
                                // onMouseDown={(event) => {
                                //   event.preventDefault();
                                // }}
                                // onMouseUp={(event) => {
                                //   event.preventDefault();
                                // }}
                                onKeyDown={(event) => {
                                  console.log("key down triggered");
                                  if (event.keyCode === 38 || event.keyCode === 40) {
                                    event.preventDefault();
                                  }
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className={`col-sm-6`}>
                        <div className={`col-sm-12`} style={{ textAlign: "center" }}>
                          <Label
                            labelStyle={{ letterSpacing: "0.67px", color: "rgba(0, 0, 0, 0.87)", fontWeight: "400", lineHeight: "19px" }}
                            label={"PT_COLLECTED" ? "PT_COLLECTED" : "NA"}
                            fontSize="16px"
                          />
                        </div>
                        {data.taxHead.map((taxData, index1) => {
                          return (
                            <div className={`col-xs-12`} key={index1}>
                              <TextField
                                key={index1}
                                type="number"
                                min={0}
                                max={0}
                                value={get(
                                  preparedFinalObject,
                                  `DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_COLLECTED`
                                )}
                                floatingLabelText={<Label label={taxData.code} />}
                                hintText={<Label label="PT_ENTER_AN_AMOUNT" />}
                                onChange={(e) => {
                                  prepareFinalObject(
                                    `DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_TAXHEAD`,
                                    taxData.code
                                  );
                                  prepareFinalObject(
                                    `DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_COLLECTED`,
                                    e.target.value
                                  );
                                }}
                                onMouseWheel={(event) => {
                                  event.preventDefault();
                                }}
                                // onMouseDown={(event) => {
                                //   event.preventDefault();
                                // }}
                                // onMouseUp={(event) => {
                                //   event.preventDefault();
                                // }}
                                onKeyDown={(event) => {
                                  console.log("key down triggered");
                                  if (event.keyCode === 38 || event.keyCode === 40) {
                                    event.preventDefault();
                                  }
                                }}
                                disabled={taxData.isDebit}
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
  preparedFinalObject = { ...preparedFinalObject };
  const { Properties } = preparedFinalObject || {};
  const FinancialYear = generalMDMSDataById && generalMDMSDataById.FinancialYear;
  const getYearList = FinancialYear && Object.keys(FinancialYear);

  return { getYearList, form, Properties, preparedFinalObject };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchGeneralMDMSData: (requestBody, moduleName, masterName) => dispatch(fetchGeneralMDMSData(requestBody, moduleName, masterName)),
    removeForm: (formkey) => dispatch(removeForm(formkey)),
    toggleSpinner: () => dispatch(toggleSpinner()),
    prepareFormData: (path, value) => dispatch(prepareFormData(path, value)),
    loadMDMSData: (requestBody, moduleName, masterName) => dispatch(loadMDMSData(requestBody, moduleName, masterName)),
    reset_property_reset: () => dispatch(reset_property_reset()),
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DemandCollection);
