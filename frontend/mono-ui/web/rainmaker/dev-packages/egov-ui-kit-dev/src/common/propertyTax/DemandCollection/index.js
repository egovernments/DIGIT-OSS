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
import { getTenantId ,getFinalData} from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import get from "lodash/get";
import set from "lodash/set";
import Label from "egov-ui-kit/utils/translationNode";
class DemandCollection extends React.Component {
  render() {
    const { prepareFinalObject, preparedFinalObject,Properties = [], isAssesment=false } = this.props;
    let finalData=getFinalData();
   /*  if(isAssesment){
      let filter_data=finalData[0]
      finalData=[filter_data]
    } */
    let demands_data = get(preparedFinalObject, `DemandProperties[0].propertyDetails[0].demand`);
    
    let dummyarray = [];

/* 
    //changing index of yearly data

    for(let i=0; demands_data && i< demands_data.length;i++)
        {
              for(let j=0; finalData && j<finalData.length;j++)
              {
                  if(demands_data[i] && demands_data[i].demand[finalData[j].financialYear]!== undefined)
                  {
                    dummyarray[j] = demands_data[i];
                  }
              }
        }


    //making null of no demand years data

        let newarray = [];

        for(let i=0; finalData && i<finalData.length;i++)
        {
          let YearExist = get(dummyarray, `[${i}].demand[${finalData[i].financialYear}]`);
          if(YearExist)
          {
            set(newarray, `[${i}]`, dummyarray[i]);
          }  
          else
          {
            set(newarray, `[${i}]`, undefined);        
          }
        }   


        set(preparedFinalObject, `DemandProperties[0].propertyDetails[0].demand`, newarray); */


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
                      <div className={`col-sm-6`}  style={{ zIndex:1000  }} >
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
                                floatingLabelText={<Label label={taxData.code}/>}
                                hintText={<Label label="PT_ENTER_AN_AMOUNT" />}
                                min={get(preparedFinalObject,`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_DEMAND`)}
                                max={get(preparedFinalObject,`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_DEMAND`)}
                                // min={taxData.isDebit?-99999:0}
                                // max={taxData.isDebit?-1:0}
                                type="number"
                                value={get(preparedFinalObject,`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_DEMAND`)}
                                onChange={(e) => {  
                                 
                                   let value = "";
                                  /*value = e.target.value;
                                  if(e.target.value.includes("."))
                                  {
                                     
                                    value = '';
                                    alert( "Integer numbers are only allowed.");  
                                        
                                  } */
                                  if(isAssesment){
                                   /*  if (
                                      (taxData.code === "PT_TAX") &&
                                      get(preparedFinalObject, `DemandPropertiesResponse.Demands[${index}].demandDetails[0].taxAmount`) >
                                        e.target.value
                                    ) {
                                      alert("Tax value cannot be decrease");
                                    } */
                                  }
                                  if (e.target.value.includes(".")) 
                                  {  
                                   alert( "Integer numbers are only allowed.");
                                   return value = "" ;
                                  }

                                  if(taxData.code === 'SWATCHATHA_TAX' ||taxData.code === 'PT_TIME_INTEREST' )
                                  {
                                      if (Math.sign(e.target.value)===-1) 
                                      {  
                                      alert( "Negative numbers are not allowed.");
                                      return value = "" ;
                                      }
                                  }
                                  if(taxData.code === 'PT_TAX')
                                  {
                                      if (Math.sign(e.target.value)===-1) 
                                      {  
                                      alert( "Please enter valid value for Property tax");
                                      return value = "" ;
                                      }
                                  }
                                  value = e.target.value;                                
                                  prepareFinalObject(`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_TAXHEAD`,taxData.code)
                                  prepareFinalObject(`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_DEMAND`, taxData.isDebit?(Math.sign(value)===-1?value:-value):value)
                                                            	
                                   }

                                  }
                                  disabled={(isAssesment && (taxData.code ==="PT_PROMOTIONAL_REBATE" || taxData.code === 'PT_TIME_REBATE' || taxData.code === 'PT_LATE_ASSESSMENT_PENALTY' || taxData.code === 'PT_ADHOC_PENALTY'))}
                                  onWheel={event => { event.preventDefault(); }}
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
                                min={get(preparedFinalObject,`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_COLLECTED`)}
                                max={get(preparedFinalObject,`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_COLLECTED`)}
                                value={get(preparedFinalObject,`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_COLLECTED`)}
                                floatingLabelText={<Label label={taxData.code}/>}
                                hintText={<Label label="PT_ENTER_AN_AMOUNT"/>}

                                onChange={(e) => {
                                  if (e.target.value.includes(".")) return
                                  prepareFinalObject(`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_TAXHEAD`,taxData.code);
                                  prepareFinalObject(`DemandProperties[0].propertyDetails[0].demand[${index}].demand[${data.financialYear}][${index1}].PT_COLLECTED`, e.target.value);
                                }}
                                onWheel={event => { event.preventDefault(); }}
                                disabled={taxData.isDebit  || isAssesment}
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
