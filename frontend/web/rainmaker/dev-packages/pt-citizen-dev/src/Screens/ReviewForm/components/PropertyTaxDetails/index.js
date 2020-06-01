import React from "react";
import get from "lodash/get";
import { Divider } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { Card, CardHeader, CardText } from "material-ui/Card";
import isUndefined from "lodash/isUndefined";
import "./index.css";
import FlatButton from "material-ui/FlatButton";

class PropertyTaxDetails extends React.Component {
  state = {
    isExpanded: true
  };

  toggleExpander = () =>
    this.setState({
      isExpanded: !this.state.isExpanded
    });

  componentDidMount = () => {
    // document
    //   .getElementsByClassName("tax-calculation-card-header")[0]
    //   .addEventListener("click", this.toggleExpander);
  };

  render() {
    const {
      estimationDetails,
      importantDates,
      optionSelected,
      openCalculationDetails
    } = this.props;
    const { isExpanded } = this.state;
    const { taxHeadEstimates, totalAmount } = estimationDetails[0] || {};
    const { intrest, penalty, rebate } = importantDates;
    return (
      <Card
        style={{ marginBottom: 20,padding:'16px', "background-color": "rgb(242, 242, 242)", boxShadow: 'none!important' }}
        expanded={isExpanded}
      >
         <div >
            <div className="clearfix fare-section">
              <div className="col-sm-12" >
             
              <div style={{ float: 'left' }}>
  
              <Label label="PT_HOME_PROPERTY_TAX"  lineHeight="19px" letterSpacing="0.67px" fontSize="18px" color="rgba(0, 0, 0, 0.87)" />
                </div>
                <div style={{ float: 'right' }}>
                  <Label label="PT_TOTAL_AMOUNT"></Label>
                </div>
              </div> </div>
            <div className="clearfix fare-section">
              <div  
                className="col-sm-12"       >
                <div style={{ float: 'right' }}>
                  <Label
                    className="property-dues-total-amount"
                    label={`Rs ${
                      totalAmount
                        ? `${
                        !(optionSelected === "Partial_Amount")
                          ? parseInt(totalAmount)
                          : parseInt(totalAmount -
                          get(
                            taxHeadEstimates[
                            taxHeadEstimates.findIndex(
                              item =>
                                item.taxHeadCode
                                  .toLowerCase()
                                  .indexOf("rebate") !== -1
                            )
                            ],
                            "estimateAmount",
                            0
                          ))
                        }`
                        : totalAmount === 0
                          ? "0"
                          : "NA"
                      }`}
                    fontSize="24px"
                    color="#484848"
                    fontWeight='600'
                   
                  />
                </div>

              </div>
            </div>
          </div>
          <div className="clearfix fare-section">

            <div
              className="col-sm-6"
              style={{

                marginRight: 100,
                padding: 16
              }}
            >
              {/* <Label
                containerStyle={{ marginBottom: 16 }}
                color="#484848"
                label="PT_FORM4_DETAILED_BILL"
                bold={true}
              /> */}
              {taxHeadEstimates &&
                taxHeadEstimates.map((item, index) => {
                  return (
                    !isUndefined(item.estimateAmount) && (
                      <div
                        key={index}
                        className="clearfix"
                        style={{ marginBottom: 8 }}
                      >
                        <div className="col-sm-9" style={{ padding: 0 }}>
                          <Label label={item.taxHeadCode} />
                        </div>
                        <div className="col-sm-3">
                          <Label
                            containerStyle={{ textAlign: "right" }}
                            className="pt-rf-price"
                            label={
                              (item.estimateAmount > 0 &&
                                (item.taxHeadCode === "PT_ADVANCE_CARRYFORWARD" ||
                                  item.category === "EXEMPTION" ||
                                  item.category === "REBATE")
                                ? ""
                                : "") +
                              `${
                              !(
                                optionSelected === "Partial_Amount" &&
                                item.taxHeadCode
                                  .toLowerCase()
                                  .indexOf("rebate") !== -1
                              )
                                ? item.estimateAmount
                                : 0
                              }`
                            }
                          />
                        </div>
                      </div>

                    )
                  );
                })}
              <Divider
                className="reciept-divider"
                inset={true}
                lineStyle={{ marginLeft: 0, marginRight: 0, height: 2 }}
              />
              <div className="clearfix" style={{ marginTop: 8 }}>
                <div className="col-sm-9" style={{ padding: 0 }}>
                  <Label label="PT_FORM4_TOTAL" />
                </div>
                <div className="col-sm-3">
                  <Label
                    containerStyle={{ textAlign: "right" }}
                    labelStyle={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color: "#fe7a51"
                    }}
                    label={
                      totalAmount
                        ? `${
                        !(optionSelected === "Partial_Amount")
                          ? parseInt(totalAmount)
                          : parseInt(totalAmount -
                          get(
                            taxHeadEstimates[
                            taxHeadEstimates.findIndex(
                              item =>
                                item.taxHeadCode
                                  .toLowerCase()
                                  .indexOf("rebate") !== -1
                            )
                            ],
                            "estimateAmount",
                            0
                          ))
                        }`
                        : totalAmount === 0
                          ? "0"
                          : "NA"
                    }
                  />
                </div>
              </div>
              <div className="col-xs-12 calculation-button">
                <FlatButton
                  label={
                    <Label
                      buttonLabel={true}
                      label="PT_CALCULATION_DETAILS"
                      bold={true}
                      fontSize="12px"
                      color="rgb(254, 122, 81)"
                    />
                  }
                  primary={true}
                  style={{
                    height: 40,
                    lineHeight: "auto",
                    minWidth: "inherit"
                  }}
                  onClick={() => {
                    openCalculationDetails();
                  }}
                />
              </div>
            </div>
            <div className="col-sm-6" style={{ backgroundColor: 'white' }}>

              <div className="date-details" >
                <Label
                  containerStyle={{ marginBottom: 16 }}
                  color="#484848"
                  label="PT_FORM4_IMPORTANT_DATES"
                  bold={true}
                />
                <ul>
                  {rebate && rebate.endingDay && (
                    <li>
                      <span>
                        <Label
                          label={`Last Date for Rebate (${rebate.rate}% of PT)`}
                        />
                      </span>
                      <span>{`${rebate.endingDay}`}</span>
                    </li>
                  )}
                  {penalty && penalty.startingDay && (
                    <li>
                      <span>
                        <Label
                          label={`Penalty (${
                            penalty.rate
                            }% of PT) applied from`}
                        />
                      </span>
                      <span>{`${penalty.startingDay}`}</span>
                    </li>
                  )}
                  {intrest && intrest.startingDay && (
                    <li>
                      <span>
                        <Label
                          label={`Interest (${
                            intrest.rate
                            }% p.a. daily) applied from`}
                        />
                      </span>
                      <span>{`${intrest.startingDay}`}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        {/* <CardHeader
          className="tax-calculation-card-header"
          actAsExpander={true}
          showExpandableButton={true}
          closeIcon={
            <div>
              <div
                className="pt-tax-calc-details-btn"
                onClick={this.toggleExpander}
              >
                <Label label="PT_VIEW_DETAILS" color="#FE7A51" />
              </div>
            </div>
          }
          iconStyle={{}}
          title={
            <div
              className="tax-header-price rainmaker-displayInline"
              onClick={this.toggleExpander}
            >
            

            </div>
          }
          ref={el => (this.xyz = el)}
        /> */}
        {/* <CardText expandable={true} expanded={true}>
         
        </CardText> */}
      </Card>
    );
  }
}

export default PropertyTaxDetails;
