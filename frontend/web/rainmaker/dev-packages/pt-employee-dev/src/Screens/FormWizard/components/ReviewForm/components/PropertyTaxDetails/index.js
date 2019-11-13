import React from "react";
import { Divider, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { Card, CardHeader, CardText } from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import isUndefined from "lodash/isUndefined";
import "./index.css";

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
      addRebateBox,
      optionSelected,
      openCalculationDetails
    } = this.props;
   
    const { taxHeadEstimates, totalAmount } = estimationDetails[0] || {};
    const { fireCess, intrest, penalty, rebate } = importantDates;
    const { isExpanded } = this.state;
    return (
      <Card
        style={{ marginBottom: 20, "background-color": "rgb(242, 242, 242)",padding: '16px' , boxShadow: 'none' }}
       
      >
        <div >
            <div className="clearfix fare-section" >
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
                          ? totalAmount
                          : totalAmount -
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
                          )
                        }`
                        : totalAmount === 0
                          ? "0"
                          : "NA"
                      }`}
                    fontSize="24px"
                    color="#484848"
                    fontWeight="600"
                  />
                </div>

              </div>
            </div>
            <div className="clearfix fare-section">
              <div className="bill-details col-sm-6">
                <div
                  className="col-sm-10"
                  style={{ backgroundColor: "rgb(242, 242, 242)", padding: 16 }}
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
                          <div className="clearfix" style={{ marginBottom: 8 }}>
                            <div className="col-sm-9" style={{ padding: 0 }}>
                              <Label label={item.taxHeadCode} />
                            </div>
                            <div className="col-sm-3">
                              <Label
                                containerStyle={{ textAlign: "right" }}
                                className="pt-rf-price"
                                label={
                                  (item.estimateAmount > 0 &&
                                    (item.taxHeadCode ===
                                      "PT_ADVANCE_CARRYFORWARD" ||
                                      item.category === "EXEMPTION" ||
                                      item.category === "REBATE")
                                    ? ""
                                    : "") + `${item.estimateAmount}`
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
                        label={`${totalAmount}`}
                      />
                    </div>
                  </div>
                </div>
                <div
                  style={{ padding: 0 }}
                  className="additional-rebate-charges col-sm-10 flex-container"
                >
                  <div className="flex-child">
                  <Button
                    label={
                      <Label
                        label={"PT_CALCULATION_DETAILS"}
                        buttonLabel={true}
                      />
                    }
                    style={{
                      height: 22,
                      borderRadius: 2,
                      color: "#fe7a51"
                    }}
                    onClick={() => {
                      openCalculationDetails();
                    }}
                  /></div>
                  <div className="flex-child">
                  <Button
                    label={
                      <Label
                        label={"PT_CALCULATION_ADD_REBATE/CHARGES"}
                        buttonLabel={true}
                      />
                    }
                    style={{
                      height: 22,
                      borderRadius: 2,
                      color: "#fe7a51"
                    }}
                    onClick={() => addRebateBox(true)}
                  /></div>
                </div>
              </div>
              <div className="col-sm-6" style={{ backgroundColor: 'white' }}>
                <div className="date-details">
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
              <Label label="PT_HOME_PROPERTY_TAX" fontSize="16px" color="#484848" /> */}
              {/* <Label
                className="property-dues-total-amount"
                label={`INR ${totalAmount}`}
                fontSize="16px"
                color="#484848"
              /> */}
            {/* </div>
          }
        />
        <CardText expandable={true}>
          
        </CardText> */}
      </Card>
    );
  }
}

export default PropertyTaxDetails;
